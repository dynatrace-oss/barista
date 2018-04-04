import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, ChangeDetectionStrategy } from '@angular/core';
import * as Highcharts from 'highcharts';

export type ChartType = 'line' | 'column' | 'pie';
const defaultChartType = 'line';

@Component({
  moduleId: module.id,
  selector: 'dt-chart',
  styleUrls: ['./chart.scss'],
  templateUrl: './chart.html',
  exportAs: 'dtChart',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtChart implements AfterViewInit {
  @ViewChild('container') container: ElementRef;

  private _options: Highcharts.Options = {
    chart: {},
    title: {
      text: 'Monthly Average Rainfall',
    },
    subtitle: {
      text: 'Source: WorldClimate.com',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Rainfall (mm)',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [{
      name: 'Tokyo',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    }, {
      name: 'New York',
      data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
    }],
  };
  private _chartObject: Highcharts.ChartObject;

  @Input()
  get type(): ChartType {
    return this._options.chart!.type as ChartType;
  }
  set type(value: ChartType) {
    const type = value || defaultChartType;
    if (!this._options.chart) {
      this._options.chart = {};
    }
    if (this._options.chart.type !== value && this._chartObject) {
      this._options.chart.type = value;
      console.log('test', value);
      this._chartObject.update(this._options, true);
    }
  }

  ngAfterViewInit(): void {
    this._chartObject = Highcharts.chart(this.container.nativeElement, this._options);
  }

  addSeries(series: Highcharts.IndividualSeriesOptions): void {
    this._chartObject.addSeries(series);
  }
}
