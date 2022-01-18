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
  coerceNumberProperty,
  NumberInput,
  coerceBooleanProperty,
  BooleanInput,
} from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { isNumber } from '@dynatrace/barista-components/core';
import {
  DtColors,
  DT_CHART_COLOR_PALETTE_ORDERED,
} from '@dynatrace/barista-components/theming';
import { PieArcDatum } from 'd3-shape';
import { merge, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DtRadialChartOverlayData } from './radial-chart-path';
import { DtRadialChartSeries } from './radial-chart-series';
import { DtRadialChartRenderData } from './utils/radial-chart-interfaces';
import {
  generatePathData,
  generatePieArcData,
  getPercentages,
  getSum,
} from './utils/radial-chart-utils';

/**
 * Output type for hoverStart and hoverEnd attributes.
 * Contains the main data of the hovered series, and wether it was hovered in the pie or on the legend.
 */
export type DtRadialChartHoverData = {
  value: number;
  name: string;
  color: string;
  selected: boolean;
  active: boolean;
  hoveredIn: 'legend' | 'pie';
};

/** Size of the inner (empty) circle in proportion to the circle's radius. */
const DONUT_INNER_CIRCLE_FRACTION = 0.8;

/** Minimum width of the chart */
const MIN_WIDTH = 400;

@Directive({
  selector: '[dtRadialChartOverlay]',
})
export class DtRadialChartOverlay {}

