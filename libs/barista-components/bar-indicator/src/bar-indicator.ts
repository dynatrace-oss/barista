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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import {
  CanColor,
  Constructor,
  HasProgressValues,
  mixinColor,
  mixinHasProgress,
} from '@dynatrace/barista-components/core';

export type DtBarIndicatorThemePalette = 'main' | 'recovered' | 'error';

export class DtBarIndicatorBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtBarIndicator = mixinHasProgress(
  mixinColor<Constructor<DtBarIndicatorBase>, DtBarIndicatorThemePalette>(
    DtBarIndicatorBase,
    'main',
  ),
);

@Component({
  selector: 'dt-bar-indicator',
  templateUrl: 'bar-indicator.html',
  styleUrls: ['bar-indicator.scss'],
  exportAs: 'dtBarIndicator',
  host: {
    class: 'dt-bar-indicator',
    '[class.dt-bar-indicator-end]': 'align == "end"',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color', 'value', 'min', 'max'],
  outputs: ['valueChange'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
})
export class DtBarIndicator
  extends _DtBarIndicator
  implements CanColor<DtBarIndicatorThemePalette>, HasProgressValues
{
  /** Whether the indicator is aligned to the start or end. */
  @Input() align: 'start' | 'end' = 'start';

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
  ) {
    super(elementRef);
  }

  /**
   * Updates all view parameters
   *
   * @internal
   */
  _updateValues(): void {
    super._updateValues();
    this._changeDetectorRef.markForCheck();
  }
}
