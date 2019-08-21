import { coerceNumberProperty } from '@angular/cdk/coercion';
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

import { isDefined } from '@dynatrace/angular-components/core';

import { DtKeyValueListItem } from './key-value-list-item';

const DT_KEY_VALUE_LIST_TWO_COLUMNS_LAYOUT_MIN_ITEMS = 12;
const DT_KEY_VALUE_LIST_THREE_COLUMNS_LAYOUT_MIN_ITEMS = 18;
const DT_KEY_VALUE_LIST_MAX_COLUMNS = 6;

@Component({
  moduleId: module.id,
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
  @ContentChildren(DtKeyValueListItem) items: QueryList<DtKeyValueListItem>;

  /** @internal */
  _calculatedColumns = 1;
  private _itemsChangeSub = Subscription.EMPTY;

  /** If not set programatically, columns are calclated depending on the number of items. */
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

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    if (!isDefined(this._columns)) {
      this._itemsChangeSub = this.items.changes
        .pipe(startWith(null))
        .subscribe(() => {
          if (
            this.items.length > DT_KEY_VALUE_LIST_THREE_COLUMNS_LAYOUT_MIN_ITEMS
          ) {
            // tslint:disable:no-any no-magic-numbers
            this._calculatedColumns = 3;
          } else if (
            this.items.length > DT_KEY_VALUE_LIST_TWO_COLUMNS_LAYOUT_MIN_ITEMS
          ) {
            // tslint:disable:no-any no-magic-numbers
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
