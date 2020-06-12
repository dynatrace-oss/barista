/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FluidEasingType } from '@dynatrace/shared/barista-definitions';

type EasingFunctionPreset =
  | 'invalid'
  | 'linear'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-expo'
  | 'ease-out-expo'
  | 'ease-in-out-expo'
  | 'custom';

@Component({
  selector: 'design-tokens-ui-easing-type-select',
  templateUrl: './easing-type-select.component.html',
  styleUrls: [
    './easing-type-select.component.scss',
    '../../shared-settings-styles.scss',
  ],
})
export class EasingTypeSelectComponent {
  /** Input easing function type */
  @Input() type: FluidEasingType = 'ease-in';

  /** Input easing exponent */
  @Input() exponent: number = 2;

  /** Fired when the easing type changes */
  @Output() typeChange = new EventEmitter<FluidEasingType>();

  /** Fired when the easing exponent changes */
  @Output() exponentChange = new EventEmitter<number>();

  /** @internal Whether the input field for a custom exponent should be displayed */
  _customExponent = false;

  /** Returns a user-friendly preset type for the current easing function and exponent */
  get _presetType(): EasingFunctionPreset {
    return this._typeAndExponentToPreset(this.type, this.exponent);
  }

  /** Sets the easing function exponent from the given preset */
  set _presetType(preset: EasingFunctionPreset) {
    this._customExponent = preset === 'custom';

    const [type, exponent] = this._presetToTypeAndExponent(
      preset,
      this.type,
      this.exponent,
    );

    if (type !== this.type) {
      this.typeChange.emit(type);
      this.type = type;
    }
    if (exponent !== this.exponent) {
      this.exponentChange.emit(exponent);
      this.exponent = exponent;
    }
  }

  private _typeAndExponentToPreset(
    type: FluidEasingType,
    exponent: number,
  ): EasingFunctionPreset {
    switch (type) {
      case 'ease-in':
        switch (exponent) {
          case 1:
            return 'linear';
          case 2:
            return 'ease-in-quad';
          case 3:
            return 'ease-in-cubic';
          default:
            return 'custom';
        }

      case 'ease-out':
        switch (exponent) {
          case 1:
            return 'linear';
          case 2:
            return 'ease-out-quad';
          case 3:
            return 'ease-out-cubic';
          default:
            return 'invalid';
        }

      case 'ease-in-out-quad':
      case 'ease-in-out-cubic':
      case 'ease-in-expo':
      case 'ease-out-expo':
      case 'ease-in-out-expo':
        return type;

      default:
        return 'invalid';
    }
  }

  private _presetToTypeAndExponent(
    preset: EasingFunctionPreset,
    defaultType: FluidEasingType,
    defaultExponent: number,
  ): [FluidEasingType, number] {
    switch (preset) {
      case 'linear':
        return ['ease-in', 1];
      case 'ease-in-quad':
        return ['ease-in', 2];
      case 'ease-out-quad':
        return ['ease-out', 2];
      case 'ease-in-cubic':
        return ['ease-in', 3];
      case 'ease-out-cubic':
        return ['ease-out', 3];

      case 'ease-in-out-quad':
      case 'ease-in-out-cubic':
      case 'ease-in-expo':
      case 'ease-out-expo':
      case 'ease-in-out-expo':
        return [preset, defaultExponent];

      case 'custom':
        return ['ease-in', 1.5];
      default:
        return [defaultType, defaultExponent];
    }
  }
}
