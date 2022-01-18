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

import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';

import {
  CanColor,
  Constructor,
  mixinColor,
} from '@dynatrace/barista-components/core';

export type DtIndicatorThemePalette =
  | 'error'
  | 'warning'
  | 'recovered'
  | 'critical'
  | undefined;

// Boilerplate for applying mixins to DtIndicator.
export class DtIndicatorBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtIndicatorMixinBase = mixinColor<
  Constructor<DtIndicatorBase>,
  DtIndicatorThemePalette
>(DtIndicatorBase);

@Directive({
  selector: '[dtIndicator]',
  inputs: ['color: dtIndicatorColor'],
  exportAs: 'dtIndicator',
  host: {
    class: 'dt-indicator',
    '[class.dt-indicator-active]': 'active',
  },
})
export class DtIndicator
  extends _DtIndicatorMixinBase
  implements CanColor<DtIndicatorThemePalette>, OnDestroy, OnChanges
{
  /**
   * @internal
   * Emits whenever some inputs change on the indicator so the row can reevaluate the indicator
   */
  _stateChanges = new Subject<void>();

  /**
   * Whether the indicator is active.
   * This in input can be used for convenience to enable / disable the indicator without the need for a wrapping element
   */
  @Input('dtIndicator')
  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    const coerceValue = coerceBooleanProperty(value);
    if (coerceValue !== this._active) {
      this._active = coerceValue;
    }
  }
  private _active = true;
  static ngAcceptInputType_active: BooleanInput;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnChanges(): void {
    this._stateChanges.next();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}
