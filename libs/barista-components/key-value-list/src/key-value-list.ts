/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { isDefined } from '@dynatrace/barista-components/core';

import { DtKeyValueListItem } from './key-value-list-item';

const DT_KEY_VALUE_LIST_TWO_COLUMNS_LAYOUT_MIN_ITEMS = 12;
const DT_KEY_VALUE_LIST_THREE_COLUMNS_LAYOUT_MIN_ITEMS = 18;
const DT_KEY_VALUE_LIST_MAX_COLUMNS = 6;

@Component({
  selector: 'dt-key-value-list',
  host: {
    class: 'dt-key-value-list',
    '[attr.dt-column]': '_calculatedColumns',
  },
  templateUrl: 'key-value-list.html',
  styleUrls: ['key-value-list.scss'],
  exportAs: 'dtKeyValueList',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueList implements AfterContentInit, OnDestroy {
  /**
   * @internal References of the key value items.
   */
  @ContentChildren(DtKeyValueListItem) _items: QueryList<DtKeyValueListItem>;

  /** @internal Calculated amount of colums. */
  _calculatedColumns = 1;
  private _itemsChangeSub = Subscription.EMPTY;

  /** If not set programatically, columns are calculated depending on the number of items. */
  @Input()
  get columns(): number {
    return this._columns;
  }
  set columns(newValue: number) {
    const coerced = coerceNumberProperty(newValue);
    this._columns = coerced;
    this._calculatedColumns = Math.min(
      Math.max(Math.floor(coerced), 1),
      DT_KEY_VALUE_LIST_MAX_COLUMNS,
    );
    this._itemsChangeSub.unsubscribe();
    this._itemsChangeSub = Subscription.EMPTY;
    this._changeDetectorRef.markForCheck();
  }
  private _columns: number;
  static ngAcceptInputType_columns: NumberInput;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    if (!isDefined(this._columns)) {
      this._itemsChangeSub = this._items.changes
        .pipe(startWith(null))
        .subscribe(() => {
          if (
            this._items.length >
            DT_KEY_VALUE_LIST_THREE_COLUMNS_LAYOUT_MIN_ITEMS
          ) {
            /* eslint-disable @typescript-eslint/no-explicit-any, no-magic-numbers */
            this._calculatedColumns = 3;
          } else if (
            this._items.length > DT_KEY_VALUE_LIST_TWO_COLUMNS_LAYOUT_MIN_ITEMS
          ) {
            /* eslint-disable @typescript-eslint/no-explicit-any, no-magic-numbers */
            this._calculatedColumns = 2;
          } else {
            this._calculatedColumns = 1;
          }
          this._changeDetectorRef.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    this._itemsChangeSub.unsubscribe();
  }
}
