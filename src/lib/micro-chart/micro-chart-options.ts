import { DataPoint } from 'highcharts';
import { DtChartOptions } from '@dynatrace/angular-components/chart';
import { DtMicroChartColorPalette } from './micro-chart-colors';

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
        states: {
          hover: {
            color: palette.lighter,
          },
          select: {
            color: palette.darker,
          },
        },
      },
      line: {
        marker: {
          enabled: true,
          states: {
            hover: {
              fillColor: palette.lighter,
              radius: 7,
              halo: false,
              lineWidth: 2,
              lineWidthPlus: 0,
              lineColor: palette.primary,
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
    dataLabels: {
      enabled: true,
    },
    marker: {
      lineColor: palette.darker,
      enabled: true,
      radius: 7,
      lineWidth: 2,
      states: {
        hover: {
          lineColor: palette.darker,
          fillColor: palette.lighter,
        },
      },
    },
  };
}

export const _DT_MICROCHART_LINE_MIN_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'top',
    y: 3,
  },
};

export const _DT_MICROCHART_LINE_MAX_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'bottom',
    y: -3,
  },
};

export function createDtMicrochartDefaultColumnDataPointOption(palette: DtMicroChartColorPalette): DataPoint {
  return {
    borderColor: palette.darker,
    dataLabels: {
      verticalAlign: 'bottom',
    },
    borderWidth: 2,
  // tslint:disable-next-line:no-any
  } as any;
}
