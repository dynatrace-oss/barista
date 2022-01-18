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

import { DtConsumptionThemePalette } from '@dynatrace/barista-components/consumption';

@Component({
  selector: 'consumption-dev-app-demo',
  templateUrl: './consumption-demo.component.html',
  styleUrls: ['./consumption-demo.component.scss'],
})
export class ConsumptionDemo {
  max = 20;
  value = 5;
  color: DtConsumptionThemePalette = 'main';
  // eslint-disable-next-line no-magic-numbers
  defaultBreakdown = [
    { name: 'SAAS', value: 2 },
    { name: 'Full stack', value: 2 },
    { name: 'PAAS', value: 1 },
  ];

  warningMax = 130_500_000;
  warningValue = 120_000_000;
  warningColor: DtConsumptionThemePalette = 'warning';
  // eslint-disable-next-line no-magic-numbers
  warningBreakdown = [
    { name: 'Synthetic actions', value: 36_500_000 },
    { name: 'Sessions', value: 37_400_000 },
    { name: 'Sessions w/ replay data', value: 36_600_000 },
  ];

  errorMax = 8_000_000_000;
  errorValue = 8_000_000_000;
  errorColor: DtConsumptionThemePalette = 'error';

  noOverlayMax = 55_000_000;
  noOverlayValue = 45_600_000;
  noOverlayColor: DtConsumptionThemePalette = 'main';
}
