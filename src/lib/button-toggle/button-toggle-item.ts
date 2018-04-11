
// Boilerplate for applying mixins to DtButtonToggleItem
import {CanDisable, HasTabIndex, mixinTabIndex} from '@dynatrace/angular-components/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, ElementRef,
  EventEmitter, HostBinding, HostListener,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DtButtonToggle} from './button-toggle';

export interface DtButtonToggleItemSelectionChange<T> {
  /** Reference to the option that emitted the event. */
  source: DtButtonToggleItem<T>;
  /** Whether the change in the option's value was a result of a user action. */
  isUserInput: boolean;
}
export class DtButtonToggleItemBase {
  disabled: boolean;
  constructor(public _elementRef: ElementRef) { }
}

export const _DtButtonToggleItem =
  mixinTabIndex(DtButtonToggleItemBase);

@Component({
  moduleId: module.id,
  selector: 'dt-button-toggle-item',
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'radio',
    'class': 'dt-button-toggle-item',
    '[attr.tabindex]': 'tabIndex',
  },
  styleUrls: ['button-toggle-item.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtButtonToggleItem<T> extends _DtButtonToggleItem implements CanDisable, HasTabIndex  {

  private _selected = false;
  private _value: T;
  private _disabled = false;

  @Output() readonly selectionChange = new EventEmitter<DtButtonToggleItemSelectionChange<T>>();

  constructor(private _buttonGroup: DtButtonToggle<T>,
              private _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef
  ) {
    super(_elementRef);
  }

  /** Whether the button-toggle item is selected. */
  @Input()
  @HostBinding('attr.aria-selected')
  @HostBinding('class.dt-button-toggle-item-selected')
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

  /** Whether the button-toggle item is disabled. */
  @Input()
  @HostBinding('attr.aria-disabled')
  @HostBinding('class.dt-button-toggle-item-disabled')
  get disabled(): boolean {
    return this._disabled  || this._buttonGroup.disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }

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

  @HostListener('click')
  private _onSelect(): void {
    if (!this.disabled) {
      this._changeDetectorRef.markForCheck();
      this.selectionChange.emit({source: this, isUserInput: true});
    }
  }

  /** Ensures the option is selected when activated from the keyboard. */
  @HostListener('keydown', ['$event'])
  // tslint:disable-next-line
  private _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._onSelect();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }
}
