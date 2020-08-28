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

const LOCAL_STORAGE_THEME_KEY = 'fluid-theme';

import { Component, OnInit } from '@angular/core';
import '@dynatrace/fluid-elements/design-system-provider';

@Component({
  selector: 'fluid-dev-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** @internal The current global theme */
  _theme: string = 'abyss';

  /** @internal The current global layout density */
  _layoutDensity: string = 'default';

  ngOnInit(): void {
    this._theme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) ?? 'abyss';
  }

  /** @internal Saves the theme in LocalStorage when changed to avoid reset on auto reload */
  _themeChanged(theme: string): void {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }
}
