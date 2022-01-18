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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtExpandablePanelModule } from '@dynatrace/barista-components/expandable-panel';
import { DtSecondaryNav, DtSecondaryNavTitle } from './secondary-nav';
import {
  DtSecondaryNavSection,
  DtSecondaryNavSectionTitle,
  DtSecondaryNavSectionDescription,
} from './section/secondary-nav-section';
import { DtSecondaryNavGroup } from './section/secondary-nav-group';
import {
  DtSecondaryNavLink,
  DtSecondaryNavLinkActive,
} from './section/secondary-nav-link';

const EXPORTED_DECLARATIONS = [
  DtSecondaryNav,
  DtSecondaryNavLink,
  DtSecondaryNavGroup,
  DtSecondaryNavTitle,
  DtSecondaryNavSection,
  DtSecondaryNavLinkActive,

  DtSecondaryNavSectionTitle,
  DtSecondaryNavSectionDescription,
];

@NgModule({
  imports: [CommonModule, DtIconModule, DtExpandablePanelModule],
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtSecondaryNavModule {}
