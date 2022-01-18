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

import { PointOptionsObject } from 'highcharts';

import { DtChartOptions } from '@dynatrace/barista-components/chart';
import { DtColors } from '@dynatrace/barista-components/theming';

import { DtMicroChartColorPalette } from './micro-chart-colors';

export function createDtMicrochartDefaultOptions(
  palette: DtMicroChartColorPalette,
): DtChartOptions {
  return {
    colors: [palette.primary],
    chart: {
      height: 150,
      plotBorderWidth: 0,
      marginTop: 15,
      marginBottom: 30,
      spacingBottom: 0,
      spacingTop: 0,
    },
    plotOptions: {
      column: {
        borderWidth: 1,
        borderColor: palette.primary,
        clip: false,
        color: palette.primary,
        minPointLength: 1,
        stacking: 'normal',
        states: {
          hover: {
            borderColor: palette.primary,
            borderWidth: 4,
            color: palette.primary,
          },
          select: {
            color: palette.darker,
          },
        },
      },
      line: {
        lineWidth: 2,
        marker: {
          radius: 4,
          enabled: true,
          states: {
            hover: {
              radius: 4,
              lineWidth: 2,
              lineWidthPlus: 0,
              lineColor: palette.primary,
              fillColor: palette.primary,
            },
            select: {
              radius: 7,
              fillColor: palette.darker,
            },
          },
        },
      },
      series: {
        dataLabels: {
          crop: false,
          style: {
            fontWeight: 'normal',
          },
        },
        marker: {
          enabled: true,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    xAxis: {},
    yAxis: {},
  };
}

export function createDtMicrochartMinMaxDataPointOptions(
  palette: DtMicroChartColorPalette,
): PointOptionsObject {
  return {
    color: palette.darker,
    borderColor: palette.darker,
    borderWidth: 2,
    states: {
      hover: {
        color: palette.darker,
        borderColor: palette.darker,
        borderWidth: 4,
      },
    },
    dataLabels: {
      align: 'center',
      color: DtColors.GRAY_500,
      enabled: true,
    },
    marker: {
      fillColor: palette.darker,
      lineColor: palette.darker,
      enabled: true,
      radius: 5,
      lineWidth: 2,
      states: {
        hover: {
          fillColor: palette.darker,
          lineColor: palette.darker,
          radius: 6,
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

export const _DT_MICROCHART_MIN_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'top',
    y: 3,
  },
};

export const _DT_MICROCHART_MAX_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'bottom',
    y: -3,
  },
};

export const _DT_MICROCHART_COLUMN_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'bottom',
    inside: false,
  },
};
