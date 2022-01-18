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

import { Directive, ElementRef } from '@angular/core';
import { Highlightable, InteractivityChecker } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';

const BREADCRUMBS_ITEM_ELLIPSIS_CLASS = `dt-breadcrumbs-item-ellipsis`;

/**
 * A breadcrumbs item that can be used within the `<dt-breadcrumbs>`.
 *
 * @example
 * <a dtBreadcrumbsItem href="/hosts">Hosts</a>
 */
@Directive({
  selector: 'a[dt-breadcrumbs-item], a[dtBreadcrumbsItem]',
  exportAs: 'dtBreadcrumbsItem',
  host: {
    class: 'dt-breadcrumbs-item',
    '(keydown)': '_onKeyDown($event)',
  },
})
export class DtBreadcrumbsItem2 implements Highlightable {
  /** @internal Whether the breadcrumb is focusable - determined by the interactivity checker */
  get _isFocusable(): boolean {
    return this._interactivityChecker.isFocusable(
      this._elementRef.nativeElement,
    );
  }

  /** @internal Stream of keydown events on the breadcrumb item */
  _onKeyDown$ = new Subject<KeyboardEvent>();

  constructor(
    readonly _elementRef: ElementRef<HTMLAnchorElement>,
    private _interactivityChecker: InteractivityChecker,
  ) {}

  /** Applies the styles for an active item to this item. Part of the Highlightable interface */
  setActiveStyles(): void {
    if (this._isFocusable) {
      this._elementRef.nativeElement.focus();
    }
  }

  /** Applies the styles for an inactive item to this item. Part of the Highlightable interface */
  setInactiveStyles(): void {
    if (this._isFocusable) {
      this._elementRef.nativeElement.blur();
    }
  }

  /** @internal */
  _setCurrent(current: boolean): void {
    const element: Element = this._elementRef.nativeElement;
    if (element && element.setAttribute) {
      if (current) {
        element.setAttribute('aria-current', 'page');
      } else {
        element.removeAttribute('aria-current');
      }
    }
  }

  /**
   * @internal Adds/removes the class for truncating the item's text
   * Moving items to/from the overlay leads to issues with the change detection,
   * hence the class for truncating the item is added/removed directly via the DOM api
   */
  _setEllipsis(value: boolean): void {
    const element: Element = this._elementRef.nativeElement;
    if (value) {
      element.classList.add(BREADCRUMBS_ITEM_ELLIPSIS_CLASS);
    } else {
      element.classList.remove(BREADCRUMBS_ITEM_ELLIPSIS_CLASS);
    }
  }

  _onKeyDown(event: KeyboardEvent): void {
    this._onKeyDown$.next(event);
  }
}
