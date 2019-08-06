import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * An empty state item. An empty state card may contain one or more such items.
 *
 * @example
 *   <dt-empty-state-item>
 *     <dt-empty-state-item-img>
 *      <img src="asset.png" alt="asset"/>
 *     </dt-empty-state-item-img>
 *     <dt-empty-state-item-title>optional heading</dt-empty-state-item-title>
 *     some item description
 *   </dt-empty-state-item>
 */
@Component({
  selector: 'dt-empty-state-item',
  templateUrl: 'empty-state-item.html',
  styleUrls: ['empty-state-item.scss'],
  host: {
    class: 'dt-empty-state-item',
  },
})
export class DtEmptyStateItem {}

/**
 * The image of an empty state card item.
 *
 * @example
 *   <dt-empty-state-item-img>
 *     <img src="asset.png" alt="asset"/>
 *   </dt-empty-state-item-img>
 */
@Directive({
  selector:
    'dt-empty-state-item-img, [dt-empty-state-item-img], [dtEmptyStateItemImg]',
  exportAs: 'dtEmptyStateItemImg',
  host: {
    class: 'dt-empty-state-item-img',
    'aria-hidden': 'true',
  },
})
export class DtEmptyStateItemImage {}

/**
 * The (optional) heading of an empty state card item.
 *
 * @example <dt-empty-state-item-title>optional heading</dt-empty-state-item-title>
 */
@Directive({
  selector:
    'dt-empty-state-item-title, [dt-empty-state-item-title], [dtEmptyStateItemTitle]',
  exportAs: 'dtEmptyStateItemTitle',
  host: {
    class: 'dt-empty-state-item-title',
    role: 'heading',
  },
})
export class DtEmptyStateItemTitle {}

/**
 * The action button/s that is/are placed below the image and text of the item
 * (must be a cta styled primary button).
 *
 * @example
 *   <dt-empty-state-footer-actions>
 *     <a dt-button color="cta" i18n>View release</a>
 *     <a dt-button color="cta" i18n>More info</a>
 *   </dt-empty-state-footer-actions>
 */
@Directive({
  selector: 'dt-empty-state-footer-actions',
  host: {
    class: 'dt-empty-state-footer-actions',
  },
})
export class DtEmptyStateFooterActions {}

/**
 * Placeholder for content that does not yet exist. It consists of one or more
 * items with each item containing an image, an optional header and a
 * short description text. It can be used within a `<dt-card>` or
 * an `<dt-table>`.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-empty-state',
  exportAs: 'dtEmptyState',
  template: `
    <div class="dt-empty-state-item-container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['empty-state.scss'],
  host: {
    class: 'dt-empty-state',
    '[class.dt-empty-state-multiple-items]': '_items.length > 1',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtEmptyState implements AfterContentInit, OnDestroy {
  /** @internal Empty state items (1..n) */
  @ContentChildren(DtEmptyStateItem)
  _items: QueryList<DtEmptyStateItem>;

  private readonly _destroy$ = new Subject<void>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._items.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
