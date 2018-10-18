import { Provider, forwardRef, Directive, Input, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DtAutocomplete } from './autocomplete';

/** Provider that allows the autocomplete to register as a ControlValueAccessor. */
export const DT_AUTOCOMPLETE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DtAutocompleteTrigger),
  multi: true,
};

@Directive({
  selector: `input[dtAutocomplete], textarea[dtAutocomplete]`,
  exportAs: 'dtAutocompleteTrigger',
  providers: [DT_AUTOCOMPLETE_VALUE_ACCESSOR],
})
export class DtAutocompleteTrigger implements ControlValueAccessor, OnDestroy {

  private _autocompleteDisabled = false;

  /** The autocomplete panel to be attached to this trigger. */
  @Input('dtAutocomplete') autocomplete: DtAutocomplete<any>;

  /** autocomplete` attribute to be set on the input element. */
  @Input('autocomplete') autocompleteAttribute = 'off';

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('dtAutocompleteDisabled')
  get autocompleteDisabled(): boolean { return this._autocompleteDisabled; }
  set autocompleteDisabled(value: boolean) {
    this._autocompleteDisabled = coerceBooleanProperty(value);
  }

  /** `View -> model callback called when value changes` */
  _onChange: (value: string) => void = () => {};

  /** `View -> model callback called when autocomplete has been touched` */
  _onTouched = () => {};

  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private _canOpenOnNextFocus = true;

  private _disposableFns: Array<() => void> = [];

  constructor(private _element: ElementRef<HTMLInputElement>, private _renderer: Renderer2) {
    this._disposableFns.push(this._renderer.listen(window, 'blur', () => {
      // If the user blurred the window while the autocomplete is focused, it means that it'll be
      // refocused when they come back. In this case we want to skip the first focus event, if the
      // pane was closed, in order to avoid reopening it unintentionally.
      this._canOpenOnNextFocus = document.activeElement !== this._element.nativeElement || this.panelOpen;
    }));
  }

  ngOnDestroy(): void {
    this._disposableFns.forEach((fn) => fn());
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: string): void {
    // Promise.resolve(null).then(() => this._setTriggerValue(value));
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: string) => {}): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    // this._element.nativeElement.disabled = isDisabled;
  }
}
