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

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
} from '@dynatrace/barista-components/core';

/** Change event emitted for a change in the DtToggleButton. */
export interface DtToggleButtonChange<T> {
  source: DtToggleButtonItem<T>;
  value: T | null;
  isUserInput: boolean;
}

export class DtToggleButtonBase {}

export const _DtToggleButtonMixinBase = mixinTabIndex(
  mixinDisabled(DtToggleButtonBase),
);

/** ToggleButtonItem as a building part of the DtToggleButtonGroup */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[dt-toggle-button-item]',
  exportAs: 'dtToggleButtonItem',
  templateUrl: 'toggle-button-item.html',
  styleUrls: ['toggle-button-item.scss'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    class: 'dt-toggle-button-item',
    role: 'radio',
    '[class.dt-toggle-button-item-selected]': 'selected',
    '[class.dt-toggle-button-item-disabled]': 'disabled',
    '[attr.disabled]': 'disabled === true ? true : null',
    '[attr.aria-checked]': 'selected',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-describedby]': 'ariaDescribedby',
    '(click)': '_handleClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtToggleButtonItem<T>
  extends _DtToggleButtonMixinBase
  implements CanDisable, HasTabIndex
{
  static ngAcceptInputType_disabled: BooleanInput;

  private _selected = false;
  private _value: T;

  /** selected input property to set an item selected. */
  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    if (this.disabled) {
      return;
    }
    const isSelected = coerceBooleanProperty(value);
    if (isSelected) {
      this.select();
    } else {
      this.deselect();
    }
  }
  static ngAcceptInputType_selected: BooleanInput;

  /** The value of this toggle button item. */
  @Input()
  get value(): T {
    return this._value;
  }
  set value(value: T) {
    if (this._value !== value) {
      this._value = value;
    }
  }

  /** Used to set the 'aria-label attribute on the underlying button element. */
  @Input('aria-label') ariaLabel: string;

  /** The 'aria-labelledby' attribute takes precedence as the elements text text alternative. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** The 'aria-describedby' attribute is read after the lements label and field type. */
  @Input('aria-describedby') ariaDescribedby: string;

  /** Change event that fires if an toggle button item is selected or deselected. */
  // Disabling no-output-native rule because we want to keep a similar API to the radio button
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly change = new EventEmitter<DtToggleButtonChange<T>>();

  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
  ) {
    super();
  }

  /** Focus the toggle button item. */
  focus(): void {
    this._focusMonitor.focusVia(this._elementRef.nativeElement, 'program');
  }

  /** @internal Handle click event on the toggle button item element. */
  _handleClick(): void {
    // if the toggle button item is disabled, exit early.
    if (this.disabled) {
      return;
    }
    // toggle the selection state of the button on click.
    if (!this._selected) {
      this._selectViaInteraction();
    } else {
      this._deselectViaInteraction();
    }
  }

  // Should be remove when CanSelect Mixin is available in the core.
  /** Deselect function to programmatically deselect the current item. */
  select(): void {
    if (!this._selected && !this.disabled) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  // Should be remove when CanSelect Mixin is available in the core.
  /** Deselect function to programmatically deselect the current item. */
  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  // Should be remove when CanSelect Mixin is available in the core.
  /** @internal Triggers a select via user interaction. */
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  // Should be remove when CanSelect Mixin is available in the core.
  /** @internal Triggers a deselect via user interaction. */
  _deselectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** Emits a selection change event. */
  private _emitSelectionChangeEvent(isUserInput: boolean = false): void {
    this.change.emit({ source: this, value: this._value, isUserInput });
  }
}
