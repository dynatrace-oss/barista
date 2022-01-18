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
import { createStringLiteral } from './create-string-literal';

/**
 * Creates typescript import declaration
 *
 * @param symbolName Name of the item that is imported
 * @param path Path to the module
 * @param named Default true whether the import is a named import or not
 */
export function createImportDeclaration(
  symbolName: string[],
  path: string,
  named = true,
): ts.ImportDeclaration {
  const importSpecifiers = symbolName.map((n) =>
    ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(n)),
  );

  let importClause: ts.ImportClause;

  if (named) {
    importClause = ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports(importSpecifiers),
    );
  } else {
    /** named imports can only have one export */
    importClause = ts.factory.createImportClause(
      false,
      ts.factory.createIdentifier(symbolName[0]),
      undefined,
    );
  }

  return ts.factory.createImportDeclaration(
    undefined /** decorators */,
    undefined /** modifiers */,
    importClause,
    createStringLiteral(path, true),
  );
}
