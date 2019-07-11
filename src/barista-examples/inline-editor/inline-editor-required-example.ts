import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <em
      dt-inline-editor
      required
      [(ngModel)]="sampleModel"
      aria-label-save="Save text"
      aria-label-cancel="Cancel and discard changes"
    >
      <dt-error>Empty value not accepted!</dt-error>
    </em>
    <span>
      model:
      <code>{{ sampleModel }}</code>
    </span>
  `,
})
export class InlineEditorRequiredExample {
  sampleModel = 'text content';
}
