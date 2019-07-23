import {
  Input,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkPortal } from '@angular/cdk/portal';

export class DtTimelineChartMarker {
  /** The actual value of the marker. */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = coerceNumberProperty(value);
  }
  private _value = 0;

  /** The identifier character. E.g. "V" */
  @Input() identifier: string;

  /** Internal portal for projecting the content of the marker to other places in the timeline chart (e.g. the legend) */
  @ViewChild(CdkPortal, { static: true }) _contentPortal: CdkPortal;
}

@Component({
  selector: 'dt-timeline-chart-timing-marker',
  templateUrl: `./timeline-chart-marker.html`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DtTimelineChartMarker,
      useExisting: DtTimelineChartTimingMarker,
    },
  ],
})
export class DtTimelineChartTimingMarker extends DtTimelineChartMarker {}

@Component({
  selector: 'dt-timeline-chart-key-timing-marker',
  templateUrl: `./timeline-chart-marker.html`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DtTimelineChartMarker,
      useExisting: DtTimelineChartKeyTimingMarker,
    },
  ],
})
export class DtTimelineChartKeyTimingMarker extends DtTimelineChartMarker {}
