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
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtExampleLoadingDistractorDefault } from './loading-distractor-default-example/loading-distractor-default-example';
import { DtExampleLoadingDistractorInput } from './loading-distractor-input-example/loading-distractor-input-example';
import { DtExampleLoadingDistractorSpinner } from './loading-distractor-spinner-example/loading-distractor-spinner-example';
import { DtInputModule } from '@dynatrace/barista-components/input';

@NgModule({
  imports: [DtLoadingDistractorModule, DtFormFieldModule, DtInputModule],
  declarations: [
    DtExampleLoadingDistractorDefault,
    DtExampleLoadingDistractorInput,
    DtExampleLoadingDistractorSpinner,
  ],
})
export class DtLoadingDistractorExamplesModule {}
