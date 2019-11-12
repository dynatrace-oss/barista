import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <button dt-button disabled>
      <dt-loading-spinner></dt-loading-spinner>
      Waiting for response
    </button>
    <button dt-button disabled variant="secondary">
      <dt-loading-spinner></dt-loading-spinner>
      Waiting for response
    </button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class ButtonLoadingSpinnerExample {}
