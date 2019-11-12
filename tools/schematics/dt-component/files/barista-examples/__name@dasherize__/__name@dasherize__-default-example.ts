import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '<%= dasherize(name) %>-barista-example',
  template: `
    <<%= selector %>></<%= selector %>>
  `,
})
export class <%= classify(name) %>DefaultExample {}
