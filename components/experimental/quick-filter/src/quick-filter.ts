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
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  DtFilterFieldDataSource,
  DtNodeDef,
  isDtAutocompleteDef,
  isDtOptionDef,
} from '@dynatrace/barista-components/filter-field';
import { Observable } from 'rxjs';
import { filter, pluck, map } from 'rxjs/operators';

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
export class DtQuickFilter {
  @Output() readonly filterChanged = new EventEmitter<any>();

  @Input()
  get dataSource(): DtFilterFieldDataSource {
    return this._dataSource;
  }
  set dataSource(dataSource: DtFilterFieldDataSource) {
    this._dataSource = dataSource;
  }

  private _dataSource: DtFilterFieldDataSource;

  _nodeDefinitions$: Observable<any>;

  ngOnInit(): void {
    if (this._dataSource) {
      this._nodeDefinitions$ = this._dataSource.connect().pipe(
        filter(isDtAutocompleteDef),
        map(({ autocomplete: rootDef }) =>
          rootDef.optionsOrGroups
            .filter(isDtAutocompleteDef)
            .map(autocompleteDef => {
              const options = autocompleteDef.autocomplete.optionsOrGroups
                .filter(isDtOptionDef)
                .map(({ option }) => option.viewValue);

              return {
                name: autocompleteDef.option!.viewValue,
                distinct: autocompleteDef.autocomplete.distinct,
                options,
              };
            }),
        ),
      );
    }
  }
}
