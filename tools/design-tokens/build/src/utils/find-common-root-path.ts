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

import { sep, join } from 'path';

/** Finds the innermost folder that contains all the given paths */
export function findCommonRootPath(paths: string[]): string | undefined {
  for (const path of paths) {
    const pathParts = path.split(sep);

    for (let i = pathParts.length - 1; i >= 0; i--) {
      const subPath = join(...pathParts.slice(0, i));
      if (paths.filter((p) => p.startsWith(subPath)).length === paths.length) {
        return subPath;
      }
    }
  }
}
