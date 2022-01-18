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

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtE2EApp } from './app.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [DtE2EApp],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DtIconModule.forRoot({ svgIconLocation: '/assets/icons/{{name}}.svg' }),
    DtOverlayModule,
    AppRoutingModule,
  ],
  bootstrap: [DtE2EApp],
})
export class DtE2EAppModule {}
