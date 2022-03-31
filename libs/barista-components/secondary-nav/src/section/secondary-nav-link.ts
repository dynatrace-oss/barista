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

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[dtSecondaryNavLink]',
  host: {
    class: 'dt-secondary-nav-link',
  },
  exportAs: 'dtSecondaryNavLink',
})
export class DtSecondaryNavLink {}

@Directive({
  selector: '[dtSecondaryNavLinkActive]',
  host: {
    '[class.dt-secondary-nav-active]': 'dtSecondaryNavLinkActive',
  },
  exportAs: 'dtSecondaryNavLinkActive',
})
export class DtSecondaryNavLinkActive {
  /** EventEmitter firing when the active state of the navlink changes. */
  @Output() activeChange: EventEmitter<boolean> = new EventEmitter();

  /** Whether the link is active. */
  @Input()
  get dtSecondaryNavLinkActive(): boolean {
    return this._active;
  }
  set dtSecondaryNavLinkActive(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (this._active !== newValue) {
      this._active = newValue;
      this.activeChange.emit(newValue);
    }
  }
  private _active = true;
}
