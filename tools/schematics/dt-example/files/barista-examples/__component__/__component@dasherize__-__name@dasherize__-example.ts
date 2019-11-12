import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(component) %>-<%= dasherize(name) %>-barista-example',
  template: `
    <<%= selector %>></<%= selector %>>
  `,
})
export class <%= classify(component) %><%= classify(name) %>Example {}
