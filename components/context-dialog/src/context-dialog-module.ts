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

import {
  DT_DEFAULT_UI_TEST_CONFIG,
  DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
} from 'components/core/src/testing';

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtContextDialog } from './context-dialog';
import { DtContextDialogHeader } from './header/context-dialog-header';
import { DtContextDialogHeaderTitle } from './header/context-dialog-header-title';
import { DtContextDialogTrigger } from './context-dialog-trigger';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

const EXPORTED_DECLARATIONS = [
  DtContextDialog,
  DtContextDialogTrigger,
  DtContextDialogHeader,
  DtContextDialogHeaderTitle,
];

@NgModule({
  imports: [
    CommonModule,
    DtButtonModule,
    DtThemingModule,
    OverlayModule,
    A11yModule,
    DtIconModule,
  ],
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...EXPORTED_DECLARATIONS],
  providers: [
    {
      provide: DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
      useValue: DT_DEFAULT_UI_TEST_CONFIG,
    },
  ],
})
export class DtContextDialogModule {}
