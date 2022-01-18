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
import { createImportDeclaration } from './create-import-declaration';

export function addImportToSourceFile(
  sourceFile: ts.SourceFile,
  symbolNames: string[],
  modulePath: string,
): ts.SourceFile {
  const imports: ts.ImportDeclaration[] = [];
  const nodes: ts.Statement[] = [];

  // separate imports from the other nodes, imports have to stay on top
  sourceFile.statements.forEach((statement: ts.Statement) => {
    if (ts.isImportDeclaration(statement)) {
      imports.push(statement);
    } else {
      nodes.push(statement);
    }
  });

  return ts.factory.updateSourceFile(sourceFile, [
    ...imports,
    createImportDeclaration(symbolNames, modulePath),
    ...nodes,
  ]);
}
