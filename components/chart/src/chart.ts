import { SelectionModel } from '@angular/cdk/collections';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Self,
  SimpleChanges,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
// tslint:disable-next-line:no-duplicate-imports
import * as Highcharts from 'highcharts';
// tslint:disable-next-line:no-duplicate-imports
import {
  ChartObject,
  Options as HighchartsOptions,
  IndividualSeriesOptions,
  addEvent as addHighchartsEvent,
  chart,
  setOptions,
} from 'highcharts';
import { merge as lodashMerge } from 'lodash';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  defer,
  merge,
} from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import {
  DtViewportResizer,
  createInViewportStream,
} from '@dynatrace/barista-components/core';
import { DtTheme } from '@dynatrace/barista-components/theming';

import {
  DT_CHART_CONFIG,
  DT_CHART_DEFAULT_CONFIG,
  DtChartConfig,
} from './chart-config';
import { DT_CHART_DEFAULT_GLOBAL_OPTIONS } from './chart-options';
import {
  DtChartHeatfield,
  DtChartHeatfieldActiveChange,
} from './heatfield/chart-heatfield';
import { applyHighchartsErrorHandler } from './highcharts/highcharts-errors';
import { configureLegendSymbols } from './highcharts/highcharts-legend-overrides';
import {
  DtHcTooltipEventPayload,
  addTooltipEvents,
  findHoveredSeriesIndex,
} from './highcharts/highcharts-tooltip-extensions';
import { DtChartTooltipEvent } from './highcharts/highcharts-tooltip-types';
import {
  applyHighchartsColorOptions,
  createHighchartOptions,
} from './highcharts/highcharts-util';
import { DtChartRange } from './range/range';
import { DtChartTimestamp } from './timestamp/timestamp';

const HIGHCHARTS_PLOT_BACKGROUND = '.highcharts-plot-background';
const CHART_INTERSECTION_THRESHOLD = 0.9;

export type DtChartOptions = HighchartsOptions & {
  series?: undefined;
  tooltip?: { shared: boolean };
  interpolateGaps?: boolean;
};
export type DtChartSeries = IndividualSeriesOptions;

// tslint:disable-next-line:no-any
declare const window: any;
// tslint:disable-next-line:no-any
declare var require: any;
/* DANGER ZONE - this function needs to be self executing so uglify does not drop the call */
// tslint:disable-next-line:no-var-requires no-require-imports
window.highchartsMore = require('highcharts/highcharts-more')(Highcharts);
// Override Highcharts prototypes
// added to the window so uglify does not drop this from the bundle
window.configureLegendSymbols = configureLegendSymbols;
window.highchartsGlobalOptions = ((): void => {
  setOptions(DT_CHART_DEFAULT_GLOBAL_OPTIONS);
})();
// Highcharts global options, set outside component so its not set every time a chart is created
// added to the window so uglify does not drop this from the bundle
window.highchartsTooltipEventsAdded = addTooltipEvents();

// add global Highcharts error handler for server side logging
applyHighchartsErrorHandler();

/** Injection token used to get the instance of the dt-chart instance  */
export const DT_CHART_RESOLVER = new InjectionToken<() => DtChart>(
  'dt-chart-resolver',
);
/**
 * @internal
 * Resolver similar to forward ref since we don't have the chart in the constructor necessarily (e.g. micro charts),
 * we might only have it afterViewInit
 */
export type DtChartResolver = () => DtChart;

/**
 * @internal
 * Factory used to get the DtChartResolver
 * this needs to be written as below without lambda expressions due to a compiler bug,
 * see https://github.com/angular/angular/issues/23629 for further information
 */
export function DT_CHART_RESOVER_PROVIDER_FACTORY(c: DtChart): DtChartResolver {
  const resolver = () => c;
  return resolver;
}

export interface DtChartSeriesVisibilityChangeEvent {
  source: DtChart;
  visible: boolean;
  series: DtChartSeries;
}

