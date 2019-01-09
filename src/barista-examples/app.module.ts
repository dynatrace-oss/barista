import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamplesAppDynatraceModule } from './dt.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { App, ROUTES } from './app.component';
import { RouterModule } from '@angular/router';
import { DtIconModule } from '@dynatrace/angular-components';
import { environment } from '@environments/environment';
import { DT_ICON_CONFIGURATION } from '@dynatrace/angular-components/icon';
import { DarkAlertExampleComponent } from './alert/dark-alert-example.component';
import { ErrorAlertExampleComponent } from './alert/error-alert-example.component';
import { InteractiveAlertExampleComponent } from './alert/interactive-alert-example.component';
import { WarningAlertExampleComponent } from './alert/warning-alert-example.component';
import { AttachDifferentElementAutocompleteExample } from './autocomplete/autocomplete-attach-different-element';
import { ControlValuesAutocompleteExample } from './autocomplete/autocomplete-control-values';
import { CustomFilterAutocompleteExample } from './autocomplete/autocomplete-custom-filter';
import { DefaultAutocompleteExample } from './autocomplete/autocomplete-default-example';
import { GroupsAutocompleteExample } from './autocomplete/autocomplete-groups';
import { HighlightFirstOptionAutocompleteExample } from './autocomplete/autocomplete-highlight-first-option';
import { DarkBreadcrumbsExampleComponent } from './breadcrumbs/dark-breadcrumbs-example.component';
import { DefaultBreadcrumbsExampleComponent } from './breadcrumbs/default-breadcrumbs-example.component';
import { ExternalBreadcrumbsExampleComponent } from './breadcrumbs/external-breadcrumbs-example.component';
import { ObservableBreadcrumbsExampleComponent } from './breadcrumbs/observable-breadcrumbs-example.component';
import { ButtonGroupDefaultExampleComponent } from './button-group/button-group-default-example.component';
import { ButtonGroupDisabledExampleComponent } from './button-group/button-group-disabled-example.component';
import { ButtonGroupErrorExampleComponent } from './button-group/button-group-error-example.component';
import { ButtonGroupInteractiveExampleComponent } from './button-group/button-group-interactive-example.component';
import { ButtonGroupItemDisabledExampleComponent } from './button-group/button-group-item-disabled-example.component';
import { ColorButtonExampleComponent } from './button/button-color-example.component';
import { DarkButtonExampleComponent } from './button/button-dark-example.component';
import { DefaultButtonExampleComponent } from './button/button-default-example.component';
import { DisabledButtonExampleComponent } from './button/button-disabled-example.component';
import { IconOnlyButtonExampleComponent } from './button/button-icon-only-example.component';
import { IconsButtonExampleComponent } from './button/button-icons-example.component';
import { InteractionButtonExampleComponent } from './button/button-interaction-example.component';
import { LoadingSpinnerButtonExampleComponent } from './button/button-loading-spinner-example.component';
import { VariantButtonExampleComponent } from './button/button-variant-example.component';
import { PureButtonExampleComponent } from './button/pure-button-example.component';
import { ActionButtonsCardExampleComponent } from './card/action-buttons-card-example.component';
import { DarkThemeCardExampleComponent } from './card/darktheme-card-example.component';
import { DefaultCardExampleComponent } from './card/default-card-example.component';
import { IconCardExampleComponent } from './card/icon-card-example.component';
import { SubtitleCardExampleComponent } from './card/subtitle-card-example.component';
import { TitleCardExampleComponent } from './card/title-card-example.component';
import { ChartAreaRangeExampleComponent } from './chart/chart-arearange-example.component';
import { ChartCategorizedExampleComponent } from './chart/chart-categorized-example.component';
import { ChartDefaultExampleComponent } from './chart/chart-default-example.component';
import { ChartHeatfieldExampleComponent } from './chart/chart-heatfield-example.component';
import { ChartHeatfieldMultipleExampleComponent } from './chart/chart-heatfield-multiple-example.component';
import { ChartLoadingExampleComponent } from './chart/chart-loading-example.component';
import { ChartOrderdColorsExampleComponent } from './chart/chart-ordered-colors-example.component';
import { ChartPieExampleComponent } from './chart/chart-pie-example.component';
import { ChartStreamExampleComponent } from './chart/chart-stream-example.component';
import { DarkCheckboxExample } from './checkbox/dark-checkbox-example';
import { DefaultCheckboxExampleComponent } from './checkbox/default-checkbox-example';
import { IndeterminateCheckboxExampleComponent } from './checkbox/indeterminate-checkbox-example';
import { CustomIconContextDialogExampleComponent } from './context-dialog/custom-icon-context-dialog-example.component';
import { DarkContextDialogExampleComponent } from './context-dialog/dark-context-dialog-example.component';
import { DefaultContextDialogExampleComponent } from './context-dialog/default-context-dialog-example.component';
import { InteractiveContextDialogExampleComponent } from './context-dialog/interactive-context-dialog-example.component';
import { PrevFocusContextDialogExampleComponent } from './context-dialog/previous-focus-context-dialog-example.component';
import { CallbackCopyToClipboardExampleComponent } from './copy-to-clipboard/callback-copy-to-clipboard-example.component';
import { ContextCopyToClipboardExampleComponent } from './copy-to-clipboard/context-copy-to-clipboard-example.component';
import { DarkCopyToClipboardExampleComponent } from './copy-to-clipboard/dark-copy-to-clipboard-example.component';
import { DefaultCopyToClipboardExampleComponent } from './copy-to-clipboard/default-copy-to-clipboard-example.component';
import { DisabledCopyToClipboardExampleComponent } from './copy-to-clipboard/disabled-copy-to-clipboard-example.component';
import { ClosableCtaCardExampleComponent } from './cta-card/closable-cta-card-example.component';
import { DefaultCtaCardExampleComponent } from './cta-card/default-cta-card-example.component';
import { DefaultExpandablePanelExampleComponent } from './expandable-panel/expandable-panel-default-example.component';
import { OpenExpandablePanelExampleComponent } from './expandable-panel/expandable-panel-open-example.component';
import { TriggerExpandablePanelExampleComponent } from './expandable-panel/expandable-panel-trigger-example.component';
import { TriggerSimpleExpandablePanelExampleComponent } from './expandable-panel/expandable-panel-trigger-simple-example.component';
import { DefaultExpandableSectionExampleComponent } from './expandable-section/expandable-section-default-example.component';
import { DisabledExpandableSectionExampleComponent } from './expandable-section/expandable-section-disabled-example.component';
import { InteractiveExpandableSectionExampleComponent } from './expandable-section/expandable-section-interactive-example.component';
import { OpenExpandableSectionExampleComponent } from './expandable-section/expandable-section-open-example.component';
import { DefaultFilterFieldExample } from './filter-field/filter-field-default-example';
import { DefaultFormFieldExample } from './form-field/form-field-default-example';
import { ErrorFormFieldExample } from './form-field/form-field-error-example';
import { HintFormFieldExample } from './form-field/form-field-hint-example';
import { PrefixSuffixFormFieldExample } from './form-field/form-field-prefix-suffix-example';
import { BitsExample } from './formatters/bits-example';
import { BytesExample } from './formatters/bytes-example';
import { CountExample } from './formatters/count-example';
import { PercentExample } from './formatters/percent-example';
import { RateExample } from './formatters/rate-example';
import { DocsAsyncIcon } from './icon/icon-all-example';
import { AllIconExample } from './icon/icon-all-example';
import { DefaultIconExample } from './icon/icon-default-example';
import { ApiInlineEditorExample } from './inline-editor/inline-editor-api-example';
import { DefaultInlineEditorExample } from './inline-editor/inline-editor-default-example';
import { FailingInlineEditorExample } from './inline-editor/inline-editor-failing-example';
import { RequiredInlineEditorExample } from './inline-editor/inline-editor-required-example';
import { SuccessfulInlineEditorExample } from './inline-editor/inline-editor-successful-example';
import { PureInlineEditorExample } from './inline-editor/pure-inline-editor-example.component';
import { DarkInputExample } from './input/input-dark-example';
import { DefaultInputExample } from './input/input-default-example';
import { DisabledReadonlyInputExample } from './input/input-disabled-readonly-example';
import { NgModelInputExample } from './input/input-ng-model-example';
import { TextareaInputExample } from './input/input-textarea-example';
import { DefaultKeyValueListExampleComponent } from './key-value-list/default-key-value-list-example.component';
import { LongtextKeyValueListExampleComponent } from './key-value-list/longtext-key-value-list-example.component';
import { MulticolumnKeyValueListExampleComponent } from './key-value-list/multicolumn-key-value-list-example.component';
import { LinkDarkExampleComponent } from './link/link-dark-example.component';
import { LinkExternalExampleComponent } from './link/link-external-example.component';
import { LinkNotificationExampleComponent } from './link/link-notification-example.component';
import { LinkSimpleExampleComponent } from './link/link-simple-example.component';
import { DefaultLoadingDistractorExampleComponent } from './loading-distractor/loading-distractor-default-example';
import { InputLoadingDistractorExampleComponent } from './loading-distractor/loading-distractor-input-example';
import { SpinnerLoadingDistractorExampleComponent } from './loading-distractor/loading-distractor-spinner-example';
import { MicroChartColumnsExampleComponent } from './micro-chart/micro-chart-columns-example.component';
import { MicroChartDefaultExampleComponent } from './micro-chart/micro-chart-default-example.component';
import { MicroChartStreamExampleComponent } from './micro-chart/micro-chart-stream-example.component';
import { DefaultOverlayExampleComponent } from './overlay/default-overlay-example.component';
import { DummyOverlay } from './overlay/programmatic-overlay-example.component';
import { ProgrammaticOverlayExampleComponent } from './overlay/programmatic-overlay-example.component';
import { TimelineComponent } from './overlay/timeline-overlay-example.component';
import { TimelinePointComponent } from './overlay/timeline-overlay-example.component';
import { TimelineOverlayExampleComponent } from './overlay/timeline-overlay-example.component';
import { DefaultPaginationExampleComponent } from './pagination/default-pagination-example.component';
import { ManyPaginationExampleComponent } from './pagination/many-pagination-example.component';
import { ChangeProgressBarExampleComponent } from './progress-bar/change-progress-bar-example.component';
import { DefaultProgressBarExampleComponent } from './progress-bar/default-progress-bar-example.component';
import { RightAlignedProgressBarExampleComponent } from './progress-bar/right-aligned-progress-bar-example.component';
import { WithColorProgressBarExampleComponent } from './progress-bar/with-color-progress-bar-example.component';
import { WithCountAndTextDescriptionIndicatorProgressBarComponent } from './progress-bar/with-count-and-description-indicator-progress-bar-example.component';
import { WithCountAndTextDescriptionProgressBarComponent } from './progress-bar/with-count-and-description-progress-bar-example.component';
import { WithCountDescriptionProgressBarComponent } from './progress-bar/with-count-progress-bar-example.component';
import { WithDescriptionProgressBarExampleComponent } from './progress-bar/with-description-progress-bar-example.component';
import { ChangeProgressCircleExampleComponent } from './progress-circle/change-progress-circle-example.component';
import { DefaultProgressCircleExampleComponent } from './progress-circle/default-progress-circle-example.component';
import { WithColorProgressCircleExampleComponent } from './progress-circle/with-color-progress-circle-example.component';
import { WithIconProgressCircleExampleComponent } from './progress-circle/with-icon-progress-circle-example.component';
import { WithTextProgressCircleExampleComponent } from './progress-circle/with-text-progress-circle-example.component';
import { DarkRadioExample } from './radio/dark-radio-example';
import { DefaultRadioExample } from './radio/default-radio-example';
import { NameGroupingRadioExample } from './radio/name-grouping-radio-example';
import { ComplexValueSelectExampleComponent } from './select/complex-value-select-example.component';
import { DefaultSelectExampleComponent } from './select/default-select-example.component';
import { DisabledSelectExampleComponent } from './select/disabled-select-example.component';
import { FormFieldSelectExampleComponent } from './select/form-field-select-example.component';
import { FormsSelectExampleComponent } from './select/forms-select-example.component';
import { GroupsSelectExampleComponent } from './select/groups-select-example.component';
import { ValueSelectExampleComponent } from './select/value-select-example.component';
import { SelectionAreaChartExample } from './selection-area/selection-area-chart-example.component';
import { SelectionAreaDefaultExample } from './selection-area/selection-area-default-example.component';
import { DarkThemeShowMoreExampleComponent } from './show-more/darktheme-show-more-example.component';
import { DefaultShowMoreExampleComponent } from './show-more/default-show-more-example.component';
import { InteractiveShowMoreExampleComponent } from './show-more/interactive-show-more-example.component';
import { NoTextShowMoreExampleComponent } from './show-more/notext-show-more-example.component';
import { DarkThemeSwitchExampleComponent } from './switch/dark-theme-switch-example.component';
import { DefaultSwitchExampleComponent } from './switch/default-switch-example.component';
import { PureSwitchExampleComponent } from './switch/pure-switch-example.component';
import { TableDefaultComponent } from './table/table-default.component';
import { TableDifferentWidthComponent } from './table/table-different-width.component';
import { TableDynamicColumnsComponent } from './table/table-dynamic-columns.component';
import { TableEmptyCustomStateComponent } from './table/table-empty-custom-state.component';
import { TableEmptyStateComponent } from './table/table-empty-state.component';
import { TableExpandableProblemComponent } from './table/table-expandable-problem.component';
import { TableExpandableRowsComponent } from './table/table-expandable-rows.component';
import { TableHoverComponent } from './table/table-hover.component';
import { TableLoadingComponent } from './table/table-loading.component';
import { TableMinWidthComponent } from './table/table-min-width.component';
import { TableObservableComponent } from './table/table-observable.component';
import { TableProblemComponent } from './table/table-problem.component';
import { TableSortingFullComponent } from './table/table-sorting-full.component';
import { TableSortingComponent } from './table/table-sorting.component';
import { TableStickyHeaderComponent } from './table/table-sticky-header.component';
import { DefaultTabsExampleComponent } from './tabs/default-tabs-example.component';
import { DynamicTabsExampleComponent } from './tabs/dynamic-tabs-example.component';
import { InteractiveTabsExampleComponent } from './tabs/interactive-tabs-example.component';
import { PureTabsExampleComponent } from './tabs/pure-tabs-example.component';
import { DefaultTagExampleComponent } from './tag/default-tag-example.component';
import { DisabledTagExampleComponent } from './tag/disabled-tag-example.component';
import { InteractiveTagExampleComponent } from './tag/interactive-tag-example.component';
import { KeyTagExampleComponent } from './tag/key-tag-example.component';
import { RemovableTagExampleComponent } from './tag/removable-tag-example.component';
import { DefaultTileExampleComponent } from './tile/default-tile-example.component';
import { DisabledTileExampleComponent } from './tile/disabled-tile.example.component';
import { ErrorTileExampleComponent } from './tile/error-tile-example.component';
import { MainTileExampleComponent } from './tile/main-tile-example.component';
import { RecoveredTileExampleComponent } from './tile/recovered-tile-example.component';
import { SmallTileExampleComponent } from './tile/small-tile-example.component';
import { DefaultToastExampleComponent } from './toast/default-toast-example.component';
import { DynamicMsgToastExampleComponent } from './toast/dynamic-msg-toast-example.component';

