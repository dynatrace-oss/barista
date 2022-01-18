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

import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { readFileFromTree } from '../read-file-from-tree';

/**
 * This method is specifically for reading JSON files in a Tree
 *
 * @param tree The tree tree
 * @param path The path to the JSON file
 * @returns The JSON data in the file.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function readJsonFromTree<T = {}>(tree: Tree, path: string): T {
  const content = readFileFromTree(tree, path);
  try {
    return JSON.parse(content) as T;
  } catch (e) {
    throw new SchematicsException(`Cannot parse ${path}: ${e.message}`);
  }
}
