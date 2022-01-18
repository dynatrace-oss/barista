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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';

import { _readKeyCode } from '../util/index';
import { DtOptgroup } from './optgroup';
import { Highlightable } from '@angular/cdk/a11y';
import { takeUntil } from 'rxjs/operators';

let _uniqueId = 0;

/** Event object emitted by DtOption when selected or deselected. */
export class DtOptionSelectionChange<T> {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: DtOption<T>,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput: boolean = false,
  ) {}
}

/** Single option inside of a `<dt-select>` or `<dt-combobox>` element. */
@Component({
  selector: 'dt-option',
  exportAs: 'dtOption',
  host: {
    role: 'option',
    '[id]': 'id',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-selected]': 'selected.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class.dt-option-selected]': 'selected',
    '[class.dt-option-active]': 'active',
    '[class.dt-option-disabled]': 'disabled',
    '(click)': '_handleClick($event)',
    '(keydown)': '_handleKeydown($event)',
    class: 'dt-option',
  },
  styleUrls: ['option.scss'],
  templateUrl: 'option.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOption<T> implements Highlightable, AfterViewChecked, OnDestroy {
  private _selected = false;
  private _active = false;
  private _disabled = false;
  private _id = `dt-option-${_uniqueId++}`;
  private _recentViewValue = '';

  /** The form value of the option. */
  @Input() value: T;

  /** Whether the option is disabled. */
  @Input()
  get disabled(): boolean {
    return (this.group && this.group.disabled) || this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  /** Event emitted when the option is selected or deselected. */
  @Output() readonly selectionChange = new EventEmitter<
    DtOptionSelectionChange<T>
  >();

  /**
   * @internal
   * Emits when the state of the option changes and any parents have to be notified.
   */
  readonly _stateChanges = new Subject<void>();

  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  /** The unique ID of the option. */
  get id(): string {
    return this._id;
  }

  /** Whether or not the option is currently selected. */
  get selected(): boolean {
    return this._selected;
  }

  /** Whether or not the option is currently active and ready to be selected. */
  get active(): boolean {
    return this._active;
  }

  /**
   * The displayed value of the option. It is necessary to show the selected option in the
   * select's trigger.
   */
  get viewValue(): string {
    return (this._getHostElement().textContent || '').trim();
  }

  constructor(
    private _element: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    @Optional() readonly group?: DtOptgroup,
  ) {}

  ngAfterViewChecked(): void {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `dt-select`) and they don't have a way of knowing if the option's label has changed
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    if (this._selected) {
      const viewValue = this.viewValue;

      if (viewValue !== this._recentViewValue) {
        this._recentViewValue = viewValue;
        this._stateChanges.next();
      }
    }
    this._ngZone.runOutsideAngular(() => {
      fromEvent(this._element.nativeElement, 'mouseover')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._handleMouseOver();
        });
    });
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Selects the option. */
  select(): void {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Sets focus onto this option. */
  focus(): void {
    const element = this._getHostElement();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (typeof element.focus === 'function') {
      element.focus();
    }
  }

  /**
   * This method sets display styles on the option to make it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * This method removes display styles on the option that made it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    return this.viewValue;
  }

  /** @internal Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    if (keyCode === ENTER || keyCode === SPACE) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /** @internal Handles the click on the option and selects it. */
  _handleClick(event: MouseEvent): void {
    // Prevent the event from reaching parent elements, which causes components,
    // like filter-field to close the autocomplete because it detected an outside click
    event.stopImmediatePropagation();

    this._selectViaInteraction();
  }

  /** Contains the hovered option as a stream */
  _optionHovered = new Subject<DtOption<T>>();

  /** @internal Handles mousemove on the option and selects the not active option */
  _handleMouseOver(): void {
    if (!this.active) {
      this._optionHovered.next(this);
    }
  }

  /**
   * @internal
   * Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.
   */
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** @internal Returns the correct tabindex for the option depending on disabled state. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** @internal Gets the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput: boolean = false): void {
    this.selectionChange.emit(new DtOptionSelectionChange(this, isUserInput));
  }
}

/** Counts the amount of option group labels that precede the specified option. */
export function _countGroupLabelsBeforeOption<T>(
  optionIndex: number,
  options: DtOption<T>[],
): number {
  if (options.some((option) => !!option.group)) {
    const optionsArray = options;
    const groups = new Set<DtOptgroup>();

    for (let i = 0; i < optionIndex + 1; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (optionsArray[i].group && !groups.has(optionsArray[i].group!)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        groups.add(optionsArray[i].group!);
      }
    }
    return groups.size;
  }

  return 0;
}

/** Determines the position to which to scroll a panel in order for an option to be into view. */
export function _getOptionScrollPosition(
  optionIndex: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number,
): number {
  const optionOffset = optionIndex * optionHeight;

  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}
