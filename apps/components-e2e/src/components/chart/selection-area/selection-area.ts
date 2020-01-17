/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

// tslint:disable no-magic-numbers
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { DataService } from '../../../services/data.service';
import { options } from './chart-options';
import { Observable } from 'rxjs';

@Component({
  selector: 'dt-e2e-selection-area',
  templateUrl: './selection-area.html',
  styles: [
    `
      :host {
        display: block;
        width: 1200px;
      }
    `,
  ],
})
export class DtE2ESelectionArea {
  validRange = false;

  options = options;
  // Added type here due to missing support for type inference on windows with typescript 3.4.5
  // error TS2742: The inferred type of 'series$' cannot be named without a reference to '...@types/highcharts'.
  // This is likely not portable. A type annotation is necessary.
  series$: Observable<
    Highcharts.IndividualSeriesOptions[]
  > = this._dataService
    .getFixture<{ data: Highcharts.IndividualSeriesOptions[] }>(
      '/data-small.json',
    )
    .pipe(map(result => result.data));

  constructor(private _dataService: DataService) {}

  rangeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  closed(): void {
    // emits when the selection gets closed
  }

  valueChanges(_value: number | [number, number]): void {
    // emits when the value changes
  }
}
