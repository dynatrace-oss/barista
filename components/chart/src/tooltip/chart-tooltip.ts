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
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  ElementRef,
  Inject,
  Optional,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import {
  isDefined,
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
  dtSetUiTestAttribute,
} from '@dynatrace/barista-components/core';

import { DtChart } from '../chart';
import { DtChartTooltipData } from '../highcharts/highcharts-tooltip-types';
import { PlotBackgroundInfo } from '../utils';

/** Default horizontal offset for the tooltip */
const DT_CHART_TOOLTIP_DEFAULT_OFFSET = 10;

/** Positions for the chart tooltip  */
const DEFAULT_DT_CHART_TOOLTIP_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -DT_CHART_TOOLTIP_DEFAULT_OFFSET,
  },
  {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: DT_CHART_TOOLTIP_DEFAULT_OFFSET,
  },
];

@Component({
  selector: 'dt-chart-tooltip',
  exportAs: 'dtChartTooltip',
  template: '<ng-content></ng-content>',
  host: {
    class: 'dt-chart-tooltip',
  },
  styleUrls: ['chart-tooltip.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class DtChartTooltip implements OnDestroy {
  /** @internal Reference to the overlay template */
  @ContentChild(TemplateRef)
  _overlayTemplate: TemplateRef<void>;

  private readonly _destroy = new Subject<void>();
  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _overlayRefDetachSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {}

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this._overlayRefDetachSubscription.unsubscribe();
  }

  /** @internal Create a new overlay for the tooltip (triggered by the chart) */
  _createOverlay(
    data: DtChartTooltipData,
    parentChart: DtChart,
    plotBackgroundInfo: PlotBackgroundInfo,
  ): void {
    // We check for data.points and data.point property since with pie / donut charts we need
    if (parentChart._chartObject && data && (data.points || data.point)) {
      const positionStrategy = this._overlay
        .position()
        .flexibleConnectedTo(
          this._getTooltipPosition(data, parentChart, plotBackgroundInfo),
        )
        .withPositions(DEFAULT_DT_CHART_TOOLTIP_POSITIONS);

      const overlayConfig = new OverlayConfig({
        positionStrategy,
        backdropClass: 'dt-no-pointer',
        hasBackdrop: true,
        panelClass: ['dt-chart-tooltip-overlay', 'dt-no-pointer'],
        scrollStrategy: this._overlay.scrollStrategies.close(),
      });

      const overlayRef = this._overlay.create(overlayConfig);
      // tslint:disable-next-line:no-any
      this._portal = new TemplatePortal<any>(
        this._overlayTemplate,
        this._viewContainerRef,
        { $implicit: data },
      );
      this._overlayRefDetachSubscription.unsubscribe();
      this._overlayRefDetachSubscription = overlayRef
        .detachments()
        .subscribe(() => {
          parentChart._resetHighchartsPointer();
        });
      overlayRef.attach(this._portal);

      this._overlayRef = overlayRef;
      dtSetUiTestAttribute(
        this._overlayRef.overlayElement,
        this._overlayRef.overlayElement.id,
        this._elementRef,
        this._config,
      );
    }
  }

  /** @internal Updates the overlay content (triggered by the chart) */
  _updateOverlayContext(
    data: DtChartTooltipData,
    parentChart: DtChart,
    plotBackgroundInfo: PlotBackgroundInfo,
  ): void {
    if (this._portal && this._overlayRef) {
      this._portal.context.$implicit = data;
      const positionStrategy = this._overlay
        .position()
        .flexibleConnectedTo(
          this._getTooltipPosition(data, parentChart, plotBackgroundInfo),
        )
        .withPositions(DEFAULT_DT_CHART_TOOLTIP_POSITIONS);
      this._overlayRef.updatePositionStrategy(positionStrategy);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal Dismisses the overlay and cleans up the ref (triggered by the chart) */
  _dismiss(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  /**
   * Calculate an origin point that can be used to position the tooltip.
   */
  private _getTooltipPosition(
    data: DtChartTooltipData,
    chart: DtChart,
    plotBackgroundInfo: PlotBackgroundInfo,
  ): { x: number; y: number } {
    const containerElement: HTMLElement = chart._container.nativeElement;
    const containerElementBB = containerElement.getBoundingClientRect();
    const { x, y } = getHighchartsTooltipPosition(data, plotBackgroundInfo);
    return {
      x: containerElementBB.left + x,
      y: containerElementBB.top + y,
    };
  }
}

/**
 * highcharts provides the tooltip position differently depending on the series type
 * Pie chart: data.point.point.tooltipPos[x, y]
 * Category: data.points[0].point.tooltipPos[x, whatever, whatever]
 * Mixed multiple series(line, column): data.points[0].point.tooltipPos[x, whatever, whatever]
 * Area as first: data.points[0].point.x => xAxis.toPixel(x)
 */
function getHighchartsTooltipPosition(
  data: DtChartTooltipData,
  plotBackgroundInfo: PlotBackgroundInfo,
): { x: number; y: number } {
  const isPieChart = !isDefined(data.points);
  const hasAreaFirstSeries =
    data.points && data.points[0].point && !data.points[0].point.tooltipPos;
  let x: number;
  // set y position for all charts in the middle of the plotbackground vertically
  // tslint:disable-next-line:no-magic-numbers
  let y = plotBackgroundInfo.height / 2 + plotBackgroundInfo.top;
  if (isPieChart) {
    const tooltipPos = data.point!.point.tooltipPos;
    x = tooltipPos![0];
    // override the y position for pie charts
    y = tooltipPos![1];
  } else if (hasAreaFirstSeries) {
    const point = data.points![0].point;
    const xAxis = data.points![0].series.xAxis;
    x = xAxis.toPixels(point.x);
  } else {
    const point = data.points![0].point;
    x = point.tooltipPos![0] + plotBackgroundInfo.left;
  }

  return { x, y };
}
