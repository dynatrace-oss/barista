import { Component } from '@angular/core';

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
