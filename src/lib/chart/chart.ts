import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

export type ChartType = 'line' | 'bar' | 'pie';

@Component({
  moduleId: module.id,
  selector: 'dt-chart',
  styleUrls: ['./chart.scss'],
  templateUrl: './chart.html',
  exportAs: 'dtChart',
})
export class DtChart implements AfterViewInit {
  @ViewChild('container') container: ElementRef;

  private _options: Highcharts.Options = {};
  private _chartObject: Highcharts.ChartObject;

  @Input()
  get type(): string | undefined {
    return this._options.chart && this._options.chart.type;
  }
  set type(t: string | undefined) {
    if (t) {
      if (!this._options.chart) {
        this._options.chart = {};
      }
      this._options.chart.type = t;
    }
  }

  ngAfterViewInit(): void {
    this._chartObject = Highcharts.chart(this.container.nativeElement, this._options);
  }
}
