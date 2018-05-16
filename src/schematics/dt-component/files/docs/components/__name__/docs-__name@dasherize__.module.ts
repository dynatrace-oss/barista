import { NgModule } from '@angular/core';
import { Default<%= classify(name) %>ExampleComponent } from './examples/default-<%= dasherize(name) %>-example.component';
import { <%= docsComponent %> } from './docs-<%= dasherize(name) %>.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { <%= moduleName %> } from '@dynatrace/angular-components';

const EXAMPLES = [
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
    <%= docsComponent %>,
  ],
  exports: [
    <%= docsComponent %>,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class Docs<%= classify(name) %>Module {
}
