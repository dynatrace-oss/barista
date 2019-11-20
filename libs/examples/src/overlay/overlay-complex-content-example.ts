/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
