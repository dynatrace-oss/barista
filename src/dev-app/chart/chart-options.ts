export const chartOptions = {
  time: {
    useUTC: false,
  },
  chart: {
    height: 250,
  },
  xAxis: {
    crosshair: {
      color: '#00a1b2',
      width: 2,
      zIndex: 10,
    },
    type: 'datetime',
  },
  yAxis: {
    softMin: 0,
    title: {
      text: 'Stacktrace samples',
    },
    labels: {},
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      skipNullPoints: true,
    },
    column: {
      stacking: 'normal',
      groupPadding: 0,
      borderWidth: 0,
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
  legend: {
    align: 'center',
    borderWidth: 0,
    enabled: true,
    layout: 'horizontal',
    symbolRadius: 0,
  },
};
