import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import {
  DtChartModule,
  DtChartRange,
  DtChartTimestamp,
  DtSelectChange,
  DtThemingModule,
} from '@dynatrace/angular-components';
// tslint:disable:no-magic-numbers

fdescribe('DtChart Selection Area', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [TestChartComponent],
    });
    TestBed.compileComponents();
  }));

  it('', async(() => {}));
});

@Component({
  selector: 'test-chart',
  template: `
<dt-chart [options]="options" [series]="series">

  <dt-chart-timestamp></dt-chart-timestamp>
  <dt-chart-range></dt-chart-range>

</dt-chart>
  `,
})
export class TestChartComponent {
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
      data: generateData(40, 0, 250, 1370304000000, 900000),
    },
  ];

  timeValues: number[] = this.series[0].data!.map((data) => data[0]);
  startRange: number;
  endRange: number;

  @ViewChild(DtChartTimestamp) timestamp: DtChartTimestamp;
  @ViewChild(DtChartRange) range: DtChartRange;

  changeRange(event: DtSelectChange<number>): void {
    this.range.value = [this.startRange, this.endRange];
  }

  changeTimestamp(event: DtSelectChange<number>): void {
    this.timestamp.value = event.value;
  }
}

function randomize(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number
): Array<[number, number]> {
  return Array.from(Array(amount).keys()).map(
    (v) =>
      [timestampStart + timestampTick * v, randomize(min, max)] as [
        number,
        number
      ]
  );
}
