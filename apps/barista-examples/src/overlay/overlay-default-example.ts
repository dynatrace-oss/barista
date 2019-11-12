import { Component } from '@angular/core';

import { DtOverlayConfig } from '@dynatrace/barista-components/overlay';

@Component({
  selector: 'component-barista-example',
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
