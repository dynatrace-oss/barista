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

import { promises as fs, mkdirSync } from 'fs';
import { join } from 'path';
import { BaAllExamplesMetadata } from '@dynatrace/barista-components/barista-definitions';
import { environment } from 'tools/environments/barista-environment';
import { ExamplePackageMetadata } from './metadata';

/** Generates the metadata file for the examples library. */
export async function generateExamplesLibMetadataFile(
  packageMetadata: ExamplePackageMetadata[],
): Promise<string> {
  const metadata: BaAllExamplesMetadata = {};

  for (const packageMeta of packageMetadata) {
    for (const exampleMeta of packageMeta.examples) {
      metadata[exampleMeta.className] = {
        name: exampleMeta.className,
        templateSource: exampleMeta.templateSource,
        classSource: exampleMeta.classSource,
        stylesSource: exampleMeta.stylesSource ? exampleMeta.stylesSource : '',
      };
    }
  }

  mkdirSync(environment.examplesMetadataDir, { recursive: true });
  const outFile = join(
    environment.examplesMetadataDir,
    environment.examplesMetadataFileName,
  );

  await fs.writeFile(outFile, JSON.stringify(metadata, null, 2), {
    flag: 'w', // "w" -> Create file if it does not exist
    encoding: 'utf8',
  });

  return outFile;
}
