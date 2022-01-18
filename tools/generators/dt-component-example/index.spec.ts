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

import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { join } from 'path';
import { addFixtureToTree, getNewFiles } from '../utils/test-utils';

const fixturesFolder = join(__dirname, './fixtures');

describe('Add Example Component', () => {
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'apps',
    version: '8.0.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'myapp',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: true,
    skipPackageJson: true,
  };

  let initialTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let initialFiles: string[];

  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner(
      '@dynatrace/barista-components/schematics',
      join(__dirname, '../../../collection.json'),
    );

    initialTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions,
        Tree.empty(),
      )
      .toPromise();

    initialTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        initialTree,
      )
      .toPromise();

    await addFixtureToTree(
      initialTree,
      'examples.module.ts.fixture',
      '/libs/examples/src/examples.module.ts',
      fixturesFolder,
    );

    await addFixtureToTree(
      initialTree,
      'examplesIndex.ts.fixtures',
      '/libs/examples/src/index.ts',
      fixturesFolder,
    );

    await addFixtureToTree(
      initialTree,
      'app-routing.module.ts.fixture',
      '/apps/demos/src/app-routing.module.ts',
      fixturesFolder,
    );

    await addFixtureToTree(
      initialTree,
      'nav-items.ts.fixture',
      '/apps/demos/src/nav-items.ts',
      fixturesFolder,
    );

    initialFiles = initialTree.files;
  });

  it('should add the necessary files', async () => {
    const result = await schematicRunner
      .runSchematicAsync(
        'dt-example',
        { name: 'simple', component: 'TestComponent' },
        initialTree,
      )
      .toPromise();

    const newFiles = getNewFiles(result.files, initialFiles);

    expect(newFiles).toEqual([
      '/libs/examples/src/test-component/index.ts',
      '/libs/examples/src/test-component/test-component-examples.module.ts',
      '/libs/examples/src/test-component/test-component-simple-example/test-component-simple-example.html',
      '/libs/examples/src/test-component/test-component-simple-example/test-component-simple-example.ts',
    ]);
  });

  it('should generate files with the appropriate content', async () => {
    const result = await schematicRunner
      .runSchematicAsync(
        'dt-example',
        { name: 'simple', component: 'TestComponent' },
        initialTree,
      )
      .toPromise();

    const newFiles = getNewFiles(result.files, initialFiles);
    newFiles.map((file) => expect(result.readContent(file)).toMatchSnapshot());
  });

  it('should change files appropriately', async () => {
    await addFixtureToTree(
      initialTree,
      'test-component-examples.module.ts.fixture',
      '/libs/examples/src/test-component/test-component-examples.module.ts',
      fixturesFolder,
    );

    await addFixtureToTree(
      initialTree,
      'index.ts.fixture',
      '/libs/examples/src/test-component/index.ts',
      fixturesFolder,
    );

    const result = await schematicRunner
      .runSchematicAsync(
        'dt-example',
        { name: 'complex', component: 'TestComponent' },
        initialTree,
      )
      .toPromise();

    expect(
      result.readContent(
        '/libs/examples/src/test-component/test-component-examples.module.ts',
      ),
    ).toMatchSnapshot();

    expect(
      result.readContent('/libs/examples/src/test-component/index.ts'),
    ).toMatchSnapshot();

    expect(result.readContent('/libs/examples/src/index.ts')).toMatchSnapshot();

    expect(
      result.readContent('/libs/examples/src/examples.module.ts.ts'),
    ).toMatchSnapshot();

    expect(
      result.readContent('/apps/demos/src/app-routing.module.ts'),
    ).toMatchSnapshot();

    expect(
      result.readContent('/apps/demos/src/nav-items.ts'),
    ).toMatchSnapshot();
  });

  it('should throw error if we already have the files in there', async () => {
    await addFixtureToTree(
      initialTree,
      'test-test-example.fixture',
      '/libs/examples/src/test/test-test-example/test-test-example.ts',
      fixturesFolder,
    );

    await expect(
      schematicRunner
        .runSchematicAsync(
          'dt-example',
          { name: 'test', component: 'test' },
          initialTree,
        )
        .toPromise(),
    ).rejects.toThrow();
  });

  it('should throw error if there was a problem updating examples.module file', async () => {
    await addFixtureToTree(
      initialTree,
      'faulty.fixture',
      '/libs/examples/src/test/test-test-example/test-test-example.ts',
      fixturesFolder,
    );

    await expect(
      schematicRunner
        .runSchematicAsync(
          'dt-example',
          { name: 'test', component: 'test' },
          initialTree,
        )
        .toPromise(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should provide meaningful error message if component index.ts modification is not successful', async () => {
    await addFixtureToTree(
      initialTree,
      'test-component-examples.module.ts.fixture',
      '/libs/examples/src/test-component/test-component-examples.module.ts',
      fixturesFolder,
    );

    await addFixtureToTree(
      initialTree,
      'faulty.fixture',
      '/libs/examples/src/test-component/index.ts',
      fixturesFolder,
    );

    await expect(
      schematicRunner
        .runSchematicAsync(
          'dt-example',
          { name: 'complex', component: 'TestComponent' },
          initialTree,
        )
        .toPromise(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should provide meaningful error message if component nav-items.ts modification is not successful', async () => {
    await addFixtureToTree(
      initialTree,
      'faulty.fixture',
      '/apps/demos/src/nav-items.ts',
      fixturesFolder,
    );

    await expect(
      schematicRunner
        .runSchematicAsync(
          'dt-example',
          { name: 'complex', component: 'TestComponent' },
          initialTree,
        )
        .toPromise(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should provide meaningful error message if component app-routing.module.ts modification is not successful', async () => {
    await addFixtureToTree(
      initialTree,
      'faulty.fixture',
      '/apps/demos/src/app-routing.module.ts',
      fixturesFolder,
    );

    await expect(
      schematicRunner
        .runSchematicAsync(
          'dt-example',
          { name: 'complex', component: 'TestComponent' },
          initialTree,
        )
        .toPromise(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should provide meaningful error message if barrel index.ts modification is not successful', async () => {
    await addFixtureToTree(
      initialTree,
      'faulty.fixture',
      '/libs/examples/src/index.ts',
      fixturesFolder,
    );

    await expect(
      schematicRunner
        .runSchematicAsync(
          'dt-example',
          { name: 'complex', component: 'TestComponent' },
          initialTree,
        )
        .toPromise(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
