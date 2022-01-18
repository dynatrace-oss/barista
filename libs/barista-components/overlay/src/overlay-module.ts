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

import { A11yModule } from '@angular/cdk/a11y';
import {
  OverlayModule,
  OverlayContainer,
  FullscreenOverlayContainer,
} from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtThemingModule } from '@dynatrace/barista-components/theming';

import { DtOverlayContainer } from './overlay-container';
import { DtOverlayTrigger } from './overlay-trigger';

const EXPORTED_DECLARATIONS = [DtOverlayContainer, DtOverlayTrigger];

@NgModule({
  imports: [
    CommonModule,
    DtButtonModule,
    DtThemingModule,
    OverlayModule,
    PortalModule,
    A11yModule,
  ],
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...EXPORTED_DECLARATIONS],
  providers: [
    { provide: OverlayContainer, useExisting: FullscreenOverlayContainer },
  ],
})
export class DtOverlayModule {}
