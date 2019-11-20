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
      <dt-card-title>CTA card title</dt-card-title>

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

          <dt-empty-state-item-title>
            Optional heading 1
          </dt-empty-state-item-title>

          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum.
        </dt-empty-state-item>
        <dt-empty-state-item>
          <dt-empty-state-item-img>
            <img src="/assets/cta-noagent.svg" alt="My Asset" />
          </dt-empty-state-item-img>

          <dt-empty-state-item-title>
            Optional heading 2
          </dt-empty-state-item-title>

          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum.
        </dt-empty-state-item>
        <dt-empty-state-item>
          <dt-empty-state-item-img>
            <img src="/assets/cta-noagent.svg" alt="My Asset" />
          </dt-empty-state-item-img>

          <dt-empty-state-item-title>
            Optional heading 3
          </dt-empty-state-item-title>

          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum.
        </dt-empty-state-item>
      </dt-empty-state>

      <dt-card-footer-actions>
        <a dt-button color="cta" i18n>View release</a>
        <a dt-button color="cta" i18n>More info</a>
      </dt-card-footer-actions>
    </dt-card>
  `,
})
export class EmptyStateMultipleItemsInCardExample {}
