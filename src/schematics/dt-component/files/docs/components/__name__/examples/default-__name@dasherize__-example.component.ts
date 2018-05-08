import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: 'Default example for <%= dasherize(name) %>',
})
export class Default<%= classify(name) %>ExampleComponent { }
