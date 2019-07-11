import { Component } from '@angular/core';
import { DtOverlayConfig } from '@dynatrace/angular-components/overlay';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <span
      [dtOverlay]="overlay"
      style="cursor: pointer;"
      [dtOverlayConfig]="config"
    >
      Hover me
    </span>
    <ng-template #overlay>
      <p>Overlay content</p>
    </ng-template>
  `,
})
export class OverlayDefaultExample {
  config: DtOverlayConfig = {
    pinnable: true,
    originY: 'center',
  };
}
