/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

/** Custom event implementation fires when the active tab has changes */
export class FluidTabGroupActiveTabChanged extends CustomEvent<any> {
  constructor(public activeTab: string) {
    super('activeTabChanged', { bubbles: true, composed: true });
  }
}

/** Custom event implementation that fires when a tab is clicked providing the active tab id  */
export class FluidTabActivatedEvent extends CustomEvent<any> {
  constructor(public activeTab: string) {
    super('tabActivated', { bubbles: true, composed: true });
  }
}

/** Custom event implementation that fires when a tab is disabled providing the disabled tab id  */
export class FluidTabDisabledEvent extends CustomEvent<any> {
  constructor(public disableTab: string) {
    super('disabled', { bubbles: true, composed: true });
  }
}
