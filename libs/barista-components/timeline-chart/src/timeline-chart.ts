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

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DtViewportResizer } from '@dynatrace/barista-components/core';

import {
  DtTimelineChartKeyTimingMarker,
  DtTimelineChartTimingMarker,
} from './timeline-chart-directives';

const POSITION_PRECISION = 10000;

@Component({
  selector: 'dt-timeline-chart',
  exportAs: 'dtTimelineChart',
  templateUrl: 'timeline-chart.html',
  styleUrls: ['timeline-chart.scss'],
  host: {
    class: 'dt-timeline-chart',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTimelineChart implements AfterContentInit, OnDestroy {
  /** The unit of the provided values. Needs to be a time-unit like "s". */
  @Input() unit = '';

  /**
   * The value (length) of the timeline chart.
   * In most cases it is the same value as the last timing marker.
   */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = coerceNumberProperty(value);
    this._updateRenderValues();
  }
  private _value = 0;
  static ngAcceptInputType_value: NumberInput;

  /** @internal The timing markers passed in via ng-content. */
  @ContentChildren(DtTimelineChartTimingMarker)
  _timingMarkers: QueryList<DtTimelineChartTimingMarker>;

  /** @internal The key-timing markers passed in via ng-content. */
  @ContentChildren(DtTimelineChartKeyTimingMarker)
  _keyTimingMarkers: QueryList<DtTimelineChartKeyTimingMarker>;

  /** @internal The generated bars that are actually rendered. */
  _renderBars: number[] = [];

  /** @internal The calculated ticks on the x-axis. */
  _renderTicks: { position: number; value: number }[] = [];

  /** @internal The timing markers that are rendered on a specific position */
  _renderTimingMarkers: {
    position: number;
    marker: DtTimelineChartTimingMarker;
  }[] = [];

  /** @internal The key-timing markers that are rendered on a specific position */
  _renderKeyTimingMarkers: {
    position: number;
    marker: DtTimelineChartKeyTimingMarker;
  }[] = [];

  private _destroy = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _viewportResizer: DtViewportResizer,
    private _elementRef: ElementRef,
  ) {}

  ngAfterContentInit(): void {
    merge(
      this._timingMarkers.changes,
      this._keyTimingMarkers,
      this._viewportResizer.change(),
    )
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this._updateRenderValues();
      });

    this._updateRenderValues();
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Updates all the values (bars, ticks, markers) that are rendered to the DOM. */
  private _updateRenderValues(): void {
    const tickAmount = this._getTickAmount();

    /* eslint-disable no-magic-numbers */
    const scale = scaleLinear()
      .domain([0, this._value])
      .range([0, POSITION_PRECISION])
      .nice();
    let ticks = scale.ticks(tickAmount);
    const last = ticks[ticks.length - 1];
    if (last < this._value && ticks.length > 1) {
      scale.domain([0, last + ticks[1]]);
      ticks = scale.ticks(tickAmount);
    }
    /* eslint-enable no-magic-numbers */

    this._updateRenderBars(scale);
    this._updateRenderTicks(scale, ticks);
    this._updateRenderTimingMarkers(scale);
    this._updateRenderKeyTimingMarkers(scale);

    this._changeDetectorRef.markForCheck();
  }

  /** Calculates the position and length of the bar objects that are actually rendered. */
  private _updateRenderBars(scale: ScaleLinear<number, number>): void {
    this._renderBars = [valueToPercentage(this._value, scale)];
  }

  /** Calculates the position and updates the tick objects that are actually rendered. */
  private _updateRenderTicks(
    scale: ScaleLinear<number, number>,
    ticks: number[],
  ): void {
    this._renderTicks = ticks.map((t) => ({
      position: valueToPercentage(t, scale),
      value: t,
    }));
  }

  /** Calculates the position and updates the timing marker objects that are actually rendered. */
  private _updateRenderTimingMarkers(scale: ScaleLinear<number, number>): void {
    this._renderTimingMarkers = this._timingMarkers
      ? this._timingMarkers.toArray().map((marker) => ({
          position: valueToPercentage(marker.value, scale),
          marker,
        }))
      : [];
  }

  /** Calculates the position and updates the key timing marker objects that are actually rendered. */
  private _updateRenderKeyTimingMarkers(
    scale: ScaleLinear<number, number>,
  ): void {
    this._renderKeyTimingMarkers = this._keyTimingMarkers
      ? this._keyTimingMarkers.toArray().map((marker) => ({
          position: valueToPercentage(marker.value, scale),
          marker,
        }))
      : [];
  }

  /** Returns the amount of ticks based on the component with. More space means more ticks. */
  private _getTickAmount(): number {
    const el = this._elementRef.nativeElement as HTMLElement;
    /* eslint-disable no-magic-numbers */
    if (el && el.clientWidth) {
      const width = el.clientWidth;
      if (width > 1200) {
        return 10;
      }
      if (width > 600) {
        return 6;
      }
    }
    return 4;
    /* eslint-enable no-magic-numbers */
  }
}

function valueToPercentage(
  value: number,
  scale: ScaleLinear<number, number>,
): number {
  return (
    // eslint-disable-next-line no-magic-numbers, @typescript-eslint/no-non-null-assertion
    Math.round((scale(value)! / 100) * POSITION_PRECISION) / POSITION_PRECISION
  );
}
