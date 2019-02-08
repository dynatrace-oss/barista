import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { mixinDisabled, CanDisable } from '@dynatrace/angular-components/core';
import { NodeData, FilterData, getNodeDataViewValue, isFreeTextData, FilterDataViewValues } from '../types';

export class DtFilterFieldTagEvent {
  constructor(public source: DtFilterFieldTag, public data: FilterData) { }
}

// tslint:disable:class-name

// Boilerplate for applying mixins to DtButton.
export class _DtFilterFieldTagBase { }
export const _DtFilterFieldTagMixinBase = mixinDisabled(_DtFilterFieldTagBase);
// tslint:enable:class-name

@Component({
  moduleId: module.id,
  selector: 'dt-filter-field-tag',
  exportAs: 'dtFilterFieldTag',
  templateUrl: 'filter-field-tag.html',
  styleUrls: ['filter-field-tag.scss'],
  inputs: ['disabled'],
  host: {
    '[attr.role]': `'option'`,
    'class': 'dt-filter-field-tag',
    '[class.dt-filter-field-tag-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterFieldTag extends _DtFilterFieldTagMixinBase implements CanDisable {

  @Input() data: FilterData;
  @Input() viewValues: FilterDataViewValues;

  @Output() readonly remove = new EventEmitter<DtFilterFieldTagEvent>();
  @Output() readonly edit = new EventEmitter<DtFilterFieldTagEvent>();

  _handleRemove(event: MouseEvent): void {
    // Prevent click from bubbling up, so it does not interfere with autocomplete
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.remove.emit(new DtFilterFieldTagEvent(this, this.data));
    }
  }

  _handleEdit(event: MouseEvent): void {
    // Prevent click from bubbling up, so it does not interfere with autocomplete
    event.stopImmediatePropagation();

    if (!this.disabled) {
      this.edit.emit(new DtFilterFieldTagEvent(this, this.data));
    }
  }
}
