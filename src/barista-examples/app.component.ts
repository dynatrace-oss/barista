import { Component } from '@angular/core';

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

export const ROUTES = [
      { path: 'alert/dark-alert-example-component', component: DarkAlertExampleComponent},
      { path: 'alert/error-alert-example-component', component: ErrorAlertExampleComponent},
      { path: 'alert/interactive-alert-example-component', component: InteractiveAlertExampleComponent},
      { path: 'alert/warning-alert-example-component', component: WarningAlertExampleComponent},
      { path: 'autocomplete/attach-different-element-autocomplete-example', component: AttachDifferentElementAutocompleteExample},
      { path: 'autocomplete/control-values-autocomplete-example', component: ControlValuesAutocompleteExample},
      { path: 'autocomplete/custom-filter-autocomplete-example', component: CustomFilterAutocompleteExample},
      { path: 'autocomplete/default-autocomplete-example', component: DefaultAutocompleteExample},
      { path: 'autocomplete/groups-autocomplete-example', component: GroupsAutocompleteExample},
      { path: 'autocomplete/highlight-first-option-autocomplete-example', component: HighlightFirstOptionAutocompleteExample},
      { path: 'breadcrumbs/dark-breadcrumbs-example-component', component: DarkBreadcrumbsExampleComponent},
      { path: 'breadcrumbs/default-breadcrumbs-example-component', component: DefaultBreadcrumbsExampleComponent},
      { path: 'breadcrumbs/external-breadcrumbs-example-component', component: ExternalBreadcrumbsExampleComponent},
      { path: 'breadcrumbs/observable-breadcrumbs-example-component', component: ObservableBreadcrumbsExampleComponent},
      { path: 'button-group/button-group-default-example-component', component: ButtonGroupDefaultExampleComponent},
      { path: 'button-group/button-group-disabled-example-component', component: ButtonGroupDisabledExampleComponent},
      { path: 'button-group/button-group-error-example-component', component: ButtonGroupErrorExampleComponent},
      { path: 'button-group/button-group-interactive-example-component', component: ButtonGroupInteractiveExampleComponent},
      { path: 'button-group/button-group-item-disabled-example-component', component: ButtonGroupItemDisabledExampleComponent},
      { path: 'button/color-button-example-component', component: ColorButtonExampleComponent},
      { path: 'button/dark-button-example-component', component: DarkButtonExampleComponent},
      { path: 'button/default-button-example-component', component: DefaultButtonExampleComponent},
      { path: 'button/disabled-button-example-component', component: DisabledButtonExampleComponent},
      { path: 'button/icon-only-button-example-component', component: IconOnlyButtonExampleComponent},
      { path: 'button/icons-button-example-component', component: IconsButtonExampleComponent},
      { path: 'button/interaction-button-example-component', component: InteractionButtonExampleComponent},
      { path: 'button/loading-spinner-button-example-component', component: LoadingSpinnerButtonExampleComponent},
      { path: 'button/variant-button-example-component', component: VariantButtonExampleComponent},
      { path: 'button/pure-button-example-component', component: PureButtonExampleComponent},
      { path: 'card/action-buttons-card-example-component', component: ActionButtonsCardExampleComponent},
      { path: 'card/dark-theme-card-example-component', component: DarkThemeCardExampleComponent},
      { path: 'card/default-card-example-component', component: DefaultCardExampleComponent},
      { path: 'card/icon-card-example-component', component: IconCardExampleComponent},
      { path: 'card/subtitle-card-example-component', component: SubtitleCardExampleComponent},
      { path: 'card/title-card-example-component', component: TitleCardExampleComponent},
      { path: 'chart/chart-area-range-example-component', component: ChartAreaRangeExampleComponent},
      { path: 'chart/chart-categorized-example-component', component: ChartCategorizedExampleComponent},
      { path: 'chart/chart-default-example-component', component: ChartDefaultExampleComponent},
      { path: 'chart/chart-heatfield-example-component', component: ChartHeatfieldExampleComponent},
      { path: 'chart/chart-heatfield-multiple-example-component', component: ChartHeatfieldMultipleExampleComponent},
      { path: 'chart/chart-loading-example-component', component: ChartLoadingExampleComponent},
      { path: 'chart/chart-orderd-colors-example-component', component: ChartOrderdColorsExampleComponent},
      { path: 'chart/chart-pie-example-component', component: ChartPieExampleComponent},
      { path: 'chart/chart-stream-example-component', component: ChartStreamExampleComponent},
      { path: 'checkbox/dark-checkbox-example', component: DarkCheckboxExample},
      { path: 'checkbox/default-checkbox-example-component', component: DefaultCheckboxExampleComponent},
      { path: 'checkbox/indeterminate-checkbox-example-component', component: IndeterminateCheckboxExampleComponent},
      { path: 'context-dialog/custom-icon-context-dialog-example-component', component: CustomIconContextDialogExampleComponent},
      { path: 'context-dialog/dark-context-dialog-example-component', component: DarkContextDialogExampleComponent},
      { path: 'context-dialog/default-context-dialog-example-component', component: DefaultContextDialogExampleComponent},
      { path: 'context-dialog/interactive-context-dialog-example-component', component: InteractiveContextDialogExampleComponent},
      { path: 'context-dialog/prev-focus-context-dialog-example-component', component: PrevFocusContextDialogExampleComponent},
      { path: 'copy-to-clipboard/callback-copy-to-clipboard-example-component', component: CallbackCopyToClipboardExampleComponent},
      { path: 'copy-to-clipboard/context-copy-to-clipboard-example-component', component: ContextCopyToClipboardExampleComponent},
      { path: 'copy-to-clipboard/dark-copy-to-clipboard-example-component', component: DarkCopyToClipboardExampleComponent},
      { path: 'copy-to-clipboard/default-copy-to-clipboard-example-component', component: DefaultCopyToClipboardExampleComponent},
      { path: 'copy-to-clipboard/disabled-copy-to-clipboard-example-component', component: DisabledCopyToClipboardExampleComponent},
      { path: 'cta-card/closable-cta-card-example-component', component: ClosableCtaCardExampleComponent},
      { path: 'cta-card/default-cta-card-example-component', component: DefaultCtaCardExampleComponent},
      { path: 'expandable-panel/default-expandable-panel-example-component', component: DefaultExpandablePanelExampleComponent},
      { path: 'expandable-panel/open-expandable-panel-example-component', component: OpenExpandablePanelExampleComponent},
      { path: 'expandable-panel/trigger-expandable-panel-example-component', component: TriggerExpandablePanelExampleComponent},
      { path: 'expandable-panel/trigger-simple-expandable-panel-example-component', component: TriggerSimpleExpandablePanelExampleComponent},
      { path: 'expandable-section/default-expandable-section-example-component', component: DefaultExpandableSectionExampleComponent},
      { path: 'expandable-section/disabled-expandable-section-example-component', component: DisabledExpandableSectionExampleComponent},
      { path: 'expandable-section/interactive-expandable-section-example-component', component: InteractiveExpandableSectionExampleComponent},
      { path: 'expandable-section/open-expandable-section-example-component', component: OpenExpandableSectionExampleComponent},
      { path: 'filter-field/default-filter-field-example', component: DefaultFilterFieldExample},
      { path: 'form-field/default-form-field-example', component: DefaultFormFieldExample},
      { path: 'form-field/error-form-field-example', component: ErrorFormFieldExample},
      { path: 'form-field/hint-form-field-example', component: HintFormFieldExample},
      { path: 'form-field/prefix-suffix-form-field-example', component: PrefixSuffixFormFieldExample},
      { path: 'formatters/bits-example', component: BitsExample},
      { path: 'formatters/bytes-example', component: BytesExample},
      { path: 'formatters/count-example', component: CountExample},
      { path: 'formatters/percent-example', component: PercentExample},
      { path: 'formatters/rate-example', component: RateExample},
      { path: 'icon/docs-async-icon', component: DocsAsyncIcon},
      { path: 'icon/all-icon-example', component: AllIconExample},
      { path: 'icon/default-icon-example', component: DefaultIconExample},
      { path: 'inline-editor/api-inline-editor-example', component: ApiInlineEditorExample},
      { path: 'inline-editor/default-inline-editor-example', component: DefaultInlineEditorExample},
      { path: 'inline-editor/failing-inline-editor-example', component: FailingInlineEditorExample},
      { path: 'inline-editor/required-inline-editor-example', component: RequiredInlineEditorExample},
      { path: 'inline-editor/successful-inline-editor-example', component: SuccessfulInlineEditorExample},
      { path: 'inline-editor/pure-inline-editor-example', component: PureInlineEditorExample},
      { path: 'input/dark-input-example', component: DarkInputExample},
      { path: 'input/default-input-example', component: DefaultInputExample},
      { path: 'input/disabled-readonly-input-example', component: DisabledReadonlyInputExample},
      { path: 'input/ng-model-input-example', component: NgModelInputExample},
      { path: 'input/textarea-input-example', component: TextareaInputExample},
      { path: 'key-value-list/default-key-value-list-example-component', component: DefaultKeyValueListExampleComponent},
      { path: 'key-value-list/longtext-key-value-list-example-component', component: LongtextKeyValueListExampleComponent},
      { path: 'key-value-list/multicolumn-key-value-list-example-component', component: MulticolumnKeyValueListExampleComponent},
      { path: 'link/link-dark-example-component', component: LinkDarkExampleComponent},
      { path: 'link/link-external-example-component', component: LinkExternalExampleComponent},
      { path: 'link/link-notification-example-component', component: LinkNotificationExampleComponent},
      { path: 'link/link-simple-example-component', component: LinkSimpleExampleComponent},
      { path: 'loading-distractor/default-loading-distractor-example-component', component: DefaultLoadingDistractorExampleComponent},
      { path: 'loading-distractor/input-loading-distractor-example-component', component: InputLoadingDistractorExampleComponent},
      { path: 'loading-distractor/spinner-loading-distractor-example-component', component: SpinnerLoadingDistractorExampleComponent},
      { path: 'micro-chart/micro-chart-columns-example-component', component: MicroChartColumnsExampleComponent},
      { path: 'micro-chart/micro-chart-default-example-component', component: MicroChartDefaultExampleComponent},
      { path: 'micro-chart/micro-chart-stream-example-component', component: MicroChartStreamExampleComponent},
      { path: 'overlay/default-overlay-example-component', component: DefaultOverlayExampleComponent},
      { path: 'overlay/dummy-overlay', component: DummyOverlay},
      { path: 'overlay/programmatic-overlay-example-component', component: ProgrammaticOverlayExampleComponent},
      { path: 'overlay/timeline-component', component: TimelineComponent},
      { path: 'overlay/timeline-point-component', component: TimelinePointComponent},
      { path: 'overlay/timeline-overlay-example-component', component: TimelineOverlayExampleComponent},
      { path: 'pagination/default-pagination-example-component', component: DefaultPaginationExampleComponent},
      { path: 'pagination/many-pagination-example-component', component: ManyPaginationExampleComponent},
      { path: 'progress-bar/change-progress-bar-example-component', component: ChangeProgressBarExampleComponent},
      { path: 'progress-bar/default-progress-bar-example-component', component: DefaultProgressBarExampleComponent},
      { path: 'progress-bar/right-aligned-progress-bar-example-component', component: RightAlignedProgressBarExampleComponent},
      { path: 'progress-bar/with-color-progress-bar-example-component', component: WithColorProgressBarExampleComponent},
      { path: 'progress-bar/with-count-and-text-description-indicator-progress-bar-component', component: WithCountAndTextDescriptionIndicatorProgressBarComponent},
      { path: 'progress-bar/with-count-and-text-description-progress-bar-component', component: WithCountAndTextDescriptionProgressBarComponent},
      { path: 'progress-bar/with-count-description-progress-bar-component', component: WithCountDescriptionProgressBarComponent},
      { path: 'progress-bar/with-description-progress-bar-example-component', component: WithDescriptionProgressBarExampleComponent},
      { path: 'progress-circle/change-progress-circle-example-component', component: ChangeProgressCircleExampleComponent},
      { path: 'progress-circle/default-progress-circle-example-component', component: DefaultProgressCircleExampleComponent},
      { path: 'progress-circle/with-color-progress-circle-example-component', component: WithColorProgressCircleExampleComponent},
      { path: 'progress-circle/with-icon-progress-circle-example-component', component: WithIconProgressCircleExampleComponent},
      { path: 'progress-circle/with-text-progress-circle-example-component', component: WithTextProgressCircleExampleComponent},
      { path: 'radio/dark-radio-example', component: DarkRadioExample},
      { path: 'radio/default-radio-example', component: DefaultRadioExample},
      { path: 'radio/name-grouping-radio-example', component: NameGroupingRadioExample},
      { path: 'select/complex-value-select-example-component', component: ComplexValueSelectExampleComponent},
      { path: 'select/default-select-example-component', component: DefaultSelectExampleComponent},
      { path: 'select/disabled-select-example-component', component: DisabledSelectExampleComponent},
      { path: 'select/form-field-select-example-component', component: FormFieldSelectExampleComponent},
      { path: 'select/forms-select-example-component', component: FormsSelectExampleComponent},
      { path: 'select/groups-select-example-component', component: GroupsSelectExampleComponent},
      { path: 'select/value-select-example-component', component: ValueSelectExampleComponent},
      { path: 'selection-area/selection-area-chart-example', component: SelectionAreaChartExample},
      { path: 'selection-area/selection-area-default-example', component: SelectionAreaDefaultExample},
      { path: 'show-more/dark-theme-show-more-example-component', component: DarkThemeShowMoreExampleComponent},
      { path: 'show-more/default-show-more-example-component', component: DefaultShowMoreExampleComponent},
      { path: 'show-more/interactive-show-more-example-component', component: InteractiveShowMoreExampleComponent},
      { path: 'show-more/no-text-show-more-example-component', component: NoTextShowMoreExampleComponent},
      { path: 'switch/dark-theme-switch-example-component', component: DarkThemeSwitchExampleComponent},
      { path: 'switch/default-switch-example-component', component: DefaultSwitchExampleComponent},
      { path: 'switch/pure-switch-example-component', component: PureSwitchExampleComponent},
      { path: 'table/table-default-component', component: TableDefaultComponent},
      { path: 'table/table-different-width-component', component: TableDifferentWidthComponent},
      { path: 'table/table-dynamic-columns-component', component: TableDynamicColumnsComponent},
      { path: 'table/table-empty-custom-state-component', component: TableEmptyCustomStateComponent},
      { path: 'table/table-empty-state-component', component: TableEmptyStateComponent},
      { path: 'table/table-expandable-problem-component', component: TableExpandableProblemComponent},
      { path: 'table/table-expandable-rows-component', component: TableExpandableRowsComponent},
      { path: 'table/table-hover-component', component: TableHoverComponent},
      { path: 'table/table-loading-component', component: TableLoadingComponent},
      { path: 'table/table-min-width-component', component: TableMinWidthComponent},
      { path: 'table/table-observable-component', component: TableObservableComponent},
      { path: 'table/table-problem-component', component: TableProblemComponent},
      { path: 'table/table-sorting-full-component', component: TableSortingFullComponent},
      { path: 'table/table-sorting-component', component: TableSortingComponent},
      { path: 'table/table-sticky-header-component', component: TableStickyHeaderComponent},
      { path: 'tabs/default-tabs-example-component', component: DefaultTabsExampleComponent},
      { path: 'tabs/dynamic-tabs-example-component', component: DynamicTabsExampleComponent},
      { path: 'tabs/interactive-tabs-example-component', component: InteractiveTabsExampleComponent},
      { path: 'tabs/pure-tabs-example-component', component: PureTabsExampleComponent},
      { path: 'tag/default-tag-example-component', component: DefaultTagExampleComponent},
      { path: 'tag/disabled-tag-example-component', component: DisabledTagExampleComponent},
      { path: 'tag/interactive-tag-example-component', component: InteractiveTagExampleComponent},
      { path: 'tag/key-tag-example-component', component: KeyTagExampleComponent},
      { path: 'tag/removable-tag-example-component', component: RemovableTagExampleComponent},
      { path: 'tile/default-tile-example-component', component: DefaultTileExampleComponent},
      { path: 'tile/disabled-tile-example-component', component: DisabledTileExampleComponent},
      { path: 'tile/error-tile-example-component', component: ErrorTileExampleComponent},
      { path: 'tile/main-tile-example-component', component: MainTileExampleComponent},
      { path: 'tile/recovered-tile-example-component', component: RecoveredTileExampleComponent},
      { path: 'tile/small-tile-example-component', component: SmallTileExampleComponent},
      { path: 'toast/default-toast-example-component', component: DefaultToastExampleComponent},
      { path: 'toast/dynamic-msg-toast-example-component', component: DynamicMsgToastExampleComponent}];

