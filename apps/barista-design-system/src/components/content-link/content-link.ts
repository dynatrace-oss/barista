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

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The ba-content link component is used because we need to dynamically
 * instanciate a router link and this is not possible, because it is a directive.
 */
@Component({
  selector: 'a[contentLink]',
  template: '<ng-content></ng-content>',
  styles: ['a:hover { cursor: pointer; }'],
  host: {
    '[href]': 'contentLink',
    '[attr.contentlink]': 'contentLink',
    '(click)': 'onClick($event)',
  },
})
export class BaContentLink {
  /** Absolute url for navigation on the page. For example /components/button */
  @Input() contentLink: string;

  /** QueryParams of absolute url */
  @Input() queryParams: { [key: string]: string };

  /** Fragment of absolute url */
  @Input() fragment: string;

  constructor(private _router: Router) {}

  onClick(event: MouseEvent): boolean {
    // Check if the click happens on a button or with some control keys pressed and let the
    // click event bubble to let consumers or the browser handle the event.
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return true;
    }
    this._router.navigate([this.contentLink], {
      fragment: this.fragment,
      queryParams: this.queryParams,
    });
    return false;
  }
}
