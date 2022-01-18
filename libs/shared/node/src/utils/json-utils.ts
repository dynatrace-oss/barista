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

import { promises as fs } from 'fs';

/**
 * Tries to parse a json file and throws an error if parsing fails
 *
 * @throws Will throw if the json cannot be parsed
 */
export async function tryJsonParse<T>(path: string): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path, { encoding: 'utf-8' })) as T;
  } catch (err) {
    throw new Error(`Error while parsing json file at ${path}`);
  }
}

export interface NgPackagerJson {
  dest: string;
}
