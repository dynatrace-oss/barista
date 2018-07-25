import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <button [dtOverlay]="overlay" tabindex="0">Custom config</button>
    <ng-template #overlay>
      <p>Overlay content 1</p>
    </ng-template>
  `,
})
export class DefaultOverlayExampleComponent {

}
