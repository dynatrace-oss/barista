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

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DtBreadcrumbs } from './breadcrumbs';
import { DtBreadcrumbsItem2 } from './breadcrumbs-item';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  exports: [DtBreadcrumbs, DtBreadcrumbsItem2, OverlayModule],
  declarations: [DtBreadcrumbs, DtBreadcrumbsItem2],
  imports: [
    A11yModule,
    CommonModule,
    RouterModule,
    PortalModule,
    OverlayModule,
  ],
})
export class DtBreadcrumbsModule {}
