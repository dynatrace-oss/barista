import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: '<dt-<%= component %>></dt-<%= component %>>',
})
export class <%= classify(name) %><%= classify(component) %>ExampleComponent { }
