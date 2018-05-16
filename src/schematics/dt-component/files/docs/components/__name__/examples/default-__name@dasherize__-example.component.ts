import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: '<<%= selector %>></<%= selector %>>',
})
export class Default<%= classify(name) %>ExampleComponent { }
