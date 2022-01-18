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

import { ModuleWithProviders, NgModule } from '@angular/core';

import { DtIcon } from './icon';
import { DT_ICON_CONFIGURATION, DtIconConfiguration } from './icon-config';

@NgModule({
  exports: [DtIcon],
  declarations: [DtIcon],
})
export class DtIconModule {
  /** Returns an icon module to be applied just in the root context. */
  static forRoot(
    config: DtIconConfiguration,
  ): ModuleWithProviders<DtIconModule> {
    return {
      ngModule: DtIconModule,
      providers: [{ provide: DT_ICON_CONFIGURATION, useValue: config }],
    };
  }
}
