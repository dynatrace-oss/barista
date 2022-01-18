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
import { readFileFromTree } from '../../utils';

describe('Update 7.0.0', () => {
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
          '@dynatrace/barista-components': '6.0.0',
          '@dynatrace/barista-fonts': '1.0.1',
          '@dynatrace/barista-icons': '3.6.0',
          highcharts: '6.2.0',
        },
        devDependencies: {
          '@types/highcharts': '5.0.36',
        },
      }),
    );
  });

  it('should update the dpendencies without highcharts', async () => {
    initialTree.overwrite(
      'package.json',
      serializeJson({
        dependencies: {},
      }),
    );
    const result = await schematicRunner
      .runSchematicAsync('update-7-0-0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies).toEqual({
      '@dynatrace/barista-components': '^7.0.0',
      '@dynatrace/barista-icons': '^5.0.0',
      'lodash-es': '^4.17.15',
    });
  });

  it('should update the dependencies with highcharts and remove the highcharts types', async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-7-0-0', {}, initialTree)
      .toPromise();

    const { dependencies, devDependencies } = readJsonInTree(
      result,
      '/package.json',
    );
    expect(dependencies).toEqual({
      '@dynatrace/barista-components': '^7.0.0',
      '@dynatrace/barista-icons': '^5.0.0',
      '@dynatrace/barista-fonts': '1.0.1',
      highcharts: '^7.2.1',
      'lodash-es': '^4.17.15',
    });
    expect(devDependencies).toEqual({});
  });

  const templateReplacements = [
    {
      description: 'should run the migration for the aria-label-close',
      fileName: '/libs/feature-a/src/lib/component-a/component-a.html',
    },
    {
      description:
        'should replace the aria-label-close-button on the context dialog',
      fileName: '/libs/feature-a/src/lib/context-dialog.html',
    },
    {
      description:
        'should replace the aria-label to the native one on the breadcrumbs',
      fileName: 'libs/feature-a/src/lib/aria-label.html',
    },
    {
      description:
        'should migrate the breadcrumbs-item selector to a plain anchor',
      fileName: 'libs/feature-a/src/lib/breadcrumbs-item.html',
    },
    {
      description:
        'should migrate the table empty state to the empty state component',
      fileName: 'libs/feature-a/src/lib/table-empty-state-simple.html',
    },
    {
      description:
        'should migrate the table empty state to the empty state component with directive on the message',
      fileName: 'libs/feature-a/src/lib/table-empty-state.html',
    },
    {
      description: 'should not migrate i18n aria label attributes',
      fileName: 'libs/feature-a/src/lib/secondary-nav.html',
    },
    {
      description: 'should not migrate normal aria label attributes',
      fileName: 'libs/feature-a/src/lib/secondary-nav-aria-label.html',
    },
    {
      description: 'should migrate aria label bindings',
      fileName: 'libs/feature-a/src/lib/aria-label-binding.html',
    },
  ];

  describe('Template replacements', () => {
    templateReplacements.forEach(({ description, fileName }) => {
      it(description, async () => {
        initialTree = Tree.merge(initialTree, addHTMLFiles());
        const result = await schematicRunner
          .runSchematicAsync('update-7-0-0', {}, initialTree)
          .toPromise();
        const file = readFileFromTree(result, fileName);

        expect(file).toMatchSnapshot();
      });
    });
  });
});

function addHTMLFiles(): Tree {
  const tree = Tree.empty();
  tree.create(
    'libs/feature-a/src/lib/component-a/component-a.html',
    `
  <dt-chart [options]="options" [series]="series$ | async">
    <dt-chart-timestamp
      aria-label-close="Close the selection"
      (closed)="closed()"
      (valueChanges)="valueChanges($event)"
    ></dt-chart-timestamp>
  </dt-chart>

  `,
  );

  tree.create(
    'libs/feature-a/src/lib/context-dialog.html',
    `<dt-context-dialog #contextDialog
    aria-label="Show dashboard modification options"
    aria-label-close-button="Hide dashboard modification options"
    i18n-aria-label
>`,
  );

  tree.create(
    'libs/feature-a/src/lib/aria-label.html',
    `<div *pageHeader  dtTheme='blue'>
    <dt-breadcrumbs aria-label="Breadcrumbs navigation" i18n-aria-label>
      <a dtBreadcrumbsItem [navLink]="cmcDsService.getHome()" i18n>Home</a>
      <a dtBreadcrumbsItem [navLink]="cmcDsService.getDeploymentStatusMainPage()" i18n>Deployment status</a>
      <a dtBreadcrumbsItem [navLink]="cmcDsService.getActiveGateOverview()" i18n>ActiveGates</a>
    </dt-breadcrumbs>
  </div>`,
  );

  tree.create(
    'libs/feature-a/src/lib/breadcrumbs-item.html',
    `<dt-breadcrumbs aria-label="Breadcrumbs navigation" i18n-aria-label>
  <dt-breadcrumbs-item i18n>Security</dt-breadcrumbs-item>
  <dt-breadcrumbs-item href="/home" i18n>Security 2</dt-breadcrumbs-item>
  <dt-breadcrumbs-item [href]="'/home'" i18n>Security 3</dt-breadcrumbs-item>
</dt-breadcrumbs>`,
  );

  tree.create(
    'libs/feature-a/src/lib/table-empty-state-simple.html',
    `<dt-table-empty-state>
  <dt-table-empty-state-message>Amend the timeframe you're querying within or review your query to make your statement less restrictive</dt-table-empty-state-message>
</dt-table-empty-state>`,
  );

  tree.create(
    'libs/feature-a/src/lib/table-empty-state.html',
    `<div class="empty-state-container" *ngIf="queryRows?.length === 0">
    <dt-table-empty-state dtTableEmptyState uitestid="dtaqlTableNoData">
      <dt-table-empty-state-image class="no-data-image"></dt-table-empty-state-image>
      <dt-table-empty-state-title i18n>No data that matches your query</dt-table-empty-state-title>
      <dt-table-empty-state-message i18n *ngIf="(filtersApplied$ | async)">Amend the timeframe you're querying within or review your query to make your statement less restrictive</dt-table-empty-state-message>
    </dt-table-empty-state>
  </div>`,
  );

  tree.create(
    'libs/feature-a/src/lib/secondary-nav.html',
    `<dt-secondary-nav i18n-aria-label aria-label="Deployment status"></dt-secondary-nav>`,
  );

  tree.create(
    'libs/feature-a/src/lib/secondary-nav-aria-label.html',
    `<dt-secondary-nav aria-label="Deployment status"></dt-secondary-nav>`,
  );

  tree.create(
    'libs/feature-a/src/lib/aria-label-binding.html',
    `<dt-secondary-nav [attr.aria-label]="'Deployment status'"></dt-secondary-nav>
     <dt-secondary-nav [attr.aria-label]="somevar"></dt-secondary-nav>`,
  );

  return tree;
}
