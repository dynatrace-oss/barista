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

import { sync as globSync } from 'glob';
import { Observable, of } from 'rxjs';

/**
 * Globs over all entrypoint patterns, finds the files that should be processed.
 * @param entrypoints - Globbing pattern of all entry points.
 * @param cwd - Relative directory that is used as a root for the globbing patterns.
 */
export function findSourceFiles(
  tokenEntrypoints: string[],
  cwd: string,
): Observable<string[]> {
  const entrypointFiles: string[] = [];
  for (const globPattern of tokenEntrypoints) {
    entrypointFiles.push(...globSync(globPattern, { cwd }));
  }
  return of(entrypointFiles);
}
