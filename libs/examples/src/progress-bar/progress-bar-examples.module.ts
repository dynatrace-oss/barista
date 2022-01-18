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
import { DtProgressBarModule } from '@dynatrace/barista-components/progress-bar';
import { CommonModule } from '@angular/common';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';

import { DtExampleProgressBarChange } from './progress-bar-change-example/progress-bar-change-example';
import { DtExampleProgressBarDark } from './progress-bar-dark-example/progress-bar-dark-example';
import { DtExampleProgressBarDefault } from './progress-bar-default-example/progress-bar-default-example';
import { DtExampleProgressBarRightAligned } from './progress-bar-right-aligned-example/progress-bar-right-aligned-example';
import { DtExampleProgressBarWithColor } from './progress-bar-with-color-example/progress-bar-with-color-example';
import { DtExampleProgressBarWithCountAndDescription } from './progress-bar-with-count-and-description-example/progress-bar-with-count-and-description-example';
import { DtExampleProgressBarWithCountAndDescriptionIndicator } from './progress-bar-with-count-and-description-indicator-example/progress-bar-with-count-and-description-indicator-example';
import { DtExampleProgressBarWithDescription } from './progress-bar-with-description-example/progress-bar-with-description-example';
import { DtExampleProgressBarWithCount } from './progress-bar-with-count-example/progress-bar-with-count-example';

@NgModule({
  imports: [
    CommonModule,
    DtButtonModule,
    DtProgressBarModule,
    DtThemingModule,
    DtIndicatorModule,
    DtButtonGroupModule,
  ],
  declarations: [
    DtExampleProgressBarChange,
    DtExampleProgressBarDark,
    DtExampleProgressBarDefault,
    DtExampleProgressBarRightAligned,
    DtExampleProgressBarWithColor,
    DtExampleProgressBarWithCountAndDescription,
    DtExampleProgressBarWithCountAndDescriptionIndicator,
    DtExampleProgressBarWithCount,
    DtExampleProgressBarWithDescription,
  ],
})
export class DtProgressBarExamplesModule {}
