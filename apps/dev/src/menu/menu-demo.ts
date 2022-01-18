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

import { Component, ViewChild } from '@angular/core';

import { DtDrawer } from '@dynatrace/barista-components/drawer';

@Component({
  selector: 'demo-component',
  templateUrl: 'menu-demo.html',
  styleUrls: ['menu-demo.scss'],
})
export class MenuDemo {
  @ViewChild(DtDrawer, { static: true }) drawer: DtDrawer;

  toggle(): void {
    this.drawer.toggle();
  }

  doSomething(): void {
    window.alert('Did something!');
  }
}
