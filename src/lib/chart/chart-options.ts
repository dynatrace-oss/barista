import { DtColors } from '@dynatrace/angular-components/theming';
import { AxisOptions, GlobalOptions } from 'highcharts';
import { DtChartOptions } from './chart';

// tslint:disable:no-magic-numbers
/** Custom highcharts easing function */
const DT_CHART_EASEINOUT = (pos: number): number => {
  if (pos === 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  if (pos * 2 < 1) {
    return Math.pow(2, (pos * 2 - 1) * 10) * 0.5;
  }
  return (-Math.pow(2, (pos * 2 - 1) * -10) + 2) * 0.5;
};
// tslint:enable:no-magic-numbers

export const DT_CHART_DEFAULT_OPTIONS: DtChartOptions = {
  chart: {
    style: {
      fontFamily: 'BerninaSansWeb',
    },
    height: 230,
    plotBorderColor: DtColors.GRAY_300,
    plotBorderWidth: 1,
    plotBackgroundColor: 'transparent',
    spacingBottom: 12,
    spacingTop: 16,
    animation: false,
    backgroundColor: 'transparent',
  },
  plotOptions: {
    series: {
      animation: {
        duration: 1000,
        // tslint:disable-next-line:no-any
        easing: DT_CHART_EASEINOUT as any, // As any to bypass highcharts types
      },
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    shared: true,
  },
  legend: {
    itemStyle: {
      fontWeight: 'normal',
      fontSize: '12px',
      color: DtColors.GRAY_700,
    },
    itemHoverStyle: {
      color: DtColors.GRAY_900,
    },
    itemHiddenStyle: {
      color: DtColors.GRAY_300,
    },
  },
};

export const DT_CHART_DEFAULT_AXIS_STYLES: AxisOptions = {
  labels: {
    style: {
      fontSize: '12px',
      color: DtColors.GRAY_700,
    },
  },
  tickWidth: 1,
  tickLength: 4,
};

export const DT_CHART_DEFAULT_GLOBAL_OPTIONS: GlobalOptions = {
  lang: {
    numericSymbols: ['k', 'mil', 'bil'],
  },
  time: {
    useUTC: false,
  },
};
