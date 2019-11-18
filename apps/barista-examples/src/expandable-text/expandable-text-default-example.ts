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
  selector: 'demo-component',
  template: `
    With automatic monitoring enabled, you can create rules that define
    exceptions to automatic process detection and monitoring. With automatic
    monitoring disabled, you can define rules that identify specific processes
    that should be monitored. Rules are applied in the order listed below.
    <dt-expandable-text label="More..." labelClose="Less">
      This means that you can construct complex operations for fine-grain
      control over the processes that are monitored in your environment. For
      example, you might define an inclusion rule that’s followed by an
      exclusion rule covering the same process.
    </dt-expandable-text>
  `,
})
export class ExpandableTextDefaultExample {}
