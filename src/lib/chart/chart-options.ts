import { DtChartOptions } from './chart';
import { Colors } from '../theming/colors';

export const DEFAULT_CHART_OPTIONS: DtChartOptions = {
  chart: {
    style: {
      fontFamily: 'BerninaSansWeb',
    },
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
      fontSize: '10px',
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
