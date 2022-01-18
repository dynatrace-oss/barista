/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtError } from './error';
import { DtFormField } from './form-field';
import { DtHint } from './hint';
import { DtLabel } from './label';
import { DtPrefix } from './prefix';
import { DtSuffix } from './suffix';
import { DtFormFieldControl } from './form-field-control';

@NgModule({
  imports: [CommonModule, PlatformModule],
  exports: [DtFormField, DtLabel, DtHint, DtError, DtPrefix, DtSuffix],
  declarations: [
    DtFormField,
    DtLabel,
    DtHint,
    DtError,
    DtPrefix,
    DtSuffix,
    // @breaking-change Will be removed with upgrade to ivy for libraries
    // can be removed once `DtFormFieldControl` is turned into a selector-less directive.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DtFormFieldControl as any,
  ],
})
export class DtFormFieldModule {}
