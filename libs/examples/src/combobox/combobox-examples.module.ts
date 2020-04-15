/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { DtComboboxModule } from '@dynatrace/barista-components/experimental/combobox';
import { DtExampleComboboxSimple } from './combobox-simple-example/combobox-simple-example';
import { DtOptionModule } from '@dynatrace/barista-components/core';
import { CommonModule } from '@angular/common';

export const DT_COMBOBOX_EXAMPLES = [DtExampleComboboxSimple];

@NgModule({
  imports: [DtComboboxModule, DtOptionModule, CommonModule],
  declarations: [...DT_COMBOBOX_EXAMPLES],
  entryComponents: [...DT_COMBOBOX_EXAMPLES],
})
export class DtComboboxExamplesModule {}
