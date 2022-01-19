/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SelectionModel } from '@angular/cdk/collections';
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
} from '@angular/core';
import {
  DtViewportResizer,
  isDefined,
  sanitize,
} from '@dynatrace/barista-components/core';
import { DtTheme } from '@dynatrace/barista-components/theming';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';
// eslint-disable-next-line no-duplicate-imports
import {
  addEvent as addHighchartsEvent,
  chart,
  Chart,
  Options as HighchartsOptions,
  setOptions,
} from 'highcharts';
import { merge as lodashMerge } from 'lodash-es';
import {
  BehaviorSubject,
  defer,
  merge,
  Observable,
  Subject,
  Subscription,
  combineLatest,
} from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  map,
  mapTo,
  startWith,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import {
  DtChartConfig,
  DT_CHART_CONFIG,
  DT_CHART_DEFAULT_CONFIG,
} from './chart-config';
import { DT_CHART_DEFAULT_GLOBAL_OPTIONS } from './chart-options';
import { DtChartOptions, DtChartSeries } from './chart.interface';
import {
  DtChartHeatfield,
  DtChartHeatfieldActiveChange,
} from './heatfield/chart-heatfield';
import { getDtHeatfieldUnsupportedChartError } from './heatfield/chart-heatfield-errors';
import { applyHighchartsErrorHandler } from './highcharts/highcharts-errors';
import { configureLegendSymbols } from './highcharts/highcharts-legend-overrides';
import {
  addTooltipEvents,
  compareTooltipEventChanged,
  DtHcTooltipEventPayload,
} from './highcharts/highcharts-tooltip-extensions';
import { DtChartTooltipEvent } from './highcharts/highcharts-tooltip-types';
import {
  applyHighchartsColorOptions,
  createHighchartOptions,
} from './highcharts/highcharts-util';
import { DtChartRange } from './range/range';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartTooltip } from './tooltip/chart-tooltip';
import { getPlotBackgroundInfo, retainSeriesVisibility } from './utils';
import { DtChartFocusTarget } from './chart-focus-anchor';
import { DtChartBase } from './chart-base';
import highchartsMore from 'highcharts/highcharts-more';
const HIGHCHARTS_PLOT_BACKGROUND = '.highcharts-plot-background';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

/* DANGER ZONE - this function needs to be self executing so uglify does not drop the call */
window.highchartsMore = highchartsMore(Highcharts);
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

/** Maps the states of a tooltip to numbers to handle them easier */
// eslint-disable-next-line no-shadow
const enum TooltipStateType {
  CLOSED,
  OPENED,
  UPDATED,
}

/** A class that holds the tooltip state along with the event data */
class TooltipState {
  constructor(
    public status: TooltipStateType,
    public event?: DtChartTooltipEvent,
  ) {}
}

