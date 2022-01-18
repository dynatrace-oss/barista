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

import { DtExampleKeyValueListDefault } from './key-value-list-default-example/key-value-list-default-example';
import { DtExampleKeyValueListLongtext } from './key-value-list-longtext-example/key-value-list-longtext-example';
import { DtExampleKeyValueListMulticolumn } from './key-value-list-multicolumn-example/key-value-list-multicolumn-example';

@NgModule({
  imports: [CommonModule, DtKeyValueListModule],
  declarations: [
    DtExampleKeyValueListDefault,
    DtExampleKeyValueListLongtext,
    DtExampleKeyValueListMulticolumn,
  ],
})
export class DtKeyValueListExamplesModule {}
