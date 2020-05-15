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

import {
  Component,
  Input,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DtSunburstChartNodeSlice } from './sunburst-chart.util';

/**
 * @internal
 * Slice, label, value and selection for sunburst-chart
 */
@Component({
  selector: 'svg:g[dt-sunburst-chart-segment]',
  templateUrl: 'sunburst-chart-segment.html',
  styleUrls: ['sunburst-chart-segment.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dt-sunburst-chart-segment',
})
export class DtSunburstChartSegment {
  /**
   * @internal
   * All data needed to render the path that visualizes
   * the given series.
   */
  @Input() slice: DtSunburstChartNodeSlice;

  /**
   * @internal
   * Marks if absolute value should be shown or percent instead
   */
  @Input() valueAsAbsolute: boolean;

  /**
   * @param elementRef Used by parent to get HTMLElement
   */
  constructor(public elementRef: ElementRef) {}
}
