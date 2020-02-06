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
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import {
  DtFilterFieldDataSource,
  DtNodeDef,
  isDtAutocompleteDef,
  DtFilterField,
  DtFilterFieldChangeEvent,
} from '@dynatrace/barista-components/filter-field';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

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
  _mutatedDataSource$: Observable<DtNodeDef | null>;
  private _originalDataSource$: Observable<any>;

  filterChanged(change): void {
    console.log(change);
  }

  ngOnChanges(_changes: any): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this._filterField.filters);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.filter();
  }

  filter() {
    console.log(this._filterField.filters);
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
    this._mutatedDataSource$ = this._originalDataSource$.pipe(
      filter(isDtAutocompleteDef),
      tap(console.log),
      map(({ autocomplete }) =>
        autocomplete.optionsOrGroups.filter(isDtAutocompleteDef),
      ),
      tap(console.log),
    );
  }
}
