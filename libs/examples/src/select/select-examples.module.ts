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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtExampleSelectComplexValue } from './select-complex-value-example/select-complex-value-example';
import { DtExampleSelectCustomValueTemplate } from './select-custom-value-template-example/select-custom-value-template-example';
import { DtExampleSelectDefault } from './select-default-example/select-default-example';
import { DtExampleSelectDisabled } from './select-disabled-example/select-disabled-example';
import { DtExampleSelectFormField } from './select-form-field-example/select-form-field-example';
import { DtExampleSelectForms } from './select-forms-example/select-forms-example';
import { DtExampleSelectGroups } from './select-groups-example/select-groups-example';
import { DtExampleSelectWithIcons } from './select-with-icons-example/select-with-icons-example';
import { DtExampleSelectValue } from './select-value-example/select-value-example';

@NgModule({
  imports: [
    DtSelectModule,
    DtButtonModule,
    DtIconModule,
    DtFormFieldModule,
    CommonModule,
    FormsModule,
    DtCheckboxModule,
  ],
  declarations: [
    DtExampleSelectComplexValue,
    DtExampleSelectDefault,
    DtExampleSelectDisabled,
    DtExampleSelectFormField,
    DtExampleSelectForms,
    DtExampleSelectGroups,
    DtExampleSelectValue,
    DtExampleSelectWithIcons,
    DtExampleSelectCustomValueTemplate,
  ],
})
export class DtExamplesSelectModule {}
