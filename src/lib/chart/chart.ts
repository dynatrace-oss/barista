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
  SkipSelf,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ViewportResizer } from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs/Subject';
import { NeverObservable } from 'rxjs/observable/NeverObservable';
import { delay } from 'rxjs/operators/delay';
import { CHART_COLOR_PALETTES } from './chart-colors';
import { DtTheme } from '@dynatrace/angular-components/theming';

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
  private _series: Highcharts.IndividualSeriesOptions[];
  private _chartObject: Highcharts.ChartObject;
  private _dataSub: Subscription = NeverObservable.create().subscribe();

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
    return this._series;
  }
  set data(series: Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined) {
    if (series instanceof Observable) {
      if (this._dataSub) {
        this._dataSub.unsubscribe();
      }
      this._dataSub = series.subscribe((s: Highcharts.IndividualSeriesOptions[]) => {
        this._updateData(s);
      });
    } else {
      this._updateData(series);
    }
  }

  getAllIds(): Array<string|undefined> {
    return this._series.map((s: Highcharts.IndividualSeriesOptions) => s.id);
  }

  @Output() readonly updated: EventEmitter<void> = new EventEmitter();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() private _viewportResizer: ViewportResizer,
    @Optional() @SkipSelf() private _theme: DtTheme) {
    if (this._viewportResizer) {
      this._viewportResizer.change()
      .pipe(delay(0))// delay to postpone the reflow to the next change detection cycle
      .subscribe(() => {
        if (this._chartObject) {
          this._chartObject.reflow();
        }
      });
    }
  }

  _updateData(series: Highcharts.IndividualSeriesOptions[] | undefined): void {
    this._series = series || [];
    if (series && series.length > 0) {
      this._noData = false;
      this._changeDetectorRef.markForCheck();
    }
    this._applyColor();
    this.update();
  }

  /**
   * applies the colors from the theme to the series if no color for the series is set
   */
  _applyColor(): void {
    if (!this._theme) {
      return;
    }
    this._options.series = this._series.map((s: Highcharts.IndividualSeriesOptions) => {
      // if there is one series apply the single property
      if (this._series.length === 1) {
        s.color = CHART_COLOR_PALETTES.turquoise.single;
      }
      // else through multi colors

      return s;
    });
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
