
// Boilerplate for applying mixins to DtButtonGroupItem
import {CanColor, CanDisable, HasTabIndex, mixinColor, mixinTabIndex} from '@dynatrace/angular-components/core';
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

export type ButtonGroupThemePalette = 'main' | 'error' | undefined;
const defaultPalette: ButtonGroupThemePalette = 'main';

export const _DtButtonGroupItem =
  mixinTabIndex(mixinColor(DtButtonGroupItemBase, defaultPalette));

@Component({
  moduleId: module.id,
  selector: 'dt-button-group-item',
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'radio',
    'class': 'dt-button-group-item',
    '[attr.tabindex]': 'tabIndex',
  },
  styleUrls: ['button-group-item.scss'],
  inputs: ['color'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})

export class DtButtonGroupItem<T> extends _DtButtonGroupItem implements CanDisable, CanColor, HasTabIndex  {

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
  @HostBinding('attr.aria-selected')
  @HostBinding('class.dt-button-group-item-selected')
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
  @HostBinding('attr.aria-disabled')
  @HostBinding('class.dt-button-group-item-disabled')
  get disabled(): boolean {
    return this._disabled  || this._buttonGroup.disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  /** The bound value. */
  @Input()
  get value(): T { return this._value; }
  set value(newValue: T) {
    this._value = newValue;
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
