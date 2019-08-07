import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { DT_CHART_COLOR_PALETTE_ORDERED } from '@dynatrace/angular-components/chart';
import {
  DtViewportResizer,
  isNumber,
} from '@dynatrace/angular-components/core';
import { PieArcDatum } from 'd3-shape';
import { combineLatest, of, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { DtRadialChartSeries } from './radial-chart-series';
import { DtRadialChartRenderData } from './utils/radial-chart-interfaces';
import {
  generatePathData,
  generatePieArcData,
  getSum,
} from './utils/radial-chart-utils';

/** Size of the inner (empty) circle in proportion to the circle's radius. */
const DONUT_INNER_CIRCLE_FRACTION = 0.8;

@Component({
  moduleId: module.id,
  selector: 'dt-radial-chart',
  exportAs: 'dtRadialChart',
  templateUrl: 'radial-chart.html',
  styleUrls: ['radial-chart.scss'],
  host: {
    class: 'dt-radial-chart',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtRadialChart implements AfterViewInit, OnDestroy {
  /**
   * The chart type. Can either be 'pie' or 'donut'.
   * Defaults to 'pie'.
   */
  @Input()
  get type(): 'pie' | 'donut' {
    return this._type;
  }
  set type(value: 'pie' | 'donut') {
    if (value && value !== this._type) {
      this._type = value;
      this._updateRenderData();
    }
  }
  private _type: 'pie' | 'donut' = 'pie';

  /** Maximum value the chart displays, 100%, full circle */
  @Input()
  get maxValue(): number | null {
    return this._maxValue;
  }
  set maxValue(value: number | null) {
    this._maxValue = coerceNumberProperty(value);
    this._updateRenderData();
  }
  private _maxValue: number | null = null;

  /** Where the circle should start, default is 0 which is on top. */
  @Input()
  get start(): number {
    return this._start;
  }
  set start(value: number) {
    this._start = coerceNumberProperty(value);
    this._updateRenderData();
  }
  private _start = 0;

  /** @internal Series data, <dt-radial-chart-series> */
  @ContentChildren(DtRadialChartSeries) _radialChartSeries: QueryList<
    DtRadialChartSeries
  >;

  /** @internal Render data used to draw the SVG. */
  _renderData: DtRadialChartRenderData[] = [];

  /** @internal Destroy subject to clear subscriptions on component destroy. */
  private readonly _destroy = new Subject<void>();

  /** @internal The chart's width based on the viewport width. */
  _width = 0;

  /** @internal The chart's radius. */
  get _radius(): number {
    // tslint:disable-next-line: no-magic-numbers
    return this._width / 2;
  }

  /** @internal Sum of all series values. */
  _totalValue: number;

  /**
   * @internal
   * Flag if a background shape should be rendered.
   * Depends on difference of the given and the calculated max value.
   */
  _hasBackground = false;

  /**
   * @internal
   * The background path is either a full circle or a ring.
   * Depends on the chart type.
   */
  _backgroundPath: string;

  /**
   * @internal
   * Get viewbox data based on the radius and width.
   * Adjust the viewbox to center the circle.
   */
  get _viewBox(): string {
    return `${-this._width / 2} ${-this._width / 2} ${this._width} ${
      this._width
    }`;
  }

  /** @internal The chart's inner radius based on the chart type and defined fraction. */
  get _innerRadius(): number {
    return this.type === 'pie' ? 0 : this._radius * DONUT_INNER_CIRCLE_FRACTION;
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    /**
     * Fires every time a value within one of the series changes
     * or the series data itself gets an update (one series is added or removed).
     */
    this._radialChartSeries.changes
      .pipe(
        takeUntil(this._destroy),
        startWith(null),
        switchMap(() =>
          this._radialChartSeries.length
            ? combineLatest(
                this._radialChartSeries.map(series => series._stateChanges),
              )
            : of(null),
        ),
      )
      .subscribe((): void => {
        Promise.resolve().then(() => {
          this._updateRenderData();
        });
      });

    /**
     * Fires every time the viewport size changes and applies the new width of the chart.
     */
    this._viewportResizer
      .change()
      .pipe(
        takeUntil(this._destroy),
        startWith(null),
      )
      .subscribe(() => {
        Promise.resolve().then(() => {
          this._width = this._elementRef.nativeElement.getBoundingClientRect().width;
          this._updateRenderData();
        });
      });
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /**
   * Updates _renderData used within the template.
   * Calculates all arc-, SVG-path- and background-data
   * or returns an empty array in case no series are available.
   */
  _updateRenderData(): void {
    if (this._radialChartSeries && this._radialChartSeries.length > 0) {
      const seriesValues = this._radialChartSeries.map(s => s.value);
      const arcs = generatePieArcData(seriesValues, this.maxValue);

      this._renderData = this._radialChartSeries.map((s, i) => {
        const colorIdx = i % DT_CHART_COLOR_PALETTE_ORDERED.length;
        return this._getSeriesRenderData(
          s,
          arcs[i],
          DT_CHART_COLOR_PALETTE_ORDERED[colorIdx],
        );
      });

      this._totalValue = getSum(seriesValues);
      this._hasBackground =
        isNumber(this.maxValue) && this._totalValue < this.maxValue!;
      this._backgroundPath =
        // tslint:disable-next-line: no-magic-numbers
        generatePathData(this._radius, this._innerRadius, 0, Math.PI * 2) || '';
    } else {
      this._renderData = [];
    }
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Puts together an object with all data needed
   * to render the SVG.
   */
  _getSeriesRenderData(
    series: DtRadialChartSeries,
    arcData: PieArcDatum<number>,
    chartColor: string,
  ): DtRadialChartRenderData {
    const path =
      generatePathData(
        this._radius,
        this._innerRadius,
        arcData.startAngle,
        arcData.endAngle,
      ) || '';

    // The series' color overrides the given color from the chart color palette.
    const color = series.color ? series.color : chartColor;

    // The path's aria label consists of the series' name, value and the chart's max-value
    const ariaLabel = `${series.name}: ${series.value} of ${
      this.maxValue ? this.maxValue : this._totalValue
    }`;

    return {
      path,
      color,
      ariaLabel,
      name: series.name,
      value: series.value,
    };
  }
}
