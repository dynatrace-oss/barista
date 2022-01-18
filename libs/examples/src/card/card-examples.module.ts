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
import { DtCardModule } from '@dynatrace/barista-components/card';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtExampleCardActionButtons } from './card-action-buttons-example/card-action-buttons-example';
import { DtExampleCardDark } from './card-dark-example/card-dark-example';
import { DtExampleCardDefault } from './card-default-example/card-default-example';
import { DtExampleCardFooterActions } from './card-footer-actions-example/card-footer-actions-example';
import { DtExampleCardIcon } from './card-icon-example/card-icon-example';
import { DtExampleCardSubtitle } from './card-subtitle-example/card-subtitle-example';

@NgModule({
  imports: [DtCardModule, DtIconModule, DtThemingModule, DtButtonModule],
  declarations: [
    DtExampleCardActionButtons,
    DtExampleCardDark,
    DtExampleCardDefault,
    DtExampleCardFooterActions,
    DtExampleCardIcon,
    DtExampleCardSubtitle,
  ],
})
export class DtCardExamplesModule {}
