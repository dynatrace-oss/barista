import { DtChartOptions } from './chart';
import { Colors } from '../theming/colors';
import { AxisOptions } from 'highcharts';

export const DEFAULT_CHART_OPTIONS: DtChartOptions = {
  chart: {
    style: {
      fontFamily: 'BerninaSansWeb',
    },
    height: 300,
    plotBorderColor: Colors.GRAY_300,
    plotBorderWidth: 1,
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    useHTML: true,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadow: false,
  },
  legend: {
    itemStyle: {
      fontWeight: 'normal',
      fontSize: '12px',
      color: Colors.GRAY_700,
    },
    itemHoverStyle: {
      color: Colors.GRAY_900,
    },
    itemHiddenStyle: {
      color: Colors.GRAY_300,
    },
  },
};

export const DEFAULT_CHART_AXIS_STYLES: AxisOptions = {
  labels: {
    style: {
      fontSize: '12px',
    },
  },
  tickWidth: 1,
  tickLength: 4,
};
