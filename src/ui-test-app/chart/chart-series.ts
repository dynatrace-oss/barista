// tslint:disable: max-file-line-count no-magic-numbers
import { generateData } from '@dynatrace/angular-components/testing';

export const series: Highcharts.IndividualSeriesOptions[] = [
  {
    name: 'Requests',
    type: 'column',
    yAxis: 1,
    data: generateData(40, 0, 200, 1370304000000, 900000),
  },
];
