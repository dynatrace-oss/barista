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
export class DefaultInlineEditorExample {
  sampleModel = 'text content';
}
