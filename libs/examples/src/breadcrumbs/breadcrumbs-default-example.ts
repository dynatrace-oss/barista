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

import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-breadcrumbs aria-label="Breadcrumbs navigation">
      <a dtBreadcrumbsItem href="first">First view</a>
      <a dtBreadcrumbsItem href="first/second">
        Second view
      </a>
      <a dtBreadcrumbsItem href="first/second/third">
        Third view
      </a>
      <a dtBreadcrumbsItem>Current view</a>
    </dt-breadcrumbs>
  `,
})
export class BreadcrumbsDefaultExample {}
