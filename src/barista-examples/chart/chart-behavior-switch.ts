import { Component } from '@angular/core';

import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    View
    <dt-button-group>
      <dt-button-group-item (selectionChange)="switchBehavior($event)"
        >CPU usage</dt-button-group-item
      >
      <dt-button-group-item (selectionChange)="switchBehavior($event)"
        >Connectivity</dt-button-group-item
      >
      <dt-button-group-item (selectionChange)="switchBehavior($event)"
        >Retransmissions</dt-button-group-item
      >
    </dt-button-group>
    <dt-chart [options]="selectOptions()" [series]="selectSeries()">
      <dt-chart-tooltip>
        <ng-template let-tooltip>
          <dt-key-value-list style="min-width: 100px">
            <dt-key-value-list-item *ngFor="let data of tooltip.points">
              <dt-key-value-list-key>
                {{ data.series.name }}
              </dt-key-value-list-key>
              <dt-key-value-list-value>
                {{ data.point.y }}
              </dt-key-value-list-value>
            </dt-key-value-list-item>
          </dt-key-value-list>
        </ng-template>
      </dt-chart-tooltip>
    </dt-chart>
  `,
})
export class ChartBehaviorSwitch {
  currentBehavior = 'CPU usage';

  // tslint:disable-next-line: no-any
  switchBehavior(event: any): void {
    this.currentBehavior = event.value;
  }

  selectOptions(): Highcharts.Options {
    let options: Highcharts.Options = {};

    options = {
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: null,
          labels: {
            format: '{value} %',
          },
          tickInterval: 5,
        },
        {
          title: null,
          labels: {
            format: '{value}',
          },
          opposite: true,
          tickInterval: 1,
        },
      ],
      plotOptions: {
        column: {
          stacking: 'normal',
        },
        series: {
          marker: {
            enabled: false,
          },
        },
      },
    };

    return options;
  }

  selectSeries(): Highcharts.IndividualSeriesOptions[] {
    let series: Highcharts.IndividualSeriesOptions[] = [];
    // tslint:disable-next-line: prefer-switch
    if (this.currentBehavior === 'CPU usage') {
      series = [
        {
          name: 'CPU usage',
          type: 'line',
          data: generateData(40, 20, 35, 1370304000000, 900000),
          color: '#92d9f8',
        },
        {
          name: 'Number of process group instances',
          type: 'column',
          yAxis: 1,
          data: generateData(40, 1, 4, 1370304000000, 900000),
          color: '#006bba',
        },
      ];
    } else if (this.currentBehavior === 'Connectivity') {
      series = [
        {
          name: 'Network utilization',
          type: 'area',
          data: generateData(60, 20, 40, 1370304000000, 900000),
          color: '#e8cbfa',
        },
        {
          name: 'Connections per day',
          type: 'column',
          yAxis: 1,
          data: generateData(60, 10, 40, 1370304000000, 900000),
          color: '#9355b7',
        },
      ];
    } else if (this.currentBehavior === 'Retransmissions') {
      series = [
        {
          name: 'Number of retransmissions',
          type: 'column',
          data: generateData(40, 20, 35, 1370304000000, 900000),
          color: '#fff5b7',
        },
        {
          name: 'Server usage',
          type: 'line',
          yAxis: 1,
          data: generateData(40, 15, 100, 1370304000000, 900000),
          color: '#f5d30f',
        },
      ];
    }
    return series;
  }
}
