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

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Event, NavigationEnd, Router } from '@angular/router';
import {
  BaContentTypes,
  BaPageLayoutType,
} from '@dynatrace/shared/barista-definitions';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  share,
  takeUntil,
} from 'rxjs/operators';
import {
  BaPageService,
  getPageKeyFromUrl,
  getUrlPathName,
} from '@dynatrace/shared/data-access-strapi';

const PAGE_THEME_MAP = new Map<string, string>([
  ['brand', 'purple'],
  ['resources', 'blue'],
  ['components', 'royalblue'],
  ['patterns', 'turquoise'],
]);

export const DEFAULT_PAGE_THEME = 'turquoise';

export interface BaBreadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'ba-app',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class BaApp implements OnInit, OnDestroy {
  /** @internal The stream that holds the current url after a navigation was triggered */
  _url$ = this._router.events.pipe(
    filter((event: Event) => event instanceof NavigationEnd),
    pluck('url'),
    distinctUntilChanged(),
    share(),
  );

  /** @internal The stream that holds the current breadcrumbs */
  _breadcrumbs$ = this._url$.pipe(
    map((url: string) => this._createBreadcrumbs(url)),
  );

  /** Subject used for bulk unsubscribing */
  private _destroy$ = new Subject<void>();

  constructor(
    private _pageService: BaPageService,
    private _router: Router,
    private _meta: Meta,
    private _title: Title,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnInit(): void {
    this._url$
      .pipe(
        map((url: string) => {
          const key = getPageKeyFromUrl(this._document, url);
          return this._pageService._cache.get(key);
        }),
        filter<BaContentTypes>(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe((page) => {
        this._setMeta(page);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Gets the page theme based on the current location. */
  _getPageTheme(): string {
    const path = this._router.url.substr(1);
    let pageTheme = DEFAULT_PAGE_THEME;
    if (path.length) {
      const firstPart = path.split('/')[0];
      pageTheme = PAGE_THEME_MAP.get(firstPart) || pageTheme;
    }
    return pageTheme;
  }

  /** @internal Generate Breadcrumbs based on the url */
  _createBreadcrumbs(url: string): BaBreadcrumb[] {
    const urlParts = getUrlPathName(this._document, url).split('/');

    let urlPart = '';
    return urlParts.map((part: string) => {
      urlPart = `${urlPart}/${part}`;
      return {
        label: part.replace(/\-/gm, ' '),
        url: urlPart,
      };
    });
  }

  /** Sets all the necessary meta tags to improve our SEO score. */
  private _setMeta(page: BaContentTypes): void {
    const pageTitle =
      page.layout === BaPageLayoutType.Index
        ? page.title
        : `Barista - ${page.title}`;

    const keywords = [
      'Dynatrace',
      'Barista',
      'Design System',
      'Open Source',
      ...(page.hasOwnProperty('tags') ? page['tags'] : []),
    ];

    const metaTags: MetaDefinition[] = [
      { property: 'og:url', content: this._router.url },
      { property: 'og:title', content: pageTitle },
      { property: 'keywords', content: keywords.join(', ') },
    ];

    if (page.description) {
      metaTags.push({ name: 'description', content: page.description });
    }

    metaTags.forEach((tag) => {
      this._meta.updateTag(tag);
    });

    this._title.setTitle(pageTitle);
  }
}
