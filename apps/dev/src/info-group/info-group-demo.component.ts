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

import { Component } from '@angular/core';

@Component({
  selector: 'demo-component',
  template: `
    <dt-info-group>
      <dt-info-group-icon
        ><dt-icon name="user-uem"></dt-icon
      ></dt-info-group-icon>
      <dt-info-group-title>5 min 30 s</dt-info-group-title>
      Session duration
    </dt-info-group>
  `,
})
export class InfoGroupDemo {}
