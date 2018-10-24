import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';
import { mixinDisabled, CanDisable } from '@dynatrace/angular-components/core';

// tslint:disable:class-name

// @Directive({
//   selector: 'dt-filter-field-tag-label',
//   exportAs: 'dtFilterFieldTagLabel',
// })
// export class DtFilterFieldTagLabel {}

// Boilerplate for applying mixins to DtButton.
export class _DtFilterFieldTagBase { }
export const _DtFilterFieldTagMixinBase = mixinDisabled(_DtFilterFieldTagBase);

@Component({
  moduleId: module.id,
  selector: 'dt-filter-field-tag',
  exportAs: 'dtFilterFieldTag',
  templateUrl: 'filter-field-tag.html',
  styleUrls: ['filter-field-tag.scss'],
  inputs: ['disabled'],
  host: {
    'class': 'dt-filter-field-tag',
    '[class.dt-filter-field-tag-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class _DtFilterFieldTag extends _DtFilterFieldTagMixinBase implements CanDisable {
  @Output() readonly remove = new EventEmitter<_DtFilterFieldTag>();
  @Output() readonly edit = new EventEmitter<_DtFilterFieldTag>();
}

// tslint:enable:class-name
