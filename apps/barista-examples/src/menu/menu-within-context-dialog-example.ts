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
    <dt-context-dialog
      aria-label="Show more details"
      aria-label-close-button="Close context dialog"
    >
      <dt-menu aria-label="Menu inside Popup Example">
        <dt-menu-group label="Dashboards & reports">
          <a routerLink="/dashboards" dtMenuItem>Dashboards</a>
          <a routerLink="/customchart" dtMenuItem>Create custom chart</a>
          <a routerLink="/reports" dtMenuItem>Reports</a>
          <button (click)="doSomething()" dtMenuItem>Something else</button>
        </dt-menu-group>

        <dt-menu-group label="Analyze">
          <a routerLink="/problems" dtMenuItem>Problems</a>
          <a routerLink="/usersessions" dtMenuItem>User sessions</a>
          <a routerLink="/smartscape" dtMenuItem>Smartscape topology</a>
          <a routerLink="/diagnostic" dtMenuItem>Diagnostic tools</a>
        </dt-menu-group>

        <a routerLink="/help" dtMenuItem>Item outside a group</a>
      </dt-menu>
    </dt-context-dialog>
  `,
})
export class MenuWithinContextDialogExample {
  doSomething(): void {
    // noop
  }
}
