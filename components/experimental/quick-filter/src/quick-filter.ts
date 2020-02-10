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
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldDataSource,
  DtNodeDef,
  isDtAutocompleteDef,
} from '@dynatrace/barista-components/filter-field';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { QuickFilterActions, quickFilterReducer } from './quick-filter-reducer';
import { applyDtOptionIds } from '../../../filter-field/src/filter-field-util';

@Directive({
  selector: 'dt-quick-filter-title',
  exportAs: 'dtQuickFilterTitle',
  host: {
    class: 'dt-quick-filter-title',
  },
})
export class DtQuckFilterTitle {}

@Directive({
  selector: 'dt-quick-filter-sub-title',
  exportAs: 'dtQuickFilterSubTitle',
  host: {
    class: 'dt-quick-filter-sub-title',
  },
})
export class DtQuckFilterSubTitle {}

@Component({
  selector: 'dt-quick-filter',
  exportAs: 'dtQuickFilter',
  templateUrl: 'quick-filter.html',
  styleUrls: ['quick-filter.scss'],
  host: {
    class: 'dt-quick-filter',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtQuickFilter<T> {
  @Output() readonly filterChanges = new EventEmitter<
    DtFilterFieldChangeEvent<T>
  >();

  @ViewChild(DtFilterField, { static: true })
  private _filterField: DtFilterField<any>;

  /** The data source instance that should be connected to the filter field. */
  @Input()
  get dataSource(): DtFilterFieldDataSource {
    return this._dataSource;
  }
  set dataSource(dataSource: DtFilterFieldDataSource) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: DtFilterFieldDataSource;

  /** @internal */
  _partialData$: Observable<DtNodeDef[]>;
  private _originalDataSource$: Observable<any>;

  _changeFilter(action: QuickFilterActions): void {
    this._filterField.filters = quickFilterReducer(
      this._filterField.filters,
      action,
    );
  }

  /** @internal Bubble the filter field change event through */
  _filterFiledChanged(change: DtFilterFieldChangeEvent<T>): void {
    console.log(change);

    this.filterChanges.emit(change);
  }

  /**
   * Takes a new data source and switches the filter date to the provided one.
   * Handles all the disconnecting and data switching.
   */
  private _switchDataSource(dataSource: DtFilterFieldDataSource): void {
    if (this._dataSource) {
      this._dataSource.disconnect();
    }

    this._dataSource = dataSource;

    this._originalDataSource$ = this._dataSource.connect();
    this._partialData$ = this._originalDataSource$.pipe(
      tap(nodeDef => {
        // apply the ids to the node to identify them later on
        applyDtOptionIds(nodeDef);
      }),
      filter(isDtAutocompleteDef),
      map(({ autocomplete }) =>
        autocomplete.optionsOrGroups.filter(isDtAutocompleteDef),
      ),
    );
  }
}
