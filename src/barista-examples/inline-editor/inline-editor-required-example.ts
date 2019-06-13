import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <em dt-inline-editor required
      [(ngModel)]="sampleModel">
      <dt-error>Empty value not accepted!</dt-error>
    </em>
    <span>model: <code>{{ sampleModel }}</code></span>
  `,
})
export class RequiredInlineEditorExample {
  sampleModel = 'text content';
}
