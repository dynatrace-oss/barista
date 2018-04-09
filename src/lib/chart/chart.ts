import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  Output,
  Optional,
  ChangeDetectorRef,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ViewportResizer } from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs/Subject';
import { SeriesOptions } from './series-options';

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

  _noData = true;
  private _options: Highcharts.Options = {};
  private _series: SeriesOptions[];
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
  get data(): Observable<SeriesOptions[]> | SeriesOptions[] | undefined {
    return this._series;
  }
  set data(series: Observable<SeriesOptions[]> | SeriesOptions[] | undefined) {
    if (series instanceof Observable) {
      if (this._dataSub) {
        this._dataSub.unsubscribe();
      }
      this._dataSub = series.subscribe((s: SeriesOptions[]) => {
        this._updateData(s);
      });
    } else {
      this._updateData(series);
    }
  }

  metricIds(): string[] {
    return this._series.map((s: SeriesOptions) => s.metricId);
  }

  @Output() readonly updated: EventEmitter<void> = new EventEmitter();

  constructor(@Optional() private _viewportResizer: ViewportResizer, private _changeDetectorRef: ChangeDetectorRef) {
    if (this._viewportResizer) {
      this._viewportResizer.change()
      .subscribe(() => {
        if (this._chartObject) {
          this._chartObject.reflow();
        }
      });
    }
  }

  _updateData(series: SeriesOptions[] | undefined): void {
    this._series = series || [];
    if (series && series.length > 0) {
      this._noData = false;
      this._changeDetectorRef.markForCheck();
    }
    this._options.series = this._series;
    this.update();
  }

  _createChart(): void {
    this._chartObject = Highcharts.chart(this.container.nativeElement, this._options);
  }

  update(redraw: boolean = true, oneToOne: boolean = true): void {
    if (this._chartObject) {
      this._chartObject.update(this._options, redraw, oneToOne);
      this.updated.emit();
    }
  }

  ngAfterViewInit(): void {
    this._createChart();
  }

  ngOnDestroy(): void {
    this._chartObject.destroy();
    this._dataSub.unsubscribe();
  }
}
