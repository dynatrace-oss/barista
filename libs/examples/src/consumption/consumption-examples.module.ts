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
import { DtKeyValueListModule } from '@dynatrace/barista-components/key-value-list';
import { DtConsumptionModule } from '@dynatrace/barista-components/consumption';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtExampleConsumptionDefault } from './consumption-default-example/consumption-default-example';
import { DtExampleConsumptionError } from './consumption-error-example/consumption-error-example';
import { DtExampleConsumptionWarning } from './consumption-warning-example/consumption-warning-example';

@NgModule({
  imports: [
    CommonModule,
    DtKeyValueListModule,
    DtConsumptionModule,
    DtIconModule,
    DtFormattersModule,
  ],
  declarations: [
    DtExampleConsumptionDefault,
    DtExampleConsumptionError,
    DtExampleConsumptionWarning,
  ],
})
export class DtConsumptionExamplesModule {}
