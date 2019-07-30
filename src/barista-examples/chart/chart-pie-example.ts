// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-tooltip>
        <ng-template let-tooltip>
          {{ tooltip.x }} {{ tooltip.point.colorIndex }}
        </ng-template>
      </dt-chart-tooltip>
    </dt-chart>
  `,
})
export class ChartPieExample {
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

  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Browsers',
      data: [
        {
          name: 'Firefox',
          y: 25,
        },
        {
          name: 'Chrome',
          y: 55,
        },
        {
          name: 'Edge',
          y: 15,
        },
      ],
    },
  ];
}

// tslint:enable:no-magic-numbers
