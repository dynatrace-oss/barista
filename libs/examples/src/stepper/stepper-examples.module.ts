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
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtStepperModule } from '@dynatrace/barista-components/stepper';
import { DtExampleStepperDefault } from './stepper-default-example/stepper-default-example';
import { DtExampleStepperEditable } from './stepper-editable-example/stepper-editable-example';
import { DtExampleStepperLinear } from './stepper-linear-example/stepper-linear-example';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtButtonModule } from '@dynatrace/barista-components/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtStepperModule,
    DtCheckboxModule,
    DtFormFieldModule,
    DtInputModule,
    DtSelectModule,
    DtButtonModule,
  ],
  declarations: [
    DtExampleStepperDefault,
    DtExampleStepperEditable,
    DtExampleStepperLinear,
  ],
})
export class DtExamplesStepperModule {}
