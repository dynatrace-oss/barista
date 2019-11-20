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

import { Component } from '@angular/core';

@Component({
  selector: 'top-bar-navigation-barista-example',
  template: `
    <dt-top-bar-navigation aria-label="Main">
      <dt-top-bar-navigation-item align="start">
        <a routerLink="" dtTopBarAction>
          <dt-icon name="menu-hamburger"></dt-icon>
        </a>
      </dt-top-bar-navigation-item>

      <dt-top-bar-navigation-item align="end">
        <button dtTopBarAction>my button</button>
      </dt-top-bar-navigation-item>

      <dt-top-bar-navigation-item align="end" *ngIf="problems > 0">
        <a href="" dtTopBarAction hasProblem>{{ problems }}</a>
      </dt-top-bar-navigation-item>

      <dt-top-bar-navigation-item align="end">
        <button dtTopBarAction><dt-icon name="user-uem"></dt-icon></button>
      </dt-top-bar-navigation-item>
    </dt-top-bar-navigation>
  `,
})
export class TopBarNavigationDefaultExample {
  problems = 61;
}
