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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'button',
    loadChildren: () =>
      import('../components/button/button.module').then(
        module => module.DtE2EButtonModule,
      ),
  },
  {
    path: 'button-group',
    loadChildren: () =>
      import('../components/button-group/button-group.module').then(
        module => module.DtE2EButtonGroupModule,
      ),
  },
  {
    path: 'chart',
    loadChildren: () =>
      import('../components/chart/chart.module').then(
        module => module.DtE2EChartModule,
      ),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('../components/checkbox/checkbox.module').then(
        module => module.DtE2ECheckboxModule,
      ),
  },
  {
    path: 'consumption',
    loadChildren: () =>
      import('../components/consumption/consumption.module').then(
        module => module.DtE2EConsumptionModule,
      ),
  },
  {
    path: 'context-dialog',
    loadChildren: () =>
      import('../components/context-dialog/context-dialog.module').then(
        module => module.DtE2eContextDialogModule,
      ),
  },
  {
    path: 'drawer',
    loadChildren: () =>
      import('../components/drawer/drawer.module').then(
        module => module.DtE2EDrawerModule,
      ),
  },
  {
    path: 'event-chart',
    loadChildren: () =>
      import('../components/event-chart/event-chart.module').then(
        module => module.DtE2EEventChartModule,
      ),
  },
  {
    path: 'expandable-panel',
    loadChildren: () =>
      import('../components/expandable-panel/expandable-panel.module').then(
        module => module.DtE2EExpandablePanelModule,
      ),
  },
  {
    path: 'expandable-section',
    loadChildren: () =>
      import('../components/expandable-section/expandable-section.module').then(
        module => module.DtE2EExpandableSectionModule,
      ),
  },
  {
    path: 'filter-field',
    loadChildren: () =>
      import('../components/filter-field/filter-field.module').then(
        module => module.DtE2EFilterFieldModule,
      ),
  },
  {
    path: 'key-value-list',
    loadChildren: () =>
      import('../components/key-value-list/key-value-list.module').then(
        module => module.DtE2EKeyValueListModule,
      ),
  },
  {
    path: 'overlay',
    loadChildren: () =>
      import('../components/overlay/overlay.module').then(
        module => module.DtE2EOverlayModule,
      ),
  },
  {
    path: 'pagination',
    loadChildren: () =>
      import('../components/pagination/pagination.module').then(
        module => module.DtE2EPaginationModule,
      ),
  },
  {
    path: 'progress-bar',
    loadChildren: () =>
      import('../components/progress-bar/progress-bar.module').then(
        module => module.DtE2EProgressBarModule,
      ),
  },
  {
    path: 'radio',
    loadChildren: () =>
      import('../components/radio/radio.module').then(
        module => module.DtE2ERadioModule,
      ),
  },
  {
    path: 'show-more',
    loadChildren: () =>
      import('../components/show-more/show-more.module').then(
        module => module.DtE2EShowMoreModule,
      ),
  },
  {
    path: 'switch',
    loadChildren: () =>
      import('../components/switch/switch.module').then(
        module => module.DtE2ESwitchModule,
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('../components/tabs/tabs.module').then(
        module => module.DtE2ETabsModule,
      ),
  },
  {
    path: 'tile',
    loadChildren: () =>
      import('../components/tile/tile.module').then(
        module => module.DtE2ETileModule,
      ),
  },
  {
    path: 'confirmation-dialog',
    loadChildren: () =>
      import(
        '../components/confirmation-dialog/confirmation-dialog.module'
      ).then(module => module.DtE2EConfirmationDialogModule),
  },
  {
    path: 'highlight',
    loadChildren: () =>
      import('../components/highlight/highlight.module').then(
        module => module.DtE2EHighlightModule,
      ),
  },
  {
    path: 'tree-table',
    loadChildren: () =>
      import('../components/tree-table/tree-table.module').then(
        module => module.DtE2ETreeTableModule,
      ),
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      paramsInheritanceStrategy: 'always',
      enableTracing: false, // Can be set for debugging the router
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
