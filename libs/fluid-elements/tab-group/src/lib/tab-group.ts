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

import {
  LitElement,
  CSSResult,
  TemplateResult,
  html,
  property,
} from 'lit-element';
import styles from './tab-group.scss';
import { FluidTab } from './tab/tab';
import {
  FluidTabActivatedEvent,
  FluidTabDisabledEvent,
  FluidTabGroupActiveTabChanged,
} from '../utils/tab-events';

/**
 * This is a experimental version of the tab group component
 * It registers itself as `fluid-tab-group` custom element.
 * @element fluid-tag-group
 * @slot - Default slot lets the user provide a group of fluid-tabs.
 */
export class FluidTabGroup extends LitElement {
  /** Array of referrences to the fluid-tabs */
  private tabChildren: FluidTab[];

  /** Styles for the tab list component */
  static get styles(): CSSResult {
    return styles;
  }

  /**
   * Defines a tab to be active
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  activetabid: string;

  /** Sets the active tab on click */
  private handleClick(event: FluidTabActivatedEvent): void {
    if (this.activetabid != event.activeTab) {
      this.activetabid = event.activeTab;
      for (const tab of this.tabChildren) {
        tab.active = tab.tabid === this.activetabid;
      }
      this.dispatchEvent(new FluidTabGroupActiveTabChanged(this.activetabid));
    }
  }

  /** Sets the active tab on keydown (ArrowLeft and ArrowRight to select / Enter and Space to confirm) */
  private handleKeyDown(event: KeyboardEvent): void {
    // Enter Space controll (validate selection)
    if (event.key === 'Enter' || event.key === ' ') {
      // Set all tabs to active false
      for (const tab of this.tabChildren) {
        tab.active = false;
      }

      // Find the tab to be active
      const activeTab = this.tabChildren.find((tab) => {
        return this.activetabid === tab.tabid;
      })!;

      activeTab.active = true;
      this.activetabid = activeTab.tabid;
      this.dispatchEvent(new FluidTabGroupActiveTabChanged(this.activetabid));
    }
    // Arrow control (navigate tabs)
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      // Loops over to find
      let index = this.tabChildren.findIndex(
        (tab: FluidTab) => this.activetabid === tab.tabid,
      );

      const oldIndex = index;
      if (event.key === 'ArrowRight') {
        index += 1;
      }
      if (event.key === 'ArrowLeft') {
        index -= 1;
      }
      if (index > this.tabChildren.length - 1) {
        index = 0;
      } else if (index < 0) {
        index = this.tabChildren.length - 1;
      }

      this.tabChildren[index].focus();
      this.tabChildren[index].tabindex = 0;
      this.tabChildren[oldIndex].tabindex = -1;
      this.activetabid = this.tabChildren[index].tabid;
      console.log(this.tabChildren);
    }
  }

  /** Checks whether the next tab is also disabled or not and sets the next not disabled tab as active  */
  private handleDisabled(disableTabEvent: FluidTabDisabledEvent): void {
    if (this.activetabid === disableTabEvent.disableTab) {
      const tabToEnable = this.tabChildren.find((tab) => !tab.disabled);
      if (tabToEnable) {
        tabToEnable.active = true;
      }
    }
  }

  /** Handles changes in the slot. Initially sets the active item (default is first) */
  private slotchange(): void {
    this.tabChildren = Array.from(this.querySelectorAll('fluid-tab'));
    // Initially set the first tab to active
    if (!this.activetabid && this.tabChildren.length > 0) {
      this.tabChildren[0].active = true;
      this.activetabid = this.tabChildren[0].tabid;
    } else {
      for (const tab of this.tabChildren) {
        tab.active = tab.tabid === this.activetabid;
      }
    }
    for (const tab of this.tabChildren) {
      tab.active = tab.tabid === this.activetabid;
    }
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`
      <div
        class="fluid-tab-group"
        @tabActivated="${this.handleClick}"
        @keydown="${this.handleKeyDown}"
        @disabled="${this.handleDisabled}"
      >
        <slot @slotchange="${this.slotchange}"></slot>
      </div>
    `;
  }
}

if (!customElements.get('fluid-tab-group')) {
  customElements.define('fluid-tab-group', FluidTabGroup);
}
