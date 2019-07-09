import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CanDisable, mixinDisabled } from '../common-behaviours/disabled';

let _uniqueId = 0;

// Boilerplate for applying mixins to DtOptgroup.
export class DtOptgroupBase {}
export const _DtOptgroupMixinBase = mixinDisabled(DtOptgroupBase);

/** Component that is used to group instances of `dt-option`. */
@Component({
  moduleId: module.id,
  selector: 'dt-optgroup',
  exportAs: 'dtOptgroup',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  templateUrl: 'optgroup.html',
  styleUrls: ['optgroup.scss'],
  host: {
    class: 'dt-optgroup',
    role: 'group',
    '[class.dt-optgroup-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-labelledby]': '_labelId',
  },
})
export class DtOptgroup extends _DtOptgroupMixinBase implements CanDisable {
  /** Label for the option group. */
  @Input() label: string;

  /** Unique id for the underlying label. */
  _labelId = `dt-optgroup-label-${_uniqueId++}`;
}
