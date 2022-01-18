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

import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  TemplateRef,
  ElementRef,
  NgZone,
  AfterContentInit,
} from '@angular/core';
import {
  DtOverlay,
  DtOverlayTrigger,
} from '@dynatrace/barista-components/overlay';
import { DtSunburstChartNodeSlice } from './sunburst-chart.util';

export interface DtSunburstChartOverlayData {
  label: string;
  value: number;
}

/**
 * @internal
 * Slice, label, value and selection for sunburst-chart
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg:g[dt-sunburst-chart-segment]',
  templateUrl: 'sunburst-chart-segment.html',
  styleUrls: ['sunburst-chart-segment.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dt-sunburst-chart-segment',
  host: {
    '(mouseenter)': 'overlayTemplate && _handleMouseEnter($event)',
    '(mouseleave)': 'overlayTemplate && _handleMouseLeave($event)',
  },
})
export class DtSunburstChartSegment
  extends DtOverlayTrigger<{
    $implicit: Partial<DtSunburstChartOverlayData>;
  }>
  implements AfterContentInit
{
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

  /** @internal Defines the maxlength for the nodes labels. */
  @Input() truncateLabelBy: number;

  /**
   * @internal
   * The template ref for the overlay template.
   * Overlay is displayed when hovering over
   * the chart series.
   */

  @Input() overlayTemplate: TemplateRef<{
    $implicit: Partial<DtSunburstChartOverlayData>;
  }>;

  elementReference: ElementRef;

  constructor(
    elementRef: ElementRef,
    overlay: DtOverlay,
    zone: NgZone,
    focusMonitor: FocusMonitor,
    platform: Platform,
  ) {
    super(elementRef, overlay, zone, focusMonitor, '0', platform);
    this.elementReference = elementRef;
  }

  ngAfterContentInit(): void {
    if (this.overlayTemplate) {
      this.overlay = this.overlayTemplate;
      this.dtOverlayConfig = {
        data: {
          ...this.slice.data,
          label: this.slice.data.origin.label,
          value: this.slice.value,
        },
      };
    }
  }
}
