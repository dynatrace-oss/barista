import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  Output,
  Optional,
  SkipSelf,
  SimpleChanges,
  OnChanges,
  isDevMode,
  ViewEncapsulation,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ViewportResizer } from '@dynatrace/angular-components/core';
import { delay } from 'rxjs/operators/delay';
import { CHART_COLOR_PALETTES, ChartColorPalette } from './chart-colors';
import { DtTheme } from '@dynatrace/angular-components/theming';

export type DtChartOptions = Highcharts.Options & { series?: undefined };
export type DtChartSeries = Highcharts.IndividualSeriesOptions[];

const defaultChartColorPalette = 'turquoise';

@Component({
  moduleId: module.id,
  selector: 'dt-chart',
  styleUrls: ['./chart.scss'],
  templateUrl: './chart.html',
  exportAs: 'dtChart',
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtChart implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container') container: ElementRef;

  _loading = false;
  private _series: DtChartSeries;
  private _chartObject: Highcharts.ChartObject;
  private _dataSub: Subscription | null = null;
  private _colorPalette: ChartColorPalette;

  @Input()
  options: DtChartOptions = {};

  @Input()
  set series(series: Observable<DtChartSeries> | DtChartSeries | undefined) {
    if (this._dataSub) {
      this._dataSub.unsubscribe();
      this._dataSub = null;
    }
    if (series instanceof Observable) {
      this._dataSub = series.subscribe((s: DtChartSeries) => {
        this._series = s;
        this._update();
      });
    } else if (series) {
      this._series = series;
    }
  }

  @Input()
  set loading(isLoading: boolean) {
    this._loading = isLoading;
  }

  @Output() readonly updated: EventEmitter<void> = new EventEmitter();

  constructor(
    @Optional() private _viewportResizer: ViewportResizer,
    @Optional() @SkipSelf() private _theme: DtTheme
  ) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.series || changes.options) {
      this._update();
    }
  }

  ngAfterViewInit(): void {
    this._createChart();
  }

  ngOnDestroy(): void {
    if (this._chartObject) {
      this._chartObject.destroy();
    }
    if (this._dataSub) {
      this._dataSub.unsubscribe();
    }
  }

  /** returns the series data for the chart */
  getSeries(): DtChartSeries {
    return this._series;
  }

  /** returns an array of ids for the series data */
  getAllIds(): Array<string | undefined> | undefined {
    if (this._series) {

      return this._series.map((s: Highcharts.IndividualSeriesOptions) => s.id);
    }

    return undefined;
  }

  /**
   * applies the colors from the theme to the series if no color for the series is set
   */
  _applyColors(): void {
    this._colorPalette = this._theme && this._theme.name ?
      CHART_COLOR_PALETTES[this._theme.name] : CHART_COLOR_PALETTES[defaultChartColorPalette];

    if (this._series) {
      this._series.forEach((s: Highcharts.IndividualSeriesOptions, index: number): void => {
        this._applySeriesColor(s, index);
      });
    }
  }

  _applySeriesColor(s: Highcharts.IndividualSeriesOptions, index: number): void {
    // leave the color if there is already a color set
    if (s.color) {
      return;
    }
    // if there is one series apply the single property
    if (this._series.length === 1) {
      s.color = this._colorPalette.single;

      return;
    }
    if (index >= this._colorPalette.multi.length && isDevMode()) {
      // tslint:disable-next-line: no-console
      console.error(`The number of series exceeds the number of chart colors in the theme ${this._theme.name}.
        Please specify colors for your series.`);
    }
    // apply color for multi series
    s.color = this._colorPalette.multi[index];
  }

  _getHighchartsOptions(): Highcharts.Options {
    const options = this.options as Highcharts.Options;
    options.series = this._series;

    return options;
  }

  _createChart(): void {
    this._applyColors();
    this._chartObject = Highcharts.chart(this.container.nativeElement, this._getHighchartsOptions());
    this._loading = !this._series;
  }

  _update(redraw: boolean = true, oneToOne: boolean = true): void {
    if (this._chartObject) {
      this._applyColors();
      this._chartObject.update(this._getHighchartsOptions(), redraw, oneToOne);
      this._loading = !this._series;
      this.updated.emit();
    }
  }
}
