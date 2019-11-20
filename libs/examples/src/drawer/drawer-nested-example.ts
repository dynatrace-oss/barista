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
  selector: 'component-barista-example',
  template: `
    <dt-drawer-container class="drawer">
      <dt-drawer #outerDrawer mode="side">
        Outer drawer content
      </dt-drawer>

      <h2>Hosting units</h2>
      <p>There can be some text before the second drawer will appear</p>

      <dt-drawer-container class="inner-drawer">
        <dt-drawer #innerDrawer mode="over" position="end">
          Inner drawer content
        </dt-drawer>

        I'm the content of the
        <b>inner</b>
        drawer
        <button dt-button (click)="innerDrawer.toggle()">
          Toggle inner drawer
        </button>
      </dt-drawer-container>

      I'm the content of the
      <b>outer</b>
      drawer
    </dt-drawer-container>

    <button dt-button (click)="outerDrawer.toggle()">
      Toggle outer drawer
    </button>
  `,
  styles: [
    `
      .drawer {
        border: 1px solid #cccccc;
        margin-bottom: 20px;
      }
      .inner-drawer {
        height: 200px;
        border: 1px solid #cccccc;
        margin: 20px 0;
      }
    `,
  ],
})
export class DrawerNestedExample {}
