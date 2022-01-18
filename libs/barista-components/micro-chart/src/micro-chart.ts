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
  DtChart,
  DtChartOptions,
  DtChartResolver,
  DT_CHART_CONFIG,
  DT_CHART_RESOLVER,
} from '@dynatrace/barista-components/chart';
import { sanitize } from '@dynatrace/barista-components/core';
import { DtTheme } from '@dynatrace/barista-components/theming';
import {
  Options,
  PointOptionsObject,
  SeriesColumnDataOptions,
  SeriesColumnOptions,
  SeriesLineDataOptions,
  SeriesLineOptions,
} from 'highcharts';
import { merge as lodashMerge } from 'lodash-es';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDtMicrochartColorPalette } from './micro-chart-colors';
import { getDtMicroChartUnsupportedChartTypeError } from './micro-chart-errors';
import {
  createDtMicrochartDefaultOptions,
  createDtMicrochartMinMaxDataPointOptions,
  _DT_MICROCHART_COLUMN_DATAPOINT_OPTIONS,
  _DT_MICROCHART_MAX_DATAPOINT_OPTIONS,
  _DT_MICROCHART_MIN_DATAPOINT_OPTIONS,
} from './micro-chart-options';
import {
  extractColumnGapDataPoints,
  extractLineGapDataPoints,
} from './micro-chart-util';

export type DtMicroChartOptions = DtChartOptions & {
  interpolateGaps?: boolean;
};

