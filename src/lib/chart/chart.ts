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
  ViewEncapsulation,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Options, IndividualSeriesOptions, ChartObject, chart, AxisOptions } from 'highcharts';
import { Observable, Subscription, Subject } from 'rxjs';
import { DtViewportResizer } from '@dynatrace/angular-components/core';
import { delay, takeUntil } from 'rxjs/operators';
import { DtTheme } from '@dynatrace/angular-components/theming';
import { mergeOptions } from './chart-utils';
import { defaultTooltipFormatter } from './chart-tooltip';
import { configureLegendSymbols } from './highcharts-legend-overrides';
import { DEFAULT_CHART_OPTIONS, DEFAULT_CHART_AXIS_STYLES } from './chart-options';
import { ChartColorizer } from './chart-colorizer';

export type DtChartOptions = Options & { series?: undefined };
export type DtChartSeries = IndividualSeriesOptions[];
interface DtChartTooltip { (): string | boolean; iswrapped: boolean; }

// Override Highcharts prototypes
configureLegendSymbols();

@Component({
  moduleId: module.id,
  selector: 'dt-chart',
  styleUrls: ['./chart.scss'],
  templateUrl: './chart.html',
  exportAs: 'dtChart',
  // disabled ViewEncapsulation because some html is generated by highcharts
  // so it does not get the classes from angular
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtChart implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container') container: ElementRef;

  _loading = false;
  private _series: Observable<DtChartSeries> | DtChartSeries | undefined;
  private _currentSeries: IndividualSeriesOptions[] | undefined;
  private _options: DtChartOptions;
  private _chartObject: ChartObject;
  private _dataSub: Subscription | null = null;
  private _isTooltipWrapped = false;
  private _highchartsOptions: Options;
  private readonly _destroy = new Subject<void>();

  @Input()
  get options(): DtChartOptions {
    return this._options;
  }
  set options(options: DtChartOptions) {
    this._options = options;
    this._isTooltipWrapped = false;
    this._mergeOptions(options);
  }

  @Input()
  get series(): Observable<DtChartSeries> | DtChartSeries | undefined {
    return this._series;
  }
  set series(series: Observable<DtChartSeries> | DtChartSeries | undefined) {
    if (this._dataSub) {
      this._dataSub.unsubscribe();
      this._dataSub = null;
    }
    if (series instanceof Observable) {
      this._dataSub = series.subscribe((s: DtChartSeries) => {
        this._mergeSeries(s);
        this._update();
        this._changeDetectorRef.markForCheck();
      });
    } else {
      this._mergeSeries(series);
    }
    this._series = series;
    this._setLoading();
  }

  @Output() readonly updated: EventEmitter<void> = new EventEmitter();

  constructor(
    @Optional() private _viewportResizer: DtViewportResizer,
    @Optional() @SkipSelf() private _theme: DtTheme,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    if (this._viewportResizer) {
      this._viewportResizer.change()
        .pipe(takeUntil(this._destroy), delay(0))// delay to postpone the reflow to the next change detection cycle
        .subscribe(() => {
          if (this._chartObject) {
            this._chartObject.reflow();
          }
        });
    }
    if (this._theme) {
      this._theme._stateChanges.pipe(takeUntil(this._destroy)).subscribe(() => {
        if (this._currentSeries) {
          this._mergeSeries(this._currentSeries);
          this._update();
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
    this._destroy.next();
    this._destroy.complete();
    if (this._chartObject) {
      this._chartObject.destroy();
    }
    if (this._dataSub) {
      this._dataSub.unsubscribe();
    }
  }

  /** returns an array of ids for the series data */
  get seriesIds(): Array<string | undefined> | undefined {
    if (this._highchartsOptions.series) {

      return this._highchartsOptions.series.map((s: IndividualSeriesOptions) => s.id);
    }

    return undefined;
  }

  /**
   * returns the combined highcharts options for the chart
   * combines series and options passed, merged with the defaultOptions
   */
  get highchartsOptions(): Options {
    if (!this._highchartsOptions) {
      this._highchartsOptions = DEFAULT_CHART_OPTIONS;
    }
    if (this._highchartsOptions.xAxis) {
      this._mergeAxis('xAxis');
    }
    if (this._highchartsOptions.yAxis) {
      this._mergeAxis('yAxis');
    }
    return this._highchartsOptions;
  }

  /* merge options with internal highcharts options and defaultoptions */
  private _mergeOptions(options: DtChartOptions): void {
    const merged = mergeOptions(DEFAULT_CHART_OPTIONS, options) as Options;
    merged.series = this.highchartsOptions.series;
    this._wrapTooltip(merged);
    this._highchartsOptions = merged;
  }

  /* merge series with the highcharts options internally */
  private _mergeSeries(series: DtChartSeries | undefined): void {
    this._currentSeries = series;
    const options = this.highchartsOptions;
    options.series = series && series.map(((s) => ({...s})));
    if (options.series) {
      ChartColorizer.apply(options, options.series.length, this._theme);
    }
  }

  /* merge default axis options to all axis */
  private _mergeAxis(axis: 'xAxis' | 'yAxis' | 'zAxis'): void {
    if (!this._highchartsOptions[axis]) {
      return;
    }
    if (Array.isArray(this._highchartsOptions[axis])) {
      this._highchartsOptions[axis] = this._highchartsOptions[axis]
        .map((a) => mergeOptions(DEFAULT_CHART_AXIS_STYLES, a) as AxisOptions[]);
    } else {
      this._highchartsOptions[axis] = mergeOptions(DEFAULT_CHART_AXIS_STYLES, this._highchartsOptions[axis]);
    }
  }

  /**
   * Wraps the options.tooltip.formatter function passed into a div.dt-chart-tooltip
   * to enable correct styling for the tooltip
   */
  private _wrapTooltip(highchartsOptions: Options): void {

    if (!this._isTooltipWrapped) {
      let tooltipFormatterFunc = defaultTooltipFormatter;
      if (this.options && this.options.tooltip && this.options.tooltip.formatter) {
        tooltipFormatterFunc = this.options.tooltip.formatter;
      }

      highchartsOptions.tooltip!.formatter = function(): string | boolean {
        const tooltipFormatterFuncBound = tooltipFormatterFunc.bind(this);

        return `<div class="dt-chart-tooltip">${tooltipFormatterFuncBound()}</div>`;
      } as DtChartTooltip;

      this._isTooltipWrapped = true;
    }
  }

  /**
   * Spins up the chart with correct colors applied
   */
  private _createChart(): void {
    this._chartObject = this._ngZone.runOutsideAngular(() => chart(this.container.nativeElement, this.highchartsOptions));
    this._setLoading();
  }

  /**
   * Update function to apply new data to the chart
   */
  private _update(redraw: boolean = true, oneToOne: boolean = true): void {
    if (this._chartObject) {
      this._setLoading();
      this._ngZone.runOutsideAngular(() => {
        this._chartObject.update(this.highchartsOptions, redraw, oneToOne);
      });
      this.updated.emit();
    }
  }

  /** updates the loading status of the component */
  private _setLoading(): void {
    this._loading = !this._highchartsOptions.series;
  }
}
