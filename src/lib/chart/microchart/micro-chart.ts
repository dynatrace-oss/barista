import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input, OnDestroy,
  Optional,
  Output, SkipSelf,
  ViewChild
} from '@angular/core';
import {AxisOptions, DataPoint, Options} from 'highcharts';
import { DtChart, DtChartOptions, DtChartSeries } from '../chart';
import {
  COLUMN_MINMAX_DATAPOINT_OPTIONS,
  DEFAULT_CHART_MICROCHART_OPTIONS, LINE_MAX_DATAPOINT_OPTIONS, LINE_MIN_DATAPOINT_OPTIONS,
  MINMAX_DATAPOINT_OPTIONS
} from './micro-chart-options';
import { merge } from 'lodash';
import { DtTheme } from '@dynatrace/angular-components/theming';
import { MicroChartColorizer } from './micro-chart-colorizer';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SUPPORTED_CHART_TYPES = ['line', 'column'];

@Component({
  moduleId: module.id,
  selector: 'dt-micro-chart',
  template: '<dt-chart (updated)="updated.emit()"></dt-chart>',
  exportAs: 'dtMicroChart',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtMicroChart implements OnDestroy {
  @ViewChild(forwardRef(() => DtChart)) private _dtChart: DtChart;

  private _series: Observable<DtChartSeries> | DtChartSeries | undefined;
  private _subscription = Subscription.EMPTY;
  private _options: DtChartOptions;

  private _columnSeries: boolean;
  private _minDataPoint: DataPoint;
  private _maxDataPoint: DataPoint;

  constructor(@Optional() @SkipSelf() private readonly _theme: DtTheme) {
    if (this._theme) {
      this._subscription = this._theme._stateChanges.subscribe(() => {
        if (this._options) {
          this._colorizeChart(this._options);
          this._colorizeMinMaxDataPoints();
          this._dtChart.options = merge({}, this._options);
        }
      });
    }
  }

  @Input()
  set options(options: DtChartOptions) {
    DtMicroChart._checkUnsupportedOptions(options);
    this._options = merge({}, DEFAULT_CHART_MICROCHART_OPTIONS, options);
    this._transformAxis(this._options);
    this._colorizeChart(this._options);
    this._dtChart.options = this._options;
  }
  get options(): DtChartOptions {
    return this._dtChart.options;
  }

  @Input()
  set series(series: Observable<DtChartSeries> | DtChartSeries | undefined) {
    this._updateSeries(series);
  }
  get series(): Observable<DtChartSeries> | DtChartSeries | undefined {
    return this._series;
  }

  @Output() readonly updated: EventEmitter<void> = new EventEmitter<void>();

  get seriesIds(): Array<string | undefined> | undefined {
    return this._dtChart.seriesIds;
  }

  get highchartsOptions(): Options {
    return this._dtChart.highchartsOptions;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private _updateSeries(series: Observable<DtChartSeries> | DtChartSeries | undefined): void {
    let transformed: Observable<DtChartSeries[]> | DtChartSeries[] | undefined;

    if (series === undefined) {
      transformed = undefined;
    } else if (series instanceof Observable) {
      transformed = series.pipe(map((s) => this._transformSeries(s)));
    } else {
      transformed = this._transformSeries(series);
    }

    this._series = series;
    this._dtChart.series = transformed;
  }

  private _colorizeChart(options: DtChartOptions): void {
    MicroChartColorizer.apply(options, this._theme);
  }

  private _transformAxis(options: DtChartOptions): void {
    if (options.xAxis) { DtMicroChart._mergeAxis(options.xAxis); }
    if (options.yAxis) { DtMicroChart._mergeAxis(options.yAxis); }
  }

  private static _mergeAxis(options: AxisOptions | AxisOptions[]): void {
    if (!options) {
      return;
    }
    if (Array.isArray(options)) {
      options.forEach((a) => {
        merge(a, {visible: false});
      });
    } else {
       merge(options, {visible: false});
    }
  }

  private _transformSeries(series: DtChartSeries): DtChartSeries[] {
    // We only support one series. This has already been checked.
    if (!series.data) {
      return [series];
    }

    this._columnSeries =
      series.type === 'column' || this.highchartsOptions.chart !== undefined && this.highchartsOptions.chart.type === 'column';

    const dataPoints = DtMicroChart._normalizeData(series.data);
    const values = dataPoints.map((point: DataPoint) => point.y) as number[];

    const minIndex = values.lastIndexOf(Math.min(...values));
    const maxIndex = values.lastIndexOf(Math.max(...values));

    this._minDataPoint = dataPoints[minIndex];
    this._maxDataPoint = dataPoints[maxIndex];

    this._decorateMinMaxDataPoints();

    series.data = dataPoints;
    return [series];
  }

  private _decorateMinMaxDataPoints(): void {
    if (this._columnSeries) {
      merge(this._minDataPoint, MINMAX_DATAPOINT_OPTIONS, COLUMN_MINMAX_DATAPOINT_OPTIONS);
      merge(this._maxDataPoint, MINMAX_DATAPOINT_OPTIONS, COLUMN_MINMAX_DATAPOINT_OPTIONS);
    } else {
      merge(this._minDataPoint, MINMAX_DATAPOINT_OPTIONS, LINE_MIN_DATAPOINT_OPTIONS);
      merge(this._maxDataPoint, MINMAX_DATAPOINT_OPTIONS, LINE_MAX_DATAPOINT_OPTIONS);
    }

    this._colorizeMinMaxDataPoints();
  }

  private _colorizeMinMaxDataPoints(): void {
    const palette = MicroChartColorizer.getPalette(this._theme);
    if (this._columnSeries) {
      merge(this._minDataPoint, { borderColor: palette.secondary });
      merge(this._maxDataPoint, { borderColor: palette.secondary });
    } else {
      const options: DataPoint = {
        marker: {
          lineColor: palette.secondary,
          states: {
            hover: {
              lineColor: palette.secondary,
              fillColor: palette.tertiary,
            },
          },
        },
      };
      merge(this._minDataPoint, options);
      merge(this._maxDataPoint, options);
    }
  }

  /**
   * Converts a series to {@link DataPoint[]}
   */
  private static _normalizeData(seriesData: Array<number | [number, number] | [string, number] | DataPoint>): DataPoint[] {
    if (seriesData.length === 0) {
      return [];
    }

    // Convert (number | [number, number] | [string, number]) to DataPoint
    // In case of another data structure we can ignore it, since an error should already be thrown for unsupported charts.
    const firstDataValue = seriesData[0];

    if (typeof firstDataValue === 'number') {
      return (seriesData as number[])
        .map((value: number, index: number) => ({x: index, y: value}));

    } else if (firstDataValue instanceof Array) {
      const numberArraySeries = seriesData as Array<[number, number]>;
      return numberArraySeries.map((value: [number, number]) => ({x: value[0], y: value[1]}));

    } else if ('y' in firstDataValue) {
      return seriesData as DataPoint[];
    }

    return [];
  }

  private static _checkUnsupportedOptions(options: DtChartOptions): void {
    if (options.chart) {
      DtMicroChart._checkUnsupportedType(options.chart.type);
    }
  }

  private static _checkUnsupportedType(type: string | undefined): void {
    if (type && SUPPORTED_CHART_TYPES.indexOf(type) === -1) {
      throw new Error(`Series type unsupported: ${type}`);
    }
  }
}
