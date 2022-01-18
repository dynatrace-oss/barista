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
import { DtEmptyState } from '@dynatrace/barista-components/empty-state';

@Component({
  templateUrl: 'empty-state-custom-empty-state-table-example.html',
})
export class DtExampleCustomEmptyStateTable {}

@Component({
  selector: 'dt-example-custom-empty-state',
  providers: [
    {
      provide: DtEmptyState,
      useExisting: DtExampleCustomEmptyState,
    },
  ],
  host: {
    role: 'row',
  },
  template: `
    <dt-empty-state>
      <dt-empty-state-item role="cell">
        <dt-empty-state-item-img>
          <img
            src="https://dt-cdn.net/images/cta-noagent-9eec611f00.svg"
            alt="My Asset"
          />
        </dt-empty-state-item-img>
        <dt-empty-state-item-title aria-level="2">
          Reusable empty state
        </dt-empty-state-item-title>
        Custom empty state message
      </dt-empty-state-item>
    </dt-empty-state>
  `,
})
export class DtExampleCustomEmptyState {}
