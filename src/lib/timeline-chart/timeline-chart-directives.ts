import { Directive, Input, Component, ViewChild } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkPortal } from '@angular/cdk/portal';

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

  @ViewChild(CdkPortal, { static: true }) _contentPortal: CdkPortal;
}

@Component({
  selector: 'dt-timeline-chart-timing-marker',
  providers: [
    {
      provide: DtTimelineChartMarker,
      useExisting: DtTimelineChartTimingMarker,
    },
  ],
  templateUrl: `./timeline-chart-marker.html`,
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
