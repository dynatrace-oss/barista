import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DocsRoutingModule } from './docs-routing.module';
import { Docs, Home } from './docs.component';
import { DocsDummyModule } from './components/dummy/docs-dummy.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DocsRoutingModule,
    DocsDummyModule,
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
