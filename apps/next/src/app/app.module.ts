/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Nav } from './components/nav';
import { NextRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import {
  BaPageGuard,
  BaPageService,
} from '@dynatrace/shared/data-access-strapi';

@NgModule({
  declarations: [AppComponent, Nav],
  imports: [BrowserModule, HttpClientModule, NextRoutingModule],
  providers: [BaPageGuard, BaPageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
