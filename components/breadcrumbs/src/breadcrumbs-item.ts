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

import { Directive, ElementRef } from '@angular/core';

/**
 * A breadcrumbs item that can be used within the `<dt-breadcrumbs>`.
 *
 *  @example
 *  <a dtBreadcrumbsItem href="/hosts">Hosts</a>
 */
@Directive({
  selector: 'a[dt-breadcrumbs-item], a[dtBreadcrumbsItem]',
  exportAs: 'dtBreadcrumbsItem',
  host: {
    class: 'dt-breadcrumbs-item',
  },
})
export class DtBreadcrumbsItem2 {
  constructor(private readonly _elementRef: ElementRef<HTMLAnchorElement>) {}

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
}
