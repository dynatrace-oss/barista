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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtButtonModule } from '@dynatrace/barista-components/button';

import { DtExampleFormFieldDefault } from './form-field-default-example/form-field-default-example';
import { DtExampleFormFieldErrorCustomValidator } from './form-field-error-custom-validator-example/form-field-error-custom-validator-example';
import { DtExampleFormFieldError } from './form-field-error-example/form-field-error-example';
import { DtExampleFormFieldHint } from './form-field-hint-example/form-field-hint-example';
import { DtExampleFormFieldPrefixSuffix } from './form-field-prefix-suffix-example/form-field-prefix-suffix-example';
import { DtExampleFormFieldServerValidation } from './form-field-server-validation/form-field-server-validation-example';
import { DtExampleFormFieldNonBoxControl } from './form-field-non-box-control-example/form-field-non-box-control-example';
import { DtAlertModule } from '@dynatrace/barista-components/alert';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtFormFieldModule,
    DtButtonModule,
    DtInputModule,
    DtIconModule,
    DtLoadingDistractorModule,
    DtAlertModule,
    DtThemingModule,
    DtCheckboxModule,
  ],
  declarations: [
    DtExampleFormFieldDefault,
    DtExampleFormFieldErrorCustomValidator,
    DtExampleFormFieldError,
    DtExampleFormFieldHint,
    DtExampleFormFieldPrefixSuffix,
    DtExampleFormFieldServerValidation,
    DtExampleFormFieldNonBoxControl,
  ],
})
export class DtFormFieldExamplesModule {}
