import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '<%= dasherize(component) %>-<%= dasherize(name) %>-barista-example',
  template: `
    <<%= selector %>></<%= selector %>>
  `,
})
export class <%= classify(component) %><%= classify(name) %>Example {}
