import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<<%= selector %>></<%= selector %>>',
})
@OriginalClassName('Default<%= classify(name) %>ExampleComponent')
export class Default<%= classify(name) %>ExampleComponent { }
