import { DataPoint } from 'highcharts';
import { DtChartOptions } from '@dynatrace/angular-components/chart';
import { DtMicroChartColorPalette } from './micro-chart-colors';
import { Colors } from '@dynatrace/angular-components/theming';

export function createDtMicrochartDefaultOptions(palette: DtMicroChartColorPalette): DtChartOptions {
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
              halo: false,
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
          overflow: 'none',
          style: {
            fontWeight: 'normal',
          },
        },
        states: {
          hover: {
            halo: false,
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

export function createDtMicrochartMinMaxDataPointOptions(palette: DtMicroChartColorPalette): DataPoint {
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
        color: Colors.GRAY_500,
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
  // tslint:disable-next-line:no-any
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
