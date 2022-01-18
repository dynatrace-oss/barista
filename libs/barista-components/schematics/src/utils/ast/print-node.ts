/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
import {
  SourceFile,
  Node,
  ScriptTarget,
  EmitHint,
  createSourceFile,
  NewLineKind,
  createPrinter,
} from 'typescript';

/**
 * Prints a typescript node and returns the result
 *
 * @param node The node to print.
 * @param sourceFile A source file that provides context for the node
 */
export function printNode(node: Node, sourceFile?: SourceFile): string {
  // create a printer to print the ts.SourceFiles
  const printer = createPrinter({ newLine: NewLineKind.LineFeed });

  return printer.printNode(
    EmitHint.Unspecified,
    node,
    sourceFile || createSourceFile('tmp.ts', '', ScriptTarget.ESNext),
  );
}
