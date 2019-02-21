import { Component } from '@angular/core';

@Component({
  selector: 'chart-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss'],
})
export class ChartDemo {

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
      },
      {
        title: null,
        labels: {
          format: '{value}/min',
        },
        opposite: true,
        tickInterval: 50,
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
  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Requests',
      type: 'column',
      yAxis: 1,
      data: [
        [1370304000000, 96],
        [1370304900000, 48],
        [1370305800000, 198],
        [1370306700000, 0],
        [1370307600000, 165],
        [1370308500000, 142],
        [1370309400000, 25],
        [1370310300000, 67],
        [1370311200000, 106],
        [1370312100000, 67],
        [1370313000000, 162],
        [1370313900000, 149],
        [1370314800000, 38],
        [1370315700000, 2],
        [1370316600000, 45],
        [1370317500000, 120],
        [1370318400000, 191],
        [1370319300000, 156],
        [1370320200000, 71],
        [1370321100000, 192],
        [1370322000000, 48],
        [1370322900000, 98],
        [1370323800000, 67],
        [1370324700000, 65],
        [1370325600000, 167],
        [1370326500000, 167],
        [1370327400000, 131],
        [1370328300000, 38],
        [1370329200000, 103],
        [1370330100000, 71],
        [1370331000000, 118],
        [1370331900000, 54],
        [1370332800000, 190],
        [1370333700000, 152],
        [1370334600000, 169],
        [1370335500000, 14],
        [1370336400000, 112],
        [1370337300000, 140],
        [1370338200000, 33],
        [1370339100000, 74],
      ],
    }];
}
