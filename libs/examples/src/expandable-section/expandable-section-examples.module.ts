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
import { DtExpandableSectionModule } from '@dynatrace/barista-components/expandable-section';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtExampleExpandableSectionDark } from './expandable-section-dark-example/expandable-section-dark-example';
import { DtExampleExpandableSectionDefault } from './expandable-section-default-example/expandable-section-default-example';
import { DtExampleExpandableSectionDisabled } from './expandable-section-disabled-example/expandable-section-disabled-example';
import { DtExampleExpandableSectionInteractive } from './expandable-section-interactive-example/expandable-section-interactive-example';
import { DtExampleExpandableSectionOpen } from './expandable-section-open-example/expandable-section-open-example';

@NgModule({
  imports: [DtExpandableSectionModule, DtThemingModule, DtButtonModule],
  declarations: [
    DtExampleExpandableSectionDark,
    DtExampleExpandableSectionDefault,
    DtExampleExpandableSectionDisabled,
    DtExampleExpandableSectionInteractive,
    DtExampleExpandableSectionOpen,
  ],
})
export class DtExpandableSectionExamplesModule {}
