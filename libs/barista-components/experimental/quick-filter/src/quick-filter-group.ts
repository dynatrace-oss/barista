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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DtCheckboxChange } from '@dynatrace/barista-components/checkbox';
import {
  DtAutocompleteValue,
  DtNodeDef,
  isDtOptionDef,
  isDtRenderType,
} from '@dynatrace/barista-components/filter-field';
import { DtRadioChange } from '@dynatrace/barista-components/radio';
import { buildIdPathsFromFilters } from './quick-filter-utils';
import {
  Action,
  addFilter,
  removeFilter,
  unsetFilterGroup,
  updateFilter,
} from './state/actions';

/** @internal The DtQuickFilterGroup is an internal component */
@Component({
  selector: 'dt-quick-filter-group',
  templateUrl: './quick-filter-group.html',
  styleUrls: ['./quick-filter-group.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    class: 'dt-quick-filter-group',
  },
})
export class DtQuickFilterGroup<T = any> {
  /**
   * @internal
   * The aria-level of the group headlines for the document outline.
   */
  @Input() groupHeadlineRole: number = 3;

  /** @internal The nodeDef of the autocomplete that should be rendered */
  @Input('nodeDef') _nodeDef: DtNodeDef;

  /** @internal The list of all active filters */
  @Input()
  set activeFilters(filters: DtAutocompleteValue<T>[][]) {
    this._activeFilterPaths = buildIdPathsFromFilters(filters || []);
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Emits a new action that changes the filter  */
  @Output() readonly filterChange = new EventEmitter<Action>();

  /** A list of active filter ids */
  private _activeFilterPaths: string[] = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** @internal Method that is used to unset a whole filter group */
  _unsetGroup(): void {
    this.filterChange.emit(unsetFilterGroup(this._nodeDef));
  }

  /** @internal Updates a radio box */
  _selectOption(change: DtRadioChange<DtNodeDef>, group: DtNodeDef): void {
    if (change.value) {
      this.filterChange.emit(updateFilter([group, change.value]));
    }
  }

  /** @internal Select or deselect a checkbox */
  _selectCheckBox(change: DtCheckboxChange<DtNodeDef>, group: DtNodeDef): void {
    const action = change.checked
      ? addFilter([group, change.source.value])
      : removeFilter(change.source.value.option!.uid!);
    this.filterChange.emit(action);
  }

  /** @internal Helper function that checks if nothing is selected inside a group */
  _isNothingSelected(): boolean {
    if (this._nodeDef.option && this._nodeDef.option.uid) {
      const index = this._activeFilterPaths.findIndex((path) =>
        path.startsWith(this._nodeDef.option!.uid!),
      );
      return index === -1;
    }
    return false;
  }

  /** @internal Helper function that checks if an option is active */
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
    return !!this._nodeDef.autocomplete?.distinct;
  }

  /** @internal Helper function that returns safely the viewValue of a nodeDef */
  _getViewValue(nodeDef: DtNodeDef): string {
    return nodeDef?.option ? nodeDef.option.viewValue : '';
  }

  /**
   * @internal
   * Helper function that returns all options that can be displayed.
   * They can only be displayed if it is an option of an autocomplete that
   * is not a render type so only have a text.
   */
  _getOptions(): DtNodeDef[] {
    if (this._nodeDef?.autocomplete) {
      return this._nodeDef.autocomplete.optionsOrGroups.filter(
        (def) => isDtOptionDef(def) && !isDtRenderType(def),
      );
    }
    return [];
  }
}
