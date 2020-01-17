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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { DtChartRange } from '@dynatrace/barista-components/chart';
import {
  DtDrawer,
  DtDrawerContainer,
} from '@dynatrace/barista-components/drawer';

import { DataService } from '../../services/data.service';
import { options } from '../chart/selection-area/chart-options';
import { Observable } from 'rxjs';

@Component({
  selector: 'dt-e2e-drawer',
  templateUrl: 'drawer.html',
})
export class DtE2EDrawer {
  openCount = 0;
  closeCount = 0;

  validRange = false;
  lastTimeframe: [number, number];

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

  @ViewChild('container', { static: true }) container: DtDrawerContainer;
  @ViewChild('drawer', { static: true }) drawer: DtDrawer;
  @ViewChild('toggleButton', { static: true }) drawerButton: ElementRef<
    HTMLButtonElement
  >;
  @ViewChild('openButton', { static: true }) openButton: ElementRef<
    HTMLButtonElement
  >;
  @ViewChild('closeButton', { static: true }) closeButton: ElementRef<
    HTMLButtonElement
  >;

  @ViewChild(DtChartRange, { static: false }) dtChartRange: DtChartRange;

  constructor(private _dataService: DataService) {}

  open(): void {
    this.openCount++;
  }
  close(): void {
    this.closeCount++;
  }

  onTimeframeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  closed(): void {
    this.lastTimeframe = [0, 0];
  }

  onTimeframeChanges(timeframe: [number, number] | number): void {
    if (Array.isArray(timeframe)) {
      this.lastTimeframe = timeframe;
    }
  }
}
