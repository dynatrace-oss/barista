/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  AxisOptions,
  Options as HighchartsOptions,
  SeriesPieOptions,
} from 'highcharts';
import { merge as lodashMerge } from 'lodash-es';

import {
  DtTheme,
  getDtChartColorPalette,
} from '@dynatrace/barista-components/theming';

import { DtChartOptions, DtChartSeries } from '../chart.interface';
import {
  DT_CHART_DEFAULT_AXIS_STYLES,
  DT_CHART_DEFAULT_OPTIONS,
} from '../chart-options';

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
  axisTypes.forEach((axisType) => {
    let axis: AxisOptions | AxisOptions[] = options[axisType];
    if (axis) {
      axis = Array.isArray(axis)
        ? axis.map((a) => lodashMerge({}, DT_CHART_DEFAULT_AXIS_STYLES, a))
        : lodashMerge({}, DT_CHART_DEFAULT_AXIS_STYLES, axis);
      options[axisType] = axis;
    }
  });
  return options;
}

/**
 * Ensures that a formatter function is set and returns false
 * this is needed because we use a custom event inside the refresh function of Highcharts
 * to receive the data every time the formatter function is called by highcharts
 */
function wrapTooltipFormatterFn(options: HighchartsOptions): HighchartsOptions {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  options.tooltip!.formatter = function (): string | false {
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
    const pieSeries = options.series?.[0] as SeriesPieOptions;
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
