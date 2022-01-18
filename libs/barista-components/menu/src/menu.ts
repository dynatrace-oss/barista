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

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

/**
 * A menu item which can either be part of a `<dt-menu-group>` or stand alone
 * within the `<dt-menu>` itself.
 *
 * Use `<a>` for navigation and `<button>` for custom actions. Visually there is
 * no difference between these two options. The `disabled` property is not
 * supported for menu items!
 *
 * @example
 *   <a href="/mypage" dtMenuItem>Problems</a>
 *   <button (click)="doSomething()" dtMenuItem>Do something</button>
 */
@Directive({
  selector:
    'a[dt-menu-item], button[dt-menu-item], a[dtMenuItem], button[dtMenuItem]',
  exportAs: 'dtMenuItem',
  host: {
    class: 'dt-menu-item',
    role: 'menuitem',
    cdkMonitorElementFocus: '',
  },
})
export class DtMenuItem implements OnDestroy {
  constructor(
    private readonly _focusMonitor: FocusMonitor,
    private readonly _elementRef: ElementRef<HTMLElement>,
  ) {
    this._focusMonitor.monitor(this._elementRef);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}

/**
 * A group of menu items with a label which is displayed as the header of
 * the group.
 *
 * @example
 *   <dt-menu-group label="Analyze">
 *     <a href="/problems" dtMenuItem>Problems</a>
 *     <a href="/usersessions" dtMenuItem>User sessions</a>
 *     <a href="/smartscape" dtMenuItem>Smartscape topology</a>
 *     <button (click)="doSomething()" dtMenuItem>Do something</button>
 *   </dt-menu-group>
 */
@Component({
  selector: 'dt-menu-group',
  template: `
    <div class="dt-menu-group-header">{{ label }}</div>
    <ng-content></ng-content>
  `,
  styleUrls: ['menu-group.scss'],
  host: {
    class: 'dt-menu-group',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMenuGroup {
  /** Label for the menu group. */
  @Input() label: string;
}

/**
 * A generic navigation menu that supports item groups as well
 * as individual items that do not belong to a group. It can be used as a
 * standalone component, in a `<dt-drawer>` or in a `<dt-context-dialog>`.
 */
@Component({
  selector: 'dt-menu',
  exportAs: 'dtMenu',
  template: '<ng-content></ng-content>',
  styleUrls: ['menu.scss'],
  host: {
    class: 'dt-menu',
    role: 'menubar',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMenu {}
