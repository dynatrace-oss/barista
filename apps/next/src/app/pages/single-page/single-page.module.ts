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
import { NgModule, Type } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  BaPageGuard,
  BaPageService,
} from '@dynatrace/shared/data-access-strapi';
import { NextSinglePage } from './single-page';
import {
  SharedDesignSystemUiModule,
  DS_CONTENT_COMPONENT_LIST_TOKEN,
} from '@dynatrace/shared/design-system/ui';
import { NextPageFooter } from './components/page-footer';

export const routes: Route[] = [
  {
    path: '',
    component: NextSinglePage,
    canActivate: [BaPageGuard],
  },
];

export const DS_CONTENT_TYPES: Type<unknown>[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedDesignSystemUiModule,
  ],
  declarations: [NextSinglePage, NextPageFooter],
  providers: [
    BaPageGuard,
    BaPageService,
    {
      provide: DS_CONTENT_COMPONENT_LIST_TOKEN,
      useValue: DS_CONTENT_TYPES,
    },
  ],
})
export class NextSinglePageModule {}
