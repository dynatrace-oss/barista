/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {
  DtViewportResizer,
  isDefined,
} from '@dynatrace/barista-components/core';
import { formatCount } from '@dynatrace/barista-components/formatters';
import {
  DtColors,
  DtTheme,
  getDtChartColorPalette,
} from '@dynatrace/barista-components/theming';
import {
  NumberValue,
  ScaleLinear,
  scaleLinear,
  ScalePoint,
  scalePoint,
  scaleTime,
  ScaleTime,
} from 'd3-scale';
import { merge, ReplaySubject, Subject } from 'rxjs';
import {
  first,
  tap,
  switchMapTo,
  takeUntil,
  debounceTime,
  pairwise,
  filter,
} from 'rxjs/operators';
import { DtStackedSeriesChartNode } from '..';
import {
  DtStackedSeriesChartOverlay,
  DtStackedSeriesChartHeatFieldOverlay,
} from './stacked-series-chart-overlay.directive';
import {
  DtStackedSeriesChartFilledSeries,
  DtStackedSeriesChartFillMode,
  DtStackedSeriesChartLegend,
  DtStackedSeriesChartMode,
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartTooltipData,
  DtStackedSeriesChartValueDisplayMode,
  DtStackedSeriesChartSelectionMode,
  DtStackedSeriesChartSelection,
  fillSeries,
  getLegends,
  getSeriesWithState,
  getTotalMaxValue,
  updateNodesVisibility,
  DtStackedSeriesChartLabelAxisMode,
  DtStackedSeriesStackHoverData,
  DtStackedSeriesLegendHoverData,
  DtStackedSeriesHoverData,
  DtStackedSeriesChartValueContinuousAxisType,
  DtStackedSeriesChartValueContinuousAxisMap,
  TimeInterval,
  DtStackedSeriesHeatField,
  DtStackedSeriesHeatFieldLevel,
} from './stacked-series-chart.util';
import {
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
  BooleanInput,
} from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';

// horizontal ticks
const TICK_BAR_SPACING = 160;
// vertical ticks
const TICK_COLUMN_SPACING = 80;

@Component({
  selector: 'dt-stacked-series-chart',
  exportAs: 'dtStackedSeriesChart',
  templateUrl: 'stacked-series-chart.html',
  styleUrls: [
    'stacked-series-chart.scss',
    'stacked-series-chart-column.scss',
    'stacked-series-chart-bar.scss',
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[class.dt-stacked-series-chart-with-legend]': 'visibleLegend',
    '[class.dt-stacked-series-chart-with-value-axis]': 'visibleValueAxis',
    '[class.dt-stacked-series-chart-bar]': "mode === 'bar'",
    '[class.dt-stacked-series-chart-column]': "mode === 'column'",
    '[style.--dt-stacked-series-chart-grid-gap]': '_gridGap',
  },
})
export class DtStackedSeriesChart implements OnDestroy, OnInit {
  /** Array of series with their nodes. */
  @Input()
  get series(): DtStackedSeriesChartSeries[] {
    return this._series;
  }
  set series(value: DtStackedSeriesChartSeries[]) {
    if (value !== this._series) {
      this._series = value;
      this._updateFilledSeries();
    }
  }
  private _series: DtStackedSeriesChartSeries[];
  /** Series with filled nodes */
  private _filledSeries: DtStackedSeriesChartFilledSeries[];

  /** Whether to make just the nodes selectable or the whole row/column */
  @Input() selectionMode: DtStackedSeriesChartSelectionMode = 'node';

  get _isNodeSelectionMode(): boolean {
    return this.selectionMode === 'node';
  }

  get _isStackSelectionMode(): boolean {
    return this.selectionMode === 'stack';
  }

