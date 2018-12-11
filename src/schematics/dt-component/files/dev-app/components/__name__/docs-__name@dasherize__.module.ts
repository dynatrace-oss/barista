import { NgModule } from '@angular/core';
import { Default<%= classify(name) %>ExampleComponent } from './examples/default-<%= dasherize(name) %>-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { <%= moduleName %> } from '@dynatrace/angular-components';

export const EXAMPLES = [
  Default<%= classify(name) %>ExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    <%= moduleName %>,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class Docs<%= classify(name) %>Module {
}
