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

import { ExamplePackageMetadata } from './metadata';
import { join } from 'path';
import { transformAndWriteTemplate, getImportExportPath } from './util';

export async function generateExamplesLibBarrelFile(
  packageMetas: ExamplePackageMetadata[],
  examplesRoot: string,
): Promise<string> {
  const templateFile = join(examplesRoot, 'index.template');
  const rootBarrelFile = join(examplesRoot, 'index.ts');

  return transformAndWriteTemplate(
    source => {
      const imports: string[] = [];
      const exampleExports: string[] = [];
      const moduleExports: string[] = [];
      const examplesMapData: string[] = [];
      for (const packageMeta of packageMetas) {
        moduleExports.push(
          `export { ${
            packageMeta.moduleClassName
          } } from './${getImportExportPath(
            packageMeta.moduleFile,
            examplesRoot,
          )}';`,
        );
        const importExportMap = new Map<string, string[]>();
        for (const example of packageMeta.examples) {
          const importExportPath = getImportExportPath(
            example.tsFileLocation,
            examplesRoot,
          );
          let importExportSymbolNames = importExportMap.get(importExportPath);
          if (!importExportSymbolNames) {
            importExportSymbolNames = [];
            importExportMap.set(importExportPath, importExportSymbolNames);
          }
          importExportSymbolNames.push(example.className);
        }

        for (const [path, symbolNames] of importExportMap) {
          const namedImports =
            symbolNames.length > 1
              ? `\n  ${symbolNames.join(',\n  ')}\n`
              : ` ${symbolNames[0]} `;
          imports.push(`import {${namedImports}} from '${path}';`);
          exampleExports.push(...symbolNames);
          examplesMapData.push(
            ...symbolNames.map(name => `['${name}', ${name}]`),
          );
        }
      }

      source = source.replace('${imports}', imports.join('\n'));
      source = source.replace('${moduleExports}', moduleExports.join('\n'));
      source = source.replace(
        '${exampleExports}',
        `export {\n  ${exampleExports.join(',\n  ')}\n};`,
      );
      return source.replace('${examplesMap}', examplesMapData.join(',\n  '));
    },
    templateFile,
    rootBarrelFile,
  );
}
