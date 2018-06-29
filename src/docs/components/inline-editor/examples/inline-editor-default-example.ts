import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel">
    </em>
    <span>model: <code>{{ sampleModel }}</code></span>
  `,
})
@OriginalClassName('DefaultInlineEditorExample')
export class DefaultInlineEditorExample {
  sampleModel = 'text content';
}
