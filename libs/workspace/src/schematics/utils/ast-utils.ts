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

import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`File ${path} does not exist.`);
  }
  const content = buffer.toString();
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 */
export function findNodes(
  node: ts.Node,
  kind: ts.SyntaxKind,
  max: number = Infinity,
): ts.Node[] {
  if (!node || max === 0) {
    return [];
  }

  const arr: ts.Node[] = [];
  if (node.kind === kind) {
    arr.push(node);
    max--;
  }
  if (max > 0) {
    for (const child of node.getChildren()) {
      // tslint:disable-next-line: no-shadowed-variable
      findNodes(child, kind, max).forEach((node: ts.Node) => {
        if (max > 0) {
          arr.push(node);
        }
        max--;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return arr;
}

/**
 * Gets the indentation string for the last entry in NodeArray
 */
export function getIndentation(
  elements: ts.NodeArray<any> | ts.Node[],
): string {
  let indentation = '\n';
  if (elements.length > 0) {
    const text = elements[elements.length - 1].getFullText();
    const matches = text.match(/^\r?\n\s*/);
    if (matches && matches.length > 0) {
      indentation = matches[0];
    }
  }
  return indentation;
}