  /** Allow selections to be made on chart */
  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    if (value !== this._selectable) {
      this._toggleSelect();
      this._selectable = coerceBooleanProperty(value) ?? false;
    }
  }
  _selectable = false;
  static ngAcceptInputType_selectable: BooleanInput;

  /** Max value in the chart */
  @Input()
  get max(): number | undefined {
    return this._max !== undefined
      ? this._max
      : getTotalMaxValue(this._filledSeries);
  }
  set max(value: number | undefined) {
    if (value !== this._max) {
      this._max = isDefined(value) ? coerceNumberProperty(value) : value;
      this._render();
    }
  }
  private _max: number | undefined;
  static ngAcceptInputType_max: NumberInput;

  /** Whether each bar should be filled completely or should take into account their siblings and max  */
  @Input()
  get fillMode(): DtStackedSeriesChartFillMode {
    return this._fillMode;
  }
  set fillMode(value: DtStackedSeriesChartFillMode) {
    if (value !== this._fillMode) {
      this._fillMode = value ?? 'relative';
      this._render();
    }
  }
  private _fillMode: DtStackedSeriesChartFillMode = 'relative';

  /**
   * Sets the display mode for the stacked-series-chart values
   * in legend to either 'none' 'percent' or 'absolute'.
   * Only valid for single track chart.
   */
  @Input() valueDisplayMode: DtStackedSeriesChartValueDisplayMode = 'none';
  /** @internal Will be true if display mode is not 'none' and only has one series */
  _canShowValue: boolean;

  /**
   * Sets the type for Continuous Axis scale calculation
   * to 'none', 'date' or linear.
   */
  @Input() continuousAxisType: DtStackedSeriesChartValueContinuousAxisType =
    'none';

  /**
   * In case we want a specific interval for ticks. I.e.: every 5 mins, per day...
   */
  @Input()
  get continuousAxisInterval(): TimeInterval {
    return this._continuousAxisInterval;
  }
  set continuousAxisInterval(value: TimeInterval) {
    this._continuousAxisInterval = value;
    this._render();
  }
  _continuousAxisInterval: TimeInterval;

  /**
   * Specific format for tick label.
   * It follows D3 format (https://github.com/d3/d3-format) for linear type
   * and D3 time format (https://github.com/d3/d3-time-format) for date type
   */
  @Input()
  get continuousAxisFormat(): string {
    return this._continuousAxisFormat;
  }
  set continuousAxisFormat(value: string) {
    this._continuousAxisFormat = value;
    this._render();
  }
  _continuousAxisFormat: string;

  /**
   * Mapping function to create d3 domain.
   * If we have a date string like "12:45:20", we will map it to a Date()
   * so that d3 could understand the domain and build the scale properly
   */
  @Input()
  get continuousAxisMap(): DtStackedSeriesChartValueContinuousAxisMap {
    return this._continuousAxisMap ?? (({ origin }) => origin.label);
  }
  set continuousAxisMap(value: DtStackedSeriesChartValueContinuousAxisMap) {
    this._continuousAxisMap = value;
    this._render();
  }
  _continuousAxisMap: DtStackedSeriesChartValueContinuousAxisMap;

  /** Array of legends that can be used to toggle bar nodes. Useful when the legend used is outside this component */
  @Input()
  get legends(): DtStackedSeriesChartLegend[] | undefined {
    return this._legends ?? [];
  }
  set legends(value: DtStackedSeriesChartLegend[] | undefined) {
    if (value !== this._legends) {
      this._legends =
        value && value.length > 0 ? value : getLegends(this._series);

      updateNodesVisibility(this._filledSeries, this._legends);

      this._render();
    }
  }
  _legends: DtStackedSeriesChartLegend[];

  /** Visibility of the legend */
  @Input()
  get visibleLegend(): boolean {
    return this._visibleLegend;
  }
  set visibleLegend(value: boolean) {
    this._visibleLegend = coerceBooleanProperty(value);
  }
  private _visibleLegend = true;
  static ngAcceptInputType_visibleLegend: BooleanInput;

  /** Whether background should be transparent or show a background. Default: true */
  @Input()
  get visibleTrackBackground(): boolean {
    return this._visibleTrackBackground;
  }
  set visibleTrackBackground(value: boolean) {
    this._visibleTrackBackground = coerceBooleanProperty(value);
  }
  private _visibleTrackBackground = true;
  static ngAcceptInputType_visibleTrackBackground: BooleanInput;

  /** Visibility of series label */
  @Input()
  get visibleLabel(): boolean {
    return this._visibleLabel;
  }
  set visibleLabel(value: boolean) {
    this._visibleLabel = coerceBooleanProperty(value);
  }
  private _visibleLabel = true;
  static ngAcceptInputType_visibleLabel: BooleanInput;

  /** Display mode */
  @Input()
  get mode(): DtStackedSeriesChartMode {
    return this._mode;
  }
  set mode(value: DtStackedSeriesChartMode) {
    if (this._mode !== value) {
      this._mode = value ?? 'bar';
      // as template changes and we rely on dimensions we have to use a lifecycle hook
      this._shouldUpdateTicks.next();
    }
  }
  _mode: DtStackedSeriesChartMode = 'bar';

  /** Maximum size of the track */
  @Input()
  get maxTrackSize(): number {
    return this._maxTrackSize;
  }
  set maxTrackSize(value: number) {
    this._maxTrackSize = coerceNumberProperty(value);
  }
  private _maxTrackSize = 16;
  static ngAcceptInputType_maxTrackSize: NumberInput;

  /** Visibility of value axis */
  @Input()
  get visibleValueAxis(): boolean {
    return this._visibleValueAxis;
  }
  set visibleValueAxis(value: boolean) {
    this._visibleValueAxis = coerceBooleanProperty(value);
  }
  private _visibleValueAxis = true;
  static ngAcceptInputType_visibleValueAxis: BooleanInput;

  /** @internal Ticks for value axis */
  _axisTicks: { position: number; value: number; valueRelative: number }[] = [];
  _trackTicks: { position: number; value: string }[] = [];
  _trackAmount: number;

  /** @internal Value axis width to allow it inside the boundaries of the component */
  _valueAxisSize: { absolute: number; relative: number } = {
    absolute: 0,
    relative: 0,
  };

  /**
   * Heat Fields, they will be place at the top or left part of the chart
   * Overlap supported
   */
  @Input()
  get heatFields(): DtStackedSeriesHeatField[] {
    return this._heatFields;
  }
  set heatFields(value: DtStackedSeriesHeatField[]) {
    this._selectedHeatFieldIndex = -1;
    this._heatFields = value;
    this._render();
  }
  _heatFieldLevels: DtStackedSeriesHeatFieldLevel[];
  _heatFields: DtStackedSeriesHeatField[];
  _selectedHeatFieldIndex = -1;

  @Input() labelAxisMode: DtStackedSeriesChartLabelAxisMode = 'full';
  /** @internal  Support only for mode === 'column', wouldn't make sense for 'row' */
  get _labelAxisCompactModeEnabled(): boolean {
    return (
      this.mode === 'column' &&
      (this.labelAxisMode === 'compact' ||
        (this.labelAxisMode === 'auto' && this._isAnyLabelOverflowing()))
    );
  }

  /** Gap between cells in the grid */
  _gridGap = 16;

  /** Current selection [series, node] */
  @Input()
  get selected(): DtStackedSeriesChartSelection | [] {
    return this._selected;
  }
  set selected([series, node]: DtStackedSeriesChartSelection | []) {
    // if selected node or series are different than current
    if (this._selected[0] !== series || this._selected[1] !== node) {
      this._toggleSelect(series, node);
    }
  }
  private _selected: DtStackedSeriesChartSelection | [] = [];

  /** Event that fires when a node is clicked with an array of [series, node]  */
  @Output() selectedChange: EventEmitter<DtStackedSeriesChartSelection | []> =
    new EventEmitter();

  /** Notifies the component container of the start of hover events on legend and stacks  */
  @Output() hoverStart = new EventEmitter<DtStackedSeriesHoverData>();

  /** Notifies the component container of the end of hover events per on legend and stacks */
  @Output() hoverEnd = new EventEmitter<DtStackedSeriesHoverData>();

  /** @internal Template reference for the DtStackedSeriesChart */
  @ContentChild(DtStackedSeriesChartOverlay, { read: TemplateRef })
  _overlay: DtStackedSeriesChartOverlay;

  /** @internal Template reference for the DtStackedSeriesChartHeatField */
  @ContentChild(DtStackedSeriesChartHeatFieldOverlay, { read: TemplateRef })
  _heatFieldOverlay: DtStackedSeriesChartHeatFieldOverlay;

  /** @internal Reference to the root svgElement. */
  @ViewChild('valueAxis') _valueAxis: ElementRef;

  /** @internal Reference to the root element. */
  @ViewChild('chartContainer') _chartContainer: ElementRef;

  /** @internal Reference to the elements on the label axis. */
  @ViewChildren('label') labels: QueryList<ElementRef>;

  /** @internal Slices to be painted */
  _tracks: DtStackedSeriesChartFilledSeries[] = [];
  _isScalePoint = false;
  _scale:
    | ScalePoint<string>
    | ScaleLinear<number, number>
    | ScaleTime<number, number>;

  _defaultLabel: string;

  /** Indicates when scale should be built */
  private _shouldRenderInner = new ReplaySubject();
  _shouldRender = this._shouldRenderInner.pipe(
    debounceTime(0),
    tap(() => {
      // We don't want the subject to be cancelled due to errors
      try {
        this._renderInner();
      } catch (_) {
        console.error(_);
      }
    }),
  );

  /** Indicates when unpin is done so that we unselect heatfield item */
  onUnpinInner$ = new Subject<boolean>();
  onUnpin$ = this.onUnpinInner$.pipe(
    pairwise(),
    filter(([prev, next]) => prev && !next),
    tap(() => (this._selectedHeatFieldIndex = -1)),
  );

  /** Indicates when ticks should be recalculated */
  private _shouldUpdateTicks = new ReplaySubject();

  /** Subject to be called upon component destroy to remove pending subscriptions */
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _platform: Platform,
    private _resizer: DtViewportResizer,
    /**
     * @deprecated Remove the sanitizer when we don't have to support ivy anymore.
     * @breaking-change Remove the DomSanitizer. (Version: TBD)
     */
    private readonly _sanitizer: DomSanitizer,
    @Optional() @SkipSelf() private readonly _theme: DtTheme,
  ) {}

  ngOnInit(): void {
    if (this._theme) {
      this._theme._stateChanges
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._updateFilledSeries();
          this._changeDetectorRef.markForCheck();
        });
    }

    merge(this._shouldUpdateTicks, this._resizer.change())
      .pipe(
        tap(() => {
          if (this.labelAxisMode === 'auto' && this.mode === 'column') {
            // Recalculate every time the size changes only if we are on these modes
            this._isAnyLabelOverflowing();
            this._changeDetectorRef.detectChanges();
          }
        }),
        // Shift the updating/rendering to the next CD cycle,
        // because we need the dimensions of axis first, which is rendered in the main cycle.
        switchMapTo(this._zone.onStable.pipe(first())),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        // Because we are waiting for the next zoneStable cycle to actually update
        // the template, we need to explicitly run this inside the zone
        // otherwise, the zone will not care about any events emitted from
        // the template bindings.
        this._zone.run(() => {
          this._updateTicks();
          this._changeDetectorRef.detectChanges();
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Toggle the selection of an element */
  _toggleSelect(
    series?: DtStackedSeriesChartSeries,
    node?: DtStackedSeriesChartNode,
  ): void {
    if (this._selectable) {
      if (
        // Toggle if node or stack are different from current selection
        series &&
        (!this._selected[0] ||
          (this._selected[0] && series.label !== this._selected[0].label) ||
          this._selected[1] !== node)
      ) {
        this._selected = [series, node];
      } else {
        this._selected = [];
      }
      this.selectedChange.emit(this._selected);

      this._render();
    } else {
      this._selected = [];
    }
  }

  _toggleStackSelect(series?: DtStackedSeriesChartSeries): false | void {
    return this._isStackSelectionMode && this._toggleSelect(series, undefined);
  }

  _toggleNodeSelect(
    series?: DtStackedSeriesChartSeries,
    node?: DtStackedSeriesChartNode,
  ): false | void {
    return this._isNodeSelectionMode && this._toggleSelect(series, node);
  }

  /** @internal Toggle the visibility of an element */
  _toggleLegend(slice: DtStackedSeriesChartLegend): void {
    // don't allow hiding last element
    if (
      this._legends.filter((node) => node.visible).length > 1 ||
      !slice.visible
    ) {
      slice.visible = !slice.visible;
      updateNodesVisibility(this._filledSeries, this._legends);

      this._render();
    }
  }

  /** @internal Track array by label in order to have transitions we have to track the elements in the list */
  _trackByFn(
    _: number,
    item: DtStackedSeriesChartTooltipData | DtStackedSeriesChartFilledSeries,
  ): string {
    return item.origin.label;
  }

  /**
   * @internal Sanitization of the custom property is necessary as, custom property assignments do not work
   * in a viewEngine setup. This can be removed with angular version 10, if ivy is no longer opt out.
   */
  _sanitizeCSS(styles: [string, string | number | DtColors][]): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(
      styles.map(([prop, value]) => `${prop}: ${value}`).join('; '),
    );
  }

  /**
   * @internal
   * Handles the mouseEnter on a series slice.
   */
  _handleOnSeriesMouseEnter(slice: DtStackedSeriesChartTooltipData): void {
    this.hoverStart.emit(this._trackStackHoverEvents(slice));
  }

  /**
   * @internal
   * Handles the mouseLeave on a series slice.
   */
  _handleOnSeriesMouseLeave(slice: DtStackedSeriesChartTooltipData): void {
    this.hoverEnd.emit(this._trackStackHoverEvents(slice));
  }

  /**
   * @internal
   * Handles the mouseEnter on a legend.
   */
  _handleOnLegendMouseEnter(legend: DtStackedSeriesChartLegend): void {
    this.hoverStart.emit(this._trackLegendHoverEvents(legend));
  }

  /**
   * @internal
   * Handles the mouseLeave on a legend.
   */
  _handleOnLegendMouseLeave(legend: DtStackedSeriesChartLegend): void {
    this.hoverEnd.emit(this._trackLegendHoverEvents(legend));
  }

  /**
   * Track by function for the renderEvents – speeds up performance
   * and prevent deletion of mouseout
   */
  _renderEventTrackByFn(
    _: number,
    _heatFieldLevel: { index: number }[],
  ): string {
    return _heatFieldLevel.map(({ index }) => index).join('_');
  }

  selectHeatField(selectedIndex: number): void {
    this._selectedHeatFieldIndex =
      this._selectedHeatFieldIndex === selectedIndex ? -1 : selectedIndex;
  }

  /** Returns an object with output data type for hover events on the stack */
  private _trackStackHoverEvents(
    slice: DtStackedSeriesChartTooltipData,
  ): DtStackedSeriesStackHoverData {
    return {
      value: slice.valueRelative,
      stackName: slice.origin.label,
      seriesName: slice.seriesOrigin.label,
      color: slice.color,
      selected: slice.selected,
      visible: slice.visible,
      hoveredIn: 'stack',
    };
  }

  /** Returns an object with output data type for hover events on the legend */
  private _trackLegendHoverEvents(
    legend: DtStackedSeriesChartLegend,
  ): DtStackedSeriesLegendHoverData {
    return {
      seriesName: legend.label,
      color: legend.color,
      visible: legend.visible,
      hoveredIn: 'legend',
    };
  }

  /**
   * Wrapper function that applies different callbacks
   * depending on the Continuous Axis Type
   */
  private _applyFnForContinuousAxisType(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbacks: [DtStackedSeriesChartValueContinuousAxisType, () => any][],
  ): void {
    callbacks
      .filter(([type]) => this.continuousAxisType === type)
      .forEach(([_, callback]) => callback());
  }

  /** Sets scale depending on the Continuous Axis Type */
  private _setScale(): void {
    const mappedSeries = this._filledSeries?.map(this.continuousAxisMap) || [];

    this._applyFnForContinuousAxisType([
      [
        'none',
        () => {
          this._scale = scalePoint()
            .domain(mappedSeries as Iterable<string>)
            .range([0, 100])
            .padding(0.5);

          this._defaultLabel = mappedSeries?.reduce(
            (a, b) => ((a as string).length > (b as string).length ? a : b),
            '',
          ) as string;
        },
      ],
      [
        'linear',
        () => {
          const minValue = Math.min(...(mappedSeries as number[]));
          const maxValue = Math.max(...(mappedSeries as number[]));
          this._scale = scaleLinear()
            .domain([minValue, maxValue])
            .range([0, 100]);

          this._defaultLabel = this._scale
            .ticks(1)
            .map(
              this._scale.tickFormat(Infinity, this.continuousAxisFormat),
            )[0];
        },
      ],
      [
        'date',
        () => {
          const minValue = new Date(Math.min.apply(null, mappedSeries));
          const maxValue = new Date(Math.max.apply(null, mappedSeries));
          this._scale = scaleTime()
            .domain([minValue, maxValue])
            .range([0, 100]);

          this._defaultLabel = this._scale.tickFormat(
            0,
            this.continuousAxisFormat,
          )(mappedSeries[0] as Date);
        },
      ],
    ]);

    this._isScalePoint = this.continuousAxisType === 'none';
  }

  private _renderHeatFields(
    getPosition: (value: DtStackedSeriesChartFilledSeries) => number,
  ): void {
    let bounds = [0, 100];
    this._applyFnForContinuousAxisType([
      [
        'none',
        () =>
          (bounds = [
            getPosition(this._tracks[0]),
            getPosition(this._tracks.slice(-1)[0]),
          ]),
      ],
    ]);
    const defaultColor = getDtChartColorPalette(1, this._theme)[0];

    const heatFieldRenderData: DtStackedSeriesHeatFieldLevel = (
      this.heatFields || []
    )
      .map((heatField, index) => {
        let [start, end] = [heatField.start, heatField.end]
          .map((label) => label && { origin: { label } })
          .map((value, i) => (value ? getPosition(value) : bounds[i]));
        // If a heat field is a specific point -instead of a range, we add some
        // min width so that overlapping could be detected
        if (start === end && start != null) {
          start -= 0.001;
          end += 0.001;
        }
        return {
          index,
          start,
          end,
          position: (end - start) / 2 + start,
          size: Math.abs(end - start),
          config: { ...heatField, color: heatField.color || defaultColor },
        };
      })
      .filter(({ start, end }) => start != null && end != null)
      .sort((a, b) => a.start - b.start || b.size - a.size);

    const hasOverlap = ({ end }, { start }) => end > start;

    this._heatFieldLevels =
      heatFieldRenderData[0] &&
      heatFieldRenderData.slice(1).reduce(
        (arr, heatField) => {
          const heatFieldLevel = arr.find(
            (_heatFieldLevel) =>
              !hasOverlap(_heatFieldLevel.slice(-1)[0], heatField),
          );
          if (heatFieldLevel) {
            heatFieldLevel.push(heatField);
            return arr;
          } else {
            return [...arr, [heatField]];
          }
        },
        [[heatFieldRenderData[0]]] as DtStackedSeriesHeatFieldLevel[],
      );
  }

  /** Calculate current state */
  private _render(): void {
    this._shouldRenderInner.next();
  }

  private _renderInner(): void {
    this._setScale();

    let getPosition;
    this._applyFnForContinuousAxisType([
      [
        'none',
        () =>
          (getPosition = (value) =>
            (this._scale as ScalePoint<string>)(
              this.continuousAxisMap(value) as string,
            )),
      ],
      [
        'linear',
        () =>
          (getPosition = (value) =>
            (this._scale as ScaleLinear<number, number>)(
              this.continuousAxisMap(value) as NumberValue,
            )),
      ],
      [
        'date',
        () =>
          (getPosition = (value) =>
            (this._scale as ScaleTime<number, number>)(
              this.continuousAxisMap(value) as Date,
            )),
      ],
    ]);

    this._tracks = getSeriesWithState(
      this._filledSeries,
      this._selected,
      this._fillMode === 'relative' ? this.max : undefined,
    ).map((track) => ({
      ...track,
      position: getPosition(track),
    }));

    // Calculating number of tracks (columns or bars) by their position
    // If there are <= 1 tracks, calculation is not possible so use track length
    try {
      const [{ position: posA }, { position: posB }] = this._tracks.slice(0, 2);
      this._trackAmount = Math.ceil(100 / ((posB || 0) - (posA || 0)));
    } catch (e) {
      this._trackAmount = this._tracks.length;
    }

    this._renderHeatFields(getPosition);

    this._shouldUpdateTicks.next();
  }

  /** Calculate legends, colors and fill series */
  private _updateFilledSeries(): void {
    this._legends = getLegends(this.series, this._theme);
    this._filledSeries = fillSeries(this.series, this._legends);
    this._canShowValue = this.series.length === 1;

    this._render();
  }

  /** Calculate the ticks used for values */
  private _updateTicks(): void {
    if (!this._platform.isBrowser) {
      return;
    }
    if (this._chartContainer && this._tracks?.length) {
      // Setting the tick amount to a defined interval
      // Otherwise, ticks fit the axis. Adding some threshold and min value
      // to assure certain space between ticks
      const tickAmount =
        (this.continuousAxisType === 'date' && this.continuousAxisInterval) ||
        (this.mode === 'bar'
          ? this._tracks.length
          : Math.max(
              2,
              Math.min(
                this._tracks.length,
                Math.floor(
                  (this._chartContainer.nativeElement.offsetWidth +
                    this._gridGap) /
                    this.labels.first.nativeElement.offsetWidth,
                ),
              ),
            ));

      this._applyFnForContinuousAxisType([
        [
          'none',
          () => {
            this._trackTicks = this._tracks
              .map(this.continuousAxisMap)
              .map((label: string) => {
                return {
                  position: (this._scale as ScalePoint<string>)(label) || 0,
                  value: label,
                };
              });
          },
        ],
        [
          'linear',
          () => {
            this._trackTicks = (this._scale as ScaleTime<number, number>)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .ticks(<any>tickAmount)
              .map((value) => {
                return {
                  position: (this._scale as ScaleLinear<number, number>)(value),
                  value: (
                    this._scale as ScaleLinear<number, number>
                  ).tickFormat(
                    Infinity,
                    this.continuousAxisFormat,
                  )(value),
                };
              });
          },
        ],
        [
          'date',
          () => {
            this._trackTicks = (this._scale as ScaleTime<number, number>)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .ticks(<any>tickAmount)
              .map((value) => {
                return {
                  position: (this._scale as ScaleTime<number, number>)(value),
                  value: (this._scale as ScaleTime<number, number>).tickFormat(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <any>tickAmount,
                    this.continuousAxisFormat,
                  )(value),
                };
              });
          },
        ],
      ]);
    }

    if (this._valueAxis) {
      const axisBox = this._valueAxis.nativeElement.getBoundingClientRect();
      const axisLength = this.mode === 'bar' ? axisBox.width : axisBox.height;
      const tickAmount = Math.max(
        Math.floor(
          axisLength /
            (this.mode === 'bar' ? TICK_BAR_SPACING : TICK_COLUMN_SPACING),
        ) + 1,
        2,
      );

      const scale = scaleLinear()
        .domain([0, this.max ?? 0])
        .range([0, 100])
        .nice(tickAmount);

      this._axisTicks = scale.ticks(tickAmount).map((value) => {
        return {
          // for column scale must be inverted but d3 does not allow a reverse scale
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          position: this.mode === 'bar' ? scale(value)! : 100 - scale(value)!,
          value: value,
          valueRelative: this.max ? value / this.max : 0,
        };
      });

      this._valueAxisSize = {
        absolute:
          formatCount(this._axisTicks.slice(-1)[0].value).toString().length *
            0.6 +
          1.5,
        relative:
          // `valueRelative` needs to be formatted to a percentage scale (0-100)
          // in order to compute the axis size
          ((this._axisTicks.slice(-1)[0].valueRelative * 100).toString()
            .length +
            1) *
            0.6 +
          1.5,
      };
    }
  }

  /** Whether there's a label on the label axis that is overflowing its allocated space on the css grid */
  private _isAnyLabelOverflowing(): boolean {
    if (
      !this.labels?.first ||
      !this._trackTicks?.length ||
      !this._chartContainer?.nativeElement
    )
      return false;
    return (
      this.labels.first.nativeElement.offsetWidth >
      (this._chartContainer.nativeElement.offsetWidth + this._gridGap) /
        this._trackTicks.length
    );
  }
}
