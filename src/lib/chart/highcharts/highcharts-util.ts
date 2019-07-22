import { DtTheme } from '@dynatrace/angular-components/theming';
import { Options as HighchartsOptions, AxisOptions } from 'highcharts';
import { merge as lodashMerge } from 'lodash';
import {
  DT_CHART_DEFAULT_OPTIONS,
  DT_CHART_DEFAULT_AXIS_STYLES,
} from '../chart-options';
import { DtChartSeries, DtChartOptions } from '../chart';
import { getDtChartColorPalette } from '../chart-colors';

/** Create a pure highcharts options out of provided chart options and/or series. */
export function createHighchartOptions(
  options: DtChartOptions = {},
  series?: DtChartSeries[],
): HighchartsOptions {
  const mergedSeries = series ? lodashMerge([], series) : undefined;
  let mergedOptions = lodashMerge(
    { series: mergedSeries },
    DT_CHART_DEFAULT_OPTIONS,
    options,
  ) as HighchartsOptions;
  mergedOptions = mergeAxis(mergedOptions);
  mergedOptions = wrapTooltipFormatterFn(mergedOptions);
  return mergedOptions;
}

/** Applies correct color palette depending on the number of metrics. */
export function applyHighchartsColorOptions(
  options: HighchartsOptions,
  theme: DtTheme,
): HighchartsOptions {
  return mergeHighchartsColorOptions(lodashMerge({}, options), theme);
}

/** Merge all axis of provide options with default axis styles. */
function mergeAxis(options: HighchartsOptions): HighchartsOptions {
  const axisTypes = ['xAxis', 'yAxis'];
  axisTypes.forEach(axisType => {
    let axis: AxisOptions | AxisOptions[] = options[axisType];
    if (axis) {
      axis = Array.isArray(axis)
        ? axis.map(a => lodashMerge({}, DT_CHART_DEFAULT_AXIS_STYLES, a))
        : lodashMerge({}, DT_CHART_DEFAULT_AXIS_STYLES, axis);
      options[axisType] = axis;
    }
  });
  return options;
}

/**
 * Ensures that a formatter function is set and returns false
 * this is needed because we use a custom event inside the refresh function of Highcharts
 * to receive the data everytime the formatter function is called by highcharts
 */
function wrapTooltipFormatterFn(options: HighchartsOptions): HighchartsOptions {
  options.tooltip!.formatter = function(): string | boolean {
    return false;
  };
  return options;
}

/** Merges the correct color palette depending on the number of metrics into the options. */
function mergeHighchartsColorOptions(
  options: HighchartsOptions,
  theme: DtTheme,
): HighchartsOptions {
  let nrOfMetrics: number;
  // Number of metrics is different depending on the chart type.
  if (isPieChartOptions(options)) {
    const pieSeries = options.series![0];
    nrOfMetrics = pieSeries.data ? pieSeries.data.length : 0;
  } else {
    nrOfMetrics = options.series ? options.series.length : 0;
  }

  options.colors = getDtChartColorPalette(nrOfMetrics, theme);

  return options;
}

/** Whether the provided highcharts options for a pie chart. */
function isPieChartOptions(options: HighchartsOptions): boolean {
  return !!(
    options.chart &&
    options.chart.type === 'pie' &&
    options.series &&
    options.series.length === 1
  );
}
