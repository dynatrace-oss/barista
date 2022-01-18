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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'autocomplete',
    loadChildren: () =>
      import('../components/autocomplete/autocomplete.module').then(
        (module) => module.DtE2EAutocompleteModule,
      ),
  },
  {
    path: 'button',
    loadChildren: () =>
      import('../components/button/button.module').then(
        (module) => module.DtE2EButtonModule,
      ),
  },
  {
    path: 'button-group',
    loadChildren: () =>
      import('../components/button-group/button-group.module').then(
        (module) => module.DtE2EButtonGroupModule,
      ),
  },
  {
    path: 'breadcrumbs',
    loadChildren: () =>
      import('../components/breadcrumbs/breadcrumbs.module').then(
        (module) => module.DtE2EBreadcrumbsModule,
      ),
  },
  {
    path: 'chart',
    loadChildren: () =>
      import('../components/chart/chart.module').then(
        (module) => module.DtE2EChartModule,
      ),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('../components/checkbox/checkbox.module').then(
        (module) => module.DtE2ECheckboxModule,
      ),
  },
  {
    path: 'combobox',
    loadChildren: () =>
      import('../components/combobox/combobox.module').then(
        (module) => module.DtE2EComboboxModule,
      ),
  },
  {
    path: 'consumption',
    loadChildren: () =>
      import('../components/consumption/consumption.module').then(
        (module) => module.DtE2EConsumptionModule,
      ),
  },
  {
    path: 'context-dialog',
    loadChildren: () =>
      import('../components/context-dialog/context-dialog.module').then(
        (module) => module.DtE2eContextDialogModule,
      ),
  },
  {
    path: 'drawer',
    loadChildren: () =>
      import('../components/drawer/drawer.module').then(
        (module) => module.DtE2EDrawerModule,
      ),
  },
  {
    path: 'empty-state',
    loadChildren: () =>
      import('../components/empty-state/empty-state.module').then(
        (module) => module.DtE2EEmptyStateModule,
      ),
  },
  {
    path: 'event-chart',
    loadChildren: () =>
      import('../components/event-chart/event-chart.module').then(
        (module) => module.DtE2EEventChartModule,
      ),
  },
  {
    path: 'expandable-panel',
    loadChildren: () =>
      import('../components/expandable-panel/expandable-panel.module').then(
        (module) => module.DtE2EExpandablePanelModule,
      ),
  },
  {
    path: 'expandable-section',
    loadChildren: () =>
      import('../components/expandable-section/expandable-section.module').then(
        (module) => module.DtE2EExpandableSectionModule,
      ),
  },
  {
    path: 'filter-field',
    loadChildren: () =>
      import('../components/filter-field/filter-field.module').then(
        (module) => module.DtE2EFilterFieldModule,
      ),
  },
  {
    path: 'key-value-list',
    loadChildren: () =>
      import('../components/key-value-list/key-value-list.module').then(
        (module) => module.DtE2EKeyValueListModule,
      ),
  },
  {
    path: 'overlay',
    loadChildren: () =>
      import('../components/overlay/overlay.module').then(
        (module) => module.DtE2EOverlayModule,
      ),
  },
  {
    path: 'pagination',
    loadChildren: () =>
      import('../components/pagination/pagination.module').then(
        (module) => module.DtE2EPaginationModule,
      ),
  },
  {
    path: 'progress-bar',
    loadChildren: () =>
      import('../components/progress-bar/progress-bar.module').then(
        (module) => module.DtE2EProgressBarModule,
      ),
  },
  {
    path: 'quick-filter',
    loadChildren: () =>
      import('../components/quick-filter/quick-filter.module').then(
        (module) => module.DtE2EQuickFilterModule,
      ),
  },
  {
    path: 'radial-chart',
    loadChildren: () =>
      import('../components/radial-chart/radial-chart.module').then(
        (module) => module.DtE2ERadialChartModule,
      ),
  },
  {
    path: 'radio',
    loadChildren: () =>
      import('../components/radio/radio.module').then(
        (module) => module.DtE2ERadioModule,
      ),
  },
  {
    path: 'select',
    loadChildren: () =>
      import('../components/select/select.module').then(
        (module) => module.DtE2ESelectModule,
      ),
  },
  {
    path: 'show-more',
    loadChildren: () =>
      import('../components/show-more/show-more.module').then(
        (module) => module.DtE2EShowMoreModule,
      ),
  },
  {
    path: 'stacked-series-chart',
    loadChildren: () =>
      import(
        '../components/stacked-series-chart/stacked-series-chart.module'
      ).then((module) => module.DtE2EStackedSeriesChartModule),
  },
  {
    path: 'sunburst-chart',
    loadChildren: () =>
      import('../components/sunburst-chart/sunburst-chart.module').then(
        (module) => module.DtE2ESunburstChartModule,
      ),
  },
  {
    path: 'switch',
    loadChildren: () =>
      import('../components/switch/switch.module').then(
        (module) => module.DtE2ESwitchModule,
      ),
  },
  {
    path: 'slider',
    loadChildren: () =>
      import('../components/slider/slider.module').then(
        (module) => module.DtE2ESliderModule,
      ),
  },
  {
    path: 'table',
    loadChildren: () =>
      import('../components/table/table.module').then(
        (module) => module.DtE2ETableModule,
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('../components/tabs/tabs.module').then(
        (module) => module.DtE2ETabsModule,
      ),
  },
  {
    path: 'tag',
    loadChildren: () =>
      import('../components/tag/tag.module').then(
        (module) => module.DtE2ETagModule,
      ),
  },
  {
    path: 'tile',
    loadChildren: () =>
      import('../components/tile/tile.module').then(
        (module) => module.DtE2ETileModule,
      ),
  },
  {
    path: 'confirmation-dialog',
    loadChildren: () =>
      import(
        '../components/confirmation-dialog/confirmation-dialog.module'
      ).then((module) => module.DtE2EConfirmationDialogModule),
  },
  {
    path: 'highlight',
    loadChildren: () =>
      import('../components/highlight/highlight.module').then(
        (module) => module.DtE2EHighlightModule,
      ),
  },
  {
    path: 'tree-table',
    loadChildren: () =>
      import('../components/tree-table/tree-table.module').then(
        (module) => module.DtE2ETreeTableModule,
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
      enableTracing: false,
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
