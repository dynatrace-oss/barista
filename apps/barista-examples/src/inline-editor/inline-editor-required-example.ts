import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
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
