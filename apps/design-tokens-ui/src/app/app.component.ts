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

import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'design-tokens-ui-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  /** @internal */
  _breadcrumbs: Breadcrumb[] = [];

  private _destroy$ = new Subject<void>();

  constructor(router: Router) {
    router.events
      .pipe(
        takeUntil(this._destroy$),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(
        (event: NavigationEnd) =>
          (this._breadcrumbs = this._createBreadcrumbs(event.url)),
      );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Generate Breadcrumbs based on the url */
  _createBreadcrumbs(url: string): Breadcrumb[] {
    const urlParts = url.substring(1).split('/');

    let urlPart = '';
    return urlParts.map((part: string) => {
      urlPart = `${urlPart}/${part}`;
      return {
        label: decodeURIComponent(part.replace(/\-/gm, ' ')),
        url: urlPart,
      };
    });
  }
}

interface Breadcrumb {
  label: string;
  url: string;
}
