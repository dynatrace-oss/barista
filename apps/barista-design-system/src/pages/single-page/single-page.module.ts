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
import { Route, RouterModule } from '@angular/router';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { BaComponentsModule, BA_CONTENT_COMPONENTS } from '../../components';
import { BaRecentlyOrderedService } from '../../shared/services/recently-ordered.service';
import { BaIconOverviewContent } from './components/icon-overview-content';
import { BaLazyIcon } from './components/lazy-icon';
import { BaPageFooter } from './components/page-footer';
import { BaPageHeader } from './components/page-header';
import { BaSidenav } from './components/sidenav';
import { BaToc } from './components/toc';
import { BaSinglePage } from './single-page';
import { BaScrollSpyService } from '../../shared/services/scroll-spy.service';
import {
  SharedDesignSystemUiModule,
  DS_CONTENT_COMPONENT_LIST_TOKEN,
  DsPageGuard,
} from '@dynatrace/shared/design-system/ui';

export const routes: Route[] = [
  {
    path: '',
    component: BaSinglePage,
    canActivate: [DsPageGuard],
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
    SharedDesignSystemUiModule,
  ],
  declarations: [
    BaSinglePage,
    BaPageFooter,
    BaPageHeader,
    BaIconOverviewContent,
    BaLazyIcon,
    BaSidenav,
    BaToc,
  ],
  providers: [
    BaRecentlyOrderedService,
    BaScrollSpyService,
    {
      provide: DS_CONTENT_COMPONENT_LIST_TOKEN,
      useValue: BA_CONTENT_COMPONENTS,
    },
  ],
})
export class BaSinglePageModule {}
