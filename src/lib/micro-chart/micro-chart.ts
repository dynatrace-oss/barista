import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  isDevMode,
  OnDestroy,
  Optional,
  Output,
  Self,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DT_CHART_CONFIG,
  DT_CHART_RESOLVER,
  DtChart,
  DtChartOptions,
  DtChartResolver,
  DtChartSeries,
} from '@dynatrace/angular-components/chart';
import { DtTheme } from '@dynatrace/angular-components/theming';
import {
  ColumnChartSeriesOptions,
  DataPoint,
  LineChartSeriesOptions,
  Options,
} from 'highcharts';
import { merge as lodashMerge } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDtMicrochartColorPalette } from './micro-chart-colors';
import { getDtMicroChartUnsupportedChartTypeError } from './micro-chart-errors';
import {
  _DT_MICROCHART_COLUMN_DATAPOINT_OPTIONS,
  _DT_MICROCHART_MAX_DATAPOINT_OPTIONS,
  _DT_MICROCHART_MIN_DATAPOINT_OPTIONS,
  createDtMicrochartDefaultOptions,
  createDtMicrochartMinMaxDataPointOptions,
} from './micro-chart-options';
import {
  extractColumnGapDataPoints,
  extractLineGapDataPoints,
} from './micro-chart-util';

const SUPPORTED_CHART_TYPES = ['line', 'column'];

/**
 * @internal
 * Factory to resolve the chart instance for the microchart
 * this needs to be written as below without lambda expressions due to a compiler bug,
 * see https://github.com/angular/angular/issues/23629 for further information
 */
export function DT_MICROCHART_CHART_RESOVER_PROVIDER_FACTORY(
  microChart: DtMicroChart,
): DtChartResolver {
  const resolver = () => microChart._dtChart;
  return resolver;
}

@Component({
  moduleId: module.id,
  selector: 'dt-micro-chart',
  template: `
    <dt-chart
      [options]="_transformedOptions"
      [series]="_transformedSeries"
      (updated)="updated.emit()"
    >
      <ng-content select="dt-chart-tooltip"></ng-content>
    </dt-chart>
  `,
  exportAs: 'dtMicroChart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  providers: [
    { provide: DT_CHART_CONFIG, useValue: { shouldUpdateColors: false } },
    {
      provide: DT_CHART_RESOLVER,
      useFactory: DT_MICROCHART_CHART_RESOVER_PROVIDER_FACTORY,
      deps: [[new Self(), DtMicroChart]],
    },
  ],
})
export class DtMicroChart implements OnDestroy {
  /** @internal DtChart instance that is needed for the tooltip */
  // tslint:disable-next-line no-forward-ref
  @ViewChild(forwardRef(() => DtChart), { static: true }) _dtChart: DtChart;

  private _themeStateChangeSub = Subscription.EMPTY;
  private _options: DtChartOptions;
  private _series:
    | Observable<DtChartSeries[]>
    | Observable<DtChartSeries>
    | DtChartSeries[]
    | DtChartSeries;
  private _currentSeries: DtChartSeries;

  _transformedOptions: DtChartOptions;
  _transformedSeries: Observable<DtChartSeries[]> | DtChartSeries[];

  @Input()
  get options(): DtChartOptions {
    return this._options;
  }
  set options(options: DtChartOptions) {
    if (isDevMode()) {
      checkUnsupportedOptions(options);
    }
    this._options = options;
    this._transformedOptions = this._transformOptions(options);
  }

  @Input()
  get series():
    | Observable<DtChartSeries[]>
    | Observable<DtChartSeries>
    | DtChartSeries[]
    | DtChartSeries {
    return this._series;
  }
  set series(
    series:
      | Observable<DtChartSeries[]>
      | Observable<DtChartSeries>
      | DtChartSeries[]
      | DtChartSeries,
  ) {
    this._transformedSeries =
      series instanceof Observable
        ? (series as Observable<DtChartSeries[] | DtChartSeries>).pipe(
            map((s: DtChartSeries[] | DtChartSeries) =>
              this._transformSeries(s),
            ),
          )
        : series && this._transformSeries(series);
    this._series = series;
  }

  private _labelFormatter = (input: number) => input.toString();
  @Input()
  get labelFormatter(): (input: number) => string {
    return this._labelFormatter;
  }
  set labelFormatter(formatter: (input: number) => string) {
    this._labelFormatter = formatter;
    this._updateTransformedSeries();
  }

  @Output() readonly updated = new EventEmitter<void>();

  get seriesId(): string | undefined {
    return this._dtChart.seriesIds === undefined
      ? undefined
      : this._dtChart.seriesIds[0];
  }

  get highchartsOptions(): Options {
    return this._dtChart.highchartsOptions;
  }

