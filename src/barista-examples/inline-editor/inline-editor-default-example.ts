import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      aria-label-save="Save text"
      aria-label-cancel="Cancel and discard changes">
    </em>
    <span>model: <code>{{ sampleModel }}</code></span>
  `,
})
export class DefaultInlineEditorExample {
  sampleModel = 'text content';
}
