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
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtCardModule } from '@dynatrace/barista-components/card';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleContextDialogActions } from './context-dialog-actions-example/context-dialog-actions-example';
import { DtExampleContextDialogCustomIcon } from './context-dialog-custom-icon-example/context-dialog-custom-icon-example';
import { DtExampleContextDialogDark } from './context-dialog-dark-example/context-dialog-dark-example';
import { DtExampleContextDialogDefault } from './context-dialog-default-example/context-dialog-default-example';
import { DtExampleContextDialogHeader } from './context-dialog-header-example/context-dialog-header-example';
import { DtExampleContextDialogFooter } from './context-dialog-footer-example/context-dialog-footer-example';
import { DtExampleContextDialogInteractive } from './context-dialog-interactive-example/context-dialog-interactive-example';
import { DtExampleContextDialogPreviousFocus } from './context-dialog-previous-focus-example/context-dialog-previous-focus-example';

@NgModule({
  imports: [
    CommonModule,
    DtContextDialogModule,
    DtButtonModule,
    DtCardModule,
    DtIconModule,
    DtThemingModule,
  ],
  declarations: [
    DtExampleContextDialogActions,
    DtExampleContextDialogCustomIcon,
    DtExampleContextDialogDark,
    DtExampleContextDialogDefault,
    DtExampleContextDialogHeader,
    DtExampleContextDialogInteractive,
    DtExampleContextDialogPreviousFocus,
    DtExampleContextDialogFooter,
  ],
})
export class DtContextDialogExamplesModule {}
