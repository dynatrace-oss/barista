import { DataPoint } from 'highcharts';
import { DtChartOptions } from '@dynatrace/angular-components/chart';

export const _DT_MICROCHART_DEFAULT_OPTIONS: DtChartOptions = {
  chart: {
    height: 150,
    plotBorderWidth: 0,
    marginTop: 15,
    marginBottom: 30,
    spacingBottom: 0,
    spacingTop: 0,
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      marker: {
        enabled: true,
        states: {
          hover: {
            halo: false,
            lineWidth: 0,
            lineWidthPlus: 0,
          },
        },
      },
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

export const _DT_MICROCHART_MINMAX_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    enabled: true,
  },
  marker: {
    enabled: true,
    radius: 7,
    lineWidth: 2,
  },
};

export const _DT_MICROCHART_LINE_MIN_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    verticalAlign: 'top',
    y: 3,
  },
};

export const _DT_MICROCHART_LINE_MAX_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    verticalAlign: 'bottom',
    y: -3,
  },
};

export const _DT_MICROCHART_COLUMN_MINMAX_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'bottom',
  },
  borderWidth: 2,
};
