import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { Constructor, mixinColor } from '@dynatrace/angular-components/core';

import { DtBreadcrumbsItem2 } from './breadcrumbs-item';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';

export type DtBreadcrumbThemePalette = 'main' | 'error' | 'neutral';

// Boilerplate for applying mixins to DtBreadcrumb.
export class DtBreadcrumbBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtBreadcrumbMixinBase = mixinColor<
  Constructor<DtBreadcrumbBase>,
  DtBreadcrumbThemePalette
>(DtBreadcrumbBase, 'main');
@Component({
  moduleId: module.id,
  selector: 'dt-breadcrumbs',
  exportAs: 'dtBreadcrumbs',
  templateUrl: 'breadcrumbs.html',
  styleUrls: ['breadcrumbs.scss'],
  host: {
    class: 'dt-breadcrumbs',
    '[attr.aria-label]': 'ariaLabel',
  },
  inputs: ['color'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtBreadcrumbs extends _DtBreadcrumbMixinBase
  implements AfterContentInit, OnDestroy {
  /** Aria label for the breadcrumbs */
  @Input('aria-label') ariaLabel: string;
  // tslint:disable:deprecation
  @ContentChildren(DtBreadcrumbsItem)
  private _items: QueryList<DtBreadcrumbsItem>;
  // tslint:enable:deprecation

  @ContentChildren(DtBreadcrumbsItem2) private _items2: QueryList<
    DtBreadcrumbsItem2
  >;

  private _destroy$ = new Subject<void>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngAfterContentInit(): void {
    this._items.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        // We need to notify the items whether they are the last one in the list,
        // because they use this information to determine their active state.
        this._items.forEach((item, index) => {
          item._lastItem = this._items.length - 1 === index;
        });
      });
    this._items2.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._items2.forEach((item, index) => {
          item._setCurrent(this._items2.length - 1 === index);
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
