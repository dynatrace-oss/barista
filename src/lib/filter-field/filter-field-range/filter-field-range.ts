// tslint:disable: template-cyclomatic-complexity
import {
  Component,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  ViewContainerRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { isDefined } from '@dynatrace/angular-components/core';
import { DtButtonGroup } from '@dynatrace/angular-components/button-group';
import { coerceNumberProperty } from '@angular/cdk/coercion';
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
    public unit: string
  ) { }
}

/** Valid FilterfieldRange operators. */
type DtFilterFieldRangeOperator = 'range' | 'lower-equal' | 'greater-equal' | 'equal';

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

    // tslint:disable-next-line: no-bitwise
    this._hasRangeOperator = !!(this._enabledOperators & DtRangeOperatorFlags.Range);
    // tslint:disable-next-line: no-bitwise
    this._hasEqualOperator = !!(this._enabledOperators & DtRangeOperatorFlags.Equal);
    // tslint:disable-next-line: no-bitwise
    this._hasLowerEqualOperator = !!(this._enabledOperators & DtRangeOperatorFlags.LowerEqual);
    // tslint:disable-next-line: no-bitwise
    this._hasGreaterEqualOperator = !!(this._enabledOperators & DtRangeOperatorFlags.GreatEqual);
    this._updateSelectedOperator();
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
  @Output() readonly rangeSubmitted = new EventEmitter<DtFilterFieldRangeSubmittedEvent>();

  /** Unique ID to be used by filter-field range trigger's "aria-owns" property. */
  id = `dt-filter-field-range-${_uniqueIdCounter++}`;

  /** Whether the filter-field range panel is open. */
  get isOpen(): boolean {
    return this._isOpen;
  }
  /** @internal Whether the filter-field range panel is open. */
  _isOpen = false;

  /** The currently selected option. */
  selectedOperator: DtFilterFieldRangeOperator | null;

  /** @internal */
  @ViewChild(TemplateRef, { static: true, }) _template: TemplateRef<{}>;

  /** @internal */
  @ViewChild(DtButtonGroup, { static: false, }) _operatorGroup: DtButtonGroup<DtFilterFieldRange>;

  /** @internal */
  _portal: TemplatePortal;

  /** @internal Holds the current value of the input field for the from value */
  _valueFrom = '';

  /** @internal Holds the current value of the input field for the to value */
  _valueTo = '';

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this._portal = new TemplatePortal<{}>(this._template, this._viewContainerRef);
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
    return isDefined(this.selectedOperator) && this.selectedOperator === type;
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
          this.selectedOperator as DtFilterFieldRangeOperator,
          range as number | [number, number],
          this.unit
        ));
    }
  }

  /** @internal Whether the range values are valid. */
  _isValidRange(): boolean {
    return isDefined(this._validateRange());
  }

  /** Validates and casts the range values (from & to) and return either the range number(s) or null */
  private _validateRange(): number | [number, number] | null {
    const valueFromOrNull = coerceNumberProperty(this._valueFrom, null);
    if (this.selectedOperator === 'range' && valueFromOrNull !== null) {
      const valueToOrNull = coerceNumberProperty(this._valueTo, null);
      return valueToOrNull !== null ? [valueFromOrNull, valueToOrNull] : null;
    }
    return valueFromOrNull;
  }

  /** Updates the selectedOperator */
  private _updateSelectedOperator(): void {
    this.selectedOperator = this._hasRangeOperator ? 'range' :
      this._hasLowerEqualOperator ? 'lower-equal' :
      this._hasGreaterEqualOperator ? 'greater-equal' :
      this._hasEqualOperator ? 'equal' : null;
  }
}
