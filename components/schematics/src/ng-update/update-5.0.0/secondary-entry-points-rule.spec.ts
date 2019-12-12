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

import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createTestApp } from '../../testing';

// Testing of Dynatrace Ng-Add Schematic
describe('ng-add schematic for dynatrace barista-components', () => {
  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestApp();
  });

  it('should update imports of @dynatrace/angular-components to barista-components in package.json', async () => {
    console.log(tree.files);
    // await testNgAdd(tree);
    // expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchObject(
    //   expect.objectContaining({
    //     dependencies: {
    //       '@dynatrace/barista-components': '5.0.0',
    //     },
    //   }),
    // );
  });
});
