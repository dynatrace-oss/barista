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

import { Volume } from 'memfs/lib/volume';
import { extname, join, resolve } from 'path';
import { DesignTokensBuildOptions } from '../schema';
import { ecmascriptBarrelFileTemplate } from '../token-converters/js-barrel-file-template';
import { typescriptBarrelFileTemplate } from '../token-converters/ts-barrel-file-template';

/** Generate an index.ts barrel file that exports all design tokens. */
export function generateTypescriptBarrelFile(
  options: DesignTokensBuildOptions,
  volume: Volume,
): Volume {
  const relativeImportPaths = Object.keys(volume.toJSON())
    .filter((fileName) => extname(fileName) === '.ts')
    .map((fileName) => fileName.replace('.ts', ''))
    .map((fileName) => fileName.replace(resolve(options.outputPath), '.'));
  volume.writeFileSync(
    join(options.outputPath, 'index.ts'),
    typescriptBarrelFileTemplate(relativeImportPaths),
  );
  return volume;
}

/** Generate an index.ts barrel file that exports all design tokens. */
export function generateEcmascriptBarrelFile(
  options: DesignTokensBuildOptions,
  volume: Volume,
): Volume {
  const relativeImportPaths = Object.keys(volume.toJSON())
    .filter((fileName) => extname(fileName) === '.js')
    .map((fileName) => fileName.replace('.js', ''))
    .map((fileName) => fileName.replace(resolve(options.outputPath), '.'));
  volume.writeFileSync(
    join(options.outputPath, 'index.js'),
    ecmascriptBarrelFileTemplate(relativeImportPaths),
  );
  return volume;
}