const EXAMPLES = [
  DarkAlertExampleComponent,
  ErrorAlertExampleComponent,
  InteractiveAlertExampleComponent,
  WarningAlertExampleComponent,
  AttachDifferentElementAutocompleteExample,
  ControlValuesAutocompleteExample,
  CustomFilterAutocompleteExample,
  DefaultAutocompleteExample,
  GroupsAutocompleteExample,
  HighlightFirstOptionAutocompleteExample,
  DarkBreadcrumbsExampleComponent,
  DefaultBreadcrumbsExampleComponent,
  ExternalBreadcrumbsExampleComponent,
  ObservableBreadcrumbsExampleComponent,
  ButtonGroupDefaultExampleComponent,
  ButtonGroupDisabledExampleComponent,
  ButtonGroupErrorExampleComponent,
  ButtonGroupInteractiveExampleComponent,
  ButtonGroupItemDisabledExampleComponent,
  ColorButtonExampleComponent,
  DarkButtonExampleComponent,
  DefaultButtonExampleComponent,
  DisabledButtonExampleComponent,
  IconOnlyButtonExampleComponent,
  IconsButtonExampleComponent,
  InteractionButtonExampleComponent,
  LoadingSpinnerButtonExampleComponent,
  VariantButtonExampleComponent,
  PureButtonExampleComponent,
  ActionButtonsCardExampleComponent,
  DarkThemeCardExampleComponent,
  DefaultCardExampleComponent,
  IconCardExampleComponent,
  SubtitleCardExampleComponent,
  TitleCardExampleComponent,
  ChartAreaRangeExampleComponent,
  ChartCategorizedExampleComponent,
  ChartDefaultExampleComponent,
  ChartHeatfieldExampleComponent,
  ChartHeatfieldMultipleExampleComponent,
  ChartLoadingExampleComponent,
  ChartOrderdColorsExampleComponent,
  ChartPieExampleComponent,
  ChartStreamExampleComponent,
  DarkCheckboxExample,
  DefaultCheckboxExampleComponent,
  IndeterminateCheckboxExampleComponent,
  CustomIconContextDialogExampleComponent,
  DarkContextDialogExampleComponent,
  DefaultContextDialogExampleComponent,
  InteractiveContextDialogExampleComponent,
  PrevFocusContextDialogExampleComponent,
  CallbackCopyToClipboardExampleComponent,
  ContextCopyToClipboardExampleComponent,
  DarkCopyToClipboardExampleComponent,
  DefaultCopyToClipboardExampleComponent,
  DisabledCopyToClipboardExampleComponent,
  ClosableCtaCardExampleComponent,
  DefaultCtaCardExampleComponent,
  DefaultExpandablePanelExampleComponent,
  OpenExpandablePanelExampleComponent,
  TriggerExpandablePanelExampleComponent,
  TriggerSimpleExpandablePanelExampleComponent,
  DefaultExpandableSectionExampleComponent,
  DisabledExpandableSectionExampleComponent,
  InteractiveExpandableSectionExampleComponent,
  OpenExpandableSectionExampleComponent,
  DefaultFilterFieldExample,
  DefaultFormFieldExample,
  ErrorFormFieldExample,
  HintFormFieldExample,
  PrefixSuffixFormFieldExample,
  BitsExample,
  BytesExample,
  CountExample,
  PercentExample,
  RateExample,
  DocsAsyncIcon,
  AllIconExample,
  DefaultIconExample,
  ApiInlineEditorExample,
  DefaultInlineEditorExample,
  FailingInlineEditorExample,
  RequiredInlineEditorExample,
  SuccessfulInlineEditorExample,
  PureInlineEditorExample,
  DarkInputExample,
  DefaultInputExample,
  DisabledReadonlyInputExample,
  NgModelInputExample,
  TextareaInputExample,
  DefaultKeyValueListExampleComponent,
  LongtextKeyValueListExampleComponent,
  MulticolumnKeyValueListExampleComponent,
  LinkDarkExampleComponent,
  LinkExternalExampleComponent,
  LinkNotificationExampleComponent,
  LinkSimpleExampleComponent,
  DefaultLoadingDistractorExampleComponent,
  InputLoadingDistractorExampleComponent,
  SpinnerLoadingDistractorExampleComponent,
  MicroChartColumnsExampleComponent,
  MicroChartDefaultExampleComponent,
  MicroChartStreamExampleComponent,
  DefaultOverlayExampleComponent,
  DummyOverlay,
  ProgrammaticOverlayExampleComponent,
  TimelineComponent,
  TimelinePointComponent,
  TimelineOverlayExampleComponent,
  DefaultPaginationExampleComponent,
  ManyPaginationExampleComponent,
  ChangeProgressBarExampleComponent,
  DefaultProgressBarExampleComponent,
  RightAlignedProgressBarExampleComponent,
  WithColorProgressBarExampleComponent,
  WithCountAndTextDescriptionIndicatorProgressBarComponent,
  WithCountAndTextDescriptionProgressBarComponent,
  WithCountDescriptionProgressBarComponent,
  WithDescriptionProgressBarExampleComponent,
  ChangeProgressCircleExampleComponent,
  DefaultProgressCircleExampleComponent,
  WithColorProgressCircleExampleComponent,
  WithIconProgressCircleExampleComponent,
  WithTextProgressCircleExampleComponent,
  DarkRadioExample,
  DefaultRadioExample,
  NameGroupingRadioExample,
  ComplexValueSelectExampleComponent,
  DefaultSelectExampleComponent,
  DisabledSelectExampleComponent,
  FormFieldSelectExampleComponent,
  FormsSelectExampleComponent,
  GroupsSelectExampleComponent,
  ValueSelectExampleComponent,
  SelectionAreaChartExample,
  SelectionAreaDefaultExample,
  DarkThemeShowMoreExampleComponent,
  DefaultShowMoreExampleComponent,
  InteractiveShowMoreExampleComponent,
  NoTextShowMoreExampleComponent,
  DarkThemeSwitchExampleComponent,
  DefaultSwitchExampleComponent,
  PureSwitchExampleComponent,
  TableDefaultComponent,
  TableDifferentWidthComponent,
  TableDynamicColumnsComponent,
  TableEmptyCustomStateComponent,
  TableEmptyStateComponent,
  TableExpandableProblemComponent,
  TableExpandableRowsComponent,
  TableHoverComponent,
  TableLoadingComponent,
  TableMinWidthComponent,
  TableObservableComponent,
  TableProblemComponent,
  TableSortingFullComponent,
  TableSortingComponent,
  TableStickyHeaderComponent,
  DefaultTabsExampleComponent,
  DynamicTabsExampleComponent,
  InteractiveTabsExampleComponent,
  PureTabsExampleComponent,
  DefaultTagExampleComponent,
  DisabledTagExampleComponent,
  InteractiveTagExampleComponent,
  KeyTagExampleComponent,
  RemovableTagExampleComponent,
  DefaultTileExampleComponent,
  DisabledTileExampleComponent,
  ErrorTileExampleComponent,
  MainTileExampleComponent,
  RecoveredTileExampleComponent,
  SmallTileExampleComponent,
  DefaultToastExampleComponent,
  DynamicMsgToastExampleComponent,
];

/**
 * NgModule that includes all example components
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    DtIconModule.forRoot({ svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` }),
    ExamplesAppDynatraceModule,
  ],
  exports: [
    ExamplesAppDynatraceModule,
  ],
  declarations: [
    ...EXAMPLES,
    App,
  ],
  entryComponents: [
    App,
  ],
  bootstrap: [App],
})
export class AppModule { }

