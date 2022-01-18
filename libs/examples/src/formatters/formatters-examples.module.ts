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
import { FormsModule } from '@angular/forms';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtInputModule } from '@dynatrace/barista-components/input';

import { DtExampleFormattersBits } from './formatters-bits-example/formatters-bits-example';
import { DtExampleFormattersBytes } from './formatters-bytes-example/formatters-bytes-example';
import { DtExampleFormattersCount } from './formatters-count-example/formatters-count-example';
import { DtExampleFormattersPercent } from './formatters-percent-example/formatters-percent-example';
import { DtExampleFormattersRate } from './formatters-rate-example/formatters-rate-example';
import { DtExampleFormattersDuration } from './formatters-duration-example/formatters-duration-example';

@NgModule({
  imports: [FormsModule, DtFormattersModule, DtFormFieldModule, DtInputModule],
  declarations: [
    DtExampleFormattersBits,
    DtExampleFormattersBytes,
    DtExampleFormattersCount,
    DtExampleFormattersPercent,
    DtExampleFormattersRate,
    DtExampleFormattersDuration,
  ],
})
export class DtFormattersExamplesModule {}
