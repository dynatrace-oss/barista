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

import { Component, OnInit } from '@angular/core';
import { BaLocationService } from './shared/location.service';
import { BaSinglePageContent } from '@dynatrace/barista-components/barista-definitions';
import { BaPageService } from './shared/page.service';

@Component({
  selector: 'ba-app',
  templateUrl: 'app.html',
  host: {
    '(click)':
      '_handleClick($event.target, $event.button, $event.ctrlKey, $event.metaKey)',
  },
})
export class BaApp implements OnInit {
  /**
   * @internal
   * The object containing all data needed to display the current page.
   */
  _currentPage: BaSinglePageContent;

  constructor(
    private pageService: BaPageService,
    private locationService: BaLocationService,
  ) {}

  ngOnInit(): void {
    this.pageService.currentPage.subscribe(page => (this._currentPage = page));
  }

  /**
   * @interal
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
