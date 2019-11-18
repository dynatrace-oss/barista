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

// tslint:disable: dt-icon-names

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-toggle-button-group>
      <div class="toggle-button-group-show-more-grid">
        <button
          *ngFor="let buttonGroupItem of buttonGroupNames; let i = index"
          dt-toggle-button-item
          value="i + 1"
        >
          <dt-toggle-button-item-icon>
            <dt-icon name="cloud"></dt-icon>
          </dt-toggle-button-item-icon>
          {{ buttonGroupItem }}
        </button>
        <dt-expandable-text
          class="inline"
          label="Show All"
          (click)="loadMore()"
        >
        </dt-expandable-text>
      </div>
    </dt-toggle-button-group>
  `,
  styles: [
    `
      .toggle-button-group-show-more-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 12px;
        grid-row-gap: 12px;
      }

      .expandable-text-button-alignment {
        display: inline-flex;
      }
    `,
  ],
})
export class ToggleButtonGroupShowMoreExample implements OnInit {
  buttonGroupNames = new Set<string>();

  ngOnInit(): void {
    this.buttonGroupNames.add('1 CDN domain contacted');
    this.buttonGroupNames.add('6 3rd party resources');
    this.buttonGroupNames.add('1 CDN resource');
    this.buttonGroupNames.add('2 files downloaded');
    this.buttonGroupNames.add('725 1st party resources');
  }

  loadMore(): void {
    this.buttonGroupNames.add('4 CDN domains contacted');
    this.buttonGroupNames.add('64 3rd party resources');
  }
}
