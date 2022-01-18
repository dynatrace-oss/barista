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
  Input,
} from '@angular/core';

@Component({
  selector: 'dt-confirmation-dialog-state',
  templateUrl: './confirmation-dialog-state.html',
  styleUrls: ['./confirmation-dialog-state.scss'],
  exportAs: 'dtConfirmationDialogState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '[attr.aria-hidden]': '!_isActive',
  },
})
export class DtConfirmationDialogState {
  /** The name of this particular state. */
  @Input() name: string;

  /**
   * @internal
   * Apply or remove the aria-hidden attribute to the host element.
   */
  _isActive = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** @internal updates the _isActive property on the state */
  _updateActive(value: boolean): void {
    this._isActive = value;
    this._changeDetectorRef.markForCheck();
  }
}
