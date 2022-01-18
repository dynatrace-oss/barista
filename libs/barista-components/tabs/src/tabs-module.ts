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

import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtColorModule } from '@dynatrace/barista-components/core';

import { DtTabGroupNavigation } from './navigation/tab-group-navigation';
import { DtTabGroup } from './tab-group';
import { DtTab } from './tab/tab';
import { DtTabBody, DtTabBodyPortalOutlet } from './tab/tab-body';
import { DtTabContent } from './tab/tab-content';
import { DtTabLabel } from './tab/tab-label';

const DIRECTIVES = [
  DtTabGroup,
  DtTab,
  DtTabLabel,
  DtTabContent,
  DtTabBody,
  DtTabBodyPortalOutlet,
  DtTabGroupNavigation,
];

@NgModule({
  imports: [A11yModule, CommonModule, PortalModule, DtColorModule],
  exports: DIRECTIVES,
  declarations: DIRECTIVES,
})
export class DtTabsModule {}