export type DtMicroChartSeries = SeriesLineOptions | SeriesColumnOptions;

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
  selector: 'dt-micro-chart',
  template: `
    <dt-chart
      [options]="_transformedOptions"
      [series]="_transformedSeries"
      (updated)="updated.emit()"
      [loading-text]="loadingText"
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
  // eslint-disable-next-line  @angular-eslint/no-forward-ref
  @ViewChild(forwardRef(() => DtChart), { static: true })
  _dtChart: DtChart;

  private _themeStateChangeSub = Subscription.EMPTY;
  private _options: DtMicroChartOptions;
  private _series:
    | Observable<DtMicroChartSeries[] | DtMicroChartSeries>
    | DtMicroChartSeries[]
    | DtMicroChartSeries;
  private _currentSeries: DtMicroChartSeries;

  /** @internal Transformed options to be applied to highcharts. */
  _transformedOptions: DtMicroChartOptions;

  /** @internal Transformed series to be applied to highcharts. */
  _transformedSeries: Observable<DtMicroChartSeries[]> | DtMicroChartSeries[];

  /** Options to configure the chart. */
  @Input()
  get options(): DtMicroChartOptions {
    return this._options;
  }
  set options(options: DtMicroChartOptions) {
    if (isDevMode()) {
      checkUnsupportedOptions(options);
    }
    const sanitized = sanitize(options);
    this._options = sanitized;
    this._transformedOptions = this._transformOptions(sanitized);
  }

  /** Series of data points or a stream rendered in this chart */
  @Input()
  get series():
    | Observable<DtMicroChartSeries[] | DtMicroChartSeries>
    | DtMicroChartSeries[]
    | DtMicroChartSeries {
    return this._series;
  }
  set series(
    series:
      | Observable<DtMicroChartSeries[] | DtMicroChartSeries>
      | DtMicroChartSeries[]
      | DtMicroChartSeries,
  ) {
    this._transformedSeries =
      series instanceof Observable
        ? (
            series as Observable<DtMicroChartSeries[] | DtMicroChartSeries>
          ).pipe(
            map((s: DtMicroChartSeries[] | DtMicroChartSeries) =>
              this._transformSeries(s),
            ),
          )
        : series && this._transformSeries(series);
    this._series = series;
  }

  /** Formatter function to format the label. */
  @Input()
  get labelFormatter(): (input: number) => string {
    return this._labelFormatter;
  }
  set labelFormatter(formatter: (input: number) => string) {
    this._labelFormatter = formatter;
    this._updateTransformedSeries();
  }
  private _labelFormatter = (input: number) => input.toString();

  /** Loading text displayed in the internal loading distractor. */
  @Input('loading-text') loadingText: string;

  /** Emits when the chart (its options or series) is updated. */
  @Output() readonly updated = new EventEmitter<void>();

  /** List of all series ids. */
  get seriesId(): string | undefined {
    return this._dtChart.seriesIds === undefined
      ? undefined
      : this._dtChart.seriesIds[0];
  }

  /** The options of the internal highcharts object. */
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

  private _transformOptions(options: DtMicroChartOptions): DtMicroChartOptions {
    const palette = getDtMicrochartColorPalette(this._theme);
    const defaultOptions = createDtMicrochartDefaultOptions(palette);
    const transformed = lodashMerge({}, defaultOptions, options);
    return hideChartAxis(transformed);
  }

  private _transformSeries(
    series: DtMicroChartSeries[] | DtMicroChartSeries,
  ): DtMicroChartSeries[] {
    // We are cloning the series here since we don't want to mutate the passed reference
    const singleSeries: DtMicroChartSeries = Array.isArray(series)
      ? { ...series[0] }
      : { ...series };

    if (isDevMode()) {
      checkUnsupportedType(singleSeries.type);
    }

    this._currentSeries = singleSeries;
    const dataPoints = singleSeries.data
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        convertToDataPoints(singleSeries.data!)
      : [];
    const { min, max } = getMinMaxDataPoints(dataPoints);
    applyMinMaxOptions(
      min,
      max,
      this.labelFormatter,
      this._theme,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
function hideChartAxis(options: DtMicroChartOptions): DtMicroChartOptions {
  ['xAxis', 'yAxis'].forEach((axisType) => {
    const axis = options[axisType];
    if (Array.isArray(axis)) {
      axis.forEach((a) => {
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
    | [number | string, number | null]
    | null
    | SeriesColumnDataOptions
    | SeriesLineDataOptions
  >,
): SeriesColumnDataOptions[] | SeriesLineDataOptions[] {
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
  dataPoints: Array<SeriesColumnDataOptions | SeriesLineDataOptions>,
): {
  min: SeriesColumnDataOptions | SeriesLineDataOptions;
  max: SeriesColumnDataOptions | SeriesLineDataOptions;
} {
  /* eslint-disable indent,@typescript-eslint/indent */
  return dataPoints.reduce(
    (accumulator, currentDataPoint) => ({
      min:
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currentDataPoint.y! < accumulator.min.y
          ? currentDataPoint
          : accumulator.min,
      max:
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currentDataPoint.y! > accumulator.max.y
          ? currentDataPoint
          : accumulator.max,
    }),
    { min: { y: Infinity }, max: { y: -Infinity } },
  );
  /* eslint-enable indent, @typescript-eslint/indent */
}

/** Apply default micro chart options to min & max data points, taking into account the given chart type */
function applyMinMaxOptions(
  min: SeriesColumnDataOptions | SeriesLineDataOptions,
  max: SeriesColumnDataOptions | SeriesLineDataOptions,
  labelFormatter: (input: number) => string,
  theme?: DtTheme,
  chartType?: string,
): void {
  const palette = getDtMicrochartColorPalette(theme);
  const minMaxDefaultOptions =
    createDtMicrochartMinMaxDataPointOptions(palette);
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

function checkUnsupportedOptions(options: DtMicroChartOptions): void {
  if (options.chart) {
    checkUnsupportedType(options.chart.type);
  }
}

/** Apply count formatter to value to be displayed in data label */
function addDataLabelFormatter(
  dataPoint: SeriesColumnDataOptions | SeriesLineDataOptions,
  formatter: (input: number) => string,
): void {
  // If there are multiple dataPoints, we apply the formatter for the first one
  // and clear out the others.
  if (dataPoint && dataPoint.dataLabels) {
    if (Array.isArray(dataPoint.dataLabels)) {
      dataPoint.dataLabels[0].formatter = () =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dataPoint.y !== undefined ? formatter(dataPoint.y!) : '';
      for (let i = 1; i < dataPoint.dataLabels.length; i++) {
        dataPoint.dataLabels[i].formatter = () => '';
      }
    } else {
      dataPoint.dataLabels.formatter = () =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dataPoint.y !== undefined ? formatter(dataPoint.y!) : '';
    }
  }
}

/**
 * Extracts a series of data points from the given series that contains data points interpolating missing data. The
 * interpolation is done differently for line and column charts, and is based on the chart type of the given options.
 *
 * @param series The DtMicroChartSeries containing data points with or without gaps
 * @param options The DtMicroChartOptions containing information about the chart type and coloring
 */
function extractGapSeries(
  series: SeriesLineOptions | SeriesColumnOptions,
  options: DtMicroChartOptions,
): SeriesLineOptions | SeriesColumnOptions {
  const data = series.data as PointOptionsObject[];

  switch (series.type) {
    case 'column':
      return {
        type: 'column',
        linkedTo: ':previous',
        data: extractColumnGapDataPoints(data),
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
