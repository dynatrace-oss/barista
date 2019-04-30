import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { DtFilterFieldTagData } from '../types';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

// tslint:disable:class-name

@Component({
  moduleId: module.id,
  selector: 'dt-filter-field-tag',
  exportAs: 'dtFilterFieldTag',
  templateUrl: 'filter-field-tag.html',
  styleUrls: ['filter-field-tag.scss'],
  host: {
    '[attr.role]': `'option'`,
    'class': 'dt-filter-field-tag',
    '[class.dt-filter-field-tag-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterFieldTag {

  @Input() data: DtFilterFieldTagData;

  @Output() readonly remove = new EventEmitter<DtFilterFieldTag>();
  @Output() readonly edit = new EventEmitter<DtFilterFieldTag>();

  /** Whether the tag is disabled. */
  // Note: The disabled mixin can not be used here because the CD needs to be triggerd after it has been set
  // to reflect the state when programatically setting the property.
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  _handleRemove(event: MouseEvent): void {
    // Prevent click from bubbling up, so it does not interfere with autocomplete
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.remove.emit(this);
    }
  }

  _handleEdit(event: MouseEvent): void {
    // Prevent click from bubbling up, so it does not interfere with autocomplete
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.edit.emit(this);
    }
  }
}
