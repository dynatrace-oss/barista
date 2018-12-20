import {
  Component,
  SkipSelf,
  Inject,
  forwardRef,
  TemplateRef,
  ContentChild,
  NgZone,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { DtChart } from '../chart';
import { DtOverlay, DtOverlayRef } from '@dynatrace/angular-components/overlay';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { DtChartTooltipData } from '../highcharts/highcharts-tooltip-types';

/** Default horizontal offset for the tooltip */
const DT_CHART_TOOLTIP_DEFAULT_OFFSET = 30;

/** Positions for the chart tooltip  */
const DEFAULT_DT_CHART_TOOLTIP_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -DT_CHART_TOOLTIP_DEFAULT_OFFSET,
  },
  {
    originX: 'end',
    originY: 'top',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
})
export class DtChartTooltip<T> implements OnDestroy {
  @ContentChild(TemplateRef) overlay: TemplateRef<T>;

  private readonly _destroy = new Subject<void>();
  private _dtOverlayRef: DtOverlayRef<T> | null;
  private _origin: SVGCircleElement | null;

  constructor(
    private _dtOverlay: DtOverlay,
    private _ngZone: NgZone,
    private _renderer: Renderer2,
    @Inject(forwardRef(() => DtChart)) @SkipSelf() private _parentChart: DtChart
  ) {
    if (this._parentChart) {
      this._parentChart.tooltipDataChange.pipe(takeUntil(this._destroy))
      .subscribe((event) => {
        this._ngZone.run(() => {
          // create the overlay here when the tooltip should be open
          // because we need to have the event information to attach the overlay to the correct element
          if (event && event.data && checkHasPointData(event.data)) {
              this._createOverlay(event.data);
          } else {
            // dismiss if no data is given
            this._dismiss();
          }
        });
      });
      // handle dismissing an existing overlay when the overlay already exists and should be closed
      this._parentChart.tooltipOpenChange.pipe(takeUntil(this._destroy))
      .subscribe((opened) => {
        this._ngZone.run(() => {
          if (!opened) {
            this._dismiss();
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Create a new overlay for the tooltip */
  private _createOverlay(data: DtChartTooltipData): void {
    if (this._origin) {
      this._renderer.removeChild(this._origin.parentNode, this._origin);
      this._origin = null;
    }
    this._origin = createOriginPoint(this._parentChart, this._renderer, data);
    this._dtOverlayRef = this._dtOverlay.create<T>(
      this._origin,
      this.overlay,
      { data, _positions: DEFAULT_DT_CHART_TOOLTIP_POSITIONS });
    this._dtOverlayRef.updatePosition(0, 0);
  }

  /** Dismisses the overlay and cleans up the ref */
  private _dismiss(): void {
    if (this._dtOverlayRef) {
      this._dtOverlayRef.dismiss();
      this._dtOverlayRef = null;
    }
  }
}

function checkHasPointData(data: DtChartTooltipData): boolean {
  return !!data.points || !!data.point;
}

function createOriginPoint(chart: DtChart, renderer: Renderer2, data: DtChartTooltipData): SVGCircleElement {
  const circle: SVGCircleElement = renderer.createElement('circle', 'svg');
  const xAxis = data.points ? data.points[0].series.xAxis : data.point!.series.xAxis;
  const yAxis = data.points ? data.points[0].series.yAxis : data.point!.series.yAxis;
  const x = data.points ? data.points[0].x : data.point!.x;
  const y = data.points ? data.points[0].y : data.point!.y;
  let xPixel;
  let yPixel;
  if (xAxis) {
    xPixel = xAxis.toPixels(x);
    yPixel = yAxis.toPixels(y);
  } else {
    // is Pie chart
    const tooltipPos = data.point!.point.tooltipPos;
    xPixel = tooltipPos[0];
    yPixel = tooltipPos[1];
  }
  renderer.setAttribute(circle, 'class', 'dt-tooltip-position-marker');
  renderer.setAttribute(circle, 'cx', xPixel.toString());
  renderer.setAttribute(circle, 'cy', yPixel.toString());
  renderer.setAttribute(circle, 'r', '1');
  renderer.setAttribute(circle, 'fill', 'transparent');
  renderer.appendChild(chart._chartObject.container.querySelector('svg'), circle);
  return circle;
}
