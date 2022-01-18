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
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';

export const testRunner = new SchematicTestRunner(
  '@dynatrace/barista-components/schematics',
  join(__dirname, '../../collection.json'),
);

/** Runs a schematic */
export async function runSchematic<T extends unknown>(
  schematicName: string,
  options: T,
  tree: Tree,
): Promise<UnitTestTree> {
  return testRunner
    .runSchematicAsync<T>(schematicName, options, tree)
    .toPromise();
}

/** Runs an external Schematic */
export async function runExternalSchematic<T extends unknown>(
  collectionName: string,
  schematicName: string,
  options: T,
  tree: Tree,
): Promise<UnitTestTree> {
  return testRunner
    .runExternalSchematicAsync<T>(collectionName, schematicName, options, tree)
    .toPromise();
}
