import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Provider,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * An event emitted by the `DtTableSearch` component when the input has changed.
 */
export interface DtTableSearchChangeEvent {
  /** The source that emitted the event. */
  readonly source: DtTableSearch;
  /** The current value. */
  readonly value: string;
}

/**
 * Provider Expression that allows dt-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 */
export const DT_TABLE_SEARCH_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare no-forward-ref
  useExisting: forwardRef(() => DtTableSearch),
  multi: true,
};

/**
 * A search field that can be used above tables for filtering.
 *
 * Searching data for the table means filtering out rows that are passed via
 * the data source. For highlighting the matched strings in the table the
 * `DtHighlight` component can be used.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-table-search',
  exportAs: 'dtTableSearch',
  templateUrl: 'table-search.html',
  styleUrls: ['table-search.scss'],
  host: {
    class: 'dt-table-search',
  },
  providers: [DT_TABLE_SEARCH_CONTROL_VALUE_ACCESSOR],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTableSearch implements ControlValueAccessor {
  /** The current search term. */
  @Input()
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    const actualValue = value || '';
    const change = this._value !== actualValue;

    this._value = actualValue;

    if (change && this._handleChange !== undefined) {
      this._handleChange(actualValue);
    }
  }
  private _value = '';

  /** Placeholder string for the input field (always needs to start with "Search ..."). */
  @Input()
  placeholder: string;

  /** An ARIA label describing the input field. */
  @Input('aria-label')
  ariaLabel: string;
  /** A reference to an ARIA description of the input field. */
  @Input('aria-labelledby')
  ariaLabelledBy: string;

  /** Event emitted when the user changes the search term. */
  @Output()
  readonly valueChange = new EventEmitter<DtTableSearchChangeEvent>();

  private _handleTouched?: () => void;
  private _handleChange?: (value: string) => void;

  /** @internal Executes _onTouched handler when input loses focus */
  _handleBlur(): void {
    if (this._handleTouched !== undefined) {
      this._handleTouched();
    }
  }

  /** @internal Emits a change event */
  _handleInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value = value;
    this.valueChange.emit({ source: this, value });
  }

  /** Implemented as a part of ControlValueAccessor. */
  writeValue(value: string): void {
    this.value = value;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnChange(fn: (value: string) => void): void {
    this._handleChange = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnTouched(fn: () => void = () => {}): void {
    this._handleTouched = fn;
  }
}
