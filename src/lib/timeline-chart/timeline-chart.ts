import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DtViewportResizer } from '@dynatrace/angular-components/core';
import {
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
} from './timeline-chart-directives';

const POSITION_PRECISION = 10000;

@Component({
  moduleId: module.id,
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

  @ContentChildren(DtTimelineChartTimingMarker)
  _timingMarkers: QueryList<DtTimelineChartTimingMarker>;

  @ContentChildren(DtTimelineChartKeyTimingMarker)
  _keyTimingMarkers: QueryList<DtTimelineChartKeyTimingMarker>;

  _renderBars: number[] = [];
  _renderTicks: { position: number; value: number }[] = [];
  _renderTimingMarkers: {
    position: number;
    marker: DtTimelineChartTimingMarker;
  }[] = [];
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

    // tslint:disable: no-magic-numbers
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
    // tslint:enable: no-magic-numbers

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
    this._renderTicks = ticks.map(t => ({
      position: valueToPercentage(t, scale),
      value: t,
    }));
  }

  /** Calculates the position and updates the timing marker objects that are actually rendered. */
  private _updateRenderTimingMarkers(scale: ScaleLinear<number, number>): void {
    this._renderTimingMarkers = this._timingMarkers
      ? this._timingMarkers.toArray().map(marker => ({
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
      ? this._keyTimingMarkers.toArray().map(marker => ({
          position: valueToPercentage(marker.value, scale),
          marker,
        }))
      : [];
  }

  /** Returns the amount of ticks based on the component with. More space means more ticks. */
  private _getTickAmount(): number {
    const el = this._elementRef.nativeElement as HTMLElement;
    // tslint:disable: no-magic-numbers
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
    // tslint:enable: no-magic-numbers
  }
}

function valueToPercentage(
  value: number,
  scale: ScaleLinear<number, number>,
): number {
  return (
    // tslint:disable-next-line: no-magic-numbers
    Math.round((scale(value) / 100) * POSITION_PRECISION) / POSITION_PRECISION
  );
}
