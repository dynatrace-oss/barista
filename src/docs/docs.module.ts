import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocsRoutingModule } from './docs-routing.module';
import { Docs } from './docs.component';
import { Home } from './docs-home/docs-home.component';
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
import { DtIconModule, DtThemingModule } from '@dynatrace/angular-components';
import { DocsRadioModule } from './components/radio/docs-radio.module';
import { DocsCheckboxModule } from './components/checkbox/docs-checkbox.module';
import { DocsProgressCircleModule } from './components/progress-circle/docs-progress-circle.module';
import { DocsBreadcrumbsModule } from './components/breadcrumbs/docs-breadcrumbs.module';
import { CoreModule } from './core/core.module';
import { DocsSwitchModule } from './components/switch/docs-switch.module';
import { environment } from './environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    DtIconModule.forRoot({ svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` }),
    DocsRoutingModule,
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
    DocsRadioModule,
    DocsCheckboxModule,
    DocsProgressCircleModule,
    DocsSwitchModule,
    DocsBreadcrumbsModule,
  ],
  declarations: [
    Docs,
    Home,
  ],
  entryComponents: [
    Docs,
  ],
  bootstrap: [Docs],
})
export class DocsModule {
}
