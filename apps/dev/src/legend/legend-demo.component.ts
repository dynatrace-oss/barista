/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  selector: 'legend-dev-app-demo',
  template: `
    <dt-legend>
      <dt-legend-item>
        <dt-legend-symbol class="dt-timeline-chart-legend-symbol">
          R
        </dt-legend-symbol>
        <ng-template dtLegendOverlay>Overlay text</ng-template>
        Request start at 0.02s
      </dt-legend-item>
      <dt-legend-item>
        <dt-legend-symbol class="dt-timeline-chart-legend-symbol">
          S
        </dt-legend-symbol>
        Speed index 0.04s
      </dt-legend-item>
      <dt-legend-item>
        <dt-legend-symbol class="dt-timeline-chart-legend-symbol">
          I
        </dt-legend-symbol>
        Dom interactive 0.17s
        <ng-template dtLegendOverlay>Overlay 2</ng-template>
      </dt-legend-item>
      <dt-legend-item>
        <dt-legend-symbol class="dt-timeline-chart-legend-symbol">
          L
        </dt-legend-symbol>
        Load event start 0.37s
      </dt-legend-item>
    </dt-legend>
  `,
  styles: [
    `
      .dt-timeline-chart-legend-symbol {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        color: #fff;
        background: #525252;
        font-size: 10px;
        font-weight: bold;
        line-height: 16px;
        text-align: center;
      }
    `,
  ],
})
export class LegendDemo {}
