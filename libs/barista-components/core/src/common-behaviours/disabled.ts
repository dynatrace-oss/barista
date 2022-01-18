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

import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { Constructor } from './constructor';

export interface CanDisable {
  /** Whether the component is disabled. */
  disabled: boolean;
}

/** Mixin to augment a directive with a `disabled` property. */
// eslint-disable-next-line @typescript-eslint/ban-types
export function mixinDisabled<T extends Constructor<{}>>(
  base: T,
): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled = false;

    get disabled(): boolean {
      return this._disabled;
    }
    set disabled(value: boolean) {
      this._disabled = coerceBooleanProperty(value);
    }

    // eslint-disable-next-line
    constructor(...args: any[]) {
      super(...args); // eslint-disable-line
    }
  };
}
