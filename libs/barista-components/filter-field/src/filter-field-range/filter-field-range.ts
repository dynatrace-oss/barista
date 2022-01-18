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
import { TemplatePortal } from '@angular/cdk/portal';
/* eslint-disable @angular-eslint/template/cyclomatic-complexity */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { DtButtonGroup } from '@dynatrace/barista-components/button-group';
import { isDefined } from '@dynatrace/barista-components/core';

import { DtRangeOperatorFlags } from '../types';

let _uniqueIdCounter = 0;

export class DtFilterFieldRangeSubmittedEvent {
  constructor(
    /** Reference to the filter field range panel that emitted the event. */
    public source: DtFilterFieldRange,
    /** Operator that has been selected. */
    public operator: DtFilterFieldRangeOperator,
    /** Entered range value(s). Could be either a single value, or a range defined by two values. */
    public range: number | [number, number],
    /** Unit for the entered range / value */
    public unit: string,
  ) {}
}

/** Valid FilterfieldRange operators. */
export type DtFilterFieldRangeOperator =
  | 'range'
  | 'lower-equal'
  | 'greater-equal'
  | 'equal';

@Component({
  selector: 'dt-filter-field-range',
  templateUrl: 'filter-field-range.html',
  styleUrls: ['filter-field-range.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtFilterFieldRange',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterFieldRange implements AfterViewInit {
  /** Unit for the range values */
  @Input() unit: string;

  /** Operators that are enabled in the range. */
  @Input()
  get enabledOperators(): DtRangeOperatorFlags {
    return this._enabledOperators;
  }
  set enabledOperators(value: DtRangeOperatorFlags) {
    this._enabledOperators = value;

    this._hasRangeOperator = !!(
      // eslint-disable-next-line no-bitwise
      (this._enabledOperators & DtRangeOperatorFlags.Range)
    );
    this._hasEqualOperator = !!(
      // eslint-disable-next-line no-bitwise
      (this._enabledOperators & DtRangeOperatorFlags.Equal)
    );
    this._hasLowerEqualOperator = !!(
      // eslint-disable-next-line no-bitwise
      (this._enabledOperators & DtRangeOperatorFlags.LowerEqual)
    );
    this._hasGreaterEqualOperator = !!(
      // eslint-disable-next-line no-bitwise
      (this._enabledOperators & DtRangeOperatorFlags.GreatEqual)
    );
    this._setOperator();
  }
  private _enabledOperators: DtRangeOperatorFlags;

  /** @internal Defines if the filter-field-range has the range option */
  _hasRangeOperator = false;

  /** @internal Defines if the filter-field-range has the equal option */
  _hasEqualOperator = false;

  /** @internal Defines if the filter-field-range has the lower-equal option */
  _hasLowerEqualOperator = false;

  /** @internal Defines if the filter-field-range has the greater-equal option */
  _hasGreaterEqualOperator = false;

  /** Event that is emitted when the filter-field range panel is opened. */
  @Output() readonly opened = new EventEmitter<void>();

  /** Event that is emitted when the filter-field range panel is closed. */
  @Output() readonly closed = new EventEmitter<void>();

  /** Event that is emitted whenever an option from the list is selected. */
  @Output()
  readonly rangeSubmitted = new EventEmitter<DtFilterFieldRangeSubmittedEvent>();

  /** Unique ID to be used by filter-field range trigger's "aria-owns" property. */
  id = `dt-filter-field-range-${_uniqueIdCounter++}`;

  /** Whether the filter-field range panel is open. */
  get isOpen(): boolean {
    return this._isOpen;
  }
  /** @internal Whether the filter-field range panel is open. */
  _isOpen = false;

  /** @internal The currently selected option. */
  _selectedOperator: DtFilterFieldRangeOperator | null;

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild(TemplateRef, { static: true }) _template: TemplateRef<any>;

  /** @internal */
  @ViewChild(DtButtonGroup) _operatorGroup: DtButtonGroup<DtFilterFieldRange>;

  /** @internal */
  _portal: TemplatePortal;

  /** @internal Holds the current value of the input field for the from value */
  _valueFrom = '';

  /** @internal Holds the current value of the input field for the to value */
  _valueTo = '';

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._portal = new TemplatePortal<any>(
      this._template,
      this._viewContainerRef,
    );
  }

  /** Sets focus to the operator button group. */
  focus(): void {
    this._operatorGroup.focus();
  }

  /** @internal Marks the filter-field range for change detection. */
  _markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Unique ID to be used on a local element */
  _getLocalId(suffix: string): string {
    return `${this.id}-${suffix}`;
  }

  /** @internal Whether the selected operator's type equals the provided type */
  _isOperatorType(type: DtFilterFieldRangeOperator): boolean {
    return isDefined(this._selectedOperator) && this._selectedOperator === type;
  }

  /** @internal Handles the submit of range values. */
  _handleSubmit(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    const range = this._validateRange();
    if (isDefined(range)) {
      this.rangeSubmitted.emit(
        new DtFilterFieldRangeSubmittedEvent(
          this,
          this._selectedOperator as DtFilterFieldRangeOperator,
          range as number | [number, number],
          this.unit,
        ),
      );
      // After emission we need to reset the range state, to have a fresh one
      // if another range opens.
      this._valueFrom = '';
      this._valueTo = '';
      this._selectedOperator = null;
    }
  }

  /** @internal Sets the operator if it is available. */
  _setOperator(operator?: DtFilterFieldRangeOperator): void {
    if (operator === 'range' && this._hasRangeOperator) {
      this._selectedOperator = operator;
      return;
    }
    if (operator === 'equal' && this._hasEqualOperator) {
      this._selectedOperator = operator;
      return;
    }
    if (operator === 'lower-equal' && this._hasLowerEqualOperator) {
      this._selectedOperator = operator;
      return;
    }
    if (operator === 'greater-equal' && this._hasGreaterEqualOperator) {
      this._selectedOperator = operator;
      return;
    }
    if (!this._selectedOperator) {
      this._selectedOperator = this._hasRangeOperator
        ? 'range'
        : this._hasLowerEqualOperator
        ? 'lower-equal'
        : this._hasGreaterEqualOperator
        ? 'greater-equal'
        : this._hasEqualOperator
        ? 'equal'
        : null;
    }
  }

  /** @internal Set values for the range input fields. */
  _setValues(values: number | [number, number]): void {
    if (Array.isArray(values)) {
      this._valueFrom = `${values[0]}`;
      this._valueTo = `${values[1]}`;
    } else {
      this._valueFrom = `${values}`;
    }
  }

  /** @internal Whether the range values are valid. */
  _isValidRange(): boolean {
    return isDefined(this._validateRange());
  }

  /** Validates and casts the range values (from & to) and return either the range number(s) or null */
  private _validateRange(): number | [number, number] | null {
    const valueFromOrNull = coerceNumberProperty(this._valueFrom, null);
    if (this._selectedOperator === 'range' && valueFromOrNull !== null) {
      const valueToOrNull = coerceNumberProperty(this._valueTo, null);
      return valueToOrNull !== null && valueFromOrNull <= valueToOrNull
        ? [valueFromOrNull, valueToOrNull]
        : null;
    }
    return valueFromOrNull;
  }
}
