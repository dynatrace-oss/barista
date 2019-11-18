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
    <dt-radio-group name="newsletter">
      <dt-radio-button value="opt-in">
        Yes, I want to receive a weekly newsletter, because I like emails a lot.
      </dt-radio-button>
      <dt-radio-button value="opt-out">
        No, I don't want to receive a weekly newsletter, because I don't like
        them at all. I don't like to read so many emails every week.
      </dt-radio-button>
    </dt-radio-group>
  `,
  styles: [
    'dt-radio-button { display: block; } dt-radio-button + dt-radio-button { margin-top: 20px; }',
  ],
})
export class RadioResponsiveExample {}
// tslint:enable:max-line-length
