/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { CanDisable, mixinDisabled } from '../common-behaviours/disabled';

let _uniqueId = 0;

// Boilerplate for applying mixins to DtOptgroup.
export class DtOptgroupBase {}
export const _DtOptgroupMixinBase = mixinDisabled(DtOptgroupBase);

/** Component that is used to group instances of `dt-option`. */
@Component({
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

  /** @internal Unique id for the underlying label. */
  _labelId = `dt-optgroup-label-${_uniqueId++}`;
}
