import { Directive, Input } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';

export class DtTimelineChartMarker {
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = coerceNumberProperty(value);
  }
  private _value = 0;

  @Input() identifier: string;
}

@Directive({
  selector: 'dt-timeline-chart-timing-marker',
  providers: [
    {
      provide: DtTimelineChartMarker,
      useExisting: DtTimelineChartTimingMarker,
    },
  ],
})
export class DtTimelineChartTimingMarker extends DtTimelineChartMarker {}

@Directive({
  selector: 'dt-timeline-chart-key-timing-marker',
  providers: [
    {
      provide: DtTimelineChartMarker,
      useExisting: DtTimelineChartKeyTimingMarker,
    },
  ],
})
export class DtTimelineChartKeyTimingMarker extends DtTimelineChartMarker {}
