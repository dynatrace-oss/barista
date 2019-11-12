import { Component } from '@angular/core';

import { DtOverlayConfig } from '@dynatrace/angular-components/overlay';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <span
      [dtOverlay]="overlay"
      style="cursor: pointer;"
      [dtOverlayConfig]="config"
    >
      Hover me to show the overlay
    </span>
    <!-- prettier-ignore -->
    <ng-template #overlay>
      <div class="overlay-example-content-wrapper">
        <p>favicon_orange_plane.ico</p>
        <p>
          This resource was requested <strong>1.00 times per user action
          for a total of 117 calls.</strong> Detailed timings are available
          for <strong>100% of these calls</strong>.
        </p>
        <p>Overall</p>
        <dt-key-value-list>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Count</dt-key-value-list-key>
            <dt-key-value-list-value>117</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Cached</dt-key-value-list-key>
            <dt-key-value-list-value>no</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Load time</dt-key-value-list-key>
            <dt-key-value-list-value>28.1 ms</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Started at</dt-key-value-list-key>
            <dt-key-value-list-value>737 ms</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Completed at</dt-key-value-list-key>
            <dt-key-value-list-value>756 ms</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Resource type</dt-key-value-list-key>
            <dt-key-value-list-value>image</dt-key-value-list-value>
          </dt-key-value-list-item>
        </dt-key-value-list>
        <p>Sizes</p>
        <dt-key-value-list>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Transferred size</dt-key-value-list-key>
            <dt-key-value-list-value>106 kB</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Encoded size</dt-key-value-list-key>
            <dt-key-value-list-value>106 kB</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Compressed</dt-key-value-list-key>
            <dt-key-value-list-value>no</dt-key-value-list-value>
          </dt-key-value-list-item>
        </dt-key-value-list>
        <button dt-button>See response details</button>
      </div>
    </ng-template>
  `,
  styles: [
    `
      ::ng-deep .overlay-example-content-wrapper {
        max-width: 300px;
      }
      ::ng-deep .overlay-example-content-wrapper p:first-child {
        margin-top: 0;
      }
      ::ng-deep .overlay-example-content-wrapper button {
        margin-top: 16px;
        margin-left: auto;
        display: block;
      }
    `,
  ],
})
export class OverlayComplexContentExample {
  config: DtOverlayConfig = {
    pinnable: true,
    originY: 'center',
  };
}
