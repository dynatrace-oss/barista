import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<input type="text" dtInput placeholder="Please insert text"/>`,
})
@OriginalClassName('DefaultInputExample')
export class DefaultInputExample { }
