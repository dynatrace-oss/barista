// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  template: '<dt-chart [options]="options" [series]="series"></dt-chart>',
})
@OriginalClassName('ChartPieExampleComponent')
export class ChartPieExampleComponent {
  options: Highcharts.Options = {
    chart: {
      type: 'pie',
    },
    tooltip: {
      formatter(): string | boolean {
        return `${this.key}&nbsp${this.y}%`;
      },
    },
    legend: {
      align: 'right',
      borderWidth: 0,
      enabled: true,
      layout: 'vertical',
      symbolRadius: 0,
      verticalAlign: 'middle',
      floating: true,
    },
    plotOptions: {
      pie: {
        showInLegend: true,
      },
    },
  };

  series: Highcharts.IndividualSeriesOptions[] = [{
    name: 'Browsers',
    data: [
      {
        name: 'Chrome',
        y: 55,
      },
      {
        name: 'Firefox',
        y: 25,
      },
      {
        name: 'Edge',
        y: 15,
      }],
    }];
}

// tslint:enable:no-magic-numbers
