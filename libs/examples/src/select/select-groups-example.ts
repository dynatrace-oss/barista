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
    <dt-select placeholder="Select filter type" aria-label="Select filter type">
      <dt-option value="Application">Application</dt-option>
      <dt-option value="Bounce">Bounce</dt-option>
      <dt-optgroup label="Browsers">
        <dt-option value="Browser family">Browser family</dt-option>
        <dt-option value="Browser type">Browser type</dt-option>
        <dt-option value="Browser version">Browser version</dt-option>
      </dt-optgroup>
      <dt-optgroup label="Location">
        <dt-option value="City">City</dt-option>
        <dt-option value="Country">Country</dt-option>
        <dt-option value="Continent">Continent</dt-option>
      </dt-optgroup>
    </dt-select>
  `,
})
export class SelectGroupsExample {}
