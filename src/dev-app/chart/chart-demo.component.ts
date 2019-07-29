// tslint:disable no-magic-numbers no-any max-file-line-count
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {
  generateAreaRangeData,
  generateData,
} from '../../barista-examples/chart/chart-data-utils';
import { DtSelectChange } from '../../lib';
import { DtChartRange } from '../../lib/chart/range/range';
import { DtChartTimestamp } from '../../lib/chart/timestamp/timestamp';

@Component({
  selector: 'chart-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDemo {
  validRange = false;
  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: {
          text: null,
        },
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
      },
      {
        title: {
          text: null,
        },
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
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  };
  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Requests',
      type: 'line',
      yAxis: 1,
      data: [
        [1563429600000, 96],
        [1563429900000, 48],
        [1563430200000, 198],
        [1563430500000, 0],
        [1563430800000, 165],
        [1563431100000, 142],
        [1563431400000, 25],
        [1563431700000, 68],
        [1563432000000, 78],
        [1563432300000, 54],
        [1563432600000, 56],
        [1563432900000, 123],
        [1563433200000, 89],
        [1563433500000, 45],
        [1563433800000, 74],
        [1563434100000, 156],
        [1563434400000, 34],
        [1563434700000, 89],
        [1563435000000, 57],
        [1563435300000, 34],
        [1563435600000, 103],
        [1563435900000, 34],
        [1563436200000, 56],
        [1563436500000, 150],
        [1563436800000, 112],
        // [1370304000000, 96],
        // [1370304900000, 48],
        // [1370305800000, 198],
        // [1370306700000, 0],
        // [1370307600000, 165],
        // [1370308500000, 142],
        // [1370309400000, 25],
        // [1370310300000, 67],
        // [1370311200000, 106],
        // [1370312100000, 67],
        // [1370313000000, 162],
        // [1370313900000, 149],
        // [1370314800000, 38],
        // [1370315700000, 2],
        // [1370316600000, 45],
        // [1370317500000, 120],
        // [1370318400000, 191],
        // [1370319300000, 156],
        // [1370320200000, 71],
        // [1370321100000, 192],
        // [1370322000000, 48],
        // [1370322900000, 98],
        // [1370323800000, 67],
        // [1370324700000, 65],
        // [1370325600000, 167],
        // [1370326500000, 167],
        // [1370327400000, 131],
        // [1370328300000, 38],
        // [1370329200000, 103],
        // [1370330100000, 71],
        // [1370331000000, 118],
        // [1370331900000, 54],
        // [1370332800000, 190],
        // [1370333700000, 152],
        // [1370334600000, 169],
        // [1370335500000, 14],
        // [1370336400000, 112],
        // [1370337300000, 140],
        // [1370338200000, 33],
        // [1370339100000, 74],
      ],
    },
  ];

  timeValues: number[] = this.series[0].data!.map(data => data[0]);
  startRange: number;
  endRange: number;

  @ViewChild(DtChartTimestamp, { static: true }) timestamp: DtChartTimestamp;
  @ViewChild(DtChartRange, { static: true }) range: DtChartRange;

  changeRange(event: DtSelectChange<number>): void {
    this.range.value = [this.startRange, this.endRange];
  }

  changeTimestamp(event: DtSelectChange<number>): void {
    this.timestamp.value = event.value;
  }

  rangeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  lineChartWithGapsOptions: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: {
          text: null,
        },
        type: 'linear',
        tickInterval: 25,
        labels: {
          format: '{value} %',
        },
      },
    ],
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  };
  lineChartWithGapsSeries: Highcharts.LineChartSeriesOptions[] = [
    {
      name: 'Requests',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
    {
      name: 'Failed requests',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
    {
      name: 'Failure rate',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
  ];

  barChartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
    },
    xAxis: {
      title: {
        text: null,
      },
      categories: [
        'First item',
        'Second item',
        'Third item',
        'Fourth item',
        'Fifth item',
      ],
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: '{value} %',
      },
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        shadow: false,
        innerSize: '80%',
        borderWidth: 0,
      },
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  };
  barChartSeries: Highcharts.BarChartSeriesOptions[] = [
    {
      name: 'Metric',
      data: [60, 86, 25, 43, 28],
    },
  ];

  donutChartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      plotBorderWidth: 0,
    },
    legend: {
      align: 'right',
      enabled: true,
      layout: 'vertical',
      symbolRadius: 0,
      verticalAlign: 'middle',
      floating: true,
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        shadow: false,
        innerSize: '80%',
        borderWidth: 0,
      },
    },
  };
  donutChartSeries: Highcharts.PieChartSeriesOptions[] = [
    {
      data: [
        {
          name: 'Canada',
          y: 55,
        },
        {
          name: 'Italy',
          y: 25,
        },
        {
          name: 'United States',
          y: 15,
        },
        {
          name: 'France',
          y: 5,
        },
      ],
    },
  ];

  lineChartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      title: {
        text: null,
      },
      type: 'datetime',
    },
    yAxis: [
      {
        title: {
          text: null,
        },
        labels: {
          format: '{value} ms',
        },
        tickInterval: 25,
      },
    ],
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  };
  lineChartSeries: Highcharts.LineChartSeriesOptions[] = [
    {
      name: 'Host 1',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 2',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 3',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 4',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 5',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 6',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
  ];

  private _minMaxChartLineSeries = generateData(
    20,
    20,
    40,
    1370304000000,
    900000,
  );
  minMaxChartOptions: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: null,
      },
      type: 'datetime',
      labels: {
        format: '{value} ms',
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
      arearange: {
        lineWidth: 0,
        states: {
          hover: undefined,
        },
      },
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  };
  minMaxChartSeries: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Bar 1',
      type: 'column',
      data: generateData(20, 20, 40, 1370304000000, 900000),
    },
    {
      name: 'Area 1',
      type: 'arearange',
      data: generateAreaRangeData(this._minMaxChartLineSeries, 4, 8),
    },
    {
      name: 'Line 1',
      type: 'line',
      data: this._minMaxChartLineSeries,
    },
  ];
}
