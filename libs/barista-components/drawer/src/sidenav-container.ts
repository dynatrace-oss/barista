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

import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { DT_DRAWER_CONTAINER } from './drawer';
import { DtDrawerContainer } from './drawer-container';
import { DtSidenav } from './sidenav';

@Component({
  selector: 'dt-sidenav-container',
  exportAs: 'dtSidenavContainer',
  templateUrl: 'drawer-container.html',
  styleUrls: ['drawer-container.scss'],
  host: {
    class: 'dt-drawer-container dt-sidenav-container',
    '(keydown)': '_handleKeyboardEvent($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DT_DRAWER_CONTAINER,
      useExisting: DtSidenavContainer,
    },
  ],
})
export class DtSidenavContainer extends DtDrawerContainer {
  @ContentChildren(DtSidenav) protected _drawers: QueryList<DtSidenav>;
}