@Component({
  selector: 'barista-examples',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class App {
  componentItems = [
	{
		"name": "alert",
		"examples": [
			{
				"name": "dark-alert-example-component",
				"route": "alert/dark-alert-example-component"
			},
			{
				"name": "error-alert-example-component",
				"route": "alert/error-alert-example-component"
			},
			{
				"name": "interactive-alert-example-component",
				"route": "alert/interactive-alert-example-component"
			},
			{
				"name": "warning-alert-example-component",
				"route": "alert/warning-alert-example-component"
			}
		]
	},
	{
		"name": "autocomplete",
		"examples": [
			{
				"name": "attach-different-element-autocomplete-example",
				"route": "autocomplete/attach-different-element-autocomplete-example"
			},
			{
				"name": "control-values-autocomplete-example",
				"route": "autocomplete/control-values-autocomplete-example"
			},
			{
				"name": "custom-filter-autocomplete-example",
				"route": "autocomplete/custom-filter-autocomplete-example"
			},
			{
				"name": "default-autocomplete-example",
				"route": "autocomplete/default-autocomplete-example"
			},
			{
				"name": "groups-autocomplete-example",
				"route": "autocomplete/groups-autocomplete-example"
			},
			{
				"name": "highlight-first-option-autocomplete-example",
				"route": "autocomplete/highlight-first-option-autocomplete-example"
			}
		]
	},
	{
		"name": "breadcrumbs",
		"examples": [
			{
				"name": "dark-breadcrumbs-example-component",
				"route": "breadcrumbs/dark-breadcrumbs-example-component"
			},
			{
				"name": "default-breadcrumbs-example-component",
				"route": "breadcrumbs/default-breadcrumbs-example-component"
			},
			{
				"name": "external-breadcrumbs-example-component",
				"route": "breadcrumbs/external-breadcrumbs-example-component"
			},
			{
				"name": "observable-breadcrumbs-example-component",
				"route": "breadcrumbs/observable-breadcrumbs-example-component"
			}
		]
	},
	{
		"name": "button-group",
		"examples": [
			{
				"name": "button-group-default-example-component",
				"route": "button-group/button-group-default-example-component"
			},
			{
				"name": "button-group-disabled-example-component",
				"route": "button-group/button-group-disabled-example-component"
			},
			{
				"name": "button-group-error-example-component",
				"route": "button-group/button-group-error-example-component"
			},
			{
				"name": "button-group-interactive-example-component",
				"route": "button-group/button-group-interactive-example-component"
			},
			{
				"name": "button-group-item-disabled-example-component",
				"route": "button-group/button-group-item-disabled-example-component"
			}
		]
	},
	{
		"name": "button",
		"examples": [
			{
				"name": "color-button-example-component",
				"route": "button/color-button-example-component"
			},
			{
				"name": "dark-button-example-component",
				"route": "button/dark-button-example-component"
			},
			{
				"name": "default-button-example-component",
				"route": "button/default-button-example-component"
			},
			{
				"name": "disabled-button-example-component",
				"route": "button/disabled-button-example-component"
			},
			{
				"name": "icon-only-button-example-component",
				"route": "button/icon-only-button-example-component"
			},
			{
				"name": "icons-button-example-component",
				"route": "button/icons-button-example-component"
			},
			{
				"name": "interaction-button-example-component",
				"route": "button/interaction-button-example-component"
			},
			{
				"name": "loading-spinner-button-example-component",
				"route": "button/loading-spinner-button-example-component"
			},
			{
				"name": "variant-button-example-component",
				"route": "button/variant-button-example-component"
			},
			{
				"name": "pure-button-example-component",
				"route": "button/pure-button-example-component"
			}
		]
	},
	{
		"name": "card",
		"examples": [
			{
				"name": "action-buttons-card-example-component",
				"route": "card/action-buttons-card-example-component"
			},
			{
				"name": "dark-theme-card-example-component",
				"route": "card/dark-theme-card-example-component"
			},
			{
				"name": "default-card-example-component",
				"route": "card/default-card-example-component"
			},
			{
				"name": "icon-card-example-component",
				"route": "card/icon-card-example-component"
			},
			{
				"name": "subtitle-card-example-component",
				"route": "card/subtitle-card-example-component"
			},
			{
				"name": "title-card-example-component",
				"route": "card/title-card-example-component"
			}
		]
	},
	{
		"name": "chart",
		"examples": [
			{
				"name": "chart-area-range-example-component",
				"route": "chart/chart-area-range-example-component"
			},
			{
				"name": "chart-categorized-example-component",
				"route": "chart/chart-categorized-example-component"
			},
			{
				"name": "chart-default-example-component",
				"route": "chart/chart-default-example-component"
			},
			{
				"name": "chart-heatfield-example-component",
				"route": "chart/chart-heatfield-example-component"
			},
			{
				"name": "chart-heatfield-multiple-example-component",
				"route": "chart/chart-heatfield-multiple-example-component"
			},
			{
				"name": "chart-loading-example-component",
				"route": "chart/chart-loading-example-component"
			},
			{
				"name": "chart-orderd-colors-example-component",
				"route": "chart/chart-orderd-colors-example-component"
			},
			{
				"name": "chart-pie-example-component",
				"route": "chart/chart-pie-example-component"
			},
			{
				"name": "chart-stream-example-component",
				"route": "chart/chart-stream-example-component"
			}
		]
	},
	{
		"name": "checkbox",
		"examples": [
			{
				"name": "dark-checkbox-example",
				"route": "checkbox/dark-checkbox-example"
			},
			{
				"name": "default-checkbox-example-component",
				"route": "checkbox/default-checkbox-example-component"
			},
			{
				"name": "indeterminate-checkbox-example-component",
				"route": "checkbox/indeterminate-checkbox-example-component"
			}
		]
	},
	{
		"name": "context-dialog",
		"examples": [
			{
				"name": "custom-icon-context-dialog-example-component",
				"route": "context-dialog/custom-icon-context-dialog-example-component"
			},
			{
				"name": "dark-context-dialog-example-component",
				"route": "context-dialog/dark-context-dialog-example-component"
			},
			{
				"name": "default-context-dialog-example-component",
				"route": "context-dialog/default-context-dialog-example-component"
			},
			{
				"name": "interactive-context-dialog-example-component",
				"route": "context-dialog/interactive-context-dialog-example-component"
			},
			{
				"name": "prev-focus-context-dialog-example-component",
				"route": "context-dialog/prev-focus-context-dialog-example-component"
			}
		]
	},
	{
		"name": "copy-to-clipboard",
		"examples": [
			{
				"name": "callback-copy-to-clipboard-example-component",
				"route": "copy-to-clipboard/callback-copy-to-clipboard-example-component"
			},
			{
				"name": "context-copy-to-clipboard-example-component",
				"route": "copy-to-clipboard/context-copy-to-clipboard-example-component"
			},
			{
				"name": "dark-copy-to-clipboard-example-component",
				"route": "copy-to-clipboard/dark-copy-to-clipboard-example-component"
			},
			{
				"name": "default-copy-to-clipboard-example-component",
				"route": "copy-to-clipboard/default-copy-to-clipboard-example-component"
			},
			{
				"name": "disabled-copy-to-clipboard-example-component",
				"route": "copy-to-clipboard/disabled-copy-to-clipboard-example-component"
			}
		]
	},
	{
		"name": "cta-card",
		"examples": [
			{
				"name": "closable-cta-card-example-component",
				"route": "cta-card/closable-cta-card-example-component"
			},
			{
				"name": "default-cta-card-example-component",
				"route": "cta-card/default-cta-card-example-component"
			}
		]
	},
	{
		"name": "expandable-panel",
		"examples": [
			{
				"name": "default-expandable-panel-example-component",
				"route": "expandable-panel/default-expandable-panel-example-component"
			},
			{
				"name": "open-expandable-panel-example-component",
				"route": "expandable-panel/open-expandable-panel-example-component"
			},
			{
				"name": "trigger-expandable-panel-example-component",
				"route": "expandable-panel/trigger-expandable-panel-example-component"
			},
			{
				"name": "trigger-simple-expandable-panel-example-component",
				"route": "expandable-panel/trigger-simple-expandable-panel-example-component"
			}
		]
	},
	{
		"name": "expandable-section",
		"examples": [
			{
				"name": "default-expandable-section-example-component",
				"route": "expandable-section/default-expandable-section-example-component"
			},
			{
				"name": "disabled-expandable-section-example-component",
				"route": "expandable-section/disabled-expandable-section-example-component"
			},
			{
				"name": "interactive-expandable-section-example-component",
				"route": "expandable-section/interactive-expandable-section-example-component"
			},
			{
				"name": "open-expandable-section-example-component",
				"route": "expandable-section/open-expandable-section-example-component"
			}
		]
	},
	{
		"name": "filter-field",
		"examples": [
			{
				"name": "default-filter-field-example",
				"route": "filter-field/default-filter-field-example"
			}
		]
	},
	{
		"name": "form-field",
		"examples": [
			{
				"name": "default-form-field-example",
				"route": "form-field/default-form-field-example"
			},
			{
				"name": "error-form-field-example",
				"route": "form-field/error-form-field-example"
			},
			{
				"name": "hint-form-field-example",
				"route": "form-field/hint-form-field-example"
			},
			{
				"name": "prefix-suffix-form-field-example",
				"route": "form-field/prefix-suffix-form-field-example"
			}
		]
	},
	{
		"name": "formatters",
		"examples": [
			{
				"name": "bits-example",
				"route": "formatters/bits-example"
			},
			{
				"name": "bytes-example",
				"route": "formatters/bytes-example"
			},
			{
				"name": "count-example",
				"route": "formatters/count-example"
			},
			{
				"name": "percent-example",
				"route": "formatters/percent-example"
			},
			{
				"name": "rate-example",
				"route": "formatters/rate-example"
			}
		]
	},
	{
		"name": "icon",
		"examples": [
			{
				"name": "docs-async-icon",
				"route": "icon/docs-async-icon"
			},
			{
				"name": "all-icon-example",
				"route": "icon/all-icon-example"
			},
			{
				"name": "default-icon-example",
				"route": "icon/default-icon-example"
			}
		]
	},
	{
		"name": "inline-editor",
		"examples": [
			{
				"name": "api-inline-editor-example",
				"route": "inline-editor/api-inline-editor-example"
			},
			{
				"name": "default-inline-editor-example",
				"route": "inline-editor/default-inline-editor-example"
			},
			{
				"name": "failing-inline-editor-example",
				"route": "inline-editor/failing-inline-editor-example"
			},
			{
				"name": "required-inline-editor-example",
				"route": "inline-editor/required-inline-editor-example"
			},
			{
				"name": "successful-inline-editor-example",
				"route": "inline-editor/successful-inline-editor-example"
			},
			{
				"name": "pure-inline-editor-example",
				"route": "inline-editor/pure-inline-editor-example"
			}
		]
	},
	{
		"name": "input",
		"examples": [
			{
				"name": "dark-input-example",
				"route": "input/dark-input-example"
			},
			{
				"name": "default-input-example",
				"route": "input/default-input-example"
			},
			{
				"name": "disabled-readonly-input-example",
				"route": "input/disabled-readonly-input-example"
			},
			{
				"name": "ng-model-input-example",
				"route": "input/ng-model-input-example"
			},
			{
				"name": "textarea-input-example",
				"route": "input/textarea-input-example"
			}
		]
	},
	{
		"name": "key-value-list",
		"examples": [
			{
				"name": "default-key-value-list-example-component",
				"route": "key-value-list/default-key-value-list-example-component"
			},
			{
				"name": "longtext-key-value-list-example-component",
				"route": "key-value-list/longtext-key-value-list-example-component"
			},
			{
				"name": "multicolumn-key-value-list-example-component",
				"route": "key-value-list/multicolumn-key-value-list-example-component"
			}
		]
	},
	{
		"name": "link",
		"examples": [
			{
				"name": "link-dark-example-component",
				"route": "link/link-dark-example-component"
			},
			{
				"name": "link-external-example-component",
				"route": "link/link-external-example-component"
			},
			{
				"name": "link-notification-example-component",
				"route": "link/link-notification-example-component"
			},
			{
				"name": "link-simple-example-component",
				"route": "link/link-simple-example-component"
			}
		]
	},
	{
		"name": "loading-distractor",
		"examples": [
			{
				"name": "default-loading-distractor-example-component",
				"route": "loading-distractor/default-loading-distractor-example-component"
			},
			{
				"name": "input-loading-distractor-example-component",
				"route": "loading-distractor/input-loading-distractor-example-component"
			},
			{
				"name": "spinner-loading-distractor-example-component",
				"route": "loading-distractor/spinner-loading-distractor-example-component"
			}
		]
	},
	{
		"name": "micro-chart",
		"examples": [
			{
				"name": "micro-chart-columns-example-component",
				"route": "micro-chart/micro-chart-columns-example-component"
			},
			{
				"name": "micro-chart-default-example-component",
				"route": "micro-chart/micro-chart-default-example-component"
			},
			{
				"name": "micro-chart-stream-example-component",
				"route": "micro-chart/micro-chart-stream-example-component"
			}
		]
	},
	{
		"name": "overlay",
		"examples": [
			{
				"name": "default-overlay-example-component",
				"route": "overlay/default-overlay-example-component"
			},
			{
				"name": "dummy-overlay",
				"route": "overlay/dummy-overlay"
			},
			{
				"name": "programmatic-overlay-example-component",
				"route": "overlay/programmatic-overlay-example-component"
			},
			{
				"name": "timeline-component",
				"route": "overlay/timeline-component"
			},
			{
				"name": "timeline-point-component",
				"route": "overlay/timeline-point-component"
			},
			{
				"name": "timeline-overlay-example-component",
				"route": "overlay/timeline-overlay-example-component"
			}
		]
	},
	{
		"name": "pagination",
		"examples": [
			{
				"name": "default-pagination-example-component",
				"route": "pagination/default-pagination-example-component"
			},
			{
				"name": "many-pagination-example-component",
				"route": "pagination/many-pagination-example-component"
			}
		]
	},
	{
		"name": "progress-bar",
		"examples": [
			{
				"name": "change-progress-bar-example-component",
				"route": "progress-bar/change-progress-bar-example-component"
			},
			{
				"name": "default-progress-bar-example-component",
				"route": "progress-bar/default-progress-bar-example-component"
			},
			{
				"name": "right-aligned-progress-bar-example-component",
				"route": "progress-bar/right-aligned-progress-bar-example-component"
			},
			{
				"name": "with-color-progress-bar-example-component",
				"route": "progress-bar/with-color-progress-bar-example-component"
			},
			{
				"name": "with-count-and-text-description-indicator-progress-bar-component",
				"route": "progress-bar/with-count-and-text-description-indicator-progress-bar-component"
			},
			{
				"name": "with-count-and-text-description-progress-bar-component",
				"route": "progress-bar/with-count-and-text-description-progress-bar-component"
			},
			{
				"name": "with-count-description-progress-bar-component",
				"route": "progress-bar/with-count-description-progress-bar-component"
			},
			{
				"name": "with-description-progress-bar-example-component",
				"route": "progress-bar/with-description-progress-bar-example-component"
			}
		]
	},
	{
		"name": "progress-circle",
		"examples": [
			{
				"name": "change-progress-circle-example-component",
				"route": "progress-circle/change-progress-circle-example-component"
			},
			{
				"name": "default-progress-circle-example-component",
				"route": "progress-circle/default-progress-circle-example-component"
			},
			{
				"name": "with-color-progress-circle-example-component",
				"route": "progress-circle/with-color-progress-circle-example-component"
			},
			{
				"name": "with-icon-progress-circle-example-component",
				"route": "progress-circle/with-icon-progress-circle-example-component"
			},
			{
				"name": "with-text-progress-circle-example-component",
				"route": "progress-circle/with-text-progress-circle-example-component"
			}
		]
	},
	{
		"name": "radio",
		"examples": [
			{
				"name": "dark-radio-example",
				"route": "radio/dark-radio-example"
			},
			{
				"name": "default-radio-example",
				"route": "radio/default-radio-example"
			},
			{
				"name": "name-grouping-radio-example",
				"route": "radio/name-grouping-radio-example"
			}
		]
	},
	{
		"name": "select",
		"examples": [
			{
				"name": "complex-value-select-example-component",
				"route": "select/complex-value-select-example-component"
			},
			{
				"name": "default-select-example-component",
				"route": "select/default-select-example-component"
			},
			{
				"name": "disabled-select-example-component",
				"route": "select/disabled-select-example-component"
			},
			{
				"name": "form-field-select-example-component",
				"route": "select/form-field-select-example-component"
			},
			{
				"name": "forms-select-example-component",
				"route": "select/forms-select-example-component"
			},
			{
				"name": "groups-select-example-component",
				"route": "select/groups-select-example-component"
			},
			{
				"name": "value-select-example-component",
				"route": "select/value-select-example-component"
			}
		]
	},
	{
		"name": "selection-area",
		"examples": [
			{
				"name": "selection-area-chart-example",
				"route": "selection-area/selection-area-chart-example"
			},
			{
				"name": "selection-area-default-example",
				"route": "selection-area/selection-area-default-example"
			}
		]
	},
	{
		"name": "show-more",
		"examples": [
			{
				"name": "dark-theme-show-more-example-component",
				"route": "show-more/dark-theme-show-more-example-component"
			},
			{
				"name": "default-show-more-example-component",
				"route": "show-more/default-show-more-example-component"
			},
			{
				"name": "interactive-show-more-example-component",
				"route": "show-more/interactive-show-more-example-component"
			},
			{
				"name": "no-text-show-more-example-component",
				"route": "show-more/no-text-show-more-example-component"
			}
		]
	},
	{
		"name": "switch",
		"examples": [
			{
				"name": "dark-theme-switch-example-component",
				"route": "switch/dark-theme-switch-example-component"
			},
			{
				"name": "default-switch-example-component",
				"route": "switch/default-switch-example-component"
			},
			{
				"name": "pure-switch-example-component",
				"route": "switch/pure-switch-example-component"
			}
		]
	},
	{
		"name": "table",
		"examples": [
			{
				"name": "table-default-component",
				"route": "table/table-default-component"
			},
			{
				"name": "table-different-width-component",
				"route": "table/table-different-width-component"
			},
			{
				"name": "table-dynamic-columns-component",
				"route": "table/table-dynamic-columns-component"
			},
			{
				"name": "table-empty-custom-state-component",
				"route": "table/table-empty-custom-state-component"
			},
			{
				"name": "table-empty-state-component",
				"route": "table/table-empty-state-component"
			},
			{
				"name": "table-expandable-problem-component",
				"route": "table/table-expandable-problem-component"
			},
			{
				"name": "table-expandable-rows-component",
				"route": "table/table-expandable-rows-component"
			},
			{
				"name": "table-hover-component",
				"route": "table/table-hover-component"
			},
			{
				"name": "table-loading-component",
				"route": "table/table-loading-component"
			},
			{
				"name": "table-min-width-component",
				"route": "table/table-min-width-component"
			},
			{
				"name": "table-observable-component",
				"route": "table/table-observable-component"
			},
			{
				"name": "table-problem-component",
				"route": "table/table-problem-component"
			},
			{
				"name": "table-sorting-full-component",
				"route": "table/table-sorting-full-component"
			},
			{
				"name": "table-sorting-component",
				"route": "table/table-sorting-component"
			},
			{
				"name": "table-sticky-header-component",
				"route": "table/table-sticky-header-component"
			}
		]
	},
	{
		"name": "tabs",
		"examples": [
			{
				"name": "default-tabs-example-component",
				"route": "tabs/default-tabs-example-component"
			},
			{
				"name": "dynamic-tabs-example-component",
				"route": "tabs/dynamic-tabs-example-component"
			},
			{
				"name": "interactive-tabs-example-component",
				"route": "tabs/interactive-tabs-example-component"
			},
			{
				"name": "pure-tabs-example-component",
				"route": "tabs/pure-tabs-example-component"
			}
		]
	},
	{
		"name": "tag",
		"examples": [
			{
				"name": "default-tag-example-component",
				"route": "tag/default-tag-example-component"
			},
			{
				"name": "disabled-tag-example-component",
				"route": "tag/disabled-tag-example-component"
			},
			{
				"name": "interactive-tag-example-component",
				"route": "tag/interactive-tag-example-component"
			},
			{
				"name": "key-tag-example-component",
				"route": "tag/key-tag-example-component"
			},
			{
				"name": "removable-tag-example-component",
				"route": "tag/removable-tag-example-component"
			}
		]
	},
	{
		"name": "tile",
		"examples": [
			{
				"name": "default-tile-example-component",
				"route": "tile/default-tile-example-component"
			},
			{
				"name": "disabled-tile-example-component",
				"route": "tile/disabled-tile-example-component"
			},
			{
				"name": "error-tile-example-component",
				"route": "tile/error-tile-example-component"
			},
			{
				"name": "main-tile-example-component",
				"route": "tile/main-tile-example-component"
			},
			{
				"name": "recovered-tile-example-component",
				"route": "tile/recovered-tile-example-component"
			},
			{
				"name": "small-tile-example-component",
				"route": "tile/small-tile-example-component"
			}
		]
	},
	{
		"name": "toast",
		"examples": [
			{
				"name": "default-toast-example-component",
				"route": "toast/default-toast-example-component"
			},
			{
				"name": "dynamic-msg-toast-example-component",
				"route": "toast/dynamic-msg-toast-example-component"
			}
		]
	}
];

  selectedTheme = 'turquoise';
  themes = [
    { value: 'turquoise', name: 'Turquoise' },
    { value: 'blue', name: 'Blue' },
    { value: 'purple', name: 'Purple' },
    { value: 'royalblue', name: 'Royalblue' },
  ];
}