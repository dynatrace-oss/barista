import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevApp } from './devapp.component';
import { AlertDemo } from './alert/alert-demo.component';
import { AutocompleteDemo } from './autocomplete/autocomplete-demo.component';
import { BarIndicatorDemo } from './bar-indicator/bar-indicator-demo.component';
import { BreadcrumbsDemo } from './breadcrumbs/breadcrumbs-demo.component';
import { ButtonDemo } from './button/button-demo.component';
import { ButtonGroupDemo } from './button-group/button-group-demo.component';
import { CardDemo } from './card/card-demo.component';
import { CheckboxDemo } from './checkbox/checkbox-demo.component';
import { ContextDialogDemo } from './context-dialog/context-dialog-demo.component';
import { CopyToClipboardDemo } from './copy-to-clipboard/copy-to-clipboard-demo.component';
import { CtaCardDemo } from './cta-card/cta-card-demo.component';
import { ExpandablePanelDemo } from './expandable-panel/expandable-panel-demo.component';
import { ExpandableSectionDemo } from './expandable-section/expandable-section-demo.component';
import { FilterFieldDemo } from './filter-field/filter-field-demo.component';
import { FormFieldDemo } from './form-field/form-field-demo.component';
import { FormattersDemo } from './formatters/formatters-demo.component';
import { IconDemo } from './icon/icon-demo.component';
import { InfoGroupDemo } from './info-group/info-group-demo.component';
import { InlineEditorDemo } from './inline-editor/inline-editor-demo.component';
import { InputDemo } from './input/input-demo.component';
import { KeyValueListDemo } from './key-value-list/key-value-list-demo.component';
import { LinkDemo } from './link/link-demo.component';
import { LoadingDistractorDemo } from './loading-distractor/loading-distractor-demo.component';
import { MicroChartDemo } from './micro-chart/micro-chart-demo.component';
import { OverlayDemo } from './overlay/overlay-demo.component';
import { PaginationDemo } from './pagination/pagination-demo.component';
import { ProgressBarDemo } from './progress-bar/progress-bar-demo.component';
import { ProgressCircleDemo } from './progress-circle/progress-circle-demo.component';
import { RadioDemo } from './radio/radio-demo.component';
import { SelectDemo } from './select/select-demo.component';
import { SelectionAreaDemo } from './selection-area/selection-area-demo.component';
import { ShowMoreDemo } from './show-more/show-more-demo.component';
import { SwitchDemo } from './switch/switch-demo.component';
import { TableDemo } from './table/table-demo.component';
import { TreeTableDemo } from './tree-table/tree-table-demo.component';
import { TabsDemo } from './tabs/tabs-demo.component';
import { TagDemo } from './tag/tag-demo.component';
import { TileDemo } from './tile/tile-demo.component';
import { ToastDemo } from './toast/toast-demo.component';
import { DrawerDemo } from './drawer/drawer-demo.component';
import { ToggleButtonGroupDemo } from './toggle-button-group/toggle-button-group-demo.component';
import { ChartDemo } from './chart/chart-demo.component';

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
  { path: 'context-dialog', component: ContextDialogDemo },
  { path: 'copy-to-clipboard', component: CopyToClipboardDemo },
  { path: 'cta-card', component: CtaCardDemo },
  { path: 'drawer', component: DrawerDemo },
  { path: 'expandable-panel', component: ExpandablePanelDemo },
  { path: 'expandable-section', component: ExpandableSectionDemo },
  { path: 'filter-field', component: FilterFieldDemo },
  { path: 'form-field', component: FormFieldDemo },
  { path: 'formatters', component: FormattersDemo },
  { path: 'icon', component: IconDemo },
  { path: 'info-group', component: InfoGroupDemo },
  { path: 'inline-editor', component: InlineEditorDemo },
  { path: 'input', component: InputDemo },
  { path: 'key-value-list', component: KeyValueListDemo },
  { path: 'link', component: LinkDemo },
  { path: 'loading-distractor', component: LoadingDistractorDemo },
  { path: 'micro-chart', component: MicroChartDemo },
  { path: 'overlay', component: OverlayDemo },
  { path: 'pagination', component: PaginationDemo },
  { path: 'progress-bar', component: ProgressBarDemo },
  { path: 'progress-circle', component: ProgressCircleDemo },
  { path: 'radio', component: RadioDemo },
  { path: 'select', component: SelectDemo },
  { path: 'selection-area', component: SelectionAreaDemo },
  { path: 'show-more', component: ShowMoreDemo },
  { path: 'switch', component: SwitchDemo },
  { path: 'table', component: TableDemo },
  { path: 'tabs', component: TabsDemo },
  { path: 'tag', component: TagDemo },
  { path: 'tile', component: TileDemo },
  { path: 'toast', component: ToastDemo },
  { path: 'tree-table', component: TreeTableDemo },
  { path: 'toggle-button-group', component: ToggleButtonGroupDemo },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DevAppRoutingModule { }
