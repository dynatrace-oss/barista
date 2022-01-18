/* eslint-disable @typescript-eslint/ban-types */
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

import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  DtOverlay,
  DtOverlayTrigger,
} from '@dynatrace/barista-components/overlay';

/** Symbol (e.g. some kind of icon) that should be placed before the text of a legend item. */
@Directive({
  selector: 'dt-legend-symbol, [dtLegendSymbol]',
  exportAs: 'dtLegendSymbol',
  host: {
    class: 'dt-legend-symbol',
  },
})
export class DtLegendSymbol {}

/** Template that should be rendered in an overlay on the legend item when hovered. */
@Directive({
  selector: 'ng-template[dtLegendOverlay]',
  exportAs: 'dtLegendOverlay',
})
export class DtLegendOverlay {}

/** One item of a legend. Contains a symbol, a text and optional an overlay.  */
@Component({
  selector: 'dt-legend-item',
  templateUrl: 'legend-item.html',
  styleUrls: ['legend-item.scss'],
  host: {
    class: 'dt-legend-item',
    '(mouseenter)': 'hasOverlay && _handleMouseEnter($event)',
    '(mouseleave)': 'hasOverlay && _handleMouseLeave($event)',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtLegendItem
  extends DtOverlayTrigger<{}>
  implements AfterContentInit, OnDestroy
{
  /** @internal The template ref that will be rendered as an overlay. */
  @Input() _overlayTemplateRef?: TemplateRef<{}>;

  @ContentChild(DtLegendOverlay, { read: TemplateRef, static: true })
  _contentOverlayTemplateRef?: TemplateRef<{}>;

  /** Whether the item has an overlay to show when hovering. */
  get hasOverlay(): boolean {
    return Boolean(this._overlayTemplateRef || this._contentOverlayTemplateRef);
  }

  constructor(
    overlay: DtOverlay,
    elementRef: ElementRef,
    zone: NgZone,
    focusMonitor: FocusMonitor,
    platform: Platform,
  ) {
    super(elementRef, overlay, zone, focusMonitor, '0', platform);
  }

  ngAfterContentInit(): void {
    const overlayTemplate =
      this._overlayTemplateRef || this._contentOverlayTemplateRef;
    if (overlayTemplate) {
      this.overlay = overlayTemplate;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
