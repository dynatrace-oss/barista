import { NgModule } from '@angular/core';
import { Dt<%= classify(name) %> } from './<%= name %>';

@NgModule({
  exports: [
    Dt<%= classify(name) %>,
  ],
  declarations: [
    Dt<%= classify(name) %>,
  ],
})
export class Dt<%= classify(name) %>Module { }
