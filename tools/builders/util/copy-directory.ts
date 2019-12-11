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

import { statSync, existsSync, promises as fs } from 'fs';
import { join } from 'path';

/** Asynchronously copies a directory and all its content to the target directory recursively */
export async function copyDirectory(
  source: string,
  target: string,
): Promise<void> {
  const exists = existsSync(source);
  if (exists) {
    const stats = statSync(source);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      const dirs = await fs.readdir(source);
      await fs.mkdir(target);
      await Promise.all(
        dirs.map(childItemName => {
          return copyDirectory(
            join(source, childItemName),
            join(target, childItemName),
          );
        }),
      );
    } else {
      await fs.copyFile(source, target);
    }
  } else {
    console.warn(`The directory '${source}' you want to copy does not exist`);
  }
}
