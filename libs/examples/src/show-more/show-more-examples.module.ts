/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
import { DtShowMoreModule } from '@dynatrace/barista-components/show-more';
import { DtExampleShowMoreDefault } from './show-more-default-example/show-more-default-example';
import { DtExampleShowMoreNoText } from './show-more-notext-example/show-more-notext-example';
import { DtExampleShowMoreInteractive } from './show-more-interactive-example/show-more-interactive-example';
import { DtExampleShowMoreDisabled } from './show-more-disabled-example/show-more-disabled-example';
import { DtExampleShowMoreDark } from './show-more-dark-example/show-more-dark-example';
import { DtButtonModule } from '@dynatrace/barista-components/button';

export const DT_SHOW_MORE_EXAMPLES = [
  DtExampleShowMoreDefault,
  DtExampleShowMoreNoText,
  DtExampleShowMoreInteractive,
  DtExampleShowMoreDisabled,
  DtExampleShowMoreDark,
];

@NgModule({
  imports: [DtShowMoreModule, DtButtonModule],
  declarations: [...DT_SHOW_MORE_EXAMPLES],
  entryComponents: [...DT_SHOW_MORE_EXAMPLES],
})
export class DtExamplesShowMoreModule {}
