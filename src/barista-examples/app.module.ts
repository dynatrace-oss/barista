import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExamplesAppExamplesModule } from './examples.module';
import { ExamplesAppDynatraceModule } from './dt.module';
import { App } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DtIconModule } from '@dynatrace/angular-components';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DtIconModule.forRoot({ svgIconLocation: '/assets/icons/{{name}}.svg' }),
    RouterModule.forRoot([]),
    ExamplesAppExamplesModule,
    ExamplesAppDynatraceModule,
  ],
  declarations: [
    App,
  ],
  entryComponents: [
    App,
  ],
  bootstrap: [App],
})
export class AppModule {
}
