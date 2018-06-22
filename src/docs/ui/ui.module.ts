import { NgModule, InjectionToken, Type } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SnippetDirective } from './snippet/snippet.directive';
import { SourceExampleComponent } from './source-example/source-example.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

// tslint:disable-next-line:no-any
export const embeddedComponentList: Array<Type<any>> = [
  SourceExampleComponent,
];

export const EMBEDDED_COMPONENTS = new InjectionToken<string>('embedded-components');
export const COMPONENT_EXAMPLES = new InjectionToken<string>('component-examples');

@NgModule({
  declarations: [
    SnippetDirective,
    embeddedComponentList,
  ],
  exports: [
    SnippetDirective,
    embeddedComponentList,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PortalModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: EMBEDDED_COMPONENTS, useValue: embeddedComponentList },
  ],
  entryComponents: embeddedComponentList,
})
export class UiModule {
}
