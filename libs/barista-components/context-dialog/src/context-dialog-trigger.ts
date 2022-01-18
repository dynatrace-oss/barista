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

import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

import { DtContextDialog } from './context-dialog';

@Directive({
  selector: 'button[dtContextDialogTrigger]',
  exportAs: 'dtContextDialogTrigger',
  host: {
    class: 'dt-context-dialog-trigger',
    '(click)': 'dialog && dialog.open()',
  },
})
export class DtContextDialogTrigger
  extends CdkOverlayOrigin
  implements OnDestroy
{
  private _dialog?: DtContextDialog;

  /** The dialog the trigger will be connected to. */
  @Input('dtContextDialogTrigger')
  get dialog(): DtContextDialog | undefined {
    return this._dialog;
  }
  set dialog(value: DtContextDialog | undefined) {
    if (value !== this._dialog) {
      this._unregisterFromDialog();
      if (value) {
        value._registerTrigger(this);
      }
      this._dialog = value;
    }
  }

  /** Emits an event when the dialog opens or closes. */
  @Output() readonly openChange = new EventEmitter<void>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnDestroy(): void {
    this._unregisterFromDialog();
  }

  /** @internal Unregisters this trigger from the dialog. */
  _unregisterFromDialog(): void {
    if (this._dialog) {
      this._dialog._unregisterTrigger(this);
      this._dialog = undefined;
    }
  }
}
