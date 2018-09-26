import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, Optional, SkipSelf, ViewEncapsulation
} from '@angular/core';
import { DataPoint } from 'highcharts';
import { DtViewportResizer} from '@dynatrace/angular-components/core';
import { DtChart, DtChartOptions, DtChartSeries } from '../chart';
import {
  DEFAULT_CHART_MICROCHART_OPTIONS, DEFAULT_MAX_DATAPOINT_OPTIONS, DEFAULT_MIN_DATAPOINT_OPTIONS,
  DEFAULT_MINMAX_DATAPOINT_OPTIONS
} from './micro-chart-options';
import { merge } from 'lodash';
import { DtTheme } from '@dynatrace/angular-components/theming';
import { MicroChartColorizer } from '@dynatrace/angular-components/chart/microchart/micro-chart-colorizer';

const SUPPORTED_CHART_TYPES = ['line', 'bar', 'column', 'series'];
const SUPPORTED_NUM_SERIES = 1;

@Component({
  moduleId: module.id,
  selector: 'dt-micro-chart',
  styleUrls: ['../chart.scss'],
  templateUrl: '../chart.html',
  exportAs: 'dtMicroChart',
  // disabled ViewEncapsulation because some html is generated by highcharts
  // so it does not get the classes from angular
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtMicroChart extends DtChart {
  constructor(@Optional() _viewportResizer: DtViewportResizer,
              @Optional() @SkipSelf() _theme: DtTheme,
              _changeDetectorRef: ChangeDetectorRef,
              _ngZone: NgZone) {
    super(_viewportResizer, _theme, _changeDetectorRef, _ngZone);
  }

  protected _mergeSeries(series: DtChartSeries | undefined): void {
    DtMicroChart._checkUnsupportedSeries(series);
    DtMicroChart._transformSeries(series);

    super._mergeSeries(series);
  }

  protected _mergeOptions(options: DtChartOptions): void {
    DtMicroChart._checkUnsupportedOptions(options);
    super._mergeOptions(merge({}, DEFAULT_CHART_MICROCHART_OPTIONS, options));
  }

  protected _mergeAxis(axis: 'xAxis' | 'yAxis' | 'zAxis'): void {
    this._mergeAxisWithOptions(axis, { visible: false });
    super._mergeAxis(axis);
  }

  protected _colorizeChart(options: DtChartOptions): void {
    MicroChartColorizer.apply(options, this._theme);
  }

  private static _transformSeries(series: DtChartSeries | undefined): void {

    if (series === undefined || series.length === 0) {
      return;
    }

    // We only support one series. This has already been checked.
    const singleSeries = series[0];
    if (singleSeries.data === undefined || singleSeries.data.length === 0) {
      return;
    }

    const dataPoints = DtMicroChart._normalizedData(singleSeries.data);
    const values = dataPoints.map((point: DataPoint) => point.y) as number[];

    const minIndex = values.lastIndexOf(Math.min(...values));
    const maxIndex = values.lastIndexOf(Math.max(...values));

    merge(dataPoints[minIndex], DEFAULT_MINMAX_DATAPOINT_OPTIONS, DEFAULT_MIN_DATAPOINT_OPTIONS);
    merge(dataPoints[maxIndex], DEFAULT_MINMAX_DATAPOINT_OPTIONS, DEFAULT_MAX_DATAPOINT_OPTIONS);

    singleSeries.data = dataPoints;
  }

  /**
   * Converts a series to {@link DataPoint[]}
   */
  private static _normalizedData(seriesData: Array<number | [number, number] | [string, number] | DataPoint>): DataPoint[] {
    if (seriesData.length === 0) {
      return [];
    }

    // Convert (number | [number, number] | [string, number]) to DataPoint
    // In case of another data structure we can ignore it, since an error should already be thrown for unsupported charts.
    const firstDataValue = seriesData[0];

    if (typeof firstDataValue === 'number') { // Case 'number'
      return (seriesData as number[])
        .map((value: number, index: number) => ({x: index, y: value}));

    } else if (firstDataValue instanceof Array) { // Case '[any, number]'
      const numberArraySeries = seriesData as Array<[number, number]>;
      return numberArraySeries.map((value: [number, number]) => ({x: value[0], y: value[1]}));

    } else if ('y' in firstDataValue) { // Case 'DataPoint'
      return seriesData as DataPoint[];
    }

    return [];
  }

  private static _checkUnsupportedSeries(series: DtChartSeries | undefined): void {
    if (series === undefined || series.length === 0) { return; }

    if (series.length > SUPPORTED_NUM_SERIES) {
      throw new Error(`You are using ${series.length} series. Supported number of series: ${SUPPORTED_NUM_SERIES}`);
    }

    DtMicroChart._checkUnsupportedType(series[0].type);
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
