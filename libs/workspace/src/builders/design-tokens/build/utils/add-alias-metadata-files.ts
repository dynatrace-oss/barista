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

import { readFileSync } from 'fs';
import { Volume } from 'memfs/lib/volume';
import { dirname, extname, join, resolve } from 'path';
import { DesignTokensBuildOptions } from '../schema';
import { parse } from 'yaml';
import { readSourceFiles } from './read-source-files';
/**
 * Add JSON versions of the original alias YAML files for
 * consumption by the design tokens UI.
 */
export async function addAliasMetadataFiles(
  baseDirectory: string,
  options: DesignTokensBuildOptions,
  volume: Volume,
): Promise<Volume> {
  const aliasFiles = await readSourceFiles(
    options.aliasesEntrypoints || [],
    baseDirectory,
  ).toPromise();
  for (const file of aliasFiles) {
    const filePath = join(baseDirectory, file);
    const fileSource = readFileSync(filePath, {
      encoding: 'utf-8',
    });
    const jsonSource = JSON.stringify(parse(fileSource));
    const absoluteOutputPath = join(resolve(options.outputPath), file).replace(
      extname(file),
      '.json',
    );
    volume.mkdirSync(dirname(absoluteOutputPath), { recursive: true });
    volume.writeFileSync(absoluteOutputPath, jsonSource);
  }
  return volume;
}
