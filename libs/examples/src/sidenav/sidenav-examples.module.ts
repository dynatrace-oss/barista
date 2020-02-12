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
import { NgModule } from '@angular/core';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtExampleSidenavDefault } from './sidenav-default-example/sidenav-default-example';
import { DtExampleSidenavWithTopBarNavigation } from './sidenav-with-top-bar-navigation-example/sidenav-with-top-bar-navigation-example';
import { DtTopBarNavigationModule } from '@dynatrace/barista-components/top-bar-navigation';
import { DtIconModule } from '@dynatrace/barista-components/icon';

export const DT_SIDENAV_EXAMPLES = [
  DtExampleSidenavDefault,
  DtExampleSidenavWithTopBarNavigation,
];

@NgModule({
  imports: [
    DtDrawerModule,
    DtTopBarNavigationModule,
    DtIconModule.forRoot({ svgIconLocation: '/assets/icons/{{name}}.svg' }),
  ],
  declarations: [...DT_SIDENAV_EXAMPLES],
  entryComponents: [...DT_SIDENAV_EXAMPLES],
})
export class DtExamplesSidenavModule {}
