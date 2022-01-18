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

import { AfterContentInit, Component, Input, TemplateRef } from '@angular/core';
import { DtOverlayTrigger } from '@dynatrace/barista-components/overlay';
import { DtColors } from '@dynatrace/barista-components/theming';
import { DtRadialChartRenderData } from './utils/radial-chart-interfaces';

export interface DtRadialChartOverlayData {
  name: string;
  value: number;
  totalValue: number;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg:g[dt-radial-chart-path]',
  templateUrl: 'radial-chart-path.html',
  styleUrls: ['radial-chart-path.scss'],
  host: {
    '[class.dt-radial-chart-path-selected]': 'series.origin.selected',
    '(mouseenter)': 'overlayTemplate && _handleMouseEnter($event)',
    '(mouseleave)': 'overlayTemplate && _handleMouseLeave($event)',
  },
})
export class DtRadialChartPath
  extends DtOverlayTrigger<{ $implicit: DtRadialChartOverlayData }>
  implements AfterContentInit
{
  /**
   * @internal
   * All data needed to render the path that visualizes
   * the given series.
   */
  @Input() series: DtRadialChartRenderData;

  /**
   * @internal
   * The sum of all series values.
   * Needed to display this value as additional information
   * in the overlay.
   */
  @Input() totalValue: number;

  /**
   * @internal
   * The template ref for the overlay template.
   * Overlay is displayed when hovering over
   * the chart series.
   */
  @Input() overlayTemplate: TemplateRef<{
    $implicit: DtRadialChartOverlayData;
  }>;

  ngAfterContentInit(): void {
    if (this.overlayTemplate) {
      this.overlay = this.overlayTemplate;
      this.dtOverlayConfig = {
        data: {
          name: this.series.name,
          value: this.series.value,
          totalValue: this.totalValue,
        },
      };
    }
  }

  /** @internal Get slice color based on its status */
  get color(): string {
    return this.series.origin.active ? this.series.color : DtColors.GRAY_100;
  }
}