@Component({
  selector: 'dt-radial-chart',
  exportAs: 'dtRadialChart',
  templateUrl: 'radial-chart.html',
  styleUrls: ['radial-chart.scss'],
  host: {
    class: 'dt-radial-chart',
    '[class.dt-radial-chart-legend-right]': 'legendPosition === "right"',
    '[class.dt-radial-chart-legend-bottom]': 'legendPosition === "bottom"',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtRadialChart implements AfterContentInit, OnDestroy {
  /**
   * The chart type. Can either be 'pie' or 'donut'.
   * Defaults to 'pie'.
   */
  @Input()
  get type(): 'pie' | 'donut' {
    return this._type;
  }
  set type(value: 'pie' | 'donut') {
    if (value && value !== this._type) {
      this._type = value;
      this._updateRenderData();
    }
  }
  private _type: 'pie' | 'donut' = 'pie';

  /** Maximum value the chart displays, 100%, full circle */
  @Input()
  get maxValue(): number | null {
    return this._maxValue;
  }
  set maxValue(value: number | null) {
    const coercedValue = coerceNumberProperty(value);
    if (coercedValue !== this._maxValue) {
      this._maxValue = coercedValue;
      this._updateRenderData();
    }
  }
  private _maxValue: number | null = null;
  static ngAcceptInputType_maxValue: NumberInput;

  /** Where the chart's legend should be placed */
  @Input()
  get legendPosition(): 'right' | 'bottom' {
    return this._legendPosition;
  }
  set legendPosition(value: 'right' | 'bottom') {
    this._legendPosition = value;
  }
  private _legendPosition: 'right' | 'bottom' = 'right';

  /** Sets the display mode for the radial-chart values to either 'percent' or 'absolute'.  */
  @Input() valueDisplayMode: 'absolute' | 'percent' = 'absolute';

  /** Sets the decimal precision for the percentage values */
  @Input() precision = 1;

  /** Sets the display mode for the radial-chart values to either 'percent' or 'absolute'.  */
  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    if (value !== this._selectable) {
      this._selectable = coerceBooleanProperty(value);
      this._select();

      this._updateRenderData();
    }
  }
  _selectable = false;
  static ngAcceptInputType_selectable: BooleanInput;

  /* Notifies the component container of the start of hover events per series, both in the pie and on the legend  */
  @Output() hoverStart = new EventEmitter<DtRadialChartHoverData>();

  /* Notifies the component container of the end of hover events per series, both in the pie and on the legend */
  @Output() hoverEnd = new EventEmitter<DtRadialChartHoverData>();

  /** @internal Series data, <dt-radial-chart-series> */
  @ContentChildren(DtRadialChartSeries)
  _radialChartSeries: QueryList<DtRadialChartSeries>;

  /** @internal Overlay template */
  @ContentChild(DtRadialChartOverlay, { static: false, read: TemplateRef })
  _overlay: TemplateRef<{ $implicit: DtRadialChartOverlayData }>;

  /** @internal Render data used to draw the SVG. */
  _renderData: DtRadialChartRenderData[] = [];

  /** @internal Destroy subject to clear subscriptions on component destroy. */
  private readonly _destroy$ = new Subject<void>();

  /** @internal The chart's width based on the viewport width. */
  _width = 0;

  /** @internal The chart's radius. */
  get _radius(): number {
    return this._width / 2 - 16;
  }

  /** @internal External selection radius. */
  get _externalSelectionRadius(): number {
    return this._radius + 8;
  }

  /** @internal Internal selection radius. */
  get _internalSelectionRadius(): number {
    return this._radius + 4;
  }

  /**
   * @internal
   * Flag if a background shape should be rendered.
   * Depends on difference of the given and the calculated max value.
   */
  _hasBackground = false;

  /**
   * @internal
   * The background path is either a full circle or a ring.
   * Depends on the chart type.
   */
  _backgroundPath: string;

  /**
   * @internal
   * Sum of all series values.
   */
  _totalSeriesValue: number;

  /**
   * @internal
   * Get viewbox data based on the radius and width.
   * Adjust the viewbox to center the circle.
   */
  get _viewBox(): string {
    return `${-this._width / 2} ${-this._width / 2} ${this._width} ${
      this._width
    }`;
  }

  /** @internal The chart's inner radius based on the chart type and defined fraction. */
  get _innerRadius(): number {
    return this.type === 'pie' ? 0 : this._radius * DONUT_INNER_CIRCLE_FRACTION;
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: Platform,
    // TODO: remove this sanitizer when ivy is no longer opt out
    private _sanitizer: DomSanitizer,
  ) {}

  /** AfterContentInit hook */
  ngAfterContentInit(): void {
    this._updateDimensions();

    /**
     * Fires every time a value within one of the series changes
     * or the series data itself gets an update (one series is added or removed).
     */
    //updated segments
    const seriesChanges$ = merge(
      this._radialChartSeries.changes.pipe(
        switchMap(() =>
          merge(
            ...this._radialChartSeries.map((series) => series._stateChanges$),
          ),
        ),
      ),
    );

    // initial segments
    const initialSeries$ = merge(
      ...this._radialChartSeries.map((series) => series._stateChanges$),
    ).pipe(takeUntil(seriesChanges$));

    merge(initialSeries$, seriesChanges$)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._updateDimensions();
        this._changeDetectorRef.markForCheck();
      });
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal gets the dimensions of the component and renders */
  _updateDimensions(): void {
    if (this._platform.isBrowser) {
      this._width = Math.max(
        MIN_WIDTH,
        this._elementRef.nativeElement.getBoundingClientRect().width,
      );

      this._updateRenderData();
    }
  }
  /**
   * Updates _renderData used within the template.
   * Calculates all arc-, SVG-path- and background-data
   * or returns an empty array in case no series are available.
   */
  _updateRenderData(): void {
    if (this._radialChartSeries && this._radialChartSeries.length > 0) {
      const seriesValues = this._radialChartSeries.map((s) => s.value);
      const arcs = generatePieArcData(seriesValues, this.maxValue);
      this._totalSeriesValue = getSum(seriesValues);

      const max =
        this.maxValue && this.maxValue >= this._totalSeriesValue
          ? this.maxValue
          : this._totalSeriesValue;

      const seriesPercentages = getPercentages(
        seriesValues,
        max,
        this.precision,
      );

      this._renderData = this._radialChartSeries.map((series, i) => {
        const colorIdx = i % DT_CHART_COLOR_PALETTE_ORDERED.length;
        return this._getSeriesRenderData(
          series,
          arcs[i],
          DT_CHART_COLOR_PALETTE_ORDERED[colorIdx],
          max,
          seriesPercentages[i],
        );
      });

      this._hasBackground =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isNumber(this.maxValue) && this._totalSeriesValue < this.maxValue!;
      this._backgroundPath =
        generatePathData(this._radius, this._innerRadius, 0, Math.PI * 2) || '';
    } else {
      this._renderData = [];
    }
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Puts together an object with all data needed
   * to render the SVG.
   */
  _getSeriesRenderData(
    series: DtRadialChartSeries,
    arcData: PieArcDatum<number>,
    chartColor: string,
    max: number,
    valuePercentage: number,
  ): DtRadialChartRenderData {
    const path =
      generatePathData(
        this._radius,
        this._innerRadius,
        arcData.startAngle,
        arcData.endAngle,
      ) || '';

    const selectionPath =
      generatePathData(
        this._externalSelectionRadius,
        this._internalSelectionRadius,
        arcData.startAngle,
        arcData.endAngle,
      ) || '';

    const hoverPath =
      generatePathData(
        this._externalSelectionRadius,
        this._radius,
        arcData.startAngle,
        arcData.endAngle,
      ) || '';

    // The series' color overrides the given color from the chart color palette.
    const color = series.color ? series.color : chartColor;

    // The path's aria label consists of the series' name, value and the chart's max-value
    const ariaLabel = `${series.name}: ${series.value} of ${max}`;

    return {
      path,
      selectionPath,
      hoverPath,
      color,
      ariaLabel,
      name: series.name,
      value: series.value,
      valuePercentage,
      origin: series,
    };
  }

  /**
   * Sanitization of the custom property is necessary as, custom property assignments do not work
   * in a viewEngine setup. This can be removed with angular version 10, if ivy is no longer opt out.
   */
  _sanitizeCSS(prop: string, value: string | number | DtColors): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(`${prop}: ${value}`);
  }

  /**
   * @internal Emits the data of the selected event and
   * registers the event as selected.
   */
  _select(series?: DtRadialChartRenderData): void {
    // deselect any other
    if (this._radialChartSeries) {
      this._radialChartSeries
        .filter((s) => !this.selectable || (s !== series?.origin && s.selected))
        .forEach((s) => {
          s.selected = false;
          s.selectedChange.emit(false);
        });
    }

    if (series && this.selectable) {
      // select current
      series.origin.selected = !series.origin.selected;
      series.origin.selectedChange.emit(series.origin.selected);
    }
  }

  /** @internal Toggle the visibility of an element */
  _toggleLegend(slice: DtRadialChartRenderData): void {
    if (
      // Keep at least one element visible at any time
      this._renderData.filter((node) => node.origin.active).length > 1 ||
      // If all but one are inactive, allow the clicked one to be activated again
      !slice.origin.active
    ) {
      slice.origin.active = !slice.origin.active;

      this._updateRenderData();
    }
  }

  /** @internal Notify the component container of the start of a hover event on a specific series */
  _hoverStart(
    {
      value,
      name,
      color,
      origin: { selected, active },
    }: DtRadialChartRenderData,
    hoveredIn: 'legend' | 'pie',
  ): void {
    this.hoverStart.emit({
      value,
      name,
      color,
      selected,
      active,
      hoveredIn,
    });
  }

  /** @internal Notify the component container of the end of a hover event on a specific series */
  _hoverEnd(
    {
      value,
      name,
      color,
      origin: { selected, active },
    }: DtRadialChartRenderData,
    hoveredIn: 'legend' | 'pie',
  ): void {
    this.hoverEnd.emit({
      value,
      name,
      color,
      selected,
      active,
      hoveredIn,
    });
  }
}
