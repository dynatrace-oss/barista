import { DtTheme } from '@dynatrace/angular-components/theming';
import { Options as HighchartsOptions, AxisOptions } from 'highcharts';
import { merge as lodashMerge } from 'lodash';
import { DT_CHART_DEFAULT_OPTIONS, DT_CHART_DEFAULT_AXIS_STYLES } from '../chart-options';
import { defaultTooltipFormatter } from '../chart-tooltip';
import { DT_CHART_COLOR_PALETTES, DT_CHART_COLOR_PALETTE_ORDERED } from '../chart-colors';
import { DtChartSeries, DtChartOptions } from '../chart';

// Threshold to determine the color palette used
const DT_CHART_THEME_COLOR_MAX_LENGTH = 3;

/** Create a pure highcharts options out of provided chart options and/or series. */
export function createHighchartOptions(options: DtChartOptions = {}, series?: DtChartSeries[], theme?: DtTheme): HighchartsOptions {
  const mergedSeries = series ? lodashMerge([], series) : undefined;
  let mergedOptions = lodashMerge({ series: mergedSeries }, DT_CHART_DEFAULT_OPTIONS, options) as HighchartsOptions;
  mergedOptions = mergeAxis(mergedOptions);
  mergedOptions = wrapTooltipFormatterFn(mergedOptions, options && options.tooltip && options.tooltip.formatter);
  if (theme) {
    mergedOptions = mergeHighchartsColorOptions(mergedOptions, theme);
  }
  return mergedOptions;
}

/** Applies correct color palette depending on the number of metrics. */
export function applyHighchartsColorOptions(options: HighchartsOptions, theme: DtTheme): HighchartsOptions {
  return mergeHighchartsColorOptions(lodashMerge({}, options), theme);
}

/** Merge all axis of provide options with default axis styles. */
function mergeAxis(options: HighchartsOptions): HighchartsOptions {
  const axisTypes = ['xAxis', 'yAxis'];
  axisTypes.forEach((axisType) => {
    let axis: AxisOptions | AxisOptions[] = options[axisType];
    if (axis) {
      axis = Array.isArray(axis) ?
        axis.map((a) => lodashMerge({}, DT_CHART_DEFAULT_AXIS_STYLES, a)) :
        lodashMerge({}, DT_CHART_DEFAULT_AXIS_STYLES, axis);
    }
  });
  return options;
}

/** Wraps the highcharts tooltip formatter function into a custom one, to apply a wrapper element for styling. */
function wrapTooltipFormatterFn(
  options: HighchartsOptions, formatterFn: () => string | boolean = defaultTooltipFormatter): HighchartsOptions {
  options.tooltip!.formatter = function(): string | boolean {
    const tooltipFormatterFuncBound = formatterFn.bind(this);
    return `<div class="dt-chart-tooltip">${tooltipFormatterFuncBound()}</div>`;
  };
  return options;
}

/** Merges the correct color palette depending on the number of metrics into the options. */
function mergeHighchartsColorOptions(options: HighchartsOptions, theme: DtTheme): HighchartsOptions {
  let nrOfMetrics: number;
  // Number of metrics is different depending on the chart type.
  if (isPieChartOptions(options)) {
    const pieSeries = options.series![0];
    nrOfMetrics = pieSeries.data ? pieSeries.data.length : 0;
  } else {
    nrOfMetrics = options.series ? options.series.length : 0;
  }

  const palette = theme && theme.name && DT_CHART_COLOR_PALETTES[theme.name] ?
  DT_CHART_COLOR_PALETTES[theme.name] : DT_CHART_COLOR_PALETTE_ORDERED;

  options.colors = nrOfMetrics <= DT_CHART_THEME_COLOR_MAX_LENGTH ? palette : DT_CHART_COLOR_PALETTE_ORDERED;
  return options;
}

/** Whether the provided highcharts options for a pie chart. */
function isPieChartOptions(options: HighchartsOptions): boolean {
  return !!(options.chart && options.chart.type === 'pie' &&
         options.series && options.series.length === 1);
}
