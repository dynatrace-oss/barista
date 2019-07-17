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
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { DtTimelineChartTimingMarker } from './timeline-chart-directives';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  @Input() unit = '';

  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = coerceNumberProperty(value);
    this._update();
  }
  private _value = 0;

  @ContentChildren(DtTimelineChartTimingMarker)
  _renderMarkers: QueryList<DtTimelineChartTimingMarker>;

  _renderBars: number[] = [];
  _renderTicks: { position: number; value: number }[] = [];
  _renderTimingMarkers: {
    position: number;
    marker: DtTimelineChartTimingMarker;
  }[] = [];

  private _destroy = new Subject<void>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._renderMarkers.changes.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._update();
    });
    this._update();
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _update(): void {
    // tslint:disable: no-magic-numbers
    const scale = scaleLinear()
      .domain([0, this._value])
      .range([0, POSITION_PRECISION])
      .nice();
    let ticks = scale.ticks(4);
    const last = ticks[ticks.length - 1];
    if (last < this._value && ticks.length > 1) {
      scale.domain([0, last + ticks[1]]);
      ticks = scale.ticks(4);
    }
    // tslint:enable: no-magic-numbers

    this._updateRenderBars(scale);
    this._updateRenderTicks(scale, ticks);
    this._updateRenderTimingMarkers(scale);

    this._changeDetectorRef.markForCheck();
  }

  private _updateRenderBars(scale: ScaleLinear<number, number>): void {
    this._renderBars = [valueToPercentage(this._value, scale)];
  }

  private _updateRenderTicks(
    scale: ScaleLinear<number, number>,
    ticks: number[]
  ): void {
    this._renderTicks = ticks.map(t => ({
      position: valueToPercentage(t, scale),
      value: t,
    }));
  }

  private _updateRenderTimingMarkers(scale: ScaleLinear<number, number>): void {
    this._renderTimingMarkers = this._renderMarkers
      ? this._renderMarkers
          .toArray()
          .map(marker => ({
            position: valueToPercentage(marker.value, scale),
            marker,
          }))
      : [];
  }
}

function valueToPercentage(
  value: number,
  scale: ScaleLinear<number, number>
): number {
  // tslint:disable-next-line: no-magic-numbers
  return (
    Math.round((scale(value) / 100) * POSITION_PRECISION) / POSITION_PRECISION
  );
}
