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
// tslint:disable: dt-card-needs-title dt-icon-names

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-card dtTheme="purple">
      <div class="dt-card-grid">
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="timemeasurement"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>5 min 30 s</dt-info-group-title>
          Session duration
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="user-uem"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>ben</dt-info-group-title>
          User identifier
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="application"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>easyTravel Protal</dt-info-group-title>
          Application name
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="finishflag"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>2</dt-info-group-title>
          Conversation goals
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="realuser-monitorwebsiteusers"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>Satisfied</dt-info-group-title>
          User experience score
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="incident"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>2</dt-info-group-title>
          Errors and annoyances
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="ios"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>OS X El Capitan 10.1</dt-info-group-title>
          Operating system
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="desktop"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>1280x768px</dt-info-group-title>
          Screen size
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="webpages"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>Chrome 70</dt-info-group-title>
          Browser
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="pinpoint-location"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>Rome, Italy</dt-info-group-title>
          Geo location
        </dt-info-group>
      </div>
    </dt-card>
  `,
  styles: [
    `
      .dt-card-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: repeat(auto-fill, auto);
        grid-column-gap: 20px;
        grid-row-gap: 20px;
      }
    `,
  ],
})
export class InfoCardInCardExample {}
