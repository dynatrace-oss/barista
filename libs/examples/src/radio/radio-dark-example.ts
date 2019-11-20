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
  selector: 'component-barista-example',
  template: `
    <div dtTheme=":dark" class="dark">
      <dt-radio-group name="group0">
        <dt-radio-button value="aberfeldy">Aberfeldy</dt-radio-button>
        <dt-radio-button value="dalmore">Dalmore</dt-radio-button>
        <dt-radio-button value="jacky" disabled>Jack Daniels</dt-radio-button>
        <dt-radio-button value="glenlivet">Glenlivet</dt-radio-button>
      </dt-radio-group>
    </div>
  `,
  styles: [
    'dt-radio-button { display: block; } dt-radio-button + dt-radio-button { margin-top: 20px; }',
  ],
})
export class RadioDarkExample {}
