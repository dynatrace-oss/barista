/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { AxisOptions, GlobalOptions } from 'highcharts';

import { DtColors } from '@dynatrace/barista-components/theming';

import { DtChartOptions } from './chart';

// tslint:disable:no-magic-numbers
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
// tslint:enable:no-magic-numbers

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
      animation: {
        duration: 1000,
        // tslint:disable-next-line:no-any
        easing: DT_CHART_EASEINOUT as any, // As any to bypass highcharts types
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
        // tslint:disable-next-line:no-any
        legendItemClick: (e: any) => {
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
    text: null,
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

export const DT_CHART_DEFAULT_GLOBAL_OPTIONS: GlobalOptions = {
  lang: {
    numericSymbols: ['k', 'mil', 'bil'],
  },
  time: {
    useUTC: true,
    timezoneOffset: new Date().getTimezoneOffset(),
  },
};
