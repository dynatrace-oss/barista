import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(name) %>-barista-example',
  template: `
    <<%= selector %>></<%= selector %>>
  `,
})
export class <%= classify(name) %>DefaultExample {}
