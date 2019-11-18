/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { DtFilterFieldTagData } from '../types';

// tslint:disable:class-name

@Component({
  selector: 'dt-filter-field-tag',
  exportAs: 'dtFilterFieldTag',
  templateUrl: 'filter-field-tag.html',
  styleUrls: ['filter-field-tag.scss'],
  host: {
    '[attr.role]': `'option'`,
    class: 'dt-filter-field-tag',
    '[class.dt-filter-field-tag-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterFieldTag {
  /** Tag data object that contains view values for displaying (like key, value and separator) and the original source. */
  @Input() data: DtFilterFieldTagData;

  /** Emits when the filter should be removed (usually by clicking the remove button). */
  @Output() readonly remove = new EventEmitter<DtFilterFieldTag>();

  /** Emits when the filter should be made editable (usually by clicking the edit button). */
  @Output() readonly edit = new EventEmitter<DtFilterFieldTag>();

  /** Whether the tag is disabled. */
  // Note: The disabled mixin can not be used here because the CD needs to be triggerd after it has been set
  // to reflect the state when programatically setting the property.
  get disabled(): boolean {
    return !this.editable && !this.deletable;
  }
  set disabled(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    this.editable = !coercedValue;
    this.deletable = !coercedValue;
    this._changeDetectorRef.markForCheck();
  }

  /** Whether the tag is editable. */
  get editable(): boolean {
    return this.data && this.data.editable;
  }
  set editable(value: boolean) {
    if (this.data) {
      this.data.editable = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Whether the tag is deletable. */
  get deletable(): boolean {
    return this.data && this.data.deletable;
  }
  set deletable(value: boolean) {
    if (this.data) {
      this.data.deletable = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** @internal Called when the remove button has been clicked. Emits the remove output. */
  _handleRemove(event: MouseEvent): void {
    // Prevent click from bubbling up, so it does not interfere with autocomplete
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.remove.emit(this);
    }
  }

  /** @internal Called when the edit button has been clicked. Emits the edit output. */
  _handleEdit(event: MouseEvent): void {
    // Prevent click from bubbling up, so it does not interfere with autocomplete
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.edit.emit(this);
    }
  }
}
