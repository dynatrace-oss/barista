/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** @internal */
@Component({
  selector: 'dt-quick-filter-group',
  templateUrl: './quick-filter-group.html',
  styleUrls: ['./quick-filter-group.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-quick-filter-group',
  },
})
export class DtQuickFilterGroup {
  @Input() items: string[];

  @Input()
  get distinct(): boolean {
    return this._distinct;
  }
  set distinct(distinct: boolean) {
    this._distinct = coerceBooleanProperty(distinct);
  }

  private _distinct: boolean;
}
