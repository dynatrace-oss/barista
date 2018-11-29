import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
  isDevMode,
  ChangeDetectorRef,
} from '@angular/core';
import { DataPoint, Options } from 'highcharts';
import { DtChart, DtChartOptions, DtChartSeries, DT_CHART_CONFIG } from '@dynatrace/angular-components/chart';
import {
  _DT_MICROCHART_LINE_MAX_DATAPOINT_OPTIONS,
  _DT_MICROCHART_LINE_MIN_DATAPOINT_OPTIONS,
  createDtMicrochartMinMaxDataPointOptions,
  createDtMicrochartDefaultOptions,
  createDtMicrochartDefaultColumnDataPointOption,
} from './micro-chart-options';
import { merge as lodashMerge } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDtMicrochartColorPalette } from './micro-chart-colors';
import { DtTheme } from '@dynatrace/angular-components/theming';
import { getDtMicroChartUnsupportedChartTypeError } from './micro-chart-errors';

const SUPPORTED_CHART_TYPES = ['line', 'column'];

@Component({
  moduleId: module.id,
  selector: 'dt-micro-chart',
  template: '<dt-chart [options]="_transformedOptions" [series]="_transformedSeries" (updated)="updated.emit()"></dt-chart>',
  exportAs: 'dtMicroChart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  providers: [{ provide: DT_CHART_CONFIG, useValue: { shouldUpdateColors: false }}],
})
export class DtMicroChart implements OnDestroy {
  @ViewChild(forwardRef(() => DtChart)) private _dtChart: DtChart;

  private _themeStateChangeSub = Subscription.EMPTY;
  private _options: DtChartOptions;
  private _series: Observable<DtChartSeries[]> | Observable<DtChartSeries> | DtChartSeries[] | DtChartSeries;
  private _currentSeries: DtChartSeries;

  _transformedOptions: DtChartOptions;
  _transformedSeries: Observable<DtChartSeries[]> | DtChartSeries[];

  @Input()
  get options(): DtChartOptions { return this._options; }
  set options(options: DtChartOptions) {
    if (isDevMode()) {
      checkUnsupportedOptions(options);
    }
    this._options = options;
    this._transformedOptions = this._transformOptions(options);
  }

  @Input()
  get series(): Observable<DtChartSeries[]> | Observable<DtChartSeries> | DtChartSeries[] | DtChartSeries { return this._series; }
  set series(series: Observable<DtChartSeries[]> | Observable<DtChartSeries> | DtChartSeries[] | DtChartSeries) {
    this._transformedSeries = series instanceof Observable ?
      (series as Observable<DtChartSeries[] | DtChartSeries>)
        .pipe(map((s: DtChartSeries[] | DtChartSeries) => this._transformSeries(s))) :
      (series && this._transformSeries(series));
    this._series = series;
  }

  @Output() readonly updated = new EventEmitter<void>();

  get seriesId(): string | undefined {
    return this._dtChart.seriesIds === undefined ? undefined : this._dtChart.seriesIds[0];
  }

  get highchartsOptions(): Options {
    return this._dtChart.highchartsOptions;
  }

  constructor(@Optional() @SkipSelf() private readonly _theme: DtTheme, private _changeDetectorRef: ChangeDetectorRef) {
    if (_theme) {
      _theme._stateChanges.subscribe(() => {
        this._transformedOptions = this._transformOptions(this._options);
        if (this._currentSeries) {
          this._transformedSeries = this._transformSeries(this._currentSeries);
        }
        _changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    this._themeStateChangeSub.unsubscribe();
  }

  private _transformOptions(options: DtChartOptions): DtChartOptions {
    const palette = getDtMicrochartColorPalette(this._theme);
    const defaultOptions = createDtMicrochartDefaultOptions(palette);
    const transformed = lodashMerge({}, defaultOptions, options);
    return hideChartAxis(transformed);
  }

  private _transformSeries(series: DtChartSeries[] | DtChartSeries): DtChartSeries[] {
    const singleSeries: DtChartSeries = Array.isArray(series) ? series[0] : series;

    if (isDevMode()) {
      checkUnsupportedType(singleSeries.type);
    }

    this._currentSeries = singleSeries;

    const isColumnSeries =
      singleSeries.type === 'column' || !!this.highchartsOptions.chart && this.highchartsOptions.chart.type === 'column';
    const dataPoints = convertToDataPoints(singleSeries.data || [singleSeries]);
    const {min, max} = getMinMaxDataPoints(dataPoints);
    applyMinMaxOptions(min, max, isColumnSeries, this._theme);

    singleSeries.data = dataPoints;
    return [singleSeries];
  }
}

/* Merges the passed options into all defined axis */
function hideChartAxis(options: DtChartOptions): DtChartOptions {
  ['xAxis', 'yAxis'].forEach((axisType) => {
    const axis = options[axisType];
    if (Array.isArray(axis)) {
      axis.forEach((a) => { lodashMerge(a, {visible: false}); });
    } else {
      lodashMerge(axis, {visible: false});
    }
  });
  return options;
}

/** Converts a series to a list of data points */
function convertToDataPoints(seriesData: Array<number | [number, number] | [string, number] | DataPoint>): DataPoint[] {
  return seriesData.map((dataPoint, index) => {
    if (typeof dataPoint === 'number') {
      return {x: index, y: dataPoint};
    } else if (Array.isArray(dataPoint)) {
      return {x: typeof dataPoint[0] === 'string' ? index : dataPoint[0], y: dataPoint[1]};
    }
    return lodashMerge({}, dataPoint);
  });
}

/** Find minium and maximum data points */
function getMinMaxDataPoints(dataPoints: DataPoint[]): { min: DataPoint; max: DataPoint } {
  // tslint:disable:align
  return dataPoints.reduce((accumulator, currentDataPoint) => ({
      min: currentDataPoint.y! < accumulator.min.y ? currentDataPoint : accumulator.min,
      max: currentDataPoint.y! > accumulator.max.y ? currentDataPoint : accumulator.max,
  }), {min: {y: Infinity}, max: {y: 0}});
  // tslint:enable:align
}

/** Apply default micro chart options to min & max data points */
function applyMinMaxOptions(min: DataPoint, max: DataPoint, isColumnSeries: boolean, theme?: DtTheme): void {
  const palette = getDtMicrochartColorPalette(theme);
  const columnOptions = createDtMicrochartDefaultColumnDataPointOption(palette);
  const minOptions = isColumnSeries ? columnOptions : _DT_MICROCHART_LINE_MIN_DATAPOINT_OPTIONS;
  const maxOptions = isColumnSeries ? columnOptions : _DT_MICROCHART_LINE_MAX_DATAPOINT_OPTIONS;
  const minMaxDefaultOptions = createDtMicrochartMinMaxDataPointOptions(palette);
  lodashMerge(min, minMaxDefaultOptions, minOptions);
  lodashMerge(max, minMaxDefaultOptions, maxOptions);
}

function checkUnsupportedType(type: string | undefined): void {
  if (type && SUPPORTED_CHART_TYPES.indexOf(type) === -1) {
    throw getDtMicroChartUnsupportedChartTypeError(type);
  }
}

function checkUnsupportedOptions(options: DtChartOptions): void {
  if (options.chart) {
    checkUnsupportedType(options.chart.type);
  }
}
