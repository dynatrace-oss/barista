import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DtViewportResizer } from '@dynatrace/angular-components/core';

/** The min-width from which empty state items are displayed horizontally. */
const ITEMS_HORIZONTAL_BREAKPOINT = 540;

/** The min-width from which the empty state items are aligned next to each other. */
const LAYOUT_HORIZONTAL_BREAKPOINT = 760;

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
  template: '<ng-content></ng-content>',
  styleUrls: ['empty-state.scss'],
  host: {
    class: 'dt-empty-state',
    '[@fadeIn]': '_visibility',
    '[class.dt-empty-state-layout-horizontal]': '_isLayoutHorizontal',
    '[class.dt-empty-state-items-horizontal]':
      '_isItemLayoutHorizontal && !_isLayoutHorizontal',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fadeIn', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DtEmptyState
  implements AfterContentInit, AfterViewInit, OnDestroy {
  /** @internal Empty state items (1..n) */
  @ContentChildren(DtEmptyStateItem)
  _items: QueryList<DtEmptyStateItem>;

  private readonly _destroy$ = new Subject<void>();

  /**
   * @internal
   * Whether empty state items should have a horizontal layout
   * (i.e. image and text next to each other).
   */
  _isItemLayoutHorizontal = false;

  /**
   * @internal
   * Whether empty state items should be aligned next to each other.
   */
  _isLayoutHorizontal = false;

  /** @internal set the visible state to trigger a fade animation */
  set _visible(visibility: boolean) {
    this._visibility = visibility ? 'visible' : 'hidden';
  }

  /** @internal The visibility state that is used to trigger the animation steps */
  _visibility: 'visible' | 'hidden' = 'visible';

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _platform: Platform,
  ) {}

  ngAfterContentInit(): void {
    this._items.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this._viewportResizer
      .change()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._updateLayout();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Updates the layout according to the width of the container (horizontal or vertical) */
  _updateLayout(): void {
    if (this._platform.isBrowser) {
      const componentWidth = this._elementRef.nativeElement.getBoundingClientRect()
        .width;
      this._isItemLayoutHorizontal =
        componentWidth > ITEMS_HORIZONTAL_BREAKPOINT;
      this._isLayoutHorizontal =
        this._items.length > 1 && componentWidth > LAYOUT_HORIZONTAL_BREAKPOINT;
      this._changeDetectorRef.markForCheck();
    }
  }
}
