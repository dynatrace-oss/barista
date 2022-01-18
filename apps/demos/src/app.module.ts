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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtExpandablePanelModule } from '@dynatrace/barista-components/expandable-panel';
import { DtInputModule } from '@dynatrace/barista-components/input';

import { DtExamplesModule } from '@dynatrace/barista-examples';
import { DtDemosAppRoutingModule } from './app-routing.module';
import { DtDemosApp } from './app';
import { DtDemosSideNav } from './side-nav.component';
import { environment } from './environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtIconModule.forRoot({
      svgIconLocation: `${environment.deployUrl.replace(
        /\/+$/,
        '',
      )}/assets/icons/{{name}}.svg`,
    }),
    DtSelectModule,
    DtThemingModule,
    DtAutocompleteModule,
    DtExpandablePanelModule,
    DtDemosAppRoutingModule,
    DtExamplesModule,
    DtInputModule,
  ],
  declarations: [DtDemosApp, DtDemosSideNav],
  bootstrap: [DtDemosApp],
})
export class DtDemosAppModule {}
