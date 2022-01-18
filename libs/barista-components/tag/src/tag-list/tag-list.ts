/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {
  startWith,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
} from 'rxjs/operators';

import { DtViewportResizer } from '@dynatrace/barista-components/core';

import { DtTag } from '../tag';
import { DtTagAdd } from '../tag-add/tag-add';

const DT_TAG_LIST_HEIGHT = 32;
const DT_TAG_LIST_LAST_TAG_SPACING = 4;

@Component({
  selector: 'dt-tag-list',
  exportAs: 'dtTagList',
  templateUrl: 'tag-list.html',
  styleUrls: ['tag-list.scss'],
  host: {
    class: 'dt-tag-list',
    role: 'list',
    '[attr.aria-label]': 'ariaLabel',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTagList implements AfterContentInit, OnDestroy {
  /** Used to set the 'aria-label' attribute on the underlying input element. */
  @Input('aria-label') ariaLabel: string;

  private readonly _destroy$ = new Subject<void>();

  /** @internal Reference to wrapper directives */
  @ViewChild('wrapper', { static: true }) _wrapperTagList: ElementRef;

  /** @internal List of Tag references */
  @ContentChildren(DtTag, { read: ElementRef })
  _tagElements: QueryList<ElementRef>;

  /** @internal List of Tag Add references */
  @ContentChildren(DtTagAdd, { read: DtTagAdd })
  _tagAddElements: QueryList<DtTagAdd>;

  /** @internal List of Tag Add subcriptions */
  _tagAddSubscriptions: Subscription[] = [];

  /** @internal Value for setting width of wrapper directive */
  _wrapperWidth: number | null = null;

  /** @internal Value for setting height of wrapper directive */
  _wrapperHeight: number | null = null;

  /** @internal Represents amount of hidden tags */
  _hiddenTagCount = 0;

  /** @internal Whether the tag-list fits in one line */
  _isOneLine = false;

  /** @internal Whether user wants all tags to be shown */
  _showAllTags = false;

  constructor(
    private _viewportResizer: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _platform: Platform,
  ) {}

  ngAfterContentInit(): void {
    if (this._platform.isBrowser) {
      // Changes need to be re-evaluated if
      this._tagElements.changes
        .pipe(
          startWith(null),
          switchMapTo(this._zone.onStable.pipe(take(1))),
          switchMap(() => this._viewportResizer.change().pipe(startWith(null))),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          if (!this._showAllTags) {
            this._setWrapperBoundingProperties(false);
            const tagArray = this._tagElements.toArray();
            const index = getIndexForFirstHiddenTag(
              tagArray.map((elRef) => elRef.nativeElement),
            );
            if (index !== 0) {
              this._handleWrapperProperties(tagArray, index);
            } else {
              this._isOneLine = true;
            }
          }
          // When running inside of a tree table, the table row does only get updated
          // when the differ of the tree table triggers a repaint. As the tag-list
          // itself marks itself dirty, but change detection never runs for it because
          // no differ detectable changes happened.
          // We need to run detectChanges here to actually update the number indicator
          this._changeDetectorRef.detectChanges();
        });
      this._tagAddElements.changes
        .pipe(startWith(null), takeUntil(this._destroy$))
        .subscribe(() => {
          this._unsubscribeFromTagAddElements();
          this._subscribeToTagAddElements();
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Expands the wrapper directive by setting width and height to 'auto' which shows all tags. */
  _expand(): void {
    this._showAllTags = true;
    this._isOneLine = true;
    this._setWrapperBoundingProperties(false);
  }

  /** @internal Calculates bounding of wrapper and show more value */
  _handleWrapperProperties(tagArray: ElementRef[], index: number): void {
    this._isOneLine = false;
    this._hiddenTagCount = tagArray.length - index;
    // Reapplying wrapper height because changing the viewsize might result in tags being rendered on multiple lines
    // but we only want to show the first row
    const wrapperLeft =
      this._wrapperTagList.nativeElement.getBoundingClientRect().left;
    this._wrapperWidth = getWrapperWidth(
      tagArray.map((elRef) => elRef.nativeElement)[index - 1],
      wrapperLeft,
    );
    this._setWrapperBoundingProperties(true);
  }

  /** @internal Sets the wrappers height and width properties */
  _setWrapperBoundingProperties(isCollapsed: boolean): void {
    if (isCollapsed) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._wrapperTagList.nativeElement.style.maxWidth = `${this
        ._wrapperWidth!}px`;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._wrapperTagList.nativeElement.style.minWidth = `${this
        ._wrapperWidth!}px`;
      this._wrapperTagList.nativeElement.style.height = `${DT_TAG_LIST_HEIGHT}px`;
    } else {
      this._wrapperTagList.nativeElement.style.maxWidth = '';
      this._wrapperTagList.nativeElement.style.minWidth = '';
      this._wrapperTagList.nativeElement.style.height = 'auto';
    }
  }

  /** Saves Tag Add subscriptions and adds _expandTagList on dt-tag-add event of Tag Add Element */
  private _subscribeToTagAddElements(): void {
    this._tagAddElements.map((el) =>
      this._tagAddSubscriptions.push(
        el.submitted.pipe(takeUntil(this._destroy$)).subscribe(() => {
          this._expand();
          this._changeDetectorRef.markForCheck();
        }),
      ),
    );
  }

  /** Unsubscribes every tag-add subscription */
  private _unsubscribeFromTagAddElements(): void {
    this._tagAddSubscriptions.forEach((subscribtion) => {
      subscribtion.unsubscribe();
    });
    this._tagAddSubscriptions = [];
  }

  /**
   * @internal evaluates whether to display the x more button
   */
  _toDisplayMoreButton(): boolean {
    return !this._isOneLine && !this._showAllTags;
  }
}

/** Returns the width of a directive by calculating the last visible elements and the directives position. */
export function getWrapperWidth(
  lastVisibleTag: HTMLElement,
  wrapperLeft: number,
): number {
  const tagBounding = lastVisibleTag.getBoundingClientRect();
  const width = Math.round(
    tagBounding.left -
      wrapperLeft +
      tagBounding.width +
      DT_TAG_LIST_LAST_TAG_SPACING,
  );

  return width;
}

/** Checks y.position of ElementRef Array and returns the index of the first Element in a new line  */
export function getIndexForFirstHiddenTag(tagArray: HTMLElement[]): number {
  if (tagArray.length) {
    let yPrev = tagArray[0].getBoundingClientRect().top;
    for (let index = 0; index < tagArray.length; index++) {
      const el = tagArray[index];
      const y = el.getBoundingClientRect().top;
      if (y > yPrev) {
        return index;
      }
      yPrev = y;
    }
  }
  return 0;
}
