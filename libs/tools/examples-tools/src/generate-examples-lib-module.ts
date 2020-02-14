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
import { environment } from '@environments/barista-environment';

/** Generates the examples-module where all example components are declared. */
export async function generateExamplesLibModule(
  examplesMetadata: ExamplePackageMetadata[],
  targetDir: string,
): Promise<string> {
  const templateFile = join(
    environment.examplesLibDir,
    'examples.module.template',
  );
  const outFile = join(targetDir, 'examples.module.ts');

  return transformAndWriteTemplate(
    source => {
      const imports: string[] = [];
      const moduleNames: string[] = [];
      for (const packageMeta of examplesMetadata) {
        imports.push(
          `import { ${
            packageMeta.moduleClassName
          } } from '${getImportExportPath(
            packageMeta.moduleFile,
            environment.examplesLibDir,
          )}';`,
        );
        moduleNames.push(packageMeta.moduleClassName);
      }
      source = source.replace('${exampleModules}', moduleNames.join(',\n    '));
      source = source.replace('${imports}', imports.join('\n'));

      return source;
    },
    templateFile,
    outFile,
  );
}
