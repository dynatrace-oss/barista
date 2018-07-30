import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <span [dtOverlay]="overlay">Hover me</span>
  <ng-template #overlay>
    <p>Overlay content</p>
  </ng-template>
  `,
})
@OriginalClassName('DefaultOverlayExampleComponent')
export class DefaultOverlayExampleComponent {}
