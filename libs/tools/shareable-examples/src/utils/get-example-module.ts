/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { sync } from 'glob';
import { basename, join, resolve } from 'path';
import { tsCreateSourceFile } from '@dynatrace/shared/node';
import {
  createPrinter,
  isImportDeclaration,
  isPropertyAssignment,
  isVariableStatement,
  Node,
  SourceFile,
  transform,
  TransformationContext,
  TransformerFactory,
  visitEachChild,
  visitNode,
  VisitResult,
  factory as tsFactory,
  ImportDeclaration,
  isSpreadElement,
  isStringLiteral,
  isNamedImports,
  isIdentifier,
  ImportSpecifier,
  isObjectLiteralExpression,
  ObjectLiteralExpression,
} from 'typescript';
import { ExampleAstFile } from './examples.interface';

function isNgModuleObject(node: Node): node is ObjectLiteralExpression {
  return (
    isObjectLiteralExpression(node) &&
    node.properties.some((propertyAssignment) => {
      return (
        propertyAssignment.name &&
        isIdentifier(propertyAssignment.name) &&
        propertyAssignment.name.text === 'declarations'
      );
    })
  );
}

/**
 * Creates a transformer to prepare the examples module, this includes the following:
 * - remove all imports from the module that are relative, except the currently processed example
 * - remove the DT_COMPONENT_EXAMPLES array declaration
 * - remove the `entryComponents` from the module decorator
 * - replace the `declarations` in the module decorator with the current example.
 */
export function createTransformer(
  exampleRoot: string,
  exampleClassName: string,
): TransformerFactory<SourceFile> {
  const transformer: TransformerFactory<SourceFile> = (
    context: TransformationContext,
  ) => {
    const importsFromExampleFile: string[] = [];

    function visitDeclarationAndEntryComponentsAndRemoveUnused(
      node: Node,
    ): Node | undefined {
      if (isSpreadElement(node)) {
        return importsFromExampleFile.length
          ? tsFactory.createIdentifier(importsFromExampleFile.join(', '))
          : tsFactory.createIdentifier(exampleClassName);
      }
      // If the node is an identifier, includes `DtExample` and is not in the
      // import list, remove it from the declarations
      if (
        isIdentifier(node) &&
        node.text.includes('DtExample') &&
        // Remove DtExamples except for the ones that are deleted
        !node.text.includes('DtExampleShared') &&
        !importsFromExampleFile.includes(node.text)
      ) {
        return undefined;
      }
      // Replace examples that are not needed in this module
      return visitEachChild(
        node,
        visitDeclarationAndEntryComponentsAndRemoveUnused,
        context,
      );
    }

    /** Visit a propertyAssignment and determine which assignments need to be rewritten. */
    function visitPropertyAssignment(node: Node): VisitResult<Node> {
      return visitEachChild(
        node,
        visitDeclarationAndEntryComponentsAndRemoveUnused,
        context,
      );
    }

    /** Visit an importDeclaration and remove imports if necessary. */
    function visitImportDeclaration(
      node: ImportDeclaration,
    ): VisitResult<Node> {
      const importFrom = isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier.text
        : '';
      // By definition, our examples are nested each within its own folder
      // we will need to keep the import for this one example, and all other
      // imports, that are not nested in a folder here.
      if (
        // Check if it is a relative import
        importFrom.startsWith('.') &&
        // Check if it is not the one import we actually want to keep
        !importFrom.includes(basename(exampleRoot)) &&
        // Check if it is not any of the other relative imports we want to ditch.
        importFrom.split('/').length > 2
      ) {
        return undefined;
      }
      // If the import is from the example component, remember the imports
      // as they will need to be in the declarations and definitions.
      if (
        importFrom.includes(basename(exampleRoot)) &&
        node.importClause &&
        node.importClause.namedBindings &&
        isNamedImports(node.importClause.namedBindings)
      ) {
        importsFromExampleFile.push(
          ...node.importClause.namedBindings.elements.map(
            (element: ImportSpecifier) => element.name.text,
          ),
        );
      }
      return node;
    }

    /** Main visit function. */
    function visit(node: Node): Node | undefined {
      // Remove all import declarations that are not needed anymore.
      if (isImportDeclaration(node)) {
        return visitNode(
          node,
          (visitedNode) =>
            visitImportDeclaration(visitedNode as ImportDeclaration),
          () => true,
        );
      }

      // Remove the unnecessary array variable declaration
      if (isVariableStatement(node)) {
        // If the variable statement is the declarations array, remove it.
        if (/DT_(.*?)_EXAMPLES/.test(node.getText())) {
          return;
        }
      }

      if (isNgModuleObject(node)) {
        // HACK: No idea how to properly fix this since there's no ts.factory.updateNodeArray()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node.properties as any) = tsFactory.createNodeArray([
          ...node.properties,
          tsFactory.createPropertyAssignment(
            tsFactory.createIdentifier('exports'),
            tsFactory.createArrayLiteralExpression(
              importsFromExampleFile.map((exampleImport) =>
                tsFactory.createIdentifier(exampleImport),
              ),
            ),
          ),
        ]);
        return visitEachChild(node, visit, context);
      }

      // Replace the declarations and entryComponents assignments
      if (isPropertyAssignment(node)) {
        if (
          node.name &&
          isIdentifier(node.name) &&
          node.name.text === 'declarations'
        ) {
          const declarations = visitNode(
            node,
            visitPropertyAssignment,
            () => true,
          );

          return declarations;
        }
        return node;
      }
      return visitEachChild(node, visit, context);
    }
    return (node) => visitNode(node, visit);
  };
  return transformer;
}

export async function getExampleModule(
  exampleRoot: string,
  exampleClassName: string,
): Promise<ExampleAstFile> {
  // Get the module file path
  // This assumes that the module is one level up the folder structure
  // and matches the pattern '.module.ts'
  const moduleFilePath = sync('*.module.ts', {
    cwd: resolve(exampleRoot, '../'),
  }).map((file) => join('../', file))[0];
  const moduleAstFile = await tsCreateSourceFile(
    resolve(exampleRoot, moduleFilePath),
  );

  const result = transform(moduleAstFile, [
    createTransformer(exampleRoot, exampleClassName),
  ]);

  // To apply the changes the transformed file needs to be passed
  // to a printer to get the updated file.
  const printer = createPrinter();
  const content = printer.printFile(result.transformed[0]);
  return {
    path: join(exampleRoot, moduleFilePath),
    content,
    ast: result.transformed[0],
  };
}
