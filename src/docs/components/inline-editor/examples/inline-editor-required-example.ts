import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor required
      [(ngModel)]="sampleModel">
    </em>
    <span>model: <code>{{ sampleModel }}</code></span>
  `,
})
@OriginalClassName('RequiredInlineEditorExample')
export class RequiredInlineEditorExample {
  sampleModel = 'text content';
}
