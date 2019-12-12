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
import { readJsonAsObjectFromTree } from '../utils';
import { runSchematic } from '../utils/testing';
import { Schema } from './schema';

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

export async function getFixture(filePath: string): Promise<string> {
  const fixturesFolder = join(__dirname, '../fixtures');
  return fs.readFile(join(fixturesFolder, filePath), {
    encoding: 'utf-8',
  });
}

export async function addFixtureToTree(
  tree: Tree,
  source: string,
  destination: string,
): Promise<void> {
  const content = await getFixture(source);
  tree.create(destination, content);
}

// Testing of Dynatrace Ng-Add Schematic
describe('ng-add schematic for dynatrace barista-components', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
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
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchObject({
      dependencies: {
        '@dynatrace/barista-components': '5.0.0',
        '@dynatrace/barista-icons': '{{version}}',
        'd3-geo': '{{version}}',
        'd3-scale': '{{version}}',
        'd3-shape': '{{version}}',
        highcharts: '{{version}}',
      },
    });
  });

  it('should add the `@angular/animations` package with the same version as the `@angular/core` package when specified', async () => {
    await addFixtureToTree(tree, 'package-empty.json', '/package.json');

    await testNgAdd(tree);
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchObject({
      dependencies: {
        '@angular/core': '^8.2.12',
        '@angular/animations': '^8.2.12',
      },
    });
  });

  // it('should update imports in project', () => {
  //   expect(getFileContent(tree, 'apps/src/main.ts')).toEqual(RENAMEDIMPORT);
  // });

  // it('should install @angular/animations', () => {
  //   expect(getFileContent(tree, 'app.module.ts')).toEqual(APPMODULE);
  // });

  // it('should insert styles to main css file', () => {
  //   expect(getFileContent(tree, 'index.css')).toEqual(STYLECSS);
  // });

  // it('should update icons and fonts paths in angular.json', () => {
  //   expect(getFileContent(tree, 'angular.json')).toEqual(ANGULARJSON);
  // });
});
