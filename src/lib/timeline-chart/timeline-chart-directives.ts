import {
  Input,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkPortal } from '@angular/cdk/portal';

/** Element to define a title for a marker that will be rendered inside the legends overlay. */
@Directive({
  selector: 'dt-timeline-chart-overlay-title',
  exportAs: 'dtTimelineChartOverlayTitle',
  host: {
    class: 'dt-timeline-chart-overlay-title',
  },
})
export class DtTimelineChartOverlayTitle {}

/** Element to define an info text for a marker that will be rendered inside the legends overlay. */
@Directive({
  selector: 'dt-timeline-chart-overlay-text',
  exportAs: 'dtTimelineChartOverlayText',
  host: {
    class: 'dt-timeline-chart-overlay-text',
  },
})
export class DtTimelineChartOverlayText {}

/** @internal Base class for sharing common logic between marker types. */
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

  /** @internal Portal for projecting the content of the marker to other places in the timeline chart (e.g. the legend) */
  @ViewChild('contentPortal', { read: CdkPortal, static: true })
  _contentPortal: CdkPortal;

  /** @internal Whether there is content to be displayed in an overlay. */
  get _hasOverlay(): boolean {
    return false;
  }
}

/** Element for the consumer to create timing markers on the timeline chart. */
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
export class DtTimelineChartTimingMarker extends DtTimelineChartMarker {
  /** @internal Portal for projecting the overlay title and text into the legend's overlay. */
  @ViewChild('overlayTemplate', { read: TemplateRef, static: true })
  _overlayTemplate: TemplateRef<{}>;

  /** @internal The title that should be rendered in the legends overlay. */
  @ContentChild(DtTimelineChartOverlayTitle, { static: true })
  _overlayTitle: DtTimelineChartOverlayTitle;

  /** @internal The text that should be rendered in the legends overlay. */
  @ContentChild(DtTimelineChartOverlayText, { static: true })
  _overlayText: DtTimelineChartOverlayText;

  /** @internal Whether there is content to be displayed in an overlay. */
  get _hasOverlay(): boolean {
    return !!this._overlayText || !!this._overlayTitle;
  }
}

/** Element for the consumer to create timing markers on the timeline chart. */
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
