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
    <form>
      <dt-form-field>
        <dt-label>Name</dt-label>
        <input
          type="text"
          dtInput
          placeholder="John Smith"
          aria-label="Please insert your full name"
        />
      </dt-form-field>
      <dt-form-field>
        <dt-label>Email address</dt-label>
        <input
          type="email"
          dtInput
          placeholder="john@smith.com"
          aria-label="Please insert your email address"
        />
      </dt-form-field>
      <button dt-button>Save</button>
    </form>
  `,
  styles: ['.dt-form-field { margin-bottom: 20px; }'],
})
export class InputFormExample {}