@Component({
  moduleId: module.id,
  selector: 'dt-chart',
  styleUrls: ['./chart.scss'],
  templateUrl: './chart.html',
  exportAs: 'dtChart',
  host: {
    class: 'dt-chart',
    '[class.dt-chart-selectable]': '_hasSelectionArea',
  },
  // disabled ViewEncapsulation because some html is generated by highcharts
  // so it does not get the classes from angular
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DT_CHART_RESOLVER,
      useFactory: DT_CHART_RESOVER_PROVIDER_FACTORY,
      deps: [[new Self(), DtChart]],
    },
  ],
})
export class DtChart
  implements AfterViewInit, OnDestroy, OnChanges, AfterContentInit {
  /** Options to configure the chart. */
  @Input()
  get options(): DtChartOptions {
    return this._options;
  }
  set options(options: DtChartOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /** Series of data points or a stream rendered in this chart */
  @Input()
  get series(): Observable<DtChartSeries[]> | DtChartSeries[] | undefined {
    return this._series;
  }
  set series(
    series: Observable<DtChartSeries[]> | DtChartSeries[] | undefined,
  ) {
    if (this._dataSub) {
      this._dataSub.unsubscribe();
      this._dataSub = null;
    }
    if (series instanceof Observable) {
      this._dataSub = series.subscribe((s: DtChartSeries[]) => {
        this._currentSeries = s;
        this._update();
      });
    } else {
      this._currentSeries = series;
    }
    this._series = series;
    this._changeDetectorRef.markForCheck();
  }

  /** The loading text of the loading distractor. */
  @Input('loading-text') loadingText: string;

  /** Eventemitter that fires every time the chart is updated */
  @Output() readonly updated: EventEmitter<void> = new EventEmitter();

  /** Eventemitter that fires every time the tooltip opens or closes */
  @Output() readonly tooltipOpenChange: EventEmitter<
    boolean
  > = new EventEmitter();
  /** Eventemitter that fires every time the data inside the chart tooltip changes */
  @Output()
  readonly tooltipDataChange: EventEmitter<DtChartTooltipEvent | null> = new EventEmitter();

  /** Eventemitter that fires every time a legend item is clicked and a series visibility changes */
  @Output()
  readonly seriesVisibilityChange = new EventEmitter<
    DtChartSeriesVisibilityChangeEvent
  >();

  /** returns an array of ids for the series data */
  get seriesIds(): Array<string | undefined> | undefined {
    return (
      this._highchartsOptions.series &&
      this._highchartsOptions.series.map((s: IndividualSeriesOptions) => s.id)
    );
  }

  /**
   * Returns the combined highcharts options for the chart
   * combines series and options passed, merged with the defaultOptions
   */
  get highchartsOptions(): HighchartsOptions {
    // To make sure the consumer cannot modify the internal highcharts options
    // (which could result in a broken state) the object will be cloned.
    return this._highchartsOptions
      ? lodashMerge({}, this._highchartsOptions)
      : {};
  }

  /**
   * Reference to the container element.
   *
   * @breaking-change Make internal in 5.0.0
   */
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

  /** @internal List of Heatfield references */
  // tslint:disable-next-line: no-forward-ref
  @ContentChildren(forwardRef(() => DtChartHeatfield))
  _heatfields: QueryList<DtChartHeatfield>;

  /** @internal Instance of the Chart range used by the selection area */
  @ContentChild(DtChartRange, { static: false }) _range?: DtChartRange;

  /** @internal Instance of the Chart timestamp used by the selection area */
  @ContentChild(DtChartTimestamp, { static: false })
  _timestamp?: DtChartTimestamp;

  private _series?: Observable<DtChartSeries[]> | DtChartSeries[];
  private _currentSeries?: IndividualSeriesOptions[];
  private _options: DtChartOptions;
  private _dataSub: Subscription | null = null;
  private _highchartsOptions: HighchartsOptions;
  private readonly _destroy$ = new Subject<void>();
  private readonly _tooltipRefreshed: Subject<DtChartTooltipEvent | null> = new Subject();
  private _isTooltipOpen = false;

  /** @internal whether the chart is in the viewport or not */
  _isInViewport$ = createInViewportStream(
    this._elementRef,
    CHART_INTERSECTION_THRESHOLD,
  );

  /** Deals with the selection logic. */
  private _heatfieldSelectionModel: SelectionModel<DtChartHeatfield>;

  /** @internal The offset of the plotBackground in relation to the chart container on the xAxis  */
  _plotBackgroundChartOffset = 0;

  /** @internal stream that emits every time the plotBackground changes */
  _plotBackground$ = new BehaviorSubject<SVGRectElement | null>(null);

  /**
   * @internal
   * hold the state if there is a range or a timestamp if one of them is there we need a selection area
   */
  _hasSelectionArea = false;

  /** @internal Emits when highcharts finishes rendering. */
  readonly _afterRender = new Subject<void>();

  /** @internal The highcharts chart object */
  _chartObject: ChartObject | null;

  /** @internal Whether the loading distractor should be shown. */
  get _isLoading(): boolean {
    return (
      this._highchartsOptions &&
      (!this._highchartsOptions.series ||
        !this._highchartsOptions.series.length)
    );
  }

  private readonly _heatfieldActiveChanges: Observable<
    DtChartHeatfieldActiveChange
  > = defer(() => {
    if (this._heatfields) {
      return merge<DtChartHeatfieldActiveChange>(
        ...this._heatfields.map(heatfield => heatfield.activeChange),
      );
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this._heatfieldActiveChanges),
    );
  });

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    @Optional() private _viewportResizer: DtViewportResizer,
    @Optional() @SkipSelf() private _theme: DtTheme,
    @Optional()
    @SkipSelf()
    @Inject(DT_CHART_CONFIG)
    private _config: DtChartConfig,
    // @breaking-change 5.0.0 Remove platform param
    // tslint:disable-next-line: no-any
    _platform: Platform,
    /** @internal used for the selection area to calculate the bounding client rect */
    public _elementRef: ElementRef,
  ) {
    this._config = this._config || DT_CHART_DEFAULT_CONFIG;

    if (this._viewportResizer) {
      this._viewportResizer
        .change()
        // delay to postpone the reflow to the next change detection cycle
        .pipe(takeUntil(this._destroy$), delay(0))
        .subscribe(() => {
          if (this._chartObject) {
            this._ngZone.runOutsideAngular(() => {
              this._chartObject!.reflow();
            });
          }
        });
    }
    if (this._theme) {
      this._theme._stateChanges
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          if (this._currentSeries && this._highchartsOptions) {
            this._updateColorOptions();
            this._updateChart();
          }
        });
    }
    this._heatfieldActiveChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(event => {
        this._onHeatfieldActivate(event.source);
      });
    this._tooltipRefreshed
      .pipe(
        takeUntil(this._destroy$),
        filter(Boolean),
        map(ev => {
          if (ev.data.points) {
            // We need to clone the series here, because highcharts mutates the object and
            // we therefore cannot create a compare function that compares the last with the next emission
            ev.data.points = ev.data.points.map(p => ({
              ...p,
              series: { ...p.series },
            }));
          }
          return ev;
        }),
        distinctUntilChanged((a, b) => {
          if (a && b) {
            return (
              a.data.x === b.data.x &&
              a.data.y === b.data.y &&
              findHoveredSeriesIndex(a) === findHoveredSeriesIndex(b)
            );
          }
          return false;
        }),
      )
      .subscribe(ev => {
        this.tooltipDataChange.next(ev);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.series || changes.options) {
      this._update();
    }
  }

  ngAfterViewInit(): void {
    this._createHighchartsChart();
  }

  ngAfterContentInit(): void {
    this._heatfieldSelectionModel = new SelectionModel<DtChartHeatfield>();
    this._heatfieldSelectionModel.changed
      .pipe(takeUntil(this._destroy$))
      .subscribe(event => {
        event.added.forEach(heatfield => {
          heatfield.active = true;
        });
        event.removed.forEach(heatfield => {
          heatfield.active = false;
        });
      });

    if (this._range || this._timestamp) {
      this._hasSelectionArea = true;
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    if (this._chartObject) {
      this._chartObject.destroy();
      // Cleanup reference here so we don't trigger more things afterwards
      this._chartObject = null;
    }
    if (this._dataSub) {
      this._dataSub.unsubscribe();
    }
    this._afterRender.complete();
  }

  /** @internal Resets the pointer so Highcharts handles new mouse interactions correctly (e.g. after programmatic destruction of tooltips) */
  _resetHighchartsPointer(): void {
    this._ngZone.runOutsideAngular(() => {
      // tslint:disable-next-line: no-any
      (this._chartObject! as any).pointer.reset();
    });
  }

  /** @internal Creates new highcharts options and applies it to the chart. */
  _update(): void {
    const highchartsOptions = createHighchartOptions(
      this._options,
      this._currentSeries,
    );

    this._highchartsOptions = highchartsOptions;
    this._updateColorOptions();
    this._updateChart();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal toggles the tooltip and updates the chart with the new settings */
  _toggleTooltip(enabled: boolean): void {
    if (this._highchartsOptions.tooltip!.enabled !== enabled) {
      this._highchartsOptions.tooltip!.enabled = enabled;
      this._updateChart();
    }
  }

  private _createHighchartsChart(): void {
    // Creating a new highcharts chart.
    // This needs to be done outside the ngZone so the events, highcharts listens to, do not pollute our change detection.
    this._chartObject = this._ngZone.runOutsideAngular(() =>
      chart(this.container.nativeElement, this.highchartsOptions),
    );

    this._chartObject.series.forEach((series, index) => {
      addHighchartsEvent(series, 'hide', () => {
        if (this._currentSeries) {
          this.seriesVisibilityChange.emit({
            source: this,
            visible: false,
            series: this._currentSeries[index],
          });
        }
      });
      addHighchartsEvent(series, 'show', () => {
        if (this._currentSeries) {
          this.seriesVisibilityChange.emit({
            source: this,
            visible: true,
            series: this._currentSeries[index],
          });
        }
      });
    });

    addHighchartsEvent(this._chartObject, 'redraw', () => {
      this._notifyAfterRender();
    });

    // adds event-listener to highcharts custom event for tooltip closed
    addHighchartsEvent(this._chartObject, 'tooltipClosed', () => {
      this._isTooltipOpen = false;
      this.tooltipOpenChange.emit(false);
      this._tooltipRefreshed.next(null);
    });
    // Adds event-listener to highcharts custom event for tooltip refreshed closed */
    // We cannot type the event param, because the types for highcharts are incorrect
    // tslint:disable-next-line:no-any
    addHighchartsEvent(this._chartObject, 'tooltipRefreshed', (event: any) => {
      if (!this._isTooltipOpen) {
        this._isTooltipOpen = true;
        this.tooltipOpenChange.emit(true);
      }
      this._tooltipRefreshed.next({
        data: (event as DtHcTooltipEventPayload).data,
        chart: this._chartObject!,
      });
    });

    this._notifyAfterRender();
  }

  private _notifyAfterRender(): void {
    this._ngZone.runOutsideAngular(() => {
      this._afterRender.next();
      const plotBackground = this.container.nativeElement.querySelector<
        SVGRectElement
      >(HIGHCHARTS_PLOT_BACKGROUND);

      // set the offset of the plotBackground in relation to the chart
      this._setPlotBackgroundOffset(plotBackground);

      this._plotBackground$.next(plotBackground);
    });
  }

  /** Calculates and sets the offset of the plot-background to the Chart container on the xAxis */
  private _setPlotBackgroundOffset(
    plotBackground: SVGRectElement | null,
  ): void {
    this._plotBackgroundChartOffset = plotBackground
      ? plotBackground.getBoundingClientRect().left -
        this.container.nativeElement.getBoundingClientRect().left
      : 0;
  }

  /** Invoked when an heatfield is activated. */
  private _onHeatfieldActivate(heatfield: DtChartHeatfield): void {
    const wasActive = this._heatfieldSelectionModel.isSelected(heatfield);

    if (heatfield.active) {
      this._heatfieldSelectionModel.select(heatfield);
    } else {
      this._heatfieldSelectionModel.deselect(heatfield);
    }

    if (wasActive !== this._heatfieldSelectionModel.isSelected(heatfield)) {
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Updates the chart with current options and series. */
  private _updateChart(): void {
    if (this._chartObject) {
      this._chartObject.destroy();
    }
    this._createHighchartsChart();
    this.updated.emit();
  }

  private _updateColorOptions(): void {
    if (this._config.shouldUpdateColors) {
      this._highchartsOptions = applyHighchartsColorOptions(
        this._highchartsOptions,
        this._theme,
      );
    }
  }
}
