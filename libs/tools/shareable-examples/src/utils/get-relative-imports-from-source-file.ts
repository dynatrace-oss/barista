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

import {
  SourceFile,
  isImportDeclaration,
  ImportDeclaration,
  isStringLiteral,
} from 'typescript';
import { resolve } from 'path';
import { existsSync, promises as fs } from 'fs';
import { ExampleFile } from './examples.interface';

/** Get relative imports from a source file. */
export async function getRelativeImportsFromSourceFile(
  source: SourceFile,
  fileRoot: string,
): Promise<ExampleFile[]> {
  // Get all relative imports from the example class file.
  const relativeImports = source.statements
    // Filter all statements that are importDeclarations
    .filter((statement) => isImportDeclaration(statement))
    // Map it to the text of the moduleSpecifier
    .map((statement: ImportDeclaration) =>
      isStringLiteral(statement.moduleSpecifier)
        ? statement.moduleSpecifier.text
        : '',
    )
    // Filter in only relative imports, that are needed.
    // These files need to be packed with it.
    .filter((moduleSpecifierText: string) =>
      moduleSpecifierText.startsWith('.'),
    );

  // Iterate over the found relative imports and read the files
  const files: ExampleFile[] = [];
  for (const relativeImport of relativeImports) {
    let relativeFileImportPath = resolve(fileRoot, relativeImport);

    if (existsSync(`${relativeFileImportPath}.ts`)) {
      relativeFileImportPath = `${relativeFileImportPath}.ts`;
    } else if (existsSync(`${relativeFileImportPath}/index.ts`)) {
      // TODO: Hope that we never need to resolve barrel files.
      console.log('Barrel import, we cannot handle this.');
    }

    // Add the exampleComponentClassFile to the dependency files.
    const content = await fs.readFile(relativeFileImportPath, {
      encoding: 'utf-8',
    });

    files.push({
      path: relativeFileImportPath,
      content,
    });
  }
  return files;
}
