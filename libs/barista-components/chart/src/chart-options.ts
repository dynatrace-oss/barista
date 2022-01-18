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
  Options,
  SeriesLegendItemClickEventObject,
} from 'highcharts';

import { DtColors } from '@dynatrace/barista-components/theming';

import { DtChartOptions } from './chart.interface';

/* eslint-disable no-magic-numbers */
/** Custom highcharts easing function */
const DT_CHART_EASEINOUT = (pos: number): number => {
  if (pos === 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  if (pos * 2 < 1) {
    return Math.pow(2, (pos * 2 - 1) * 10) * 0.5;
  }
  return (-Math.pow(2, (pos * 2 - 1) * -10) + 2) * 0.5;
};
/* eslint-enable no-magic-numbers */

export const DT_CHART_DEFAULT_OPTIONS: DtChartOptions = {
  chart: {
    style: {
      fontFamily: "'BerninaSansWeb', 'OpenSans', sans-serif",
    },
    height: 230,
    plotBorderColor: DtColors.GRAY_300,
    plotBorderWidth: 1,
    plotBackgroundColor: 'transparent',
    spacingBottom: 12,
    spacingTop: 16,
    animation: false,
    backgroundColor: 'transparent',
  },
  plotOptions: {
    series: {
      states: {
        inactive: {
          // This handles enabling / disabling the inactive state
          // Inactive state happens for example when a series has data missing (null as value for datapoints)
          // by default the series in area charts gets hidden up from v7. Setting this to 1 disables this behavior
          opacity: 1,
        },
      },
      animation: {
        duration: 1000,
        easing: DT_CHART_EASEINOUT,
      },
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      events: {
        legendItemClick: (e: SeriesLegendItemClickEventObject) => {
          const chart = e.target.chart;
          const visibleSeriesCount = chart.series.reduce(
            (counter: number, s) => (s.visible ? counter + 1 : counter),
            0,
          );
          if (e.target.visible && visibleSeriesCount <= 1) {
            e.preventDefault();
          }
        },
      },
    },
  },
  title: {
    text: undefined,
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    shared: true,
    followTouchMove: false,
  },
  legend: {
    itemStyle: {
      fontWeight: 'normal',
      fontSize: '12px',
      color: DtColors.GRAY_700,
    },
    itemHoverStyle: {
      color: DtColors.GRAY_900,
    },
    itemHiddenStyle: {
      color: DtColors.GRAY_300,
    },
  },
};

export const DT_CHART_DEFAULT_AXIS_STYLES: AxisOptions = {
  labels: {
    style: {
      fontSize: '12px',
      color: DtColors.GRAY_700,
    },
  },
  tickWidth: 1,
  tickLength: 4,
};

export const DT_CHART_DEFAULT_GLOBAL_OPTIONS: Options = {
  lang: {
    numericSymbols: ['k', 'mil', 'bil'],
  },
  time: {
    useUTC: true,
    timezoneOffset: new Date().getTimezoneOffset(),
  },
};
