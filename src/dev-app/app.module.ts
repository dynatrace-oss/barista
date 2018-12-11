import { HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DevAppRoutingModule } from './devapp-routing.module';
import { FormsModule } from '@angular/forms';
import { DtIconModule, DtThemingModule, DT_ICON_CONFIGURATION, DtSelectModule } from '@dynatrace/angular-components';
import { environment } from '@environments/environment';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DevApp } from './devapp.component';
import { AlertDemo } from './alert/alert-demo.component';
import { AutocompleteDemo } from './autocomplete/autocomplete-demo.component';
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
import { TabsDemo } from './tabs/tabs-demo.component';
import { TagDemo } from './tag/tag-demo.component';
import { TileDemo } from './tile/tile-demo.component';
import { ToastDemo } from './toast/toast-demo.component';

@Component({template: ''})
export class NoopRouteComponent {}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DevAppRoutingModule,
    // RouterModule.forRoot([
    //   { path: ':noop',  component: NoopRouteComponent },
    //   { path: 'job/angular-components/job/:noop/DevApp', component: NoopRouteComponent },
    //   { path: 'job/angular-components/view/change-requests/job/:noop/DevApp', component: NoopRouteComponent },
    // ]),

    // Changing the way we provide from `forRoot` to a custom provider, because there is an issue in AOT in Angular 6 listed below.
    // We can go back to `forRoot` once this is resolve.
    // Jira issue: https://dev-jira.dynatrace.org/browse/***REMOVED***
    // Angular issue: https://github.com/angular/angular/issues/23609
    // DtIconModule.forRoot({ svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` }),
    DtIconModule,

    DtSelectModule,
    DtThemingModule,
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
    CheckboxDemo,
    ContextDialogDemo,
    CopyToClipboardDemo,
    CtaCardDemo,
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
    RadioDemo,
    SelectDemo,
    SelectionAreaDemo,
    ShowMoreDemo,
    SwitchDemo,
    TableDemo,
    TabsDemo,
    TagDemo,
    TileDemo,
    ToastDemo,
  ],
  // exports: [
  //   DocsViewerComponent,
  // ],
  entryComponents: [
    DevApp,
  ],
  bootstrap: [DevApp],
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
export class AppModule {
}
