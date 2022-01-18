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
import { DtEmptyStateModule } from '@dynatrace/barista-components/empty-state';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtCardModule } from '@dynatrace/barista-components/card';
import { DtTableModule } from '@dynatrace/barista-components/table';
import { DtExampleEmptyStateDefault } from './empty-state-default-example/empty-state-default-example';
import { DtExampleEmptyStateInCard } from './empty-state-in-card-example/empty-state-in-card-example';
import { DtExampleEmptyStateMultipleItems } from './empty-state-multiple-items-example/empty-state-multiple-items-example';
import { DtExampleEmptyStateMultipleItemsInCard } from './empty-state-multiple-items-in-card-example/empty-state-multiple-items-in-card-example';
import {
  DtExampleCustomEmptyStateTable,
  DtExampleCustomEmptyState,
} from './empty-state-custom-empty-state-table-example/empty-state-custom-empty-state-table-example';

@NgModule({
  imports: [
    DtEmptyStateModule,
    DtIconModule,
    DtButtonModule,
    DtCardModule,
    DtTableModule,
  ],
  declarations: [
    DtExampleEmptyStateDefault,
    DtExampleEmptyStateInCard,
    DtExampleEmptyStateMultipleItems,
    DtExampleEmptyStateMultipleItemsInCard,
    DtExampleCustomEmptyStateTable,
    DtExampleCustomEmptyState,
  ],
})
export class DtEmptyStateExamplesModule {}
