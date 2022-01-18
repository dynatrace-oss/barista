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

import { Tree } from '@angular-devkit/schematics/src/tree/interface';

/**
 * Returns a set of matched files in a tree by a provided matcher function
 *
 * @param tree The tree where we have to search for the files
 * @param matcher A function that gets a file path and check if the path matches
 */
export function getMatchingFilesFromTree(
  tree: Tree,
  matcher: (filePath: string) => boolean,
): Set<string> {
  const files = new Set<string>();
  tree.root.visit((file) => {
    if (matcher(file)) {
      files.add(file.toString());
    }
  });
  return files;
}
