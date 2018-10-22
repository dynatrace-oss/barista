import { HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Docs } from './docs.component';
import { DocsButtonModule } from './components/button/docs-button.module';
import { DocsButtonGroupModule } from './components/button-group/docs-button-group.module';
import { DocsLinkModule } from './components/link/docs-link.module';
import { DocsInlineEditorModule } from './components/inline-editor/docs-inline-editor.module';
import { DocsInputModule } from './components/input/docs-input.module';
import { DocsLoadingDistractorModule } from './components/loading-distractor/docs-loading-distractor.module';
import { DocsExpandablePanelModule } from './components/expandable-panel/docs-expandable-panel.module';
import { DocsExpandableSectionModule } from './components/expandable-section/docs-expandable-section.module';
import { DocsTableModule } from './components/table/docs-table.module';
import { DocsChartModule } from './components/chart/docs-chart.module';
import { DocsTileModule } from './components/tile/docs-tile.module';
import { DocsCardModule } from './components/card/docs-card.module';
import { DocsContextDialogModule } from './components/context-dialog/docs-context-dialog.module';
import { DocsFormFieldModule } from './components/form-field/docs-form-field-module';
import { DocsTagModule } from './components/tag/docs-tag.module';
import { DocsAlertModule } from './components/alert/docs-alert.module';
import { DocsIconModule } from './components/icon/docs-icon.module';
import { DocsKeyValueListModule } from './components/key-value-list/docs-key-value-list.module';
import { DocsPaginationModule } from './components/pagination/docs-pagination.module';
import { DocsShowMoreModule } from './components/show-more/docs-show-more.module';
import { FormsModule } from '@angular/forms';
import { DocsCopyToClipboardModule } from './components/copy-to-clipboard/docs-copy-to-clipboard.module';
import { DtIconModule, DtThemingModule, DT_ICON_CONFIGURATION, DtSelectModule } from '@dynatrace/angular-components';
import { DocsRadioModule } from './components/radio/docs-radio.module';
import { DocsCheckboxModule } from './components/checkbox/docs-checkbox.module';
import { DocsProgressCircleModule } from './components/progress-circle/docs-progress-circle.module';
import { DocsBreadcrumbsModule } from './components/breadcrumbs/docs-breadcrumbs.module';
import { CoreModule } from './core/core.module';
import { DocsSwitchModule } from './components/switch/docs-switch.module';
import { environment } from '@environments/environment';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DocsViewerComponent } from './core/docs-viewer.component';
import { DocsProgressBarModule } from './components/progress-bar/docs-progress-bar.module';
import { DocsTabsModule } from './components/tabs/docs-tabs.module';
import { DocsToastModule } from './components/toast/docs-toast.module';
import { DocsSelectModule } from './components/select/docs-select.module';
import { DocsOverlayModule } from './components/overlay/docs-overlay.module';
import { DocsFormattersModule } from './components/formatters/docs-formatters-module';
import { DocsMicroChartModule } from './components/micro-chart/docs-micro-chart.module';
import { DocsAutocompleteModule } from './components/autocomplete/docs-autocomplete.module';

@Component({template: ''})
export class NoopRouteComponent {}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    RouterModule.forRoot([
      { path: ':noop',  component: NoopRouteComponent },
      { path: 'job/angular-components/job/:noop/Docs', component: NoopRouteComponent },
      { path: 'job/angular-components/view/change-requests/job/:noop/Docs', component: NoopRouteComponent },
    ]),

    // Changing the way we provide from `forRoot` to a custom provider, because there is an issue in AOT in Angular 6 listed below.
    // We can go back to `forRoot` once this is resolve.
    // Jira issue: ***REMOVED***/***REMOVED***
    // Angular issue: https://github.com/angular/angular/issues/23609
    // DtIconModule.forRoot({ svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` }),
    DtIconModule,

    DtSelectModule,

    DocsAutocompleteModule,
    DocsButtonModule,
    DocsButtonGroupModule,
    DocsInputModule,
    DocsInlineEditorModule,
    DocsIconModule,
    DocsLoadingDistractorModule,
    DocsLinkModule,
    DocsExpandablePanelModule,
    DocsExpandableSectionModule,
    DocsTableModule,
    DocsChartModule,
    DocsMicroChartModule,
    DocsTileModule,
    DocsCardModule,
    DocsContextDialogModule,
    DocsFormFieldModule,
    DocsTagModule,
    DocsAlertModule,
    DocsKeyValueListModule,
    DocsPaginationModule,
    DocsShowMoreModule,
    DtThemingModule,
    DocsCopyToClipboardModule,
    DocsRadioModule,
    DocsCheckboxModule,
    DocsFormattersModule,
    DocsProgressCircleModule,
    DocsSwitchModule,
    DocsBreadcrumbsModule,
    DocsProgressBarModule,
    DocsTabsModule,
    DocsToastModule,
    DocsSelectModule,
    DocsOverlayModule,
  ],
  declarations: [
    Docs,
    DocsViewerComponent,
    NoopRouteComponent,
  ],
  exports: [
    DocsViewerComponent,
  ],
  entryComponents: [
    Docs,
  ],
  bootstrap: [Docs],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },

    // Custom icon config provider for the Angular 6 AOT issue described above
    {
      provide: DT_ICON_CONFIGURATION,
      useValue: { svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` },
    },
  ],
})
export class DocsModule {
}
