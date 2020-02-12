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

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  DtNodeDef,
  isDtOptionDef,
  isDtRenderType,
} from '@dynatrace/barista-components/filter-field';
import { DtRadioChange } from '@dynatrace/barista-components/radio';
import { DtCheckboxChange } from '../../../checkbox';
import {
  addFilter,
  removeFilter,
  updateFilter,
  Action,
  unsetFilterGroup,
} from './state/actions';
import { buildIdPathsFromFilters } from './quick-filter-utils';

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
  /** @internal The nodeDef of the autocomplete that should be rendered */
  @Input('nodeDef') _nodeDef: DtNodeDef;

  /** @internal The list of all active filters */
  @Input()
  set activeFilters(filters: any[][]) {
    this._activeFilterPaths = buildIdPathsFromFilters(filters || []);
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Emits a new action that changes the filter  */
  @Output() readonly filterChange = new EventEmitter<Action>();

  /** A list of active filter ids */
  private _activeFilterPaths: string[] = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  _unsetGroup(): void {
    this.filterChange.emit(unsetFilterGroup(this._nodeDef));
  }

  /** @internal Updates a radio box */
  _selectOption(change: DtRadioChange<DtNodeDef>): void {
    if (change.value) {
      this.filterChange.emit(updateFilter(change.value));
    }
  }

  /** @internal Select or de select a checkbox */
  _selectCheckBox(change: DtCheckboxChange<DtNodeDef>): void {
    const action = change.checked
      ? addFilter(change.source.value)
      : removeFilter(change.source.value);
    this.filterChange.emit(action);
  }

  /** @internal Helper function that checks if nothing is selected inside a group */
  _isNothingSelected(): boolean {
    if (this._nodeDef.option && this._nodeDef.option.uid) {
      const index = this._activeFilterPaths.findIndex(path =>
        path.startsWith(this._nodeDef.option!.uid!),
      );
      return index === -1;
    }
    return false;
  }

  /** @internal Helper function that checks if an options is active */
  _isActive(node: DtNodeDef): boolean {
    return !!(
      node.option && this._activeFilterPaths.includes(node.option.uid || '')
    );
  }

  /**
   * @internal
   * Helper function that checks if the nodeDef of the autocomplete is distinct.
   * Needed to differentiate between radios or checkboxes.
   */
  _isDistinct(): boolean {
    return !!(
      this._nodeDef.autocomplete && this._nodeDef.autocomplete.distinct
    );
  }

  /** @internal Helper function that returns safely the viewValue of a nodeDef */
  _getViewValue(nodeDef: DtNodeDef): string {
    return nodeDef && nodeDef.option ? nodeDef.option.viewValue : '';
  }

  /**
   * @internal
   * Helper function that returns all options that can be displayed.
   * They can only be displayed if it is an option of an autocomplete that
   * is not a render type so only have a text.
   */
  _getOptions(): DtNodeDef[] {
    if (this._nodeDef && this._nodeDef.autocomplete) {
      return this._nodeDef.autocomplete.optionsOrGroups.filter(
        def => isDtOptionDef(def) && !isDtRenderType(def),
      );
    }
    return [];
  }
}
