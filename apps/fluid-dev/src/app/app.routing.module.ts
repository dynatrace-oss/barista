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

export const fluidRoutes: Route[] = [
  {
    path: 'button',
    loadChildren: () =>
      import('../pages/button/button-page.module').then(
        (module) => module.FluidButtonPageModule,
      ),
  },
  {
    path: 'button-group',
    loadChildren: () =>
      import('../pages/button-group/button-group-page.module').then(
        (module) => module.FluidButtonGroupPageModule,
      ),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('../pages/checkbox/checkbox-page.module').then(
        (module) => module.FluidCheckboxPageModule,
      ),
  },
  {
    path: 'popover',
    loadChildren: () =>
      import('../pages/popover/popover-page.module').then(
        (module) => module.FluidPopoverPageModule,
      ),
  },
  {
    path: 'switch',
    loadChildren: () =>
      import('../pages/switch/switch-page.module').then(
        (module) => module.FluidSwitchPageModule,
      ),
  },
  {
    path: 'tab',
    loadChildren: () =>
      import('../pages/tab/tab-page.module').then(
        (module) => module.FluidTabPageModule,
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(fluidRoutes, {
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
export class FluidRoutingModule {}
