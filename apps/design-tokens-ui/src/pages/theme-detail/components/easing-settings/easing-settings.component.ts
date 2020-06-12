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
import {
  FluidPaletteGenerationOptions,
  FluidEasingType,
} from '@dynatrace/shared/barista-definitions';
import { DEFAULT_GENERATION_OPTIONS } from '@dynatrace/design-tokens-ui/shared';

@Component({
  selector: 'design-tokens-ui-easing-settings',
  templateUrl: './easing-settings.component.html',
})
export class EasingSettingsComponent {
  /** Input palette generation options object */
  @Input() options: FluidPaletteGenerationOptions = DEFAULT_GENERATION_OPTIONS;

  /** Fired when the easing functions change */
  @Output() optionsChange = new EventEmitter<FluidPaletteGenerationOptions>();

  /** @internal */
  get _upperEasing(): FluidEasingType {
    return this.options.upperEasing;
  }

  /** @internal */
  set _upperEasing(type: FluidEasingType) {
    // Emit a new object to make change detection on the curve work
    this.optionsChange.emit({
      ...this.options,
      upperEasing: type,
    });
  }

  /** @internal */
  get _lowerEasing(): FluidEasingType {
    return this.options.lowerEasing;
  }

  /** @internal */
  set _lowerEasing(type: FluidEasingType) {
    this.optionsChange.emit({
      ...this.options,
      lowerEasing: type,
    });
  }

  /** @internal */
  get _upperExponent(): number {
    return this.options.upperExponent;
  }

  /** @internal */
  set _upperExponent(exponent: number) {
    this.optionsChange.emit({
      ...this.options,
      upperExponent: exponent,
    });
  }

  /** @internal */
  get _lowerExponent(): number {
    return this.options.lowerExponent;
  }

  /** @internal */
  set _lowerExponent(exponent: number) {
    this.optionsChange.emit({
      ...this.options,
      lowerExponent: exponent,
    });
  }
}
