/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { Route, RouterModule } from '@angular/router';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { BaComponentsModule } from '../../components';
import { BaPageGuard } from 'libs/shared/data-access-strapi/src/lib/page-guard';
import { BaRecentlyOrderedService } from '../../shared/services/recently-ordered.service';
import { BaContributors } from './components/contributors';
import { BaIconOverviewContent } from './components/icon-overview-content';
import { BaLazyIcon } from './components/lazy-icon';
import { BaPageFooter } from './components/page-footer';
import { BaPageHeader } from './components/page-header';
import { BaSidenav } from './components/sidenav';
import { BaToc } from './components/toc';
import { BaPageContent } from './page-content';
import { BaSinglePage } from './single-page';
import { BaTocService } from '../../shared/services/toc.service';
import { BaScrollSpyService } from '../../shared/services/scroll-spy.service';

export const routes: Route[] = [
  {
    path: '',
    component: BaSinglePage,
    canActivate: [BaPageGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BaComponentsModule,
    DtTagModule,
    DtFormFieldModule,
    DtInputModule,
    DtIconModule,
  ],
  declarations: [
    BaSinglePage,
    BaPageContent,
    BaPageFooter,
    BaPageHeader,
    BaIconOverviewContent,
    BaContributors,
    BaLazyIcon,
    BaSidenav,
    BaToc,
  ],
  providers: [BaRecentlyOrderedService, BaScrollSpyService, BaTocService],
})
export class BaSinglePageModule {}
