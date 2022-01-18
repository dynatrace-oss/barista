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
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtConfirmationDialogModule } from '@dynatrace/barista-components/confirmation-dialog';
import { DtExampleConfirmationDialogDefault } from './confirmation-dialog-default-example/confirmation-dialog-default-example';
import { DtExampleConfirmationDialogShowBackdrop } from './confirmation-dialog-show-backdrop-example/confirmation-dialog-show-backdrop-example';

@NgModule({
  imports: [DtButtonModule, DtConfirmationDialogModule],
  declarations: [
    DtExampleConfirmationDialogDefault,
    DtExampleConfirmationDialogShowBackdrop,
  ],
})
export class DtConfirmationDialogExamplesModule {}
