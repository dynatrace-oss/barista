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

import { noop, Tree } from '@angular-devkit/schematics';
import {
  addFixtureToTree,
  runSchematic,
  createWorkspace,
  addLegacyComponents,
} from '../testing';
import { readFileFromTree, readJsonAsObjectFromTree } from '../utils';
import { Schema } from './schema';
import { UnitTestTree } from '@angular-devkit/schematics/testing';

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

let tree: UnitTestTree;

beforeEach(async () => {
  tree = await createWorkspace();
});

// Testing of Dynatrace Ng-Add Schematic
describe('Migrate existing angular-components to barista components', () => {
  let externalSchematicsMock: jest.Mock;

  beforeEach(async () => {
    externalSchematicsMock = devkitSchematics.externalSchematic = jest
      .fn()
      .mockReturnValue(noop());

    await addLegacyComponents(tree);
  });

  afterEach(() => {
    externalSchematicsMock.mockClear();
  });

  it('should call the migration schematic when legacy imports are detected', async () => {
    await testNgAdd(tree, { project: undefined });
    expect(externalSchematicsMock).toBeCalledTimes(1);
    expect(externalSchematicsMock).toBeCalledWith(
      expect.stringMatching(/collection\.json$/),
      'update-5.0.0',
      {},
    );
  });

  it('should update imports of @dynatrace/angular-components to barista-components in package.json', async () => {
    await testNgAdd(tree, { project: undefined });
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

  it('should include main.scss in angular.json, when typography is set to false ', async () => {
    await addFixtureToTree(
      tree,
      'package-animations-existing.json',
      '/package.json',
    );

    await addFixtureToTree(tree, 'angular-simple.json', '/angular.json');
    await testNgAdd(tree, { project: 'myapp', typography: false });

    expect(
      readJsonAsObjectFromTree<any>(tree, '/angular.json').projects.myapp
        .architect.build.options.styles[1],
    ).toMatch(/main\.scss$/);
  });

  it('should add styles correctly even if there is no styles array in the angular.json ', async () => {
    await addFixtureToTree(
      tree,
      'package-animations-existing.json',
      '/package.json',
    );

    await addFixtureToTree(
      tree,
      'angular-without-styles.json',
      '/angular.json',
    );
    await testNgAdd(tree, { project: 'myapp' });

    expect(readJsonAsObjectFromTree(tree, '/angular.json')).toMatchSnapshot();
  });

  it('should update the main ngModule with the correct providers', async () => {
    await testNgAdd(tree, {
      project: 'myapp',
      module: '/apps/myapp/src/app/app.module.ts',
    });

    expect(
      readFileFromTree(tree, '/apps/myapp/src/app/app.module.ts'),
    ).toMatchSnapshot();
  });

  it.only('should update the legacy angular json', async () => {
    await testNgAdd(tree, { project: 'myapp' });

    expect(readJsonAsObjectFromTree(tree, '/angular.json')).toMatchSnapshot();
  });
});

describe('New workspace', () => {
  it('should add all the required modules in a fresh create angular app', async () => {
    await testNgAdd(tree, {
      project: 'myapp',
      module: '/apps/myapp/src/app/app.module.ts',
    });

    expect(
      readFileFromTree(tree, '/apps/myapp/src/app/app.module.ts'),
    ).toMatchSnapshot('app.module.ts');
    expect(readJsonAsObjectFromTree(tree, '/angular.json')).toMatchSnapshot(
      'angular.json',
    );
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot(
      'package.json',
    );
  });

  it('should add all the necessary peer dependencies if no barista or angular components are installed', async () => {
    await addFixtureToTree(tree, 'package-empty.json', '/package.json');
    await testNgAdd(tree, { animations: false, project: undefined });
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it('should add the `@angular/animations` package with the same version as the `@angular/core` package when specified', async () => {
    await addFixtureToTree(tree, 'package-empty.json', '/package.json');
    await testNgAdd(tree, { project: undefined });
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it("shouldn't add @angular/animations` package if already installed", async () => {
    await addFixtureToTree(
      tree,
      'package-animations-existing.json',
      '/package.json',
    );

    await testNgAdd(tree, { animations: true, project: undefined });

    // check if the angular animations package is used more than once
    expect(
      readFileFromTree(tree, '/package.json').match(/\@angular\/animations/gim),
    ).toHaveLength(1);
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });

  it('should add @angular/platform-browser-dynamic', async () => {
    await addFixtureToTree(tree, 'package-empty.json', '/package.json');

    expect(readFileFromTree(tree, '/package.json')).not.toMatch(
      '@angular/platform-browser-dynamic',
    );

    await testNgAdd(tree, { project: undefined });
    expect(readJsonAsObjectFromTree(tree, '/package.json')).toMatchSnapshot();
  });
});
