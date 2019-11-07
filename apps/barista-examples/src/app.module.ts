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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamplesAppDynatraceComponentsModule } from './dt.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { ExamplesModule } from './examples.module';
import { AppRoutingModule } from './app-routing.module';

import { App } from './app';
import { BaristaSideNav } from './side-nav.component';

import { environment } from './environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtIconModule.forRoot({ svgIconLocation: `${environment.deployUrl.replace(/\/+$/, '')}/assets/icons/{{name}}.svg` }),
    ExamplesAppDynatraceComponentsModule,
    AppRoutingModule,
    ExamplesModule,
  ],
  declarations: [
    App,
    BaristaSideNav,
  ],
  entryComponents: [
    App,
  ],
  bootstrap: [App],
})
export class AppModule { }
