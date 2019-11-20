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
    <div class="demo-card">
      <dt-cta-card>
        <dt-cta-card-title i18n>
          Start monitoring your Cloud Foundry foundation VMs
        </dt-cta-card-title>
        <dt-cta-card-footer-actions>
          <a dt-button color="cta" i18n>View release</a>
        </dt-cta-card-footer-actions>
        <dt-cta-card-image>
          <img alt="no agent svg" src="/assets/cta-noagent.svg" />
        </dt-cta-card-image>
        Deploy Dynatrace OneAgent via the Dynatrace OneAgent BOSH release to
        your Cloud Foundry foundation VMs. Get monitoring insights into all
        Cloud Foundry components including Diego cells, Gorouters, and more.
        Benefit from automatic monitoring of Cloud Foundry applications, down to
        the code and query level, thanks to built-in auto-injection for
        Garden-runC containers.
        <a class="dt-link" color="cta">Read more...</a>
      </dt-cta-card>
    </div>
  `,
})
export class CtaCardDefaultExample {}
