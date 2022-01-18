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
import { DtExampleTreeTableAsyncShowMore } from './tree-table-async-show-more-example/tree-table-async-show-more-example';
import { DtExampleTreeTableDefault } from './tree-table-default-example/tree-table-default-example';
import { DtExampleTreeTableProblemIndicator } from './tree-table-problem-indicator-example/tree-table-problem-indicator-example';
import { DtExampleTreeTableSimple } from './tree-table-simple-example/tree-table-simple-example';
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';
import { DtTreeTableModule } from '@dynatrace/barista-components/tree-table';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInfoGroupModule } from '@dynatrace/barista-components/info-group';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtProgressBarModule } from '@dynatrace/barista-components/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    DtTreeTableModule,
    DtIconModule,
    DtContextDialogModule,
    DtInfoGroupModule,
    DtIndicatorModule,
    DtButtonModule,
    DtProgressBarModule,
  ],
  declarations: [
    DtExampleTreeTableSimple,
    DtExampleTreeTableAsyncShowMore,
    DtExampleTreeTableDefault,
    DtExampleTreeTableProblemIndicator,
  ],
})
export class DtExamplesTreeTableModule {}
