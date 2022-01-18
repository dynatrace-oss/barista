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

import { coerceNumberProperty } from '@angular/cdk/coercion';

import { Constructor } from './constructor';
import { CanDisable } from './disabled';

export interface HasTabIndex {
  /** Tabindex of the component. */
  tabIndex: number;
}

/** Mixin to augment a directive with a `tabIndex` property. */
export function mixinTabIndex<T extends Constructor<CanDisable>>(
  base: T,
  defaultTabIndex: number = 0,
): Constructor<HasTabIndex> & T {
  return class extends base {
    private _tabIndex: number = defaultTabIndex;

    get tabIndex(): number {
      return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value: number) {
      // If the specified tabIndex value is null or undefined, fall back to the default value.

      this._tabIndex = coerceNumberProperty(value, defaultTabIndex);
    }
  };
}
