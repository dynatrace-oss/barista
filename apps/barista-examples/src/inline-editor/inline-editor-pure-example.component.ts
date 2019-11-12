import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <em
      dt-inline-editor
      [(ngModel)]="sampleModel"
      aria-label-save="Save text"
      aria-label-cancel="Cancel and discard changes"
    ></em>
  `,
})
export class InlineEditorPureExample {
  sampleModel = 'test';
}
