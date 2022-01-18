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

import { Overlay, ViewportRuler, OverlayContainer } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  Inject,
  Input,
} from '@angular/core';

import {
  _readKeyCode,
  DtViewportResizer,
} from '@dynatrace/barista-components/core';

import { DtFilterFieldRange } from './filter-field-range';
import { DtFilterFieldElementTrigger } from '../shared/filter-field-element-trigger';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: `input[dtFilterFieldRange]`,
  exportAs: 'dtFilterFieldRangeTrigger',
})
export class DtFilterFieldRangeTrigger
  extends DtFilterFieldElementTrigger<DtFilterFieldRange>
  implements OnDestroy
{
  protected elementSelector = 'dtFilterFieldElement';

  /** The filter-field range panel to be attached to this trigger. */
  @Input('dtFilterFieldRange')
  get element(): DtFilterFieldRange {
    return this._element;
  }
  set element(value: DtFilterFieldRange) {
    super.element = value;
  }

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('dtFilterFieldRangeDisabled')
  get elementDisabled(): boolean {
    return this._elementDisabled;
  }
  set elementDisabled(value: boolean) {
    super.elementDisabled = value;
  }

  constructor(
    protected _elementRef: ElementRef,
    protected _overlay: Overlay,
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _viewportRuler: ViewportRuler,
    protected _platform: Platform,
    protected _overlayContainer: OverlayContainer,
    _zone: NgZone,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DOCUMENT) _document: any,
    public _viewportResizer: DtViewportResizer,
  ) {
    super(
      _elementRef,
      _overlay,
      _changeDetectorRef,
      _viewportResizer,
      _zone,
      _viewportRuler,
      _platform,
      _overlayContainer,
      _document,
    );
  }
}
