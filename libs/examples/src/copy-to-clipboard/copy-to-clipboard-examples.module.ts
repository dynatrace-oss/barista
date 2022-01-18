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
import { DtCopyToClipboardModule } from '@dynatrace/barista-components/copy-to-clipboard';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtAlertModule } from '@dynatrace/barista-components/alert';
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleCopyToClipboardCallback } from './copy-to-clipboard-callback-example/copy-to-clipboard-callback-example';
import { DtExampleCopyToClipboardContext } from './copy-to-clipboard-context-example/copy-to-clipboard-context-example';
import { DtExampleCopyToClipboardDark } from './copy-to-clipboard-dark-example/copy-to-clipboard-dark-example';
import { DtExampleCopyToClipboardDefault } from './copy-to-clipboard-default-example/copy-to-clipboard-default-example';
import { DtExampleCopyToClipboardError } from './copy-to-clipboard-error-example/copy-to-clipboard-error-example';
import { DtExampleCopyToClipboardTextarea } from './copy-to-clipboard-textarea-example/copy-to-clipboard-textarea-example';
import { DtExampleCopyToClipboardSecondaryButton } from './copy-to-clipboard-secondary-button-example/copy-to-clipboard-secondary-button-example';

@NgModule({
  imports: [
    CommonModule,
    DtCopyToClipboardModule,
    DtInputModule,
    DtAlertModule,
    DtContextDialogModule,
    DtThemingModule,
  ],
  declarations: [
    DtExampleCopyToClipboardCallback,
    DtExampleCopyToClipboardContext,
    DtExampleCopyToClipboardDark,
    DtExampleCopyToClipboardDefault,
    DtExampleCopyToClipboardError,
    DtExampleCopyToClipboardSecondaryButton,
    DtExampleCopyToClipboardTextarea,
  ],
})
export class DtCopyToClipboardExamplesModule {}
