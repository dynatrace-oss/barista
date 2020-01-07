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
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { CommonModule } from '@angular/common';
import { DtExampleTagDefault } from './tag-default-example/tag-default-example';
import { DtExampleTagInteractive } from './tag-interactive-example/tag-interactive-example';
import { DtExampleTagKey } from './tag-key-example/tag-key-example';
import { DtExampleTagListWithTagAdd } from './tag-list-with-tag-add-example/tag-list-with-tag-add-example';
import { DtExampleTagRemovable } from './tag-removable-example/tag-removable-example';

export const DT_TAG_EXAMPLES = [
  DtExampleTagDefault,
  DtExampleTagInteractive,
  DtExampleTagKey,
  DtExampleTagListWithTagAdd,
  DtExampleTagRemovable,
];
@NgModule({
  imports: [DtTagModule, DtButtonModule, CommonModule],
  declarations: [...DT_TAG_EXAMPLES],
  entryComponents: [...DT_TAG_EXAMPLES],
})
export class DtExamplesTagModule {}