  constructor(
    @Optional() @SkipSelf() private readonly _theme: DtTheme,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._transformedOptions = this._transformOptions({});

    if (_theme) {
      _theme._stateChanges.subscribe(() => {
        this._transformedOptions = this._transformOptions(this._options);
        this._updateTransformedSeries();
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

  private _transformSeries(
    series: DtChartSeries[] | DtChartSeries,
  ): DtChartSeries[] {
    const singleSeries: DtChartSeries = Array.isArray(series)
      ? series[0]
      : series;

    if (isDevMode()) {
      checkUnsupportedType(singleSeries.type);
    }

    this._currentSeries = singleSeries;
    const dataPoints = convertToDataPoints(singleSeries.data || [singleSeries]);
    const { min, max } = getMinMaxDataPoints(dataPoints);
    applyMinMaxOptions(
      min,
      max,
      this.labelFormatter,
      this._theme,
      this._transformedOptions.chart!.type,
    );

    singleSeries.data = dataPoints;

    if (this._transformedOptions.interpolateGaps) {
      return [
        singleSeries,
        extractGapSeries(singleSeries, this._transformedOptions),
      ];
    }

    return [singleSeries];
  }

  private _updateTransformedSeries(): void {
    if (this._currentSeries) {
      this._transformedSeries = this._transformSeries(this._currentSeries);
    }
    this._changeDetectorRef.markForCheck();
  }
}

/* Merges the passed options into all defined axis */
function hideChartAxis(options: DtChartOptions): DtChartOptions {
  ['xAxis', 'yAxis'].forEach(axisType => {
    const axis = options[axisType];
    if (Array.isArray(axis)) {
      axis.forEach(a => {
        lodashMerge(a, { visible: false });
      });
    } else {
      lodashMerge(axis, { visible: false });
    }
  });
  return options;
}

/** Converts a series to a list of data points */
function convertToDataPoints(
  seriesData: Array<
    | number
    | [number, number]
    | [string, number]
    | [string, number, number]
    | [number, number, number]
    | DataPoint
  >,
): DataPoint[] {
  return seriesData.map((dataPoint, index) => {
    if (typeof dataPoint === 'number') {
      return { x: index, y: dataPoint };
    }
    if (Array.isArray(dataPoint)) {
      return {
        x: typeof dataPoint[0] === 'string' ? index : dataPoint[0],
        y: dataPoint[1],
      };
    }
    return lodashMerge({}, dataPoint);
  });
}

/** Find minium and maximum data points */
function getMinMaxDataPoints(
  dataPoints: DataPoint[],
): { min: DataPoint; max: DataPoint } {
  // tslint:disable:align
  return dataPoints.reduce(
    (accumulator, currentDataPoint) => ({
      min:
        currentDataPoint.y! < accumulator.min.y
          ? currentDataPoint
          : accumulator.min,
      max:
        currentDataPoint.y! > accumulator.max.y
          ? currentDataPoint
          : accumulator.max,
    }),
    { min: { y: Infinity }, max: { y: -Infinity } },
  );
  // tslint:enable:align
}

/** Apply default micro chart options to min & max data points, taking into account the given chart type */
function applyMinMaxOptions(
  min: DataPoint,
  max: DataPoint,
  labelFormatter: (input: number) => string,
  theme?: DtTheme,
  chartType?: string,
): void {
  const palette = getDtMicrochartColorPalette(theme);
  const minMaxDefaultOptions = createDtMicrochartMinMaxDataPointOptions(
    palette,
  );
  if (chartType === 'column') {
    lodashMerge(
      min,
      minMaxDefaultOptions,
      _DT_MICROCHART_COLUMN_DATAPOINT_OPTIONS,
    );
    lodashMerge(
      max,
      minMaxDefaultOptions,
      _DT_MICROCHART_COLUMN_DATAPOINT_OPTIONS,
    );
  } else {
    lodashMerge(
      min,
      minMaxDefaultOptions,
      _DT_MICROCHART_MIN_DATAPOINT_OPTIONS,
    );
    lodashMerge(
      max,
      minMaxDefaultOptions,
      _DT_MICROCHART_MAX_DATAPOINT_OPTIONS,
    );
  }
  addDataLabelFormatter(min, labelFormatter);
  addDataLabelFormatter(max, labelFormatter);
}

function checkUnsupportedType(type?: string): void {
  if (type && SUPPORTED_CHART_TYPES.indexOf(type) === -1) {
    throw getDtMicroChartUnsupportedChartTypeError(type);
  }
}

function checkUnsupportedOptions(options: DtChartOptions): void {
  if (options.chart) {
    checkUnsupportedType(options.chart.type);
  }
}

/** Apply count formatter to value to be displayed in data label */
function addDataLabelFormatter(
  dataPoint: DataPoint,
  formatter: (input: number) => string,
): void {
  if (dataPoint && dataPoint.dataLabels) {
    dataPoint.dataLabels.formatter = () =>
      dataPoint.y !== undefined ? formatter(dataPoint.y) : '';
  }
}

/**
 * Extracts a series of data points from the given series that contains data points interpolating missing data. The
 * interpolation is done differently for line and column charts, and is based on the chart type of the given options.
 * @param series The DtChartSeries containing data points with or without gaps
 * @param options The DtChartOptions containing information about the chart type and coloring
 */
function extractGapSeries(
  series: DtChartSeries,
  options: DtChartOptions,
): LineChartSeriesOptions | ColumnChartSeriesOptions {
  const data = series.data as DataPoint[];

  switch (options.chart && options.chart.type) {
    case 'column':
      return {
        type: 'column',
        linkedTo: ':previous',
        data: extractColumnGapDataPoints(data),
        dashStyle: 'Dash',
        color: 'transparent',
        borderColor: options.colors && options.colors[0],
        enableMouseTracking: false,
      };
    case 'line':
    default:
      return {
        type: 'line',
        linkedTo: ':previous',
        data: extractLineGapDataPoints(data),
        dashStyle: 'Dash',
        color: options.colors && options.colors[0],
        lineWidth: 1,
        marker: {
          enabled: false,
        },
        zIndex: -1,
        enableMouseTracking: false,
      };
  }
}
