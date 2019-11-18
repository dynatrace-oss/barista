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
    <dt-secondary-nav aria-label="External Links Secondary Nav Example">
      <dt-secondary-nav-title>Settings</dt-secondary-nav-title>

      <dt-secondary-nav-section expandable active>
        <dt-secondary-nav-section-title>
          Monitoring
        </dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description>
          Setup and overview
        </dt-secondary-nav-section-description>
        <a
          dtSecondaryNavLink
          href="https://google.com"
          class="dt-secondary-nav-active"
        >
          Monitored technologies
        </a>
        <a dtSecondaryNavLink href="https://google.com">Monitoring overview</a>
        <a dtSecondaryNavLink href="https://google.com">Host naming</a>
      </dt-secondary-nav-section>

      <dt-secondary-nav-section href="https://google.com" [external]="true">
        <dt-secondary-nav-section-title
          >External Link</dt-secondary-nav-section-title
        >
        <dt-secondary-nav-section-description
          >Non expanding section</dt-secondary-nav-section-description
        >
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
export class SecondaryNavExternalExample {}
