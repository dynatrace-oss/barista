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
import { NgModule } from '@angular/core';
import { DtExampleSwitchDefault } from './switch-default-example/switch-default-example';
import { DtExampleSwitchDark } from './switch-dark-example/switch-dark-example';
import { DtExampleSwitchResponsive } from './switch-responsive-example/switch-responsive-example';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtSwitchModule } from '@dynatrace/barista-components/switch';

@NgModule({
  imports: [DtSwitchModule, DtThemingModule],
  declarations: [
    DtExampleSwitchDefault,
    DtExampleSwitchDark,
    DtExampleSwitchResponsive,
  ],
})
export class DtExamplesSwitchModule {}
