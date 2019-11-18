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

import { Component, ViewChild } from '@angular/core';

import { DtDrawer } from '@dynatrace/barista-components/drawer';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-drawer-container class="drawer">
      <dt-drawer
        *ngIf="drawerPresent"
        #drawer
        [mode]="mode"
        [position]="position"
        opened
      >
        Drawer Content
      </dt-drawer>
      Main content
    </dt-drawer-container>

    <button dt-button (click)="addOrRemoveDrawer()">add / remove drawer</button>
    <button
      dt-button
      color="secondary"
      [disabled]="!drawerPresent"
      (click)="toggle()"
    >
      toggle drawer
    </button>
    <dt-form-field>
      <dt-label>Select drawer mode:</dt-label>
      <dt-select [(value)]="mode">
        <dt-option value="side" default>Side Mode</dt-option>
        <dt-option value="over">Over mode</dt-option>
      </dt-select>
    </dt-form-field>
    <dt-form-field>
      <dt-label>Select drawer position:</dt-label>
      <dt-select [(value)]="position">
        <dt-option value="start">Start</dt-option>
        <dt-option value="end">End</dt-option>
      </dt-select>
    </dt-form-field>
  `,
  styles: [
    `
      .drawer {
        height: 300px;
        border: 1px solid #cccccc;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class DrawerDynamicExample {
  drawerPresent = false;
  mode = 'side';
  position = 'start';
  @ViewChild('drawer', { static: false }) drawer: DtDrawer;

  addOrRemoveDrawer(): void {
    this.drawerPresent = !this.drawerPresent;
  }

  toggle(): void {
    this.drawer.toggle();
  }
}
