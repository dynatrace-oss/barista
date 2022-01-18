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
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree, serializeJson } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 8.0.0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@dynatrace/barista-components/schematics',
      path.join(__dirname, '../../../migrations.json'),
    );

    initialTree.overwrite(
      'package.json',
      serializeJson({
        dependencies: {
          '@angular/core': '^10.0.0',
          '@dynatrace/barista-components': '^7.5.0',
          '@dynatrace/barista-fonts': '^1.0.1',
          '@dynatrace/barista-icons': '^3.6.0',
        },
      }),
    );
  });

  it('should update the barista components to the latest major version', async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-8-0-0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies).toEqual({
      '@angular/core': '^10.0.0',
      '@dynatrace/barista-components': '^8.0.0',
      '@dynatrace/barista-fonts': '^1.0.1',
      '@dynatrace/barista-icons': '^7.5.0',
    });
  });

  it('should not update anything if it is already up to date', async () => {
    initialTree.overwrite(
      'package.json',
      serializeJson({
        dependencies: {
          '@angular/core': '^10.0.0',
          '@dynatrace/barista-components': '^8.0.0',
        },
      }),
    );

    const result = await schematicRunner
      .runSchematicAsync('update-8-0-0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies).toEqual({
      '@angular/core': '^10.0.0',
      '@dynatrace/barista-components': '^8.0.0',
      '@dynatrace/barista-icons': '^7.5.0',
    });
  });

  it('should not update the angular version', async () => {
    initialTree.overwrite(
      'package.json',
      serializeJson({
        dependencies: {
          '@angular/core': '^9.5.0',
          '@dynatrace/barista-components': '^7.6.0',
        },
      }),
    );

    const result = await schematicRunner
      .runSchematicAsync('update-8-0-0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies).toEqual({
      '@angular/core': '^9.5.0',
      '@dynatrace/barista-components': '^8.0.0',
      '@dynatrace/barista-icons': '^7.5.0',
    });
  });
});
