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

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtSwitchModule } from '@dynatrace/barista-components/switch';
import { BaColor } from './color-component/color';
import { BaColorGrid } from './color-grid/color-grid';
import { BaContentLink } from './content-link/content-link';
import { BaHeadlineLink } from './headline-link/headline-link';
import { BaIconColorWheel } from './icon-color-wheel/icon-color-wheel';
import { BaLayoutGrid } from './layout-grid/layout-grid';
import { BaLayoutGridItem } from './layout-grid/layout-grid-item';
import { BaLiveExample } from './live-example/live-example';

/**
 * The order of the following components is relevant in case they are nested.
 * Inner components must be instantiated first. This is why the grid-item
 * comes before the grid and the grid before the color-grid.
 */
export const BA_CONTENT_COMPONENTS: Type<unknown>[] = [
  BaIconColorWheel,
  BaLiveExample,
  BaHeadlineLink,
  BaColor,
  BaColorGrid,
  BaContentLink,
  BaLayoutGridItem,
  BaLayoutGrid,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ClipboardModule,
    DtSwitchModule,
    DtOverlayModule,
    DtIconModule,
    DtButtonModule,
  ],
  declarations: [...BA_CONTENT_COMPONENTS],
})
export class BaComponentsModule {}
