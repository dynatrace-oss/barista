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

import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { readFileFromTree } from '../../utils';
import * as ts from 'typescript';
import { getImportModuleSpecifier } from '../utils-ast';

const OLD_IMPORT = '@dynatrace/angular-components';

/** Rename every import in Filesystem to barista-components */
export function renameExistingImports(files: string[]): Rule {
  return (tree: Tree, _: SchematicContext) => {
    for (let fileName of files) {
      const sourceText = readFileFromTree(tree, fileName);
      const sourceFile = ts.createSourceFile(
        fileName,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
      );

      // Renames imports of current file:
      for (let i = sourceFile.statements.length - 1; i >= 0; i--) {
        const statement = sourceFile.statements[i];

        if (ts.isImportDeclaration(statement)) {
          const moduleSpecifier = getImportModuleSpecifier(statement);

          // if we have an old import we have to rename it:
          if (moduleSpecifier && moduleSpecifier.includes(OLD_IMPORT)) {
            let importStatement = statement.moduleSpecifier.getText();

            const node = createStringLiteral(
              importStatement
                .replace('angular', 'barista')
                .replace("'", '')
                .replace("'", ''),
              true,
            );
            updateNodeFileInTree(
              tree,
              fileName,
              sourceFile,
              statement.moduleSpecifier,
              node,
            );
          }
        }
      }
    }
  };
}

export function createStringLiteral(
  text: string,
  singleQuote: boolean,
): ts.StringLiteral {
  const literal = ts.createStringLiteral(text) as any;

  literal['singleQuote'] = singleQuote;
  literal['type-literal-delimeter'] = true;
  return literal;
}

export function updateNodeFileInTree(
  tree: Tree,
  filename: string,
  _: ts.SourceFile,
  oldNode: ts.Node,
  node: any,
): void {
  // create a printer to print the ts.SourceFiles
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const printedNode = printer.printNode(
    ts.EmitHint.Unspecified,
    node,
    oldNode.getSourceFile(),
  );
  const recorder = tree.beginUpdate(filename);
  const { pos: start, end } = oldNode;

  recorder.remove(start + 1, end - start - 1);
  recorder.insertLeft(start + 1, printedNode);
  tree.commitUpdate(recorder);
}

export function insertNodeToFileInTree(
  tree: Tree,
  fileName: string,
  sourceFile: ts.SourceFile,
  node: any,
): void {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const printedNode =
    printer
      .printNode(ts.EmitHint.Unspecified, node, sourceFile)
      .split('"')
      .join('') + '\n';

  const recorder = tree.beginUpdate(fileName);
  recorder.insertRight(-1, printedNode);
  tree.commitUpdate(recorder);
}
