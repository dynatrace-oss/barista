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

import { ExamplePackageMetadata } from './metadata';
import { relative, join, extname } from 'path';
import { transformAndWriteTemplate } from './util';

function getImportExportPath(fileName: string, examplesRoot: string): string {
  let path = fileName;
  if (extname(path) === '.ts') {
    path = path.slice(0, -3);
  }
  return relative(examplesRoot, path);
}

export async function generateExamplesLibBarrelFile(
  packageMetas: ExamplePackageMetadata[],
  examplesRoot: string,
): Promise<string> {
  const templateFile = join(examplesRoot, 'index.template');
  const rootBarrelFile = join(examplesRoot, 'index.ts');

  return transformAndWriteTemplate(
    source => {
      let exports: string[] = [];
      for (const packageMeta of packageMetas) {
        exports.push(
          `export * from './${getImportExportPath(
            packageMeta.moduleFile,
            examplesRoot,
          )}';`,
        );
        for (const example of packageMeta.examples) {
          exports.push(
            `export * from './${getImportExportPath(
              example.tsFileLocation,
              examplesRoot,
            )}';`,
          );
        }
      }

      source = source.replace('${exports}', exports.join('\n'));

      return source;
    },
    templateFile,
    rootBarrelFile,
  );
}
