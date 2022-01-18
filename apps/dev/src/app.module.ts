/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { Component, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevAppRoutingModule } from './devapp-routing.module';
import { DevApp } from './devapp.component';
import { DevAppDynatraceModule } from './dt-components.module';
import { AlertDemo } from './alert/alert-demo.component';
import { AutocompleteDemo } from './autocomplete/autocomplete-demo.component';
import { BarIndicatorDemo } from './bar-indicator/bar-indicator-demo.component';
import { BreadcrumbsDemo } from './breadcrumbs/breadcrumbs-demo.component';
import { ButtonGroupDemo } from './button-group/button-group-demo.component';
import { ButtonDemo } from './button/button-demo.component';
import { CardDemo } from './card/card-demo.component';
import { ChartDemo } from './chart/chart-demo.component';
import { CheckboxDemo } from './checkbox/checkbox-demo.component';
import { ConfirmationDialogDemo } from './confirmation-dialog/confirmation-dialog-demo.component';
import { ConsumptionDemo } from './consumption/consumption-demo.component';
import { ContainerBreakpointObserverDemo } from './container-breakpoint-observer/container-breakpoint-observer-demo.component';
import { ContextDialogDemo } from './context-dialog/context-dialog-demo.component';
import { CopyToClipboardDemo } from './copy-to-clipboard/copy-to-clipboard-demo.component';
import { DatepickerDemo } from './datepicker/datepicker-demo.component';
import { DrawerDemo } from './drawer/drawer-demo.component';
import { DrawerTableDemo } from './drawer-table/drawer-table-demo.component';
import { EmptyStateDemo } from './empty-state/empty-state-demo';
import { EventChartDemo } from './event-chart/event-chart-demo.component';
import { ExpandablePanelDemo } from './expandable-panel/expandable-panel-demo.component';
import { ExpandableSectionDemo } from './expandable-section/expandable-section-demo.component';
import { ExpandableTextDemo } from './expandable-text/expandable-text-demo.component';
import { FilterFieldDemo } from './filter-field/filter-field-demo.component';
import { FormFieldDemo } from './form-field/form-field-demo.component';
import { FormattersDemo } from './formatters/formatters-demo.component';
import { HighlightDemo } from './highlight/highlight-demo.component';
import { IconDemo } from './icon/icon-demo.component';
import { IndicatorDemo } from './indicator/indicator-demo.component';
import { InfoGroupDemo } from './info-group/info-group-demo.component';
import { InlineEditorDemo } from './inline-editor/inline-editor-demo.component';
import { InputDemo } from './input/input-demo.component';
import { KeyValueListDemo } from './key-value-list/key-value-list-demo.component';
import { LegendDemo } from './legend/legend-demo.component';
import { LinkDemo } from './link/link-demo.component';
import { LoadingDistractorDemo } from './loading-distractor/loading-distractor-demo.component';
import { MenuDemo } from './menu/menu-demo';
import { MicroChartDemo } from './micro-chart/micro-chart-demo.component';
import { OverlayDemo } from './overlay/overlay-demo.component';
import { PaginationDemo } from './pagination/pagination-demo.component';
import { ProgressBarDemo } from './progress-bar/progress-bar-demo.component';
import { ProgressCircleDemo } from './progress-circle/progress-circle-demo.component';
import { RadialChartDemo } from './radial-chart/radial-chart-demo.component';
import { RadioDemo } from './radio/radio-demo.component';
import { SecondaryNavDemo } from './secondary-nav/secondary-nav-demo.component';
import { SelectDemo } from './select/select-demo.component';
import { ShowMoreDemo } from './show-more/show-more-demo.component';
import { StackedSeriesChartDemo } from './stacked-series-chart/stacked-series-chart-demo.component';
import { SidenavDemo } from './sidenav/sidenav-demo.component';
import { StepperDemo } from './stepper/stepper-demo.component';
import { SliderDemo } from './slider/slider-demo.component';
import { SunburstChartDemo } from './sunburst-chart/sunburst-chart-demo.component';
import { SwitchDemo } from './switch/switch-demo.component';
import { TableDemo } from './table/table-demo.component';
import { TableOrderDemo } from './table-order/table-order-demo.component';
import { TabsDemo } from './tabs/tabs-demo.component';
import { TagDemo } from './tag/tag-demo.component';
import { TileDemo } from './tile/tile-demo.component';
import { TimelineChartDemo } from './timeline-chart/timeline-chart-demo.component';
import { ToastDemo } from './toast/toast-demo.component';
import { ToggleButtonGroupDemo } from './toggle-button-group/toggle-button-group-demo.component';
import { TopBarNavigationDemo } from './top-bar-navigation/top-bar-navigation-demo.component';
import { TreeTableDemo } from './tree-table/tree-table-demo.component';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  DT_DEFAULT_UI_TEST_CONFIG,
  DT_UI_TEST_CONFIG,
  DT_OVERLAY_THEMING_CONFIG,
  DT_DEFAULT_DARK_THEMING_CONFIG,
} from '@dynatrace/barista-components/core';
import { ComboboxDemo } from './combobox/combobox-demo.component';
import { QuickFilterDemoComponent } from './quick-filter/quick-filter-demo.component';

// eslint-disable-next-line @angular-eslint/use-component-selector
@Component({ template: '' })
export class NoopRouteComponent {}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DevAppRoutingModule,
    DtIconModule.forRoot({ svgIconLocation: '/assets/icons/{{name}}.svg' }),
    DevAppDynatraceModule,
    DragDropModule,
  ],
  declarations: [
    DevApp,
    NoopRouteComponent,
    AlertDemo,
    AutocompleteDemo,
    BreadcrumbsDemo,
    ButtonDemo,
    ButtonGroupDemo,
    CardDemo,
    ChartDemo,
    CheckboxDemo,
    ComboboxDemo,
    ConfirmationDialogDemo,
    ContextDialogDemo,
    CopyToClipboardDemo,
    DatepickerDemo,
    DrawerDemo,
    DrawerTableDemo,
    ExpandablePanelDemo,
    ExpandableSectionDemo,
    FilterFieldDemo,
    FormFieldDemo,
    FormattersDemo,
    IconDemo,
    InlineEditorDemo,
    InputDemo,
    KeyValueListDemo,
    LinkDemo,
    LoadingDistractorDemo,
    MicroChartDemo,
    OverlayDemo,
    PaginationDemo,
    ProgressBarDemo,
    ProgressCircleDemo,
    RadialChartDemo,
    RadioDemo,
    SecondaryNavDemo,
    SelectDemo,
    ShowMoreDemo,
    StackedSeriesChartDemo,
    SunburstChartDemo,
    SwitchDemo,
    TableDemo,
    TableOrderDemo,
    TabsDemo,
    TagDemo,
    TileDemo,
    ToastDemo,
    BarIndicatorDemo,
    TreeTableDemo,
    ToggleButtonGroupDemo,
    IndicatorDemo,
    InfoGroupDemo,
    HighlightDemo,
    ConsumptionDemo,
    MenuDemo,
    TimelineChartDemo,
    LegendDemo,
    EmptyStateDemo,
    ExpandableTextDemo,
    EventChartDemo,
    TopBarNavigationDemo,
    StepperDemo,
    SliderDemo,
    SidenavDemo,
    ContainerBreakpointObserverDemo,
    QuickFilterDemoComponent,
  ],
  bootstrap: [DevApp],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
    {
      provide: DT_OVERLAY_THEMING_CONFIG,
      useValue: DT_DEFAULT_DARK_THEMING_CONFIG,
    },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
