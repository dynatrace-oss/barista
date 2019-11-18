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
  selector: 'container-breakpoint-observer-barista-example',
  template: `
    <dt-container-breakpoint-observer>
      <p>This element is alway visible</p>
      <p *dtIfContainerBreakpoint="'(min-width:400px)'; else elseBlock">
        This element is only visible if the container has at least a width of
        400px
      </p>
      <ng-template #elseBlock>
        <p>
          This element is visible if the container is smaller than 400px
        </p>
      </ng-template>
    </dt-container-breakpoint-observer>
  `,
})
export class ContainerBreakpointObserverIfElseExample {}
