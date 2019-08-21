import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Inject,
  NgZone,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { isDefined } from '@dynatrace/angular-components/core';

import { DT_CHART_RESOLVER, DtChart, DtChartResolver } from '../chart';
import { DtChartTooltipData } from '../highcharts/highcharts-tooltip-types';

interface HighchartsPlotBackgroundInformation {
  x: number;
  y: number;
  height: number;
}

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
export class DtChartTooltip implements OnDestroy, AfterViewInit {
  @ContentChild(TemplateRef, { static: false }) _overlayTemplate: TemplateRef<
    any // tslint:disable-line:no-any
  >;

  private readonly _destroy = new Subject<void>();
  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _plotBackgroundInfo: HighchartsPlotBackgroundInformation;
  private _overlayRefDetachSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private _overlay: Overlay,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DT_CHART_RESOLVER)
    @Optional()
    @SkipSelf()
    private _resolveParentChart: DtChartResolver,
  ) {}

  ngAfterViewInit(): void {
    const parentChart = this._resolveParentChart();
    if (parentChart) {
      parentChart._isInViewport$
        .pipe(
          switchMap(isVisible =>
            isVisible ? parentChart.tooltipDataChange.asObservable() : of(null),
          ),
          takeUntil(this._destroy),
        )
        .subscribe(event => {
          this._ngZone.run(() => {
            // create the overlay here when the tooltip should be open
            // because we need to have the event information to attach the overlay to the correct element
            if (event && event.data && checkHasPointData(event.data)) {
              if (!isDefined(this._overlayRef)) {
                this._createOverlay(event.data, parentChart);
              } else {
                this._updateOverlayContext(event.data, parentChart);
              }
            } else {
              // dismiss if no data is given
              this._dismiss();
            }
          });
        });

      // handle dismissing an existing overlay when the overlay already exists and should be closed
      parentChart.tooltipOpenChange
        .pipe(takeUntil(this._destroy))
        .subscribe(opened => {
          this._ngZone.run(() => {
            if (!opened) {
              this._dismiss();
            }
          });
        });

      parentChart._plotBackground$
        .pipe(takeUntil(this._destroy))
        .pipe(filter(background => !!background))
        .subscribe(background => {
          const x = parseInt(background!.getAttribute('x')!, 10);
          const y = parseInt(background!.getAttribute('y')!, 10);
          const height = parseInt(background!.getAttribute('height')!, 10);
          this._plotBackgroundInfo = { x, y, height };
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this._overlayRefDetachSubscription.unsubscribe();
  }

  /** Create a new overlay for the tooltip */
  private _createOverlay(data: DtChartTooltipData, parentChart: DtChart): void {
    if (parentChart._chartObject) {
      const positionStrategy = this._overlay
        .position()
        .flexibleConnectedTo(this._getTooltipPosition(data, parentChart))
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
    }
  }

  /** Updates the overlay content */
  private _updateOverlayContext(
    data: DtChartTooltipData,
    parentChart: DtChart,
  ): void {
    if (this._portal && this._overlayRef) {
      this._portal.context.$implicit = data;
      const positionStrategy = this._overlay
        .position()
        .flexibleConnectedTo(this._getTooltipPosition(data, parentChart))
        .withPositions(DEFAULT_DT_CHART_TOOLTIP_POSITIONS);
      this._overlayRef.updatePositionStrategy(positionStrategy);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Dismisses the overlay and cleans up the ref */
  private _dismiss(): void {
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
  ): { x: number; y: number } {
    const containerElement: HTMLElement = chart.container.nativeElement;
    const containerElementBB = containerElement.getBoundingClientRect();
    const { x, y } = getHighchartsTooltipPosition(
      data,
      this._plotBackgroundInfo,
    );
    return {
      x: containerElementBB.left + x,
      y: containerElementBB.top + y,
    };
  }
}

function checkHasPointData(data: DtChartTooltipData): boolean {
  return !!data.points || !!data.point;
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
  plotBackgroundInfo: HighchartsPlotBackgroundInformation,
): { x: number; y: number } {
  const isPieChart = !isDefined(data.points);
  const hasAreaFirstSeries =
    data.points && data.points[0].point && !data.points[0].point.tooltipPos;
  let x: number;
  // set y position for all charts in the middle of the plotbackground vertically
  // tslint:disable-next-line:no-magic-numbers
  let y = plotBackgroundInfo.height / 2 + plotBackgroundInfo.y;
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
    x = point.tooltipPos![0] + plotBackgroundInfo.x;
  }

  return { x, y };
}
