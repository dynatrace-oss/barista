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

import { NgModule } from '@angular/core';

import { DtAlertModule } from '@dynatrace/barista-components/alert';
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtBarIndicatorModule } from '@dynatrace/barista-components/bar-indicator';
import { DtBreadcrumbsModule } from '@dynatrace/barista-components/breadcrumbs';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';
import { DtCardModule } from '@dynatrace/barista-components/card';
import { DtChartModule } from '@dynatrace/barista-components/chart';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtConfirmationDialogModule } from '@dynatrace/barista-components/confirmation-dialog';
import { DtConsumptionModule } from '@dynatrace/barista-components/consumption';
import { DtContainerBreakpointObserverModule } from '@dynatrace/barista-components/container-breakpoint-observer';
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';
import { DtCopyToClipboardModule } from '@dynatrace/barista-components/copy-to-clipboard';
import { DtDatepickerModule } from '@dynatrace/barista-components/experimental/datepicker';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtDrawerTableModule } from '@dynatrace/barista-components/experimental/drawer-table';
import { DtEmptyStateModule } from '@dynatrace/barista-components/empty-state';
import { DtEventChartModule } from '@dynatrace/barista-components/event-chart';
import { DtExpandablePanelModule } from '@dynatrace/barista-components/expandable-panel';
import { DtExpandableSectionModule } from '@dynatrace/barista-components/expandable-section';
import { DtExpandableTextModule } from '@dynatrace/barista-components/expandable-text';
import { DtFilterFieldModule } from '@dynatrace/barista-components/filter-field';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtHighlightModule } from '@dynatrace/barista-components/highlight';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtInfoGroupModule } from '@dynatrace/barista-components/info-group';
import { DtInlineEditorModule } from '@dynatrace/barista-components/inline-editor';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtKeyValueListModule } from '@dynatrace/barista-components/key-value-list';
import { DtLegendModule } from '@dynatrace/barista-components/legend';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtMenuModule } from '@dynatrace/barista-components/menu';
import { DtMicroChartModule } from '@dynatrace/barista-components/micro-chart';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtPaginationModule } from '@dynatrace/barista-components/pagination';
import { DtProgressBarModule } from '@dynatrace/barista-components/progress-bar';
import { DtProgressCircleModule } from '@dynatrace/barista-components/progress-circle';
import { DtRadialChartModule } from '@dynatrace/barista-components/radial-chart';
import { DtRadioModule } from '@dynatrace/barista-components/radio';
import { DtSecondaryNavModule } from '@dynatrace/barista-components/secondary-nav';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtShowMoreModule } from '@dynatrace/barista-components/show-more';
import { DtStackedSeriesChartModule } from '@dynatrace/barista-components/stacked-series-chart';
import { DtStepperModule } from '@dynatrace/barista-components/stepper';
import { DtSliderModule } from '@dynatrace/barista-components/slider';
import { DtSunburstChartModule } from '@dynatrace/barista-components/sunburst-chart';
import { DtSwitchModule } from '@dynatrace/barista-components/switch';
import { DtTableModule } from '@dynatrace/barista-components/table';
import { DtTabsModule } from '@dynatrace/barista-components/tabs';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtTileModule } from '@dynatrace/barista-components/tile';
import { DtTimelineChartModule } from '@dynatrace/barista-components/timeline-chart';
import { DtToastModule } from '@dynatrace/barista-components/toast';
import { DtToggleButtonGroupModule } from '@dynatrace/barista-components/toggle-button-group';
import { DtTopBarNavigationModule } from '@dynatrace/barista-components/top-bar-navigation';
import { DtTreeTableModule } from '@dynatrace/barista-components/tree-table';
import { DtComboboxModule } from '@dynatrace/barista-components/experimental/combobox';
import { DtQuickFilterModule } from '@dynatrace/barista-components/quick-filter';

/**
 * NgModule that includes all Dynatrace angular components modules that are required to serve the examples.
 */
@NgModule({
  exports: [
    DtAlertModule,
    DtAutocompleteModule,
    DtBarIndicatorModule,
    DtBreadcrumbsModule,
    DtButtonModule,
    DtButtonGroupModule,
    DtCardModule,
    DtChartModule,
    DtCheckboxModule,
    DtComboboxModule,
    DtConfirmationDialogModule,
    DtContextDialogModule,
    DtCopyToClipboardModule,
    DtDatepickerModule,
    DtDrawerModule,
    DtDrawerTableModule,
    DtExpandablePanelModule,
    DtExpandableSectionModule,
    DtFilterFieldModule,
    DtFormFieldModule,
    DtFormattersModule,
    DtHighlightModule,
    DtIconModule,
    DtIndicatorModule,
    DtInfoGroupModule,
    DtInlineEditorModule,
    DtInputModule,
    DtKeyValueListModule,
    DtLoadingDistractorModule,
    DtMicroChartModule,
    DtOverlayModule,
    DtPaginationModule,
    DtProgressBarModule,
    DtProgressCircleModule,
    DtRadialChartModule,
    DtRadioModule,
    DtSecondaryNavModule,
    DtSelectModule,
    DtShowMoreModule,
    DtStackedSeriesChartModule,
    DtSunburstChartModule,
    DtSwitchModule,
    DtTableModule,
    DtTabsModule,
    DtTagModule,
    DtThemingModule,
    DtTileModule,
    DtToastModule,
    DtTreeTableModule,
    DtToggleButtonGroupModule,
    DtConsumptionModule,
    DtMenuModule,
    DtTimelineChartModule,
    DtLegendModule,
    DtEmptyStateModule,
    DtExpandableTextModule,
    DtEventChartModule,
    DtTopBarNavigationModule,
    DtStepperModule,
    DtSliderModule,
    DtContainerBreakpointObserverModule,
    DtQuickFilterModule,
  ],
})
export class DevAppDynatraceModule {}
