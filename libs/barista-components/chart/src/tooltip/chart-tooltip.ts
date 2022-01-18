/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  FlexibleConnectedPositionStrategy,
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
  ElementRef,
  Inject,
  OnDestroy,
  Optional,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import {
  DT_UI_TEST_CONFIG,
  dtSetUiTestAttribute,
  DtUiTestConfiguration,
} from '@dynatrace/barista-components/core';

import { DtChart } from '../chart';
import { DtChartTooltipData } from '../highcharts/highcharts-tooltip-types';
import { DtPlotBackgroundInfo } from '../utils';
import {
  DT_CHART_DEFAULT_TOOLTIP_POSITIONS,
  DT_CHART_TOOLTIP_CONFIG,
  DtChartTooltipConfig,
  getDefaultTooltipPosition,
} from './chart-tooltip-position';

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
    @Inject(DT_CHART_TOOLTIP_CONFIG)
    private _chartTooltipConfig?: DtChartTooltipConfig,
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
    data: DtChartTooltipData | undefined,
    parentChart: DtChart,
    plotBackgroundInfo: DtPlotBackgroundInfo,
  ): void {
    // We check for data.points and data.point property since with pie / donut charts we need
    if (parentChart._chartObject && data && (data.points || data.point)) {
      const overlayConfig = new OverlayConfig({
        positionStrategy: this._getPositionStrategy(
          data,
          parentChart,
          plotBackgroundInfo,
        ),
        backdropClass: 'dt-no-pointer',
        hasBackdrop: true,
        panelClass: ['dt-chart-tooltip-overlay', 'dt-no-pointer'],
        scrollStrategy: this._overlay.scrollStrategies.close(),
      });

      const overlayRef = this._overlay.create(overlayConfig);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    data: DtChartTooltipData | undefined,
    parentChart: DtChart,
    plotBackgroundInfo: DtPlotBackgroundInfo,
  ): void {
    if (this._portal && this._overlayRef && data) {
      this._portal.context.$implicit = data;
      const positionStrategy = this._getPositionStrategy(
        data,
        parentChart,
        plotBackgroundInfo,
      );
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

  /** Returns the positionstrategy being used for the tooltip - either the default one or if a config is provided a custom position function */
  private _getPositionStrategy(
    data: DtChartTooltipData,
    parentChart: DtChart,
    plotBackgroundInfo: DtPlotBackgroundInfo,
  ): FlexibleConnectedPositionStrategy {
    const positioner =
      this._chartTooltipConfig?.positionFunction !== undefined
        ? this._chartTooltipConfig.positionFunction(
            data,
            parentChart,
            plotBackgroundInfo,
          )
        : getDefaultTooltipPosition(data, parentChart, plotBackgroundInfo);

    return this._overlay
      .position()
      .flexibleConnectedTo(positioner)
      .withPositions(DT_CHART_DEFAULT_TOOLTIP_POSITIONS);
  }
}
