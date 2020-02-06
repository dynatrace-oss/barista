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
import {
  DtNodeDef,
  isDtOptionDef,
} from '@dynatrace/barista-components/filter-field';
// TODO: check if we can export the types
import { isDtRenderType } from '../../../filter-field/src/types';

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
  @Input() nodeDef: DtNodeDef;

  _isDistinct(): boolean {
    return this.nodeDef.autocomplete!.distinct;
  }

  /** @internal Helper function that returns safely the viewValue of a nodeDef */
  _getViewValue(nodeDef: DtNodeDef): string {
    return nodeDef && nodeDef.option ? nodeDef.option.viewValue : '';
  }

  _getOptions(): DtNodeDef[] {
    if (this.nodeDef && this.nodeDef.autocomplete) {
      return this.nodeDef.autocomplete.optionsOrGroups.filter(
        def => isDtOptionDef(def) && !isDtRenderType(def),
      );
    }
    return [];
  }
}
