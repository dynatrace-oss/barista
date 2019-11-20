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
    <dt-tag-list aria-label="test">
      <dt-tag>window</dt-tag>
      <dt-tag>deploy</dt-tag>
      <dt-tag>.NetTest</dt-tag>
      <dt-tag>193.168.4.3:80</dt-tag>
      <dt-tag><dt-tag-key>Maxk</dt-tag-key>loadtest</dt-tag>
      <dt-tag>sdk-showroom</dt-tag>
      <dt-tag>dt</dt-tag>
      <dt-tag>requests</dt-tag>
      <dt-tag>cluster</dt-tag>
      <dt-tag>server</dt-tag>
      <dt-tag>node</dt-tag>
    </dt-tag-list>
  `,
})
export class TagDefaultExample {}
