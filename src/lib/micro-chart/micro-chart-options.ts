import { DataPoint } from 'highcharts';
import { DtChartOptions } from '@dynatrace/angular-components/chart';
import { DtMicroChartColorPlaceholder } from './micro-chart-colorizer';

export const _DT_MICROCHART_DEFAULT_OPTIONS: DtChartOptions = {
  colors: [DtMicroChartColorPlaceholder.PRIMARY],
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
          color: DtMicroChartColorPlaceholder.TERTIARY,
        },
        select: {
          color: DtMicroChartColorPlaceholder.SECONDARY,
        },
      },
    },
    line: {
      marker: {
        enabled: true,
        states: {
          hover: {
            fillColor: DtMicroChartColorPlaceholder.TERTIARY,
            radius: 7,
            halo: false,
            lineWidth: 2,
            lineWidthPlus: 0,
            lineColor: DtMicroChartColorPlaceholder.PRIMARY,
          },
          select: {
            radius: 7,
            fillColor: DtMicroChartColorPlaceholder.SECONDARY,
          },
        },
      },
    },
    series: {
      allowPointSelect: true,
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
    lineColor: DtMicroChartColorPlaceholder.SECONDARY,
    enabled: true,
    radius: 7,
    lineWidth: 2,
    states: {
      hover: {
        lineColor: DtMicroChartColorPlaceholder.SECONDARY,
        fillColor: DtMicroChartColorPlaceholder.TERTIARY,
      },
    },
  },
};

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

export const _DT_MICROCHART_COLUMN_MINMAX_DATAPOINT_OPTIONS = {
  borderColor: DtMicroChartColorPlaceholder.SECONDARY,
  dataLabels: {
    verticalAlign: 'bottom',
  },
  borderWidth: 2,
};
