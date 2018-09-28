import { DataPoint } from 'highcharts';
import { DtChartOptions } from '../chart';

export const DEFAULT_CHART_MICROCHART_OPTIONS: DtChartOptions = {
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
      allowPointSelect: true,
    },
    line: {
      states: {
        hover: {
          halo: false,
        },
      },
    },
    series: {
      marker: {
        enabled: true,
        states: {
          hover: {
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
    },
  },
  legend: {
    enabled: false,
  },
  xAxis: {},
  yAxis: {},
};

export const MINMAX_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    enabled: true,
  },
  marker: {
    enabled: true,
    radius: 7,
  },
};

export const LINE_MIN_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    verticalAlign: 'top',
    y: 3,
  },
};

export const LINE_MAX_DATAPOINT_OPTIONS: DataPoint = {
  dataLabels: {
    verticalAlign: 'bottom',
    y: -3,
  },
};

export const COLUMN_MINMAX_DATAPOINT_OPTIONS = {
  dataLabels: {
    verticalAlign: 'bottom',
  },
  borderWidth: 2,
};
