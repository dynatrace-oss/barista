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

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRouteSnapshot } from '@angular/router';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTopBarNavigationModule } from '@dynatrace/barista-components/top-bar-navigation';

import { PipesModule } from '../../pipes';
import { ThemesComponent } from './themes.component';
import { ThemeTileComponent } from './components/theme-tile/theme-tile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ThemesComponent },
      {
        path: ':theme',
        loadChildren: () =>
          import('../theme-detail/theme-detail.module').then(
            (module) => module.ThemeDetailModule,
          ),
        data: {
          themeResolver: (snapshot: ActivatedRouteSnapshot) =>
            snapshot.paramMap.get('theme'),
        },
      },
    ]),
    DtIconModule,
    DtTopBarNavigationModule,
    PipesModule,
  ],
  declarations: [ThemesComponent, ThemeTileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThemesModule {}
