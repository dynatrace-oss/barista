import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DocsRoutingModule } from './docs-routing.module';
import { Docs } from './docs.component';
import { Home } from './docs-home/docs-home.component';
import { DocsButtonModule } from './components/button/docs-button.module';
import { DocsLinkModule } from './components/link/docs-link.module';
import { DocsInputModule } from 'components/input/docs-input.module';
import { DocsLoadingDistractorModule } from './components/loading-distractor/docs-loading-distractor.module';
import { DocsExpandablePanelModule } from './components/expandable-panel/docs-expandable-panel.module';
import { DocsExpandableSectionModule } from './components/expandable-section/docs-expandable-section.module';
import { DocsTableModule } from './components/table/docs-table.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DocsRoutingModule,
    DocsButtonModule,
    DocsInputModule,
    DocsLoadingDistractorModule,
    DocsLinkModule,
    DocsExpandablePanelModule,
    DocsExpandableSectionModule,
    DocsTableModule,
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
