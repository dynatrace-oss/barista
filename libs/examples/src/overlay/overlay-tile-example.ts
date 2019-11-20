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
