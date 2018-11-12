import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <button dt-loading-button disabled><dt-loading-spinner></dt-loading-spinner>Waiting for response</button>
  <button dt-loading-button disabled variant="secondary"><dt-loading-spinner></dt-loading-spinner>Waiting for response</button>`,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('LoadingSpinnerButtonExampleComponent')
export class LoadingSpinnerButtonExampleComponent {}
