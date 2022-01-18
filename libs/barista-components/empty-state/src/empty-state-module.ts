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

import { DtIconModule } from '@dynatrace/barista-components/icon';

import {
  DtEmptyState,
  DtEmptyStateFooterActions,
  DtEmptyStateItem,
  DtEmptyStateItemImage,
  DtEmptyStateItemTitle,
  DtCustomEmptyState,
} from './empty-state';

const EMPTY_STATE_DIRECTIVES = [
  DtEmptyState,
  DtEmptyStateItem,
  DtEmptyStateItemImage,
  DtEmptyStateItemTitle,
  DtEmptyStateFooterActions,
  DtCustomEmptyState,
];

@NgModule({
  exports: [EMPTY_STATE_DIRECTIVES],
  declarations: [EMPTY_STATE_DIRECTIVES],
  imports: [DtIconModule],
})
export class DtEmptyStateModule {}
