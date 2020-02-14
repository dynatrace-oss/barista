/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { tsCreateSourceFile } from '@dynatrace/tools/shared';
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
  createIdentifier,
  PropertyAssignment,
  ImportDeclaration,
  isSpreadElement,
  createPropertyAssignment,
  isStringLiteral,
  isNamedImports,
  ImportSpecifier,
} from 'typescript';
import { ExampleAstFile } from './examples.interface';

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
    let importsFromExampleFile: string | undefined;

    function visitSpraedDeclarationAndReplaceIt(node: Node): Node | undefined {
      if (isSpreadElement(node)) {
        return importsFromExampleFile
          ? createIdentifier(importsFromExampleFile)
          : createIdentifier(exampleClassName);
      }
      return visitEachChild(node, visitSpraedDeclarationAndReplaceIt, context);
    }

    /** Visit a propertyAssignment and determine which assignments need to be rewritten. */
    function visitPropertyAssignment(
      node: PropertyAssignment,
    ): Node | undefined {
      const assignmentName = node.name.getText();
      // Replace the spread in the declarations with the one component
      // we want to keep in there.
      if (assignmentName === 'declarations') {
        return visitEachChild(
          node,
          visitSpraedDeclarationAndReplaceIt,
          context,
        );
      }
      // Replace the entryComponents assignment with an exports,
      // to be able to use the component outside of the declaring module.
      if (assignmentName === 'entryComponents') {
        const entryComponentsNode = visitEachChild(
          node,
          visitSpraedDeclarationAndReplaceIt,
          context,
        );
        return createPropertyAssignment(
          'exports',
          entryComponentsNode.initializer,
        );
      }
      return node;
    }

    /** Visit an importDeclaration and remove imports if necessary. */
    function visitImportDeclaration(node: ImportDeclaration): Node | undefined {
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
        importsFromExampleFile = node.importClause.namedBindings.elements
          .map((element: ImportSpecifier) => element.name.text)
          .join(', ');
      }
      return node;
    }

    /** Main visit function. */
    function visit(node: Node): Node | undefined {
      // Remove all import declarations that are not needed anymore.
      if (isImportDeclaration(node)) {
        return visitNode(node, visitImportDeclaration);
      }

      // Remove the unnecessary array variable declaration
      if (isVariableStatement(node)) {
        // If the variable statement is the declarations array, remove it.
        if (/DT_(.*?)_EXAMPLES/.test(node.getText())) {
          return;
        }
      }

      // Replace the declarations and entryComponents assignments
      if (isPropertyAssignment(node)) {
        return visitNode(node, visitPropertyAssignment);
      }
      return visitEachChild(node, visit, context);
    }
    return node => visitNode(node, visit);
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
  }).map(file => join('../', file))[0];
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
