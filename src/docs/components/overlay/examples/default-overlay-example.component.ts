import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <button [dtOverlay]="overlay" tabindex="0" [dtOverlayConfig]="{enableClick: true, scrollStrategyType: 'block', positions: [{originX: 'start',originY: 'bottom',overlayX: 'start',overlayY: 'top'}]}">Custom config with click</button>
    <ng-template #overlay>
      <p>Overlay content 1</p>
    </ng-template>
  `,
})
export class DefaultOverlayExampleComponent {

}
