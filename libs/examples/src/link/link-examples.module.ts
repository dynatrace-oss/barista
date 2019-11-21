/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleLinkDark } from './link-dark-example/link-dark-example';
import { DtExampleLinkExternal } from './link-external-example/link-external-example';
import { DtExampleLinkNotification } from './link-notification-example/link-notification-example';
import { DtExampleLinkSimple } from './link-simple-example/link-simple-example';

export const DT_LINK_EXAMPLES = [
  DtExampleLinkDark,
  DtExampleLinkExternal,
  DtExampleLinkNotification,
  DtExampleLinkSimple,
];

@NgModule({
  imports: [DtThemingModule],
  declarations: [...DT_LINK_EXAMPLES],
  entryComponents: [...DT_LINK_EXAMPLES],
})
export class DtLinkExamplesModule {}
