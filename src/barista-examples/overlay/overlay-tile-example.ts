import { Component } from '@angular/core';

import { DtOverlayConfig } from '@dynatrace/angular-components/overlay';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-tile color="main" [dtOverlay]="overlay">
      <dt-tile-icon><dt-icon name="loadaction"></dt-icon></dt-tile-icon>
      <dt-tile-title>Loading of page/special-offers.jsp</dt-tile-title>
      Hover me to see more details
    </dt-tile>
    <!-- prettier-ignore -->
    <ng-template #overlay>
      <div class="overlay-example-content-wrapper">
        <p>Loading of page/special-offers.jsp</p>
        <dt-key-value-list>
          <dt-key-value-list-item>
            <dt-key-value-list-key>User action duration</dt-key-value-list-key>
            <dt-key-value-list-value>4.9s</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>User actions</dt-key-value-list-key>
            <dt-key-value-list-value>2.5/min</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Apdex rating</dt-key-value-list-key>
            <dt-key-value-list-value dtIndicator dtIndicatorColor="error">
              <dt-icon name="smiley-enraged-2" dtIndicator dtIndicatorColor="error"></dt-icon>
              0.47
            </dt-key-value-list-value>
          </dt-key-value-list-item>
        </dt-key-value-list>
      </div>
    </ng-template>
  `,
  styles: [
    `
      ::ng-deep .overlay-example-content-wrapper p {
        margin-top: 0;
      }
      ::ng-deep .overlay-example-content-wrapper dt-icon {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
      }
    `,
  ],
})
export class OverlayTileExample {
  config: DtOverlayConfig = {
    pinnable: true,
    originY: 'center',
  };
}
