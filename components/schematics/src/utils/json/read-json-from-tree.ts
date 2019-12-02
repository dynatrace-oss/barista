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

import {
  JsonAstObject,
  parseJsonAst,
  JsonParseMode,
} from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { readFileFromTree } from '../read-file-from-tree';
import { SchematicsException } from '@angular-devkit/schematics';

const ERROR_INVALID_JSON = 'Invalid JSON. Was expecting an object';

/**
 * reads safely a JSON and returns a JsonAstObject
 * @param tree Schematics Tree with the files
 * @param path Path to the json file
 */
export function readJsonFromTree(tree: Tree, path: string): JsonAstObject {
  const content = readFileFromTree(tree, path);
  const packageJson = parseJsonAst(content, JsonParseMode.Strict);
  if (packageJson.kind !== 'object') {
    throw new SchematicsException(ERROR_INVALID_JSON);
  }
  return packageJson;
}
