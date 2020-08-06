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

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../theme.service';
import { DsPageService } from '@dynatrace/shared/design-system/ui';
import { map } from 'rxjs/operators';

@Component({
  selector: 'next-nav',
  templateUrl: 'nav.html',
  styleUrls: ['nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'next-nav',
  },
})
export class Nav {
  /** @internal Data needed to render the navigation. */
  _navData$ = this._pageService.getCategories().pipe(
    map((data) =>
      data.map((category) => ({
        section: category,
        link: category.toLowerCase(),
      })),
    ),
  );
  constructor(
    public _themeService: ThemeService,
    private _pageService: DsPageService,
  ) {}
}
