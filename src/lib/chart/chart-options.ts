import { DtChartOptions } from './chart';

export const DEFAULT_CHART_OPTIONS: DtChartOptions = {
  chart: {
    style: {
      fontFamily: 'BerninaSans',
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
};
