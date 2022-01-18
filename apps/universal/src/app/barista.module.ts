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

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DtAlertModule } from '@dynatrace/barista-components/alert';
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';
import { DtCardModule } from '@dynatrace/barista-components/card';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtConsumptionModule } from '@dynatrace/barista-components/consumption';
import { DtContainerBreakpointObserverModule } from '@dynatrace/barista-components/container-breakpoint-observer';
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';
import { DtCopyToClipboardModule } from '@dynatrace/barista-components/copy-to-clipboard';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtEmptyStateModule } from '@dynatrace/barista-components/empty-state';
import { DtEventChartModule } from '@dynatrace/barista-components/event-chart';
import { DtExpandableTextModule } from '@dynatrace/barista-components/expandable-text';
import { DtQuickFilterModule } from '@dynatrace/barista-components/quick-filter';
import { DtFilterFieldModule } from '@dynatrace/barista-components/filter-field';
import { DtHighlightModule } from '@dynatrace/barista-components/highlight';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtInfoGroupModule } from '@dynatrace/barista-components/info-group';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtMenuModule } from '@dynatrace/barista-components/menu';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtPaginationModule } from '@dynatrace/barista-components/pagination';
import { DtProgressBarModule } from '@dynatrace/barista-components/progress-bar';
import { DtProgressCircleModule } from '@dynatrace/barista-components/progress-circle';
import { DtRadialChartModule } from '@dynatrace/barista-components/radial-chart';
import { DtRadioModule } from '@dynatrace/barista-components/radio';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtShowMoreModule } from '@dynatrace/barista-components/show-more';
import { DtStackedSeriesChartModule } from '@dynatrace/barista-components/stacked-series-chart';
import { DtStepperModule } from '@dynatrace/barista-components/stepper';
import { DtSliderModule } from '@dynatrace/barista-components/slider';
import { DtSunburstChartModule } from '@dynatrace/barista-components/sunburst-chart';
import { DtSwitchModule } from '@dynatrace/barista-components/switch';
import { DtTableModule } from '@dynatrace/barista-components/table';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtTileModule } from '@dynatrace/barista-components/tile';
import { DtTimelineChartModule } from '@dynatrace/barista-components/timeline-chart';
import { DtToggleButtonGroupModule } from '@dynatrace/barista-components/toggle-button-group';
import { DtTopBarNavigationModule } from '@dynatrace/barista-components/top-bar-navigation';
import { DtTreeTableModule } from '@dynatrace/barista-components/tree-table';
import { DtComboboxModule } from '@dynatrace/barista-components/experimental/combobox';

@NgModule({
  imports: [
    HttpClientModule,
    DtIconModule.forRoot({ svgIconLocation: '/assets/icons/{{name}}.svg' }),
  ],
  exports: [
    DtAlertModule,
    DtAutocompleteModule,
    DtButtonGroupModule,
    DtButtonModule,
    DtCardModule,
    DtCheckboxModule,
    DtComboboxModule,
    DtConsumptionModule,
    DtContainerBreakpointObserverModule,
    DtContainerBreakpointObserverModule,
    DtContextDialogModule,
    DtCopyToClipboardModule,
    DtDrawerModule,
    DtEmptyStateModule,
    DtEventChartModule,
    DtExpandableTextModule,
    DtFilterFieldModule,
    DtHighlightModule,
    DtIndicatorModule,
    DtInfoGroupModule,
    DtInputModule,
    DtLoadingDistractorModule,
    DtMenuModule,
    DtOverlayModule,
    DtPaginationModule,
    DtProgressBarModule,
    DtProgressCircleModule,
    DtQuickFilterModule,
    DtRadialChartModule,
    DtRadioModule,
    DtSelectModule,
    DtShowMoreModule,
    DtSliderModule,
    DtStackedSeriesChartModule,
    DtStepperModule,
    DtSunburstChartModule,
    DtSwitchModule,
    DtTableModule,
    DtTagModule,
    DtTileModule,
    DtTimelineChartModule,
    DtToggleButtonGroupModule,
    DtTopBarNavigationModule,
    DtTreeTableModule,
  ],
})
export class BaristaModule {}
