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
  selector: 'dt-example-consumption-warning',
  templateUrl: 'consumption-warning-example.html',
})
export class DtExampleConsumptionWarning {
  max = 120_000_000;
  value = 130_500_000;

  free = 20_000_000;
  quota = 100_000_000;
  flexibleOverages = 10_500_000;

  breakdown = [
    { name: 'Synthetic actions', value: 36_500_000 },
    { name: 'Sessions', value: 37_400_000 },
    { name: 'Sessions w/ replay data', value: 36_600_000 },
  ];
}
