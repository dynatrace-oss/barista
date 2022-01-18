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
import { BehaviorSubject } from 'rxjs';

import { DtDrawer } from '@dynatrace/barista-components/drawer';

@Component({
  selector: 'dt-example-top-bar-navigation-drawer-barista',
  templateUrl: 'top-bar-navigation-drawer-example.html',
  styleUrls: ['top-bar-navigation-drawer-example.scss'],
})
export class DtExampleTopBarNavigationDrawer {
  @ViewChild(DtDrawer, { static: true }) drawer: DtDrawer;

  problems = 60;
  showHamburger = new BehaviorSubject(true);

  openDrawer(): void {
    this.drawer.open();
    this.showHamburger.next(false);
  }

  closeDrawer(): void {
    this.drawer.close();
    this.showHamburger.next(true);
  }
}