@Component({
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
  // eslint-disable-next-line
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DT_CHART_RESOLVER,
      useFactory: DT_CHART_RESOVER_PROVIDER_FACTORY,
      deps: [[new Self(), DtChart]],
    },
    {
      provide: DtChartBase,
      useExisting: DtChart,
    },
  ],
})
export class DtChart
  extends DtChartBase
  implements AfterViewInit, OnDestroy, OnChanges, AfterContentInit
{
  /** Options to configure the chart. */
  @Input()
  get options(): Observable<DtChartOptions> | DtChartOptions {
    return this._options;
  }
  set options(options: Observable<DtChartOptions> | DtChartOptions) {
    if (this._optionsSub) {
      this._optionsSub.unsubscribe();
      this._optionsSub = null;
    }
    if (options instanceof Observable) {
      this._optionsSub = options.subscribe((o: DtChartOptions) => {
        this._currentOptions = sanitize(o);
        this._update();
      });
      this._options = options;
    } else {
      const sanitized = sanitize(options);
      this._currentOptions = sanitized;
      this._options = sanitized;
    }
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
        this._currentSeries = s.map(
          retainSeriesVisibility(this._chartObject?.series),
        );
        this._update();
      });
    } else {
      this._currentSeries = !series
        ? series
        : series.map(retainSeriesVisibility(this._chartObject?.series));
    }
    this._series = series;
    this._changeDetectorRef.markForCheck();
  }

  /** The loading text of the loading distractor. */
  @Input('loading-text') loadingText: string;

  /** Eventemitter that fires every time the chart is updated */
  @Output() readonly updated: EventEmitter<void> = new EventEmitter();

  /** Eventemitter that fires every time the tooltip opens or closes */
  @Output()
  readonly tooltipOpenChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Eventemitter that fires every time the data inside the chart tooltip changes
   */
  @Output()
  readonly tooltipDataChange: EventEmitter<DtChartTooltipEvent> = new EventEmitter();

  /** Eventemitter that fires every time a legend item is clicked and a series visibility changes */
  @Output()
  readonly seriesVisibilityChange = new EventEmitter<DtChartSeriesVisibilityChangeEvent>();

  /** returns an array of ids for the series data */
  get seriesIds(): Array<string | undefined> | undefined {
    return (
      this._highchartsOptions.series &&
      this._highchartsOptions.series.map((s: DtChartSeries) => s.id)
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
   * @interal Reference to the container element.
   */
  @ViewChild('container', { static: true }) _container: ElementRef<HTMLElement>;

  /** @internal The chart tooltip reference */
  @ContentChildren(DtChartTooltip) _tooltip: QueryList<DtChartTooltip>;

  /** @internal List of Heatfield references */
  @ContentChildren(DtChartHeatfield)
  _heatfields: QueryList<DtChartHeatfield>;

  /** @internal Instance of the Chart range used by the selection area */
  @ContentChild(DtChartRange) _range?: DtChartRange;

  /** @internal Instance of the Chart timestamp used by the selection area */
  @ContentChild(DtChartTimestamp)
  _timestamp?: DtChartTimestamp;

  _focusTargets = new Set<DtChartFocusTarget>();

  private _series?: Observable<DtChartSeries[]> | DtChartSeries[];
  private _currentSeries?: DtChartSeries[];
  private _currentOptions: DtChartOptions;
  private _options: Observable<DtChartOptions> | DtChartOptions;
  private _dataSub: Subscription | null = null;
  private _optionsSub: Subscription | null = null;
  private _highchartsOptions: HighchartsOptions;
  private readonly _destroy$ = new Subject<void>();

  /** Deals with the selection logic. */
  private _heatfieldSelectionModel: SelectionModel<DtChartHeatfield>;
  /** The subscription for the selection model */
  private _heatfieldSelectionModelSubscription: Subscription =
    Subscription.EMPTY;

  /** @internal Emits the tooltip data when it changed */
  _highChartsTooltipDataChanged$ = new Subject<DtChartTooltipEvent>();

  /** @internal Emits when the tooltip should be opened with the provided data */
  _highChartsTooltipOpened$ = new Subject<DtChartTooltipEvent>();

  /** @internal Emits when the tooltip should be closed */
  _highChartsTooltipClosed$ = new Subject<void>();

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
  _chartObject: Chart | null;

  /** @internal Whether the loading distractor should be shown. */
  get _isLoading(): boolean {
    return (
      this._highchartsOptions &&
      (!this._highchartsOptions.series ||
        !this._highchartsOptions.series.length)
    );
  }

  private readonly _heatfieldActiveChanges: Observable<DtChartHeatfieldActiveChange> =
    defer(() => {
      if (this._heatfields) {
        return merge<DtChartHeatfieldActiveChange>(
          ...this._heatfields.map((heatfield) => heatfield.activeChange),
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
    /** @internal used for the selection area to calculate the bounding client rect */
    public _elementRef: ElementRef,
  ) {
    super();
    this._config = this._config || DT_CHART_DEFAULT_CONFIG;

    if (this._viewportResizer) {
      this._viewportResizer
        .change()
        // delay to postpone the reflow to the next change detection cycle
        .pipe(delay(0), takeUntil(this._destroy$))
        .subscribe(() => {
          if (this._chartObject) {
            this._ngZone.runOutsideAngular(() => {
              this._chartObject?.reflow();
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

    // uses the ContentChild of the DtChartTooltip to toggle and update
    // the tooltip according to the highcharts events.
    this._handleTooltipChange();
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
    //============================================================
    // Initialize heat-fields
    //============================================================
    const heatFields$ = this._heatfields.changes.pipe(
      startWith(null),
      switchMap(() => this._ngZone.onStable.pipe(take(1))),
      map(() => this._heatfields.toArray()),
    );

    combineLatest(heatFields$, this._plotBackground$)
      .pipe(takeUntil(this._destroy$))
      .subscribe(([heatfields, plotBackground]) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._initHeatFields(heatfields, plotBackground!);
      });

    heatFields$
      .pipe(
        switchMap(() => this._heatfieldActiveChanges),
        takeUntil(this._destroy$),
      )
      .subscribe((event) => {
        this._onHeatfieldActivate(event.source);
      });

    //============================================================
    // Selection Area
    //============================================================
    if (this._range || this._timestamp) {
      this._hasSelectionArea = true;
    }
  }

  private _initHeatFields(
    heatfields: DtChartHeatfield[],
    plotBackground: SVGRectElement,
  ): void {
    if (heatfields.length === 0) {
      // no heatfields so we can skip this
      return;
    }

    const clientRect = getPlotBackgroundInfo(plotBackground);

    this._checkHeatfieldSupport();
    heatfields.forEach((heatfield) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      heatfield._initHeatfield(clientRect, this._chartObject!);
    });

    this._heatfieldSelectionModelSubscription.unsubscribe();
    this._heatfieldSelectionModel = new SelectionModel<DtChartHeatfield>();
    this._heatfieldSelectionModelSubscription =
      this._heatfieldSelectionModel.changed.subscribe((event) => {
        event.added.forEach((heatfield) => {
          heatfield.active = true;
        });
        event.removed.forEach((heatfield) => {
          heatfield.active = false;
        });
      });
  }

  ngOnDestroy(): void {
    // Next and complete the highChartsTooltipClosed observable
    // to clear off any tooltips, that would still be open.
    this._highChartsTooltipClosed$.next();
    this._highChartsTooltipClosed$.complete();

    this._heatfieldSelectionModelSubscription.unsubscribe();

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
    if (this._optionsSub) {
      this._optionsSub.unsubscribe();
    }
    this._afterRender.complete();
  }

  /** @internal Resets the pointer so Highcharts handles new mouse interactions correctly (e.g. after programmatic destruction of tooltips) */
  _resetHighchartsPointer(): void {
    this._ngZone.runOutsideAngular(() => {
      if (this._chartObject) {
        this._chartObject.pointer.reset();
      }
    });
  }

  /** @internal Creates new highcharts options and applies it to the chart. */
  _update(): void {
    const highchartsOptions = createHighchartOptions(
      this._currentOptions,
      this._currentSeries,
    );

    this._highchartsOptions = highchartsOptions;
    this._updateColorOptions();
    this._updateChart();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal toggles the tooltip and updates the chart with the new settings */
  _toggleTooltip(enabled: boolean): void {
    if (this._highchartsOptions.tooltip?.enabled !== enabled) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._highchartsOptions.tooltip!.enabled = enabled;
      this._updateChart();
    }
  }

  /** Handles the tooltips open and closing along with the updating of the data */
  private _handleTooltipChange(): void {
    this._highChartsTooltipClosed$
      .pipe(
        startWith(null),
        switchMap(() =>
          this._highChartsTooltipDataChanged$.asObservable().pipe(take(1)),
        ),
        takeUntil(this._destroy$),
      )
      .subscribe((event: DtChartTooltipEvent) => {
        this._highChartsTooltipOpened$.next(event);
      });

    const tooltipOpened$ = this._highChartsTooltipOpened$.pipe(
      map((event) => new TooltipState(TooltipStateType.OPENED, event)),
    );

    const tooltipClosed$ = this._highChartsTooltipOpened$.pipe(
      // `switchMap` to close is used to last only for one cycle of
      // open and closing the tooltip.
      switchMap(() => this._highChartsTooltipClosed$.pipe(take(1))),
      mapTo(new TooltipState(TooltipStateType.CLOSED)),
    );

    const tooltipUpdated$ = this._highChartsTooltipOpened$.pipe(
      // use the `switchMap` to create an inner observable that the
      // `distinctUntilChanged` restarts after it was closed and opened again.
      // Only starts when a tooltip was opened and restarts after it was closed.
      switchMap(() =>
        this._highChartsTooltipDataChanged$.pipe(
          distinctUntilChanged(compareTooltipEventChanged),
        ),
      ),
      map((event) => new TooltipState(TooltipStateType.UPDATED, event)),
    );

    merge(tooltipOpened$, tooltipClosed$, tooltipUpdated$)
      .pipe(withLatestFrom(this._plotBackground$), takeUntil(this._destroy$))
      .subscribe(([state, plotBackground]) => {
        this._ngZone.run(() => {
          const tooltip = this._tooltip.first;

          if (!isDefined(tooltip) || !isDefined(plotBackground)) {
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const plotBackgroundInfo = getPlotBackgroundInfo(plotBackground!);

          switch (state.status) {
            case TooltipStateType.CLOSED:
              tooltip._dismiss();
              this.tooltipOpenChange.emit(false);
              break;
            case TooltipStateType.OPENED:
              tooltip._createOverlay(
                state.event?.data,
                this,
                plotBackgroundInfo,
              );
              this.tooltipOpenChange.emit(true);
              break;
            case TooltipStateType.UPDATED:
              tooltip._updateOverlayContext(
                state.event?.data,
                this,
                plotBackgroundInfo,
              );
              if (state.event?.data) {
                this.tooltipDataChange.emit({
                  data: state.event?.data,
                });
              } else {
                this.tooltipDataChange.emit();
              }

              break;
          }
        });
      });
  }

  private _createHighchartsChart(): void {
    // Creating a new highcharts chart.
    // This needs to be done outside the ngZone so the events, highcharts listens to, do not pollute our change detection.
    this._chartObject = this._ngZone.runOutsideAngular(() =>
      chart(this._container.nativeElement, this.highchartsOptions),
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
      this._highChartsTooltipClosed$.next();
    });
    // Adds event-listener to highcharts custom event for tooltip refreshed closed */
    // We cannot type the event param, because the types for highcharts are incorrect
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addHighchartsEvent(this._chartObject, 'tooltipRefreshed', (event: any) => {
      this._highChartsTooltipDataChanged$.next({
        data: (event as DtHcTooltipEventPayload).data,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chart: this._chartObject!,
      });
    });

    this._notifyAfterRender();
  }

  private _notifyAfterRender(): void {
    this._ngZone.runOutsideAngular(() => {
      this._afterRender.next();
      const plotBackground =
        this._container.nativeElement.querySelector<SVGRectElement>(
          HIGHCHARTS_PLOT_BACKGROUND,
        );

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
        this._container.nativeElement.getBoundingClientRect().left
      : 0;
  }

  /** Checks if a heatfield is supported with the chart options if not throw an error */
  private _checkHeatfieldSupport(): void {
    // When using optional chaining here instead like this._currentOptions?.xAxis![0]?.categories
    // typescript seems to have an error in v3.9 that crashes the build
    // with Error: Debug Failure. Invalid cast. The supplied value [object Object] did not pass the test 'isOptionalChain'
    if (
      this._currentOptions &&
      this._currentOptions.xAxis &&
      this._currentOptions.xAxis[0] &&
      this._currentOptions.xAxis[0].categories
    ) {
      throw getDtHeatfieldUnsupportedChartError();
    }
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
