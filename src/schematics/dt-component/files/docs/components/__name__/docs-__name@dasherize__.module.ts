import { NgModule } from '@angular/core';
import { Default<%= classify(name) %>ExampleComponent } from './examples/default-<%= dasherize(name) %>-example.component';
import { Docs<%= classify(name) %>Component } from './docs-<%= dasherize(name) %>.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { Dt<%= classify(name) %>Module } from '@dynatrace/angular-components';

const EXAMPLES = [
  Default<%= classify(name) %>ExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    Dt<%= classify(name) %>Module,
  ],
  declarations: [
    ...EXAMPLES,
    Docs<%= classify(name) %>Component,
  ],
  exports: [
    Docs<%= classify(name) %>Component,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class Docs<%= classify(name) %>Module {
}
