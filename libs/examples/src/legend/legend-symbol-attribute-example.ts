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
  selector: 'legend-symbol-attribute-example',
  template: `
    <dt-legend>
      <dt-legend-item>
        <dt-icon dtLegendSymbol name="chart-legend-bar"></dt-icon>
        Requests
      </dt-legend-item>
      <dt-legend-item>
        <dt-icon dtLegendSymbol name="chart-legend-line"></dt-icon>
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
export class SymbolAttributeLegendExample {}
