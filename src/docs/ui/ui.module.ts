import { NgModule } from '@angular/core';

import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SnippetDirective } from './snippet/snippet.directive';
import { SourceExampleComponent } from './source-example/source-example.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    SnippetDirective,
    SourceExampleComponent,
  ],
  exports: [
    SnippetDirective,
    SourceExampleComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PortalModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
})
export class UiModule {
}
