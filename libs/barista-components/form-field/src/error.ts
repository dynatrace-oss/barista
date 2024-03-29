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

import { Directive, ElementRef, Input } from '@angular/core';

let nextUniqueId = 0;

/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'dt-error, [dtError]',
  exportAs: 'dtError',
  host: {
    class: 'dt-error',
    role: 'alert',
    '[attr.id]': 'id',
  },
})
export class DtError {
  /** Generated unique id for the error element. */
  @Input() id = `dt-error-${nextUniqueId++}`;

  constructor(private _elementRef: ElementRef) {}

  /**
   * Exposing message here so other components,
   * like inline-editor can access and clone it
   */
  get message(): string {
    return this._elementRef.nativeElement.textContent;
  }
}
