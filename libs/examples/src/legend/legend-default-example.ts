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

@Component({
  selector: 'legend-default-example',
  template: `
    <dt-legend>
      <dt-legend-item>
        <dt-legend-symbol>
          <dt-icon name="chart-legend-bar"></dt-icon>
        </dt-legend-symbol>
        Requests
      </dt-legend-item>
      <dt-legend-item>
        <dt-legend-symbol>
          <dt-icon name="chart-legend-line"></dt-icon>
        </dt-legend-symbol>
        Failed Requests
      </dt-legend-item>
    </dt-legend>
  `,
  styles: [
    `
      dt-icon {
        vertical-align: -5px;
        width: 16px;
      }
    `,
  ],
})
export class DefaultLegendExample {}
