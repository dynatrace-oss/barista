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
  selector: 'default-demo',
  template: `
    <dt-card>
      <dt-card-title>
        Start monitoring your Cloud Foundry foundation VMs
      </dt-card-title>

      <dt-card-title-actions>
        <button
          dt-icon-button
          variant="secondary"
          color="cta"
          aria-label="Close card"
        >
          <dt-icon name="abort"></dt-icon>
        </button>
      </dt-card-title-actions>

      <dt-empty-state>
        <dt-empty-state-item>
          <dt-empty-state-item-img>
            <img src="/assets/cta-noagent.svg" alt="My Asset" />
          </dt-empty-state-item-img>

          Deploy Dynatrace OneAgent via the Dynatrace OneAgent BOSH release to
          your Cloud Foundry foundation VMs. Get monitoring insights into all
          Cloud Foundry components including Diego cells, Gorouters, and more.
          Benefit from automatic monitoring of Cloud Foundry applications, down
          to the code and query level, thanks to built-in auto-injection for
          Garden-runC containers.
          <a class="dt-link" color="cta" i18n>Read more...</a>

          <dt-empty-state-footer-actions>
            <a dt-button color="cta" i18n>View release</a>
            <a dt-button color="cta" i18n>More info</a>
          </dt-empty-state-footer-actions>
        </dt-empty-state-item>
      </dt-empty-state>
    </dt-card>
  `,
})
export class EmptyStateInCardExample {}
