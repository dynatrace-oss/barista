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

// tslint:disable:max-line-length
@Component({
  selector: 'component-barista-example',
  template: `
    <dt-checkbox>
      Check this checkbox to subscribe to our product news newsletter and other
      updates. We'll send updates once a month and promise we won't spam you.
    </dt-checkbox>
    <dt-checkbox>
      This website uses performance, functionality and targeting cookies. If you
      check this checkbox, you consent to the use of cookies.
    </dt-checkbox>
  `,
  styles: [
    `
      dt-checkbox {
        display: block;
      }
      dt-checkbox + dt-checkbox {
        margin-top: 20px;
      }
    `,
  ],
})
export class CheckboxResponsiveExample {}
// tslint:enable:max-line-length
