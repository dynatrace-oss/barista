
// Boilerplate for applying mixins to DtButtonGroupItem
import {CanDisable, HasTabIndex, mixinTabIndex} from '@dynatrace/angular-components/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DtButtonGroup} from './button-group';

export interface DtButtonGroupItemSelectionChange<T> {
  /** Reference to the option that emitted the event. */
  source: DtButtonGroupItem<T>;
  /** Whether the change in the option's value was a result of a user action. */
  isUserInput: boolean;
}
export class DtButtonGroupItemBase {
  disabled: boolean;
  constructor(public _elementRef: ElementRef) { }
}

export const _DtButtonGroupItem =
  mixinTabIndex(DtButtonGroupItemBase);

@Component({
  moduleId: module.id,
  selector: 'dt-button-group-item',
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'button',
    '[attr.tabindex]': 'tabIndex',
    '[class.dt-button-group-item-selected]': 'selected',
    '[class.dt-button-group-item-disabled]': 'disabled',
    'class': 'dt-button-group-item',
    '(click)': '_selectViaInteraction()',
    '(keydown)': '_handleKeydown($event)',
  },
  styleUrls: ['button-group-item.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtButtonGroupItem<T> extends _DtButtonGroupItem implements CanDisable, HasTabIndex  {

  private _selected = false;
  private _value: T;
  private _disabled = false;

  @Output() readonly selectionChange = new EventEmitter<DtButtonGroupItemSelectionChange<T>>();

  constructor(private _buttonGroup: DtButtonGroup<T>,
              private _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef
  ) {
    super(_elementRef);
  }

  /** Whether the button-group item is selected. */
  @Input()
  get selected(): boolean {
    return this._selected && !this.disabled;
  }
  set selected(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const changed = this._selected !== newValue;
    this._selected = newValue;
    if (changed) {
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Whether the button-group item is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled  || this._buttonGroup.disabled;
  }
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }

  /** The bound value. */
  @Input()
  get value(): T { return this._value; }
  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
    }
  }

  select(selected: boolean = true): void {
    this.selected = selected;
  }

  deselect(): void {
    this.selected = false;
  }

  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._changeDetectorRef.markForCheck();
      this.selectionChange.emit({source: this, isUserInput: true});
    }
  }

  /** Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }
}
