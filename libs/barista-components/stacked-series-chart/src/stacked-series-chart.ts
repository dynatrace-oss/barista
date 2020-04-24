/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DtViewportResizer } from '@dynatrace/barista-components/core';
import { formatCount } from '@dynatrace/barista-components/formatters';
import { DtColors, DtTheme } from '@dynatrace/barista-components/theming';
import { scaleLinear } from 'd3-scale';
import { merge, Subject } from 'rxjs';
import { first, switchMapTo, takeUntil } from 'rxjs/operators';
import { DtStackedSeriesChartNode } from '..';
import { DtStackedSeriesChartOverlay } from './stacked-series-chart-overlay.directive';
import {
  DtStackedSeriesChartFilledSeries,
  DtStackedSeriesChartFillMode,
  DtStackedSeriesChartLegend,
  DtStackedSeriesChartMode,
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartTooltipData,
  DtStackedSeriesChartValueDisplayMode,
  fillSeries,
  getLegends,
  getSeriesWithState,
  getTotalMaxValue,
  updateNodesVisibility,
} from './stacked-series-chart.util';
import { DtOverlayRef, DtOverlay } from '@dynatrace/barista-components/overlay';

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
  },
})
export class DtStackedSeriesChart implements OnDestroy {
  /** Array of series with their nodes. */
  @Input()
  get series(): DtStackedSeriesChartSeries[] {
    return this._series;
  }
  set series(value: DtStackedSeriesChartSeries[]) {
    if (value !== this._series) {
      this._series = value;
      this._updateFilledSeries();
      this._render();
    }
  }
  private _series: DtStackedSeriesChartSeries[];
  /** Series with filled nodes */
  private _filledSeries: DtStackedSeriesChartFilledSeries[];

