/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from 'typescript';

import { DtMigrationRule, DtTargetVersion } from '../migration-rule';

const ONLY_SUBPACKAGE_FAILURE_STR =
  `Importing from "@dynatrace/barista-components" is deprecated. ` +
  `Instead import from the entry-point the symbol belongs to.`;

const NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR =
  `Imports from Dynatrace Angular Components should import ` +
  `specific symbols rather than importing the entire library.`;

/** Legacy module specifier */
export const MODULE_SPECIFIER = '@dynatrace/angular-components';

/**
 * Regex for testing file paths against to determine if the file is from the
 * Dynatrace angular components library.
 */
const DYNATRACE_AC_FILEPATH_REGEX = new RegExp(`${MODULE_SPECIFIER}/(.*?)/`);

/**
 * A migration rule that updates imports which refer to the primary Dynatrace Angular Components
 * entry-point to use the appropriate secondary entry points (e.g. @dynatrace/barista-components/button).
 */
export class SecondaryEntryPointsRule extends DtMigrationRule {
  /** The printer instance that creates the new import declarations */
  printer = ts.createPrinter();

  // Only enable this rule if the migration targets version 5. The primary
  // entry-point of Dynatrace Angular Components has been marked as deprecated in version 4.
  /** Whether this rule should be enabled - update version matches 5 */
  ruleEnabled = this.dtTargetVersion === DtTargetVersion.V5;

  /** AST-node visitor */
  visitNode(declaration: ts.Node): void {
    // Only look at import declarations.
    if (
      !ts.isImportDeclaration(declaration) ||
      !ts.isStringLiteralLike(declaration.moduleSpecifier)
    ) {
      return;
    }

    const importLocation = declaration.moduleSpecifier.text;
    // If the import module is not @dynatrace/barista-components, skip check.
    if (importLocation !== MODULE_SPECIFIER) {
      return;
    }

    // If no import clause is found, or nothing is named as a binding in the
    // import, add failure saying to import symbols in clause.
    if (!declaration.importClause || !declaration.importClause.namedBindings) {
      this.createFailureAtNode(
        declaration,
        NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR,
      );
      return;
    }

    // All named bindings in import clauses must be named symbols, otherwise add
    // failure saying to import symbols in clause.
    if (!ts.isNamedImports(declaration.importClause.namedBindings)) {
      this.createFailureAtNode(
        declaration,
        NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR,
      );
      return;
    }

    // If no symbols are in the named bindings then add failure saying to
    // import symbols in clause.
    if (!declaration.importClause.namedBindings.elements.length) {
      this.createFailureAtNode(
        declaration,
        NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR,
      );
      return;
    }

    // Whether the existing import declaration is using a single quote module specifier.
    const singleQuoteImport = declaration.moduleSpecifier.getText()[0] === `'`;

    // Map which consists of secondary entry-points and import specifiers which are used
    // within the current import declaration.
    const importMap = new Map<string, ts.ImportSpecifier[]>();

    // Determine the subpackage each symbol in the namedBinding comes from.
    for (const element of declaration.importClause.namedBindings.elements) {
      const elementName = element.propertyName
        ? element.propertyName
        : element.name;

      // Get the symbol for the named binding element. Note that we cannot determine the
      // value declaration based on the type of the element as types are not necessarily
      // specific to a given secondary entry-point (e.g. exports with the type of "string")
      // would resolve to the module types provided by TypeScript itself.
      const symbol = getDeclarationSymbolOfNode(elementName, this.typeChecker);

      // If the symbol can't be found, or no declaration could be found within
      // the symbol, add failure to report that the given symbol can't be found.
      if (
        !symbol ||
        !(
          symbol.valueDeclaration ||
          (symbol.declarations && symbol.declarations.length !== 0)
        )
      ) {
        this.createFailureAtNode(
          element,
          `"${element.getText()}" was not found in the Dynatrace angular components library.`,
        );
        return;
      }

      // The filename for the source file of the node that contains the
      // first declaration of the symbol. All symbol declarations must be
      // part of a defining node, so parent can be asserted to be defined.
      const resolvedNode: ts.Node =
        symbol.valueDeclaration || symbol.declarations[0];
      const sourceFile: string = resolvedNode.getSourceFile().fileName;

      // File the module the symbol belongs to from a regex match of the
      // filename. This will always match since only "@dynatrace/barista-components"
      // elements are analyzed.
      const matches = sourceFile.match(DYNATRACE_AC_FILEPATH_REGEX);
      if (!matches) {
        this.createFailureAtNode(
          element,
          `"${element.getText()}" was found to be imported ` +
            `from a file outside the Dynatrace angular components library.`,
        );
        return;
      }
      const [, moduleName] = matches;

      // The module name where the symbol is defined e.g. card, dialog. The
      // first capture group is contains the module name.
      if (importMap.has(moduleName)) {
        importMap.get(moduleName)!.push(element);
      } else {
        importMap.set(moduleName, [element]);
      }
    }

    // Transforms the import declaration into multiple import declarations that import
    // the given symbols from the individual secondary entry-points. For example:
    // import { DtCardModule, DtCardTitle } from '@dynatrace/barista-components/card';
    // import { DtChart } from '@dynatrace/barista-components/chart';
    const newImportStatements = Array.from(importMap.entries())
      .sort()
      .map(([name, elements]) => {
        const newImport = ts.createImportDeclaration(
          undefined,
          undefined,
          ts.createImportClause(undefined, ts.createNamedImports(elements)),
          createStringLiteral(`${MODULE_SPECIFIER}/${name}`, singleQuoteImport),
        );
        return this.printer.printNode(
          ts.EmitHint.Unspecified,
          newImport,
          declaration.getSourceFile(),
        );
      })
      .join('\n');

    // Without any import statements that were generated, we can assume that this was an empty
    // import declaration. We still want to add a failure in order to make developers aware that
    // importing from "@dynatrace/barista-components" is deprecated.
    if (!newImportStatements) {
      this.createFailureAtNode(
        declaration.moduleSpecifier,
        ONLY_SUBPACKAGE_FAILURE_STR,
      );
      return;
    }

    const recorder = this.getUpdateRecorder(
      declaration.moduleSpecifier.getSourceFile().fileName,
    );

    // Perform the replacement that switches the primary entry-point import to
    // the individual secondary entry-point imports.
    recorder.remove(declaration.getStart(), declaration.getWidth());
    recorder.insertRight(declaration.getStart(), newImportStatements);
  }
}

/**
 * Creates a string literal from the specified text.
 * @param text Text of the string literal.
 * @param singleQuotes Whether single quotes should be used when printing the literal node.
 */
function createStringLiteral(
  text: string,
  singleQuotes: boolean,
): ts.StringLiteral {
  const literal = ts.createStringLiteral(text);
  // See: https://github.com/microsoft/TypeScript/blob/master/src/compiler/utilities.ts#L584-L590
  // tslint:disable-next-line: no-string-literal
  literal['singleQuote'] = singleQuotes;
  return literal;
}

/** Gets the symbol that contains the value declaration of the given node. */
function getDeclarationSymbolOfNode(
  node: ts.Node,
  checker: ts.TypeChecker,
): ts.Symbol | undefined {
  const symbol = checker.getSymbolAtLocation(node);

  // Symbols can be aliases of the declaration symbol. e.g. in named import specifiers.
  // We need to resolve the aliased symbol back to the declaration symbol.
  // tslint:disable-next-line:no-bitwise
  if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
    return checker.getAliasedSymbol(symbol);
  }
  return symbol;
}
