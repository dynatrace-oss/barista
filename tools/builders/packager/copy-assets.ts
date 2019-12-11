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

import { parseDir } from 'sass-graph';
import { copyDirectory } from '../util/copy-directory';
import { join, relative, dirname } from 'path';
import { promises as fs } from 'fs';
import { PackagerOptions } from './schema';

/** Asynchronously copies all style files and all their dependencies to the destination */
export async function copyStyles(
  options: PackagerOptions,
  projectRoot: string,
  libraryDestination: string,
): Promise<void> {
  const allStyleFiles = options.styleFolders.map(folder =>
    Object.keys(parseDir(join(projectRoot, folder)).index),
  );
  const files = new Set(...allStyleFiles);
  for (const file of files) {
    const destination = join(libraryDestination, relative(projectRoot, file));
    await fs.mkdir(dirname(destination), { recursive: true });
    await fs.copyFile(file, destination);
  }
}

/** Asynchronously copies all asset folders in the options specified */
export async function copyAssets(
  options: PackagerOptions,
  projectRoot: string,
  libraryDestination: string,
): Promise<void[]> {
  return Promise.all(
    options.assetFolders.map(folder => {
      const destination = join(libraryDestination, folder);
      return copyDirectory(join(projectRoot, folder), destination);
    }),
  );
}