  /** Allow selections to be made on chart */
  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    if (value !== this._selectable) {
      this._toggleSelect();
      this._selectable = value ?? false;
    }
  }
  _selectable: boolean = false;

  /** Max value in the chart */
  @Input()
  get max(): number | undefined {
    return this._max !== undefined ? this._max : getTotalMaxValue(this.series);
  }
  set max(value: number | undefined) {
    if (value !== this._max) {
      this._max = value;
      this._render();
    }
  }
  private _max: number | undefined;

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
  @Input() visibleLegend: boolean = true;

  /** Whether background should be transparent or show a background. Default: true */
  @Input() visibleTrackBackground: boolean = true;

  /** Visibility of series label */
  @Input() visibleLabel: boolean = true;

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
  @Input() maxTrackSize: number = 16;

  /** Visibility of value axis */
  @Input() visibleValueAxis: boolean = true;

  /** @internal Ticks for value axis */
  _axisTicks: { pos: number; value: number; valueRelative: number }[] = [];

  /** @internal Value axis width to allow it inside the boundaries of the component */
  _valueAxisSize: { absolute: number; relative: number } = {
    absolute: 0,
    relative: 0,
  };

  /** Current selection [series, node] */
  @Input()
  get selected(): [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | [] {
    return this._selected;
  }
  set selected([series, node]:
    | [DtStackedSeriesChartSeries, DtStackedSeriesChartNode]
    | []) {
    // if selected node is different than current
    if (this._selected[1] !== node) {
      this._toggleSelect(series, node);
    }
  }
  private _selected:
    | [DtStackedSeriesChartSeries, DtStackedSeriesChartNode]
    | [] = [];

  /** Event that fires when a node is clicked with an array of [series, node]  */
  @Output() selectedChange: EventEmitter<
    [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | []
  > = new EventEmitter();

  /** @internal Template reference for the DtStackedSeriesChart */
  @ContentChild(DtStackedSeriesChartOverlay, { read: TemplateRef })
  _overlay: TemplateRef<DtStackedSeriesChartTooltipData>;

  /** @internal Reference to the root svgElement. */
  @ViewChild('valueAxis') _valueAxis;

  /** Reference to the open overlay. */
  private _overlayRef: DtOverlayRef<DtStackedSeriesChartTooltipData> | null;

  /** @internal Slices to be painted */
  _tracks: DtStackedSeriesChartFilledSeries[] = [];

  /** Indicates when ticks should be recalculated */
  private _shouldUpdateTicks = new Subject();

  /** Subject to be called upon component destroy to remove pending subscriptions */
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private _resizer: DtViewportResizer,
    private _zone: NgZone,
    private _overlayService: DtOverlay,
    /**
     * @deprecated Remove the sanitizer when we don't have to support ivy anymore.
     * @breaking-change Remove the DomSanitizer. (Version: TBD)
     */
    private readonly _sanitizer: DomSanitizer,
    @Optional() @SkipSelf() private readonly _theme: DtTheme,
  ) {
    if (this._theme) {
      this._theme._stateChanges
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._updateFilledSeries();
          this._render();
          this._changeDetectorRef.markForCheck();
        });
    }

    merge(this._shouldUpdateTicks, this._resizer.change())
      .pipe(
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
      if (series && node && this._selected[1] !== node) {
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
   * Creates an overlay if it is necessary.
   */
  _handleOnSeriesMouseEnter(
    event: MouseEvent,
    slice: DtStackedSeriesChartTooltipData,
  ): void {
    if (this._overlay && !this._overlayRef) {
      this._overlayRef = this._overlayService.create<
        DtStackedSeriesChartTooltipData
      >(event.target as HTMLElement, this._overlay);
      this._overlayRef.updateImplicitContext(slice);
      this._overlayRef.updatePosition(event.offsetX, event.offsetY);
    }
  }

  /**
   * @internal
   * Handles the mouseMove on a series slice.
   * Updates the position of the overlay to create a mouseFollow position
   */
  _handleOnSeriesMouseMove(event: MouseEvent): void {
    if (this._overlayRef) {
      this._overlayService._positionStrategy.setOrigin({
        x: event.clientX,
        y: event.clientY,
      });
      this._overlayRef.updatePosition();
    }
  }
  /**
   * @internal
   * Handles the mouseLeave on a series slice.
   * Dismisses the overlay if there is one defined.
   */
  _handleOnSeriesMouseLeave(): void {
    if (this._overlayRef) {
      this._overlayRef.dismiss();
      this._overlayRef = null;
    }
  }

  /** Calculate current state */
  private _render(): void {
    this._tracks = getSeriesWithState(
      this._filledSeries,
      this._selected,
      this._fillMode === 'relative' ? this.max : undefined,
    );
  }

  /** Calculate legends, colors and fill series */
  private _updateFilledSeries(): void {
    this._legends = getLegends(this.series, this._theme);
    this._filledSeries = fillSeries(this.series, this._legends);
    this._canShowValue = this.series.length === 1;

    this._shouldUpdateTicks.next();
  }

  /** Calculate the ticks used for values */
  private _updateTicks(): void {
    if (this._valueAxis) {
      const axisBox = this._valueAxis.nativeElement.getBoundingClientRect();
      const axisLength = this.mode === 'bar' ? axisBox.width : axisBox.height;
      const tickAmount =
        Math.floor(
          axisLength /
            (this.mode === 'bar' ? TICK_BAR_SPACING : TICK_COLUMN_SPACING),
        ) + 1;

      const scale = scaleLinear()
        .domain([0, this.max ?? 0])
        .range([0, 100]);

      this._axisTicks = scale.ticks(tickAmount).map((value) => {
        return {
          // for column scale must be inverted but d3 does not allow a reverse scale
          pos: this.mode === 'bar' ? scale(value) : 100 - scale(value),
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
          (this._axisTicks.slice(-1)[0].valueRelative.toString().length + 1) *
            0.6 +
          1.5,
      };
    }
  }
}
