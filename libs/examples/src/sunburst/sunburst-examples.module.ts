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
import { DtSunburstModule } from '@dynatrace/barista-components/sunburst';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleSunburstDefault } from './sunburst-default-example/sunburst-default-example';

export const DT_ALERT_EXAMPLES = [DtExampleSunburstDefault];

@NgModule({
  imports: [DtSunburstModule, DtButtonModule, DtThemingModule],
  declarations: [...DT_ALERT_EXAMPLES],
  entryComponents: [...DT_ALERT_EXAMPLES],
})
export class DtSunburstExamplesModule {}
