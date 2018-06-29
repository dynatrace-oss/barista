import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-icon name="agent"></dt-icon>`,
  styles: ['dt-icon { display: block; width: 40px; height: 40px; '],
})
@OriginalClassName('DefaultIconExample')
export class DefaultIconExample { }
