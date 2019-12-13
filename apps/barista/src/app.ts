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

// tslint:disable: indent object-literal-key-quotes quotemark trailing-comma max-line-length no-duplicate-imports max-file-line-count

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaLocationService } from './shared/location.service';
import { BaPageService } from './shared/page.service';
import { BaLayoutType } from '@dynatrace/barista-components/barista-definitions';

const PAGE_THEME_MAP = new Map<string, string>([
  ['brand', 'purple'],
  ['resources', 'blue'],
  ['components', 'royalblue'],
  ['patterns', 'turquoise'],
]);

export const DEFAULT_PAGE_THEME = 'turquoise';

@Component({
  selector: 'ba-app',
  templateUrl: 'app.html',
  styleUrls: ['./app.scss'],
  host: {
    '(click)':
      '_handleClick($event.target, $event.button, $event.ctrlKey, $event.metaKey)',
  },
})
export class BaApp implements OnInit, OnDestroy {
  /**
   * @internal
   * The object containing all data needed to display the current page.
   */
  _currentPage$ = this._pageService.currentPage;

  /**
   * @internal
   * Observable of the current path.
   */
  _breadcrumbs$ = this._locationService.currentPath$.pipe(
    switchMap(path =>
      this._pageService.currentPage.pipe(map(page => ({ path, page }))),
    ),
    map(({ path, page }) => {
      return page.layout === BaLayoutType.Error
        ? []
        : createBreadcrumbItems(path);
    }),
  );

  /** @internal Gets the page theme based on the current location. */
  _pageTheme$ = this._locationService.currentPath$.pipe(
    map((path: string) => {
      let pageTheme = DEFAULT_PAGE_THEME;
      if (path.length) {
        const firstPart = path.split('/')[0];
        pageTheme = PAGE_THEME_MAP.get(firstPart) || pageTheme;
      }
      return pageTheme;
    }),
  );

  /** Subscription on the current page. */
  private _currentPageSubscription = Subscription.EMPTY;

  constructor(
    private _pageService: BaPageService,
    private _locationService: BaLocationService,
    private _titleService: Title,
  ) {}

  ngOnInit(): void {
    this._currentPageSubscription = this._currentPage$.subscribe(page =>
      this._titleService.setTitle(`${page.title} | Barista design system`),
    );
  }

  ngOnDestroy(): void {
    this._currentPageSubscription.unsubscribe();
  }

  /**
   * @internal
   * Handles all anchor clicks in app.
   */
  _handleClick(
    eventTarget: HTMLElement,
    button: number,
    ctrlKey: boolean,
    metaKey: boolean,
  ): boolean {
    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target: HTMLElement | null = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }

    if (target instanceof HTMLAnchorElement) {
      return this._locationService.handleAnchorClick(
        target,
        button,
        ctrlKey,
        metaKey,
      );
    }

    // Allow the click to pass through
    return true;
  }
}

function createBreadcrumbItems(
  path: string,
): { title: string; href: string }[] {
  let previousPath = '';
  return path.split('/').map((part: string) => {
    previousPath = `${previousPath}/${part}`;
    part = part
      .split('-')
      .join(' ')
      .replace(part.charAt(0), part.charAt(0).toUpperCase());
    return { title: part, href: previousPath };
  });
}
