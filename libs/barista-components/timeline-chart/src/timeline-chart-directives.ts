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

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

/** Element to define a title for a marker that will be rendered inside the legends overlay. */
@Directive({
  selector: 'dt-timeline-chart-overlay-title, [dtTimelineChartOverlayTitle]',
  exportAs: 'dtTimelineChartOverlayTitle',
  host: {
    class: 'dt-timeline-chart-overlay-title',
  },
})
export class DtTimelineChartOverlayTitle {}

/** Element to define an info text for a marker that will be rendered inside the legends overlay. */
@Directive({
  selector: 'dt-timeline-chart-overlay-text, [dtTimelineChartOverlayText]',
  exportAs: 'dtTimelineChartOverlayText',
  host: {
    class: 'dt-timeline-chart-overlay-text',
  },
})
export class DtTimelineChartOverlayText {}

/** @internal Base class for sharing common logic between marker types. */
@Directive()
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
  static ngAcceptInputType_value: NumberInput;

  /** The identifier character. E.g. "V" */
  @Input() identifier: string;

  /** @internal Portal for projecting the content of the marker to other places in the timeline chart (e.g. the legend) */
  @ViewChild('contentPortal', { read: CdkPortal, static: true })
  _contentPortal: CdkPortal;

  /** @internal Portal for projecting the overlay title and text into the overlay. */
  @ViewChild('overlayTemplate', { read: TemplateRef, static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _overlayTemplate: TemplateRef<any>;

  /** @internal The title that should be rendered in the overlay. */
  @ContentChild(DtTimelineChartOverlayTitle, { static: true })
  _overlayTitle: DtTimelineChartOverlayTitle;

  /** @internal The text that should be rendered in the overlay. */
  @ContentChild(DtTimelineChartOverlayText, { static: true })
  _overlayText: DtTimelineChartOverlayText;

  /** @internal Whether there is content to be displayed in an overlay. */
  get _hasOverlay(): boolean {
    return !!this._overlayText || !!this._overlayTitle;
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
export class DtTimelineChartTimingMarker extends DtTimelineChartMarker {}

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
