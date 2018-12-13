import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExamplesAppExamplesModule } from './examples.module';
import { App } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ExamplesAppExamplesModule,
  ],
  declarations: [
    App,
  ],
  entryComponents: [
    App,
  ],
  bootstrap: [App],
  // providers: [
  //   Location,
  //   { provide: LocationStrategy, useClass: PathLocationStrategy },

  //   // Custom icon config provider for the Angular 6 AOT issue described above
  //   {
  //     provide: DT_ICON_CONFIGURATION,
  //     useValue: { svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` },
  //   },
  // ],
})
export class AppModule {
}
