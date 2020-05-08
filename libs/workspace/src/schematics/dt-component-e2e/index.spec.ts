/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { promises as fs } from 'fs';
import { join } from 'path';

export async function getFixture(filePath: string): Promise<string> {
  const fixturesFolder = join(__dirname, './fixtures');
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
  if (tree.exists(destination)) {
    tree.overwrite(destination, content);
    return;
  }
  tree.create(destination, content);
}

const getNewFiles = (newFiles: string[], oldFiles: string[]): string[] =>
  newFiles.filter((file) => !oldFiles.includes(file));

describe('Add E2E Component', () => {
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
      'app.routing.module.ts.fixture.ts',
      'apps/components-e2e/src/app/app.routing.module.ts',
    );

    initialFiles = initialTree.files;
  });

  it('should add the necessary files', async () => {
    const result = await schematicRunner
      .runSchematicAsync('dt-e2e', { name: 'alert' }, initialTree)
      .toPromise();

    const newFiles = getNewFiles(result.files, initialFiles);

    expect(newFiles).toEqual([
      '/apps/components-e2e/src/components/alert/alert.e2e.ts',
      '/apps/components-e2e/src/components/alert/alert.html',
      '/apps/components-e2e/src/components/alert/alert.module.ts',
      '/apps/components-e2e/src/components/alert/alert.po.ts',
      '/apps/components-e2e/src/components/alert/alert.ts',
    ]);
  });

  it('should generate files with the appropriate content', async () => {
    const result = await schematicRunner
      .runSchematicAsync('dt-e2e', { name: 'alert' }, initialTree)
      .toPromise();

    const newFiles = getNewFiles(result.files, initialFiles);
    newFiles.map((file) => expect(result.readContent(file)).toMatchSnapshot());
  });

  it('should change files appropriately', async () => {
    const result = await schematicRunner
      .runSchematicAsync('dt-e2e', { name: 'alert' }, initialTree)
      .toPromise();

    expect(
      result.readContent('apps/components-e2e/src/app/app.routing.module.ts'),
    ).toMatchSnapshot();
  });

  it('should throw error if we already have the files in there', async () => {
    await addFixtureToTree(
      initialTree,
      'alert.fixture.ts',
      '/apps/components-e2e/src/components/alert/alert.ts',
    );

    await expect(
      schematicRunner
        .runSchematicAsync('dt-e2e', { name: 'alert' }, initialTree)
        .toPromise(),
    ).rejects.toThrow();
  });
});
