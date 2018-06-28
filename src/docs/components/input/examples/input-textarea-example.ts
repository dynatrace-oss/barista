import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<textarea dtInput placeholder="Please insert text"></textarea>`,
})
@OriginalClassName('TextareaInputExample')
export class TextareaInputExample { }
