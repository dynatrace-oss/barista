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
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleButtonColor } from './button-color-example/button-color-example';
import { DtExampleButtonDark } from './button-dark-example/button-dark-example';
import { DtExampleButtonDefault } from './button-default-example/button-default-example';
import { DtExampleButtonDisabled } from './button-disabled-example/button-disabled-example';
import { DtExampleButtonIconOnly } from './button-icon-only-example/button-icon-only-example';
import { DtExampleButtonIcons } from './button-icons-example/button-icons-example';
import { DtExampleButtonInteraction } from './button-interaction-example/button-interaction-example';
import { DtExampleButtonLoadingSpinner } from './button-loading-spinner-example/button-loading-spinner-example';
import { DtExampleButtonVariant } from './button-variant-example/button-variant-example';

@NgModule({
  imports: [
    DtButtonModule,
    DtIconModule,
    DtThemingModule,
    DtLoadingDistractorModule,
  ],
  declarations: [
    DtExampleButtonColor,
    DtExampleButtonDark,
    DtExampleButtonDefault,
    DtExampleButtonDisabled,
    DtExampleButtonIconOnly,
    DtExampleButtonIcons,
    DtExampleButtonInteraction,
    DtExampleButtonLoadingSpinner,
    DtExampleButtonVariant,
  ],
})
export class DtButtonExamplesModule {}
