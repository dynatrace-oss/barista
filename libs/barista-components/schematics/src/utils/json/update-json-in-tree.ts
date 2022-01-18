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

import {
  SchematicContext,
  Rule,
  SchematicsException,
} from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { readJsonFromTree } from './read-json-from-tree';

const JSON_NOT_EXISTING_ERROR = (filePath: string) =>
  `The specified JSON file ${filePath} is not existing!`;

/** Serializes a JSON */
function serializeJson(json: any, indents = 2): string {
  return JSON.stringify(json, null, indents);
}

/**
 * This method is specifically for updating JSON in a Tree
 *
 * @param path Path of JSON file in the Tree
 * @param callback Manipulation of the JSON data
 * @returns A rule which updates a JSON file file in a Tree
 */
export function updateJsonInTree<T = any, O = T>(
  path: string,
  callback: (json: T, context: SchematicContext) => O,
): Rule {
  return (host: Tree, context: SchematicContext): Tree => {
    if (!host.exists(path)) {
      throw new SchematicsException(JSON_NOT_EXISTING_ERROR(path));
    }
    const jsonObject = readJsonFromTree<T>(host, path);
    // override the original file with the changes from the callback
    host.overwrite(path, serializeJson(callback(jsonObject, context)));
    return host;
  };
}
