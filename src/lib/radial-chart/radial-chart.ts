import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { isNumber } from '@dynatrace/angular-components/core';
import { PieArcDatum } from 'd3-shape';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { DtRadialChartSeries } from './public-api/radial-chart-series';
import {
  DtRadialChartRenderData,
  DtRadialChartType,
} from './utils/radial-chart-interfaces';
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
  get type(): DtRadialChartType {
    return this._type.value;
  }
  set type(value: DtRadialChartType) {
    if (value && value !== this._type.value) {
      this._type.next(value);
    }
  }
  private _type: BehaviorSubject<DtRadialChartType> = new BehaviorSubject(
    'pie',
  );

  /** Maximum value the chart displays, 100%, full circle */
  @Input()
  get maxValue(): number {
    return this._maxValue;
  }
  set maxValue(value: number) {
    this._maxValue = coerceNumberProperty(value);
  }
  private _maxValue: number;

  /** Where the circle should start, default is 0 which is on top. */
  @Input()
  get start(): number {
    return this._start;
  }
  set start(value: number) {
    this._start = coerceNumberProperty(value);
  }
  private _start = 0;

  /** @internal Series data, <dt-radial-chart-series> */
  @ContentChildren(DtRadialChartSeries) _radialChartSeries: QueryList<
    DtRadialChartSeries
  >;

  /** @internal Render data used to draw the SVG. */
  _renderData = new Subject<DtRadialChartRenderData[]>();

  /** @internal Destroy subject to clear subscriptions on component destroy. */
  private readonly _destroy = new Subject<void>();

  /** @internal The chart's radius. */
  // TODO: this should be calculated depending on the available size & viewport
  _radius = 300;

  /**
   * @internal
   * Flag if a background shape should be rendered.
   * Depends on difference of the given and the calculated max value.
   */
  _hasBackground: boolean;

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
    return `${-this._radius} ${-this._radius} ${this._width} ${this._width}`;
  }

  /** @internal The chart's width based on the radius. */
  get _width(): number {
    // tslint:disable-next-line:no-magic-numbers
    return this._radius * 2;
  }

  /** @internal The chart's inner radius based on the chart type and defined fraction. */
  get _innerRadius(): number {
    return this._type.value === 'pie'
      ? 0
      : this._radius * DONUT_INNER_CIRCLE_FRACTION;
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    const seriesInputChanges = this._radialChartSeries.changes.pipe(
      startWith(null),
      filter(() => !!this._radialChartSeries.length),
      switchMap(() =>
        combineLatest(
          this._radialChartSeries.map(series => series._valueChanges),
        ),
      ),
    );
    combineLatest([seriesInputChanges, this._type])
      .pipe(
        takeUntil(this._destroy),
        map(([series]) => series),
      )
      .subscribe(series => {
        Promise.resolve().then(() => {
          const nextRenderData: DtRadialChartRenderData[] = [];

          const seriesValues = series.map(s => s.value);
          const sumAllValues = getSum(seriesValues);
          const arcs = generatePieArcData(seriesValues, this.maxValue);

          series.forEach((s, i) => {
            nextRenderData.push(this._getRenderData(arcs[i], s));
          });

          this._hasBackground =
            isNumber(this.maxValue) && sumAllValues < this.maxValue;
          this._backgroundPath =
            // tslint:disable-next-line: no-magic-numbers
            generatePathData(this._radius, this._innerRadius, 0, Math.PI * 2) ||
            '';
          this._renderData.next(nextRenderData);
          this._changeDetectorRef.markForCheck();
        });
      });
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /**
   * Puts together an object with data needed
   * to render the SVG.
   */
  _getRenderData(
    arcData: PieArcDatum<number>,
    series: DtRadialChartSeries,
  ): DtRadialChartRenderData {
    const path =
      generatePathData(
        this._radius,
        this._innerRadius,
        arcData.startAngle,
        arcData.endAngle,
      ) || '';
    return {
      path,
      color: series.color,
      name: series.name,
      value: series.value,
    };
  }
}
