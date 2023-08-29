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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { <%= componentModule.name %> } from '<%= componentModule.package %>';
import { <%= e2eComponent.component %> } from './<%= dasherize(name) %>';

const routes: Route[] = [{ path: '', component: <%= e2eComponent.component %> }];

@NgModule({
  declarations: [<%= e2eComponent.component %>],
  imports: [CommonModule, RouterModule.forChild(routes), <%= componentModule.name %>],
})
export class <%= e2eComponent.module %> {}
