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

import { promises as fs } from 'fs';
import { ExampleMetadata } from './metadata';
import { EXAMPLES_ROOT } from './main';
import { relative, extname } from 'path';

/**
 * Reads a provided template file, transforms its content
 * by calling a provided transform function,
 * and then writes it to the file-system at the provided path.
 */
export async function transformAndWriteTemplate(
  transformFn: (source: string) => string,
  templateFile: string,
  outFile: string,
): Promise<string> {
  let source = (await fs.readFile(templateFile, {
    encoding: 'utf-8',
  })).toString();

  source = transformFn(source);

  await fs.writeFile(outFile, source, {
    flag: 'w', // "w" -> Create file if it does not exist
    encoding: 'utf8',
  });

  return outFile;
}

/**
 * Creates a list of imports for all examples
 * based on the provided metadata array.
 */
export function getExampleImportsFromMetadata(
  examplesMetadata: ExampleMetadata[],
): Map<string, string[]> {
  const exampleImports = new Map<string, string[]>();
  for (const metadataObj of examplesMetadata) {
    let importPath = relative(EXAMPLES_ROOT, metadataObj.tsFileLocation);
    if (!importPath.startsWith('../')) {
      importPath = `./${importPath}`;
    }

    if (extname(importPath) === '.ts') {
      importPath = importPath.slice(0, -3);
    }

    let importNames = exampleImports.get(importPath);
    if (!importNames) {
      importNames = [];
      exampleImports.set(importPath, importNames);
    }
    importNames.push(metadataObj.className);
  }
  return exampleImports;
}

/** Generate import statements for every provided example metadata. */
export function generateExampleImportStatements(
  examplesMetadata: ExampleMetadata[],
): string {
  let imports = '';
  for (const [path, importNames] of getExampleImportsFromMetadata(
    examplesMetadata,
  )) {
    imports += `import { ${importNames.join(', ')} } from '${path}';\n`;
  }
  return imports;
}
