import { DtChartOptions } from './chart';
import { Colors } from '../theming/colors';
import { AxisOptions } from 'highcharts';
(Math as any).easeInOutExpo= function(pos) {
    if(pos===0) return 0;
    if(pos===1) return 1;
    if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
  };

export const DEFAULT_CHART_OPTIONS: DtChartOptions = {
  chart: {
    style: {
      fontFamily: 'BerninaSansWeb',
    },
    height: 230,
    plotBorderColor: Colors.GRAY_300,
    plotBorderWidth: 1,
    spacingBottom: 12,
    spacingTop: 12,
    animation: false,
  },

  plotOptions: {
          series: {
              animation: {
                  duration: 600,
                  easing: 'easeInOutExpo'
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
