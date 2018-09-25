import {DataPoint} from 'highcharts';
import {DtChartOptions} from '../chart';

export const DEFAULT_CHART_MICROCHART_OPTIONS: DtChartOptions = {
  chart: {
    height: 150,
    plotBorderWidth: 0,
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
      dataLabels: {
        crop: false,
        overflow: 'none',
        style: {
          fontWeight: 'normal',
        },
      },
    },
  },
  legend: {
    enabled: false,
  },
};

export const DEFAULT_MINMAX_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    enabled: true,
  },
  marker: {
    enabled: true,
  },
};

export const DEFAULT_MIN_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    verticalAlign: 'top',
    y: 3,
  },
};

export const DEFAULT_MAX_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    verticalAlign: 'bottom',
    y: -3,
  },
};
