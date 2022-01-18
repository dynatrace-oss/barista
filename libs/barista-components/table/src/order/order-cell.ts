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
  Component,
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ElementRef,
  AfterViewInit,
  Optional,
  Host,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DtOrder } from './order-directive';
import { DtCell, DtColumnDef } from '../cell';
import { _addCssClass } from '@dynatrace/barista-components/core';
import { DtIndicator } from '@dynatrace/barista-components/indicator';
import { ENTER } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';

// Pattern used for validating the input field
const INPUT_PATTERN = '[0-9]*';

/**
 * Cell template that adds the right classes, role and static content for the order cell,
 * which can be used to change the order of rows in a table.
 */
@Component({
  selector: 'dt-order-cell',
  templateUrl: './order-cell.html',
  styleUrls: ['./order-cell.scss'],
  host: {
    class: 'dt-order-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  exportAs: 'dtOrderCell',
})
export class DtOrderCell<T>
  extends DtCell
  implements AfterViewInit, OnChanges, OnDestroy
{
  /** Index of the row to display in the input field */
  @Input() index: string;

  /**
   * @internal Used to trigger the animation of the indicator to highlight
   * a row after an order change so that it is easier for the user to follow
   * the row to the new position
   */
  _animateOrderChangedIndicator = false;

  /** Previous index of the row to pass to the order function */
  private _prevIndex: number;

  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  @ViewChild('orderInput', { static: true })
  _orderInput: ElementRef<HTMLInputElement>;

  _orderFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(INPUT_PATTERN),
  ]);

  constructor(
    columnDef: DtColumnDef,
    changeDetectorRef: ChangeDetectorRef,
    elem: ElementRef,
    private _order: DtOrder<T>,
    @Optional() @Host() _dtIndicator?: DtIndicator,
  ) {
    super(columnDef, changeDetectorRef, elem, undefined, _dtIndicator);
  }

  /** Sets the previous index to keep track of the order changes */
  ngAfterViewInit(): void {
    this._orderFormControl.setValue(this.index);
    this._prevIndex = parseInt(this.index);

    // Enables or disables the input depending on the directive's disabled input
    this._order._disabledChange
      .pipe(startWith(false), takeUntil(this._destroy$))
      .subscribe((value) => {
        if (value) {
          this._orderFormControl.disable();
        } else {
          this._orderFormControl.enable();
        }
      });
  }

  /** Update the text field and previous index on input change */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.index) {
      this._orderFormControl.setValue(changes.index.currentValue);
      this._prevIndex = changes.index.currentValue;
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * @internal Handles keyup events and in case of the enter key
   * blurs the input, hence triggering a reorder
   */
  _handleKeyup($event: KeyboardEvent): void {
    if ($event?.keyCode !== ENTER || this._orderFormControl.invalid) {
      return;
    }

    this._orderInput.nativeElement.blur();
  }

  /** @internal Triggers a reorder on blur */
  _handleBlur(): void {
    this._orderChange();
  }

  /**
   * Triggers a reorder of the table data if the value of the
   * index actually changed
   */
  private _orderChange(): void {
    const currentValue = parseInt(this._orderFormControl.value);

    // Reorder the table if the input is valid and actually changed
    if (this._orderFormControl.valid && this._prevIndex !== currentValue) {
      this._order._order(this._prevIndex, currentValue);
      this._prevIndex = currentValue;

      this._animateOrderChangedIndicator = true;
      this._stateChanges.next();

      // Keep focus in the changed input field
      this._orderInput.nativeElement.focus();
    }
  }
}
