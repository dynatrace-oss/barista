import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  Input,
  ElementRef,
} from '@angular/core';
import { startWith } from 'rxjs/operators';
import { NEVER } from 'rxjs';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';
import { mixinColor, Constructor } from '@dynatrace/angular-components/core';

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
  @ContentChildren(DtBreadcrumbsItem) private _items: QueryList<
    DtBreadcrumbsItem
  >;

  private _itemChangesSub = NEVER.subscribe();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngAfterContentInit(): void {
    this._itemChangesSub = this._items.changes
      .pipe(startWith(null))
      .subscribe(() => {
        // We need to notify the items whether they are the last one in the list,
        // because they use this information to determine their active state.
        this._items.forEach((item, index) => {
          item._lastItem = this._items.length - 1 === index;
        });
      });
  }

  ngOnDestroy(): void {
    this._itemChangesSub.unsubscribe();
  }
}
