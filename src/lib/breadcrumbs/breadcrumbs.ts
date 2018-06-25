import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy
} from '@angular/core';
import { startWith } from 'rxjs/operators';
import { NEVER } from 'rxjs';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';

@Component({
  moduleId: module.id,
  selector: 'dt-breadcrumbs',
  exportAs: 'dtBreadcrumbs',
  templateUrl: 'breadcrumbs.html',
  styleUrls: ['breadcrumbs.scss'],
  host: {
    class: 'dt-breadcrumbs',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtBreadcrumbs implements AfterContentInit, OnDestroy {

  @ContentChildren(DtBreadcrumbsItem) private _items: QueryList<DtBreadcrumbsItem>;

  private _itemChangesSub = NEVER.subscribe();

  ngAfterContentInit(): void {
    this._itemChangesSub = this._items.changes
      .pipe(startWith(null))
      .subscribe(() => {
        // We need to notify the items whether they are the last one in the list,
        // because they use this information to determine their active state.
        this._items.forEach((item, index) => item._lastItem = this._items.length - 1 === index);
      });
  }

  ngOnDestroy(): void {
    this._itemChangesSub.unsubscribe();
  }
}
