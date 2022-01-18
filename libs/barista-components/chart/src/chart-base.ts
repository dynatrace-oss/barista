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

import { ElementRef } from '@angular/core';
import { Chart } from 'highcharts';
import { BehaviorSubject, Subject } from 'rxjs';
import type { DtChartFocusTarget } from './chart-focus-anchor';
import type { DtChartRange } from './range/range';
import type { DtChartTimestamp } from './timestamp/timestamp';

export abstract class DtChartBase {
  _elementRef: ElementRef;

  readonly _afterRender: Subject<void>;

  _plotBackground$: BehaviorSubject<SVGRectElement | null>;

  _range?: DtChartRange;

  _timestamp?: DtChartTimestamp;

  _chartObject: Chart | null;

  _plotBackgroundChartOffset = 0;

  _container: ElementRef<HTMLElement>;

  _focusTargets: Set<DtChartFocusTarget>;
}
