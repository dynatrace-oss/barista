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

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';

import {
  CanColor,
  CanDisable,
  Constructor,
  HasTabIndex,
  mixinColor,
  mixinTabIndex,
  _readKeyCode,
  HasElementRef,
} from '@dynatrace/barista-components/core';

export const _DtButtonGroup = mixinTabIndex(
  class {} as Constructor<CanDisable>,
);

@Component({
  selector: 'dt-button-group',
  exportAs: 'dtButtonGroup',
  template: '<ng-content></ng-content>',
  styleUrls: ['button-group.scss'],
  inputs: ['tabIndex'],
  host: {
    class: 'dt-button-group',
    '[attr.aria-disabled]': 'disabled.toString()',
    role: 'radiogroup',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtButtonGroup<T>
  extends _DtButtonGroup
  implements CanDisable, HasTabIndex, AfterContentInit
{
  private _value: T | null = null;
  private _disabled = false;

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define, @angular-eslint/no-forward-ref
  @ContentChildren(forwardRef(() => DtButtonGroupItem), { descendants: true })
  private _items: QueryList<DtButtonGroupItem<T>>;

  /** Emits a stream when the value changes. */
  @Output() readonly valueChange = new EventEmitter<T | null>();

  /** The value of the button group. */
  @Input()
  get value(): T | null {
    return !this.disabled ? this._value : null;
  }
  set value(newValue: T | null) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._updateCheckedItemFromValue();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Whether the radio group is disabled */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._markItemsForCheck();
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** Sets the focus to the first button in the buttongroup. */
  focus(): void {
    if (this._items && this._items.first) {
      this._items.first.focus();
    }
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngAfterContentInit(): void {
    if (this._items && this._items.length > 0) {
      // find if there is a selection
      // defer to next CD run - this is needed because we cannot update the item right away when there is no value set
      Promise.resolve().then(() => {
        const checked = this._items.find((item) => item.checked);
        if (this.value === null) {
          this.value = checked ? checked.value : this._items.first.value;
        } else {
          this._updateCheckedItemFromValue();
        }
      });
    }
  }

  /** @internal Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    this.valueChange.emit(this._value);
  }

  /** trigger change detection for items */
  private _markItemsForCheck(): void {
    if (this._items) {
      this._items.forEach((item) => {
        item._markForCheck();
      });
    }
  }

  /** Updates the `checked` state of each item button based on the groups value. */
  private _updateCheckedItemFromValue(): void {
    if (this._items) {
      this._items.forEach((item) => {
        item.checked = this.value === item.value;
      });
    }
  }
}

/** Change event object emitted by DtRadioButton */
export interface DtButtonGroupItemCheckedChange<T> {
  source: DtButtonGroupItem<T>;
  value: T | null;
}

export type DtButtonGroupThemePalette = 'main' | 'error';
export class DtButtonGroupItemBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtButtonGroupItem = mixinTabIndex(
  mixinColor<
    Constructor<CanDisable & HasElementRef>,
    DtButtonGroupThemePalette
  >(DtButtonGroupItemBase as Constructor<CanDisable & HasElementRef>, 'main'),
);

@Component({
  selector: 'dt-button-group-item',
  template: ` <ng-content></ng-content> `,
  exportAs: 'dtButtonGroupItem',
  host: {
    role: 'radio',
    class: 'dt-button-group-item',
    '[attr.aria-checked]': 'checked',
    '[class.dt-button-group-item-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[class.dt-button-group-item-disabled]': 'disabled',
    '[attr.tabindex]': 'tabIndex',
    '(click)': '_onChecked($event)',
    '(keydown)': '_handleKeydown($event)',
  },
  styleUrls: ['button-group-item.scss'],
  inputs: ['color'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtButtonGroupItem<T>
  extends _DtButtonGroupItem
  implements
    CanDisable,
    CanColor<DtButtonGroupThemePalette>,
    HasTabIndex,
    AfterContentInit,
    OnDestroy
{
  private _checked = false;
  private _value: T;
  private _disabled = false;

  /** Emits a stream when this item is checked or unchecked. */
  @Output() readonly checkedChange = new EventEmitter<
    DtButtonGroupItemCheckedChange<T>
  >();

  /** Whether the button-group item is checked. */
  @Input()
  get checked(): boolean {
    return this._checked && !this.disabled;
  }
  set checked(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (this._checked !== newValue) {
      this._checked = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_checked: BooleanInput;

  /** Whether the button-group item is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled || (this._buttonGroup && this._buttonGroup.disabled);
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled && this._checked) {
      this._checked = false;
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** The bound value. */
  @Input()
  get value(): T {
    return this._value;
  }
  set value(newValue: T) {
    this._value = newValue;
  }

  /** Sets the focus on the element */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  constructor(
    private _buttonGroup: DtButtonGroup<T>,
    private _changeDetectorRef: ChangeDetectorRef,
    /** @internal */
    public _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
  ) {
    super(_elementRef);
    this._focusMonitor.monitor(_elementRef);
  }

  ngAfterContentInit(): void {
    if (this.value === undefined && this._elementRef) {
      this._value = this._elementRef.nativeElement.textContent;
    }
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** @internal Checks this item. */
  _onChecked(event: Event): void {
    event.stopPropagation();
    const groupValueChanged =
      this._buttonGroup && this.value !== this._buttonGroup.value;
    this.checkedChange.emit({ source: this, value: this.value });

    if (this._buttonGroup && groupValueChanged) {
      this._buttonGroup.value = this.value;
      this._buttonGroup._emitChangeEvent();
    }
  }

  /** @internal Ensures the option is checked when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    if (keyCode === ENTER || keyCode === SPACE) {
      this._onChecked(event);

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /** @internal Marks this item to be checked on the next CD cycle. */
  _markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }
}
