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
import { RouterModule, Routes } from '@angular/router';

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
import { ComboboxDemo } from './combobox/combobox-demo.component';
import { QuickFilterDemoComponent } from './quick-filter/quick-filter-demo.component';

const routes: Routes = [
  { path: 'alert', component: AlertDemo },
  { path: 'autocomplete', component: AutocompleteDemo },
  { path: 'bar-indicator', component: BarIndicatorDemo },
  { path: 'breadcrumbs', component: BreadcrumbsDemo },
  { path: 'button', component: ButtonDemo },
  { path: 'button-group', component: ButtonGroupDemo },
  { path: 'card', component: CardDemo },
  { path: 'chart', component: ChartDemo },
  { path: 'checkbox', component: CheckboxDemo },
  { path: 'combobox', component: ComboboxDemo },
  { path: 'consumption', component: ConsumptionDemo },
  { path: 'context-dialog', component: ContextDialogDemo },
  { path: 'confirmation-dialog', component: ConfirmationDialogDemo },
  { path: 'copy-to-clipboard', component: CopyToClipboardDemo },
  { path: 'datepicker', component: DatepickerDemo },
  { path: 'drawer', component: DrawerDemo },
  { path: 'drawer-table', component: DrawerTableDemo },
  { path: 'empty-state', component: EmptyStateDemo },
  { path: 'expandable-panel', component: ExpandablePanelDemo },
  { path: 'expandable-section', component: ExpandableSectionDemo },
  { path: 'expandable-text', component: ExpandableTextDemo },
  { path: 'event-chart', component: EventChartDemo },
  { path: 'filter-field', component: FilterFieldDemo },
  { path: 'form-field', component: FormFieldDemo },
  { path: 'formatters', component: FormattersDemo },
  { path: 'highlight', component: HighlightDemo },
  { path: 'icon', component: IconDemo },
  { path: 'indicator', component: IndicatorDemo },
  { path: 'info-group', component: InfoGroupDemo },
  { path: 'inline-editor', component: InlineEditorDemo },
  { path: 'input', component: InputDemo },
  { path: 'key-value-list', component: KeyValueListDemo },
  { path: 'legend', component: LegendDemo },
  { path: 'link', component: LinkDemo },
  { path: 'loading-distractor', component: LoadingDistractorDemo },
  { path: 'menu', component: MenuDemo },
  { path: 'micro-chart', component: MicroChartDemo },
  { path: 'overlay', component: OverlayDemo },
  { path: 'pagination', component: PaginationDemo },
  { path: 'progress-bar', component: ProgressBarDemo },
  { path: 'progress-circle', component: ProgressCircleDemo },
  { path: 'radial-chart', component: RadialChartDemo },
  { path: 'radio', component: RadioDemo },
  { path: 'secondary-nav', component: SecondaryNavDemo },
  { path: 'select', component: SelectDemo },
  { path: 'show-more', component: ShowMoreDemo },
  { path: 'stacked-series-chart', component: StackedSeriesChartDemo },
  { path: 'stepper', component: StepperDemo },
  { path: 'sunburst-chart', component: SunburstChartDemo },
  { path: 'switch', component: SwitchDemo },
  { path: 'table', component: TableDemo },
  { path: 'table-order', component: TableOrderDemo },
  { path: 'tabs', component: TabsDemo },
  { path: 'tag', component: TagDemo },
  { path: 'tile', component: TileDemo },
  { path: 'timeline-chart', component: TimelineChartDemo },
  { path: 'legend', component: LegendDemo },
  { path: 'expandable-text', component: ExpandableTextDemo },
  { path: 'event-chart', component: EventChartDemo },
  { path: 'top-bar-navigation', component: TopBarNavigationDemo },
  { path: 'stepper', component: StepperDemo },
  { path: 'slider', component: SliderDemo },
  { path: 'toast', component: ToastDemo },
  {
    path: 'container-breakpoint-observer',
    component: ContainerBreakpointObserverDemo,
  },
  { path: 'toggle-button-group', component: ToggleButtonGroupDemo },
  { path: 'sidenav', component: SidenavDemo },
  { path: 'tree-table', component: TreeTableDemo },
  { path: 'quick-filter', component: QuickFilterDemoComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
})
export class DevAppRoutingModule {}
