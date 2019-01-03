import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: '<dt-<%= dasherize(component) %>></dt-<%= dasherize(component) %>>',
})
export class <%=classify(exampleComponentName) %> { }
