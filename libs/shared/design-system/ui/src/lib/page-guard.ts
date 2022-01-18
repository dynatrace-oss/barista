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

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { DsPageService, getUrlPathName } from './page.service';

@Injectable()
export class DsPageGuard implements CanActivate {
  constructor(
    private _pageService: DsPageService,
    private _router: Router,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  /** Checks whether a given route can be navigated to */
  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const url = getUrlPathName(this._document, state.url);
    return this._pageService._getPage(url).pipe(
      catchError((error) => {
        console.error(error);
        this._router.navigate(['not-found']);
        return of(false);
      }),
      mapTo(true),
    );
  }
}
