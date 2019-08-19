import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '<%= dasherize(name) %>-demo',
  template: '<<%= selector %>></<%= selector %>>',
})
export class <%= classify(name) %>DefaultExample {}
