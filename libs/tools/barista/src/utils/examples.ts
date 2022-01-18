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

import { mkdirSync, promises as fs, readdirSync, lstatSync } from 'fs';
import { environment } from '@environments/barista-environment';
import { join, basename } from 'path';
import { ExamplePackageMetadata, getExamplePackageMetadata } from './metadata';
import { BaAllExamplesMetadata } from '@dynatrace/shared/design-system/interfaces';

/** Collect all files containing examples in the demos app. */
export async function getExamplesInPackages(): Promise<
  ExamplePackageMetadata[]
> {
  return (
    await Promise.all(
      readdirSync(environment.examplesLibDir)
        .map((name) => join(environment.examplesLibDir, name))
        .filter((dir) => lstatSync(dir).isDirectory())
        .map((dir) => getExamplePackageMetadata(dir)),
    )
  ).filter(Boolean) as ExamplePackageMetadata[];
}

/** Generates the metadata file for the examples library. */
export async function generateExamplesLibMetadataFile(
  packageMetadata: ExamplePackageMetadata[],
  distDir: string,
): Promise<string> {
  const metadata: BaAllExamplesMetadata = {};

  for (const packageMeta of packageMetadata) {
    for (const exampleMeta of packageMeta.examples) {
      metadata[exampleMeta.className] = {
        directory: basename(packageMeta.dir),
        name: exampleMeta.className,
        templateSource: exampleMeta.templateSource,
        classSource: exampleMeta.classSource,
        stylesSource: exampleMeta.stylesSource ? exampleMeta.stylesSource : '',
      };
    }
  }

  mkdirSync(distDir, { recursive: true });
  const outFile = join(distDir, environment.examplesMetadataFileName);

  await fs.writeFile(outFile, JSON.stringify(metadata, null, 2), {
    flag: 'w', // "w" -> Create file if it does not exist
    encoding: 'utf8',
  });

  return outFile;
}
