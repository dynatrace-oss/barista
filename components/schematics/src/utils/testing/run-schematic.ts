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
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';

const testRunner = new SchematicTestRunner(
  '@dynatrace/barista-components/schematics',
  join(__dirname, '../collection.json'),
);

export async function runSchematic(
  schematicName: string,
  options: any,
  tree: Tree,
): Promise<UnitTestTree> {
  return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}
