/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { existsSync } from 'fs';
import { lstatSync } from 'fs';
import { resolve } from 'path';

/**
 * Try to resolve a folder or filename as js file or as barrel file.
 * @param fileName The filename or path that should be resolved
 */
export function resolveModuleFileName(fileName: string): string | undefined {
  const absolutePath = resolve(fileName);

  if (existsSync(absolutePath) && lstatSync(absolutePath).isFile()) {
    return absolutePath;
  }

  if (existsSync(`${absolutePath}.js`)) {
    return `${absolutePath}.js`;
  }

  if (existsSync(`${absolutePath}/index.js`)) {
    return `${absolutePath}/index.js`;
  }

  // TODO: lukas.holzer find a more elegant solution for getting the module_root
  if (existsSync(`${absolutePath}/src/index.js`)) {
    return `${absolutePath}/src/index.js`;
  }
}
