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

import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextErrorPage } from './pages/error-page/error-page';

export const nextRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/index-page/index-page.module').then(
        (module) => module.NextIndexPageModule,
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/single-page/next-single-page.module').then(
        (module) => module.NextSinglePageModule,
      ),
  },
];

@NgModule({
  declarations: [NextErrorPage],
  imports: [
    CommonModule,
    RouterModule.forRoot(nextRoutes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      paramsInheritanceStrategy: 'always',
      enableTracing: false, // Can be set for debugging the router
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class NextRoutingModule {}
