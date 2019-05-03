import { NgModule } from '@angular/core';
import {
  DtAlertModule,
  DtAutocompleteModule,
  DtBarIndicatorModule,
  DtBreadcrumbsModule,
  DtButtonGroupModule,
  DtButtonModule,
  DtCardModule,
  DtChartModule,
  DtCheckboxModule,
  DtContextDialogModule,
  DtConsumptionModule,
  DtCopyToClipboardModule,
  DtCtaCardModule,
  DtDrawerModule,
  DtExpandablePanelModule,
  DtExpandableSectionModule,
  DtFilterFieldModule,
  DtFormattersModule,
  DtFormFieldModule,
  DtHighlightModule,
  DtIconModule,
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
  DtRadioModule,
  DtSelectionAreaModule,
  DtSelectModule,
  DtShowMoreModule,
  DtSwitchModule,
  DtTableModule,
  DtTabsModule,
  DtTagModule,
  DtThemingModule,
  DtTileModule,
  DtTreeTableModule,
  DtToastModule,
  DtToggleButtonGroupModule,
} from '@dynatrace/angular-components';

const DT_MODULES = [
  DtAlertModule,
  DtAutocompleteModule,
  DtBarIndicatorModule,
  DtButtonModule,
  DtBreadcrumbsModule,
  DtButtonGroupModule,
  DtCardModule,
  DtChartModule,
  DtCheckboxModule,
  DtContextDialogModule,
  DtConsumptionModule,
  DtCopyToClipboardModule,
  DtCtaCardModule,
  DtDrawerModule,
  DtExpandablePanelModule,
  DtExpandableSectionModule,
  DtFormFieldModule,
  DtFilterFieldModule,
  DtFormattersModule,
  DtHighlightModule,
  DtIconModule,
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
  DtSelectModule,
  DtRadioModule,
  DtSelectionAreaModule,
  DtShowMoreModule,
  DtSwitchModule,
  DtTableModule,
  DtTabsModule,
  DtTagModule,
  DtThemingModule,
  DtTileModule,
  DtTreeTableModule,
  DtToastModule,
  DtToggleButtonGroupModule,
];

/**
 * NgModule that includes all Dynatrace angular components modules that are required to serve the examples.
 */
@NgModule({
  imports: [
    ...DT_MODULES,
  ],
  exports: [
    ...DT_MODULES,
  ],
})
export class ExamplesAppDynatraceModule { }
