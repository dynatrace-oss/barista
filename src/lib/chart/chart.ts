import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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
export class DtChart implements AfterViewInit, OnDestroy {
  @ViewChild('container') container: ElementRef;

  private _options: Highcharts.Options = {};
  private _chartObject: Highcharts.ChartObject;
  private _dataSub: Subscription;

  @Input()
  get options(): Highcharts.Options {
    return this._options;
  }
  set options(value: Highcharts.Options) {
    this._options = value;
    this.update();
  }

  @Input()
  get data(): Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined {
    return this._options.series;
  }
  set data(series: Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined) {

    if (series instanceof Observable) {
      if (this._dataSub) {
        this._dataSub.unsubscribe();
      }
      console.log('data set', series);
      this._dataSub = series.subscribe((s: Highcharts.IndividualSeriesOptions[]) => {
        this._updateData(s);
      });
    } else {
      this._updateData(series);
    }
  }

  _updateData(series: Highcharts.IndividualSeriesOptions[] | undefined): void {
    this._options.series = series || [];
    this.update();
  }

  update(redraw: boolean = true, oneToOne: boolean = true): void {
    if (this._chartObject) {
      this._chartObject.update(this._options, redraw, oneToOne);
    }
  }

  ngAfterViewInit(): void {
    this._chartObject = Highcharts.chart(this.container.nativeElement, this._options);
  }

  ngOnDestroy(): void {
    this._chartObject.destroy();
    this._dataSub.unsubscribe();
  }
}
