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

import { Tree, noop } from '@angular-devkit/schematics';
import { promises as fs } from 'fs';
import { join } from 'path';
import { readJsonAsObjectFromTree, readFileFromTree } from '../utils';
import { runSchematic, addFixtureToTree } from '../testing';
import { Schema } from './schema';
import { getWorkspace, updateWorkspace } from '../utils/workspace';

// used for mocking the externalSchematic function
const devkitSchematics = require('@angular-devkit/schematics');

export async function testNgAdd(
  tree: Tree,
  options: Partial<Schema> = {},
): Promise<void> {
  const schemaOptions: Schema = {
    project: 'testProject',
    animations: true,
    typography: true,
    ...options,
  };
  await runSchematic('ng-add', schemaOptions, tree);
}

// Testing of Dynatrace Ng-Add Schematic
describe('ng-add schematic for dynatrace barista-components', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = Tree.empty();
    await addFixtureToTree(
      tree,
      'barista-components-package.json',
      'node_modules/@dynatrace/barista-components/package.json',
    );
  });

  it('should update imports of @dynatrace/angular-components to barista-components in package.json', async () => {
    // mock the run external schematic function
    devkitSchematics.externalSchematic = jest.fn().mockReturnValue(noop());

    await addFixtureToTree(
      tree,
      'package-simple-migration.json',
      '/package.json',
    );

    await testNgAdd(tree);
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchObject(
      expect.objectContaining({
        dependencies: {
          '@dynatrace/barista-components': '5.0.0',
        },
      }),
    );
  });

  it('should add all the necessary peer dependencies if no barista or angular components are installed', async () => {
    await addFixtureToTree(tree, 'package-empty.json', '/package.json');

    await testNgAdd(tree, { animations: false });
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it('should add the `@angular/animations` package with the same version as the `@angular/core` package when specified', async () => {
    await addFixtureToTree(tree, 'package-empty.json', '/package.json');

    await testNgAdd(tree);
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it("shouldn't add @angular/animations` package if already installed", async () => {
    await addFixtureToTree(
      tree,
      'package-animations-existing.json',
      '/package.json',
    );

    await testNgAdd(tree, { animations: true });

    const packageJSON = readFileFromTree(tree, '/package.json');

    // check if the angular animations package is used more than once
    expect(packageJSON.match(/\@angular\/animations/gim)).toHaveLength(1);
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it('should add @angular/platform-browser-dynamic', async () => {
    await addFixtureToTree(
      tree,
      'package-animations-existing.json',
      '/package.json',
    );

    await testNgAdd(tree);
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it('should add barista icons to the angular.json', async () => {
    await addFixtureToTree(
      tree,
      'package-animations-existing.json',
      '/package.json',
    );

    await addFixtureToTree(tree, 'angular-simple.json', '/angular.json');
    await testNgAdd(tree, { project: 'myapp' });

    expect(readJsonAsObjectFromTree(tree, '/angular.json')).toMatchSnapshot();
  });
});
