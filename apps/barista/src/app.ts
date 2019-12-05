/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { Component } from '@angular/core';
import { BaLocationService } from './shared/location.service';
import { BaPageService } from './shared/page.service';
import { map } from 'rxjs/operators';

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
export class BaApp {
  /**
   * @internal
   * The object containing all data needed to display the current page.
   */
  _currentPage$ = this.pageService.currentPage;

  /**
   * @internal
   * Observable of the current path.
   */
  _breadcrumbs$ = this.locationService.currentPath$.pipe(
    map((path: string) => {
      let previousPath = '';
      return path.split('/').map((part: string) => {
        previousPath = `${previousPath}/${part}`;
        part = part
          .split('-')
          .join(' ')
          .replace(part.charAt(0), part.charAt(0).toUpperCase());
        return { title: part, href: previousPath };
      });
    }),
  );

  /**
   * @internal
   * Whether Breadcrumb-Component is visible (only visible when at least two items would be shown)
   */
  _showBreadCrumb$ = this._breadcrumbs$.pipe(
    map((path: { title: string; href: string }[]) => path.length > 1),
  );

  /** @internal Gets the page theme based on the current location. */
  _pageTheme$ = this.locationService.currentPath$.pipe(
    map((path: string) => {
      let pageTheme = DEFAULT_PAGE_THEME;
      if (path.length) {
        const firstPart = path.split('/')[0];
        pageTheme = PAGE_THEME_MAP.get(firstPart) || pageTheme;
      }
      return pageTheme;
    }),
  );

  constructor(
    private pageService: BaPageService,
    private locationService: BaLocationService,
  ) {}

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
      return this.locationService.handleAnchorClick(
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
