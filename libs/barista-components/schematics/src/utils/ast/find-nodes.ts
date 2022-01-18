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
import * as ts from 'typescript';

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 *
 * @param node
 * @param kind
 * @param maxItems The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function findNodes(
  node: ts.Node,
  kind: ts.SyntaxKind,
  maxItems = Infinity,
): ts.Node[] {
  let max = maxItems;

  if (!node || max === 0) {
    return [];
  }

  const arr: ts.Node[] = [];
  if (node.kind === kind) {
    arr.push(node);
    max -= 1;
  }
  if (max > 0) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach((childNode: ts.Node) => {
        if (max > 0) {
          arr.push(childNode);
        }
        max -= 1;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return arr;
}
