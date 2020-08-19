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
  css,
  unsafeCSS,
  customElement,
} from 'lit-element';

import { FluidTab } from '../tab/tab';
import {
  FluidTabDisabledEvent,
  FluidTabBlurredEvent,
  FluidTabActiveSetEvent,
  FluidTabGroupActiveTabChanged,
  FluidTabActivatedEvent,
} from '../tab-events';
import {
  ENTER,
  SPACE,
  ARROW_RIGHT,
  ARROW_LEFT,
  TAB,
} from '@dynatrace/shared/keycodes';

import {
  FLUID_SPACING_SMALL,
  FLUID_SPACING_0,
  FLUID_SPACING_MEDIUM,
} from '@dynatrace/fluid-design-tokens';

/**
 * This is a experimental version of the tab group component
 * It registers itself as `fluid-tab-group` custom element.
 * @element fluid-tab-group
 * @slot - Default slot lets the user provide a group of fluid-tabs.
 */
@customElement('fluid-tab-group')
export class FluidTabGroup extends LitElement {
  /** Array of referrences to the fluid-tabs */
  private tabChildren: FluidTab[];

  /** Styles for the tab list component */
  static get styles(): CSSResult {
    return css`
      :host {
        /**
        * Legibility definitions should probably be
        * shipped or imported from a core
        */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      .fluid-tab-group {
        margin-block-start: ${unsafeCSS(FLUID_SPACING_SMALL)};
        margin-block-end: ${unsafeCSS(FLUID_SPACING_SMALL)};
        margin-inline-start: ${unsafeCSS(FLUID_SPACING_0)};
        margin-inline-end: ${unsafeCSS(FLUID_SPACING_0)};
        padding-inline-start: ${unsafeCSS(FLUID_SPACING_MEDIUM)};
      }
    `;
  }

  /**
   * Defines the currently active tabid
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  activetabid: string;

  /** Sets the activeTabId. Handles programatically calling the active setter on the fluid-tab */
  private _setActiveTabId(activeSetEvent: FluidTabActiveSetEvent): void {
    this.activetabid = activeSetEvent.tabId;
    for (const tab of this.tabChildren) {
      if (tab.tabid !== this.activetabid) {
        tab.active = false;
      }
    }
  }

  /** Sets the active tab on click */
  private _handleClick(event: FluidTabActivatedEvent): void {
    const toActivateTab = this.tabChildren.find(
      (tabItem) => tabItem.tabid === event.activeTabId,
    );

    if (toActivateTab) {
      // Resets all tabs
      const toResetTab = this.tabChildren.find((tab) => tab.active);
      if (toResetTab) {
        toResetTab.tabindex = -1;
        toResetTab.active = false;
        toResetTab.tabbed = false;
      }
      this.activetabid = event.activeTabId;

      toActivateTab.active = true;
      toActivateTab.tabindex = 0;
      this.dispatchEvent(new FluidTabGroupActiveTabChanged(event.activeTabId));
    }
  }

  /** Sets the active tab on keydown (ArrowLeft and ArrowRight to select / Enter and Space to confirm) */
  private _handleKeyUp(event: KeyboardEvent): void {
    // Sets the focus outline when user tabbed into the tab group
    if (event.code === TAB) {
      const focusableTab = this.tabChildren.find((tab) => tab.tabindex === 0);

      if (focusableTab) {
        focusableTab.tabbed = true;
      }
    }

    // Selection control. Selects the tab that was focused using tab/arrowkeys
    if (event.code === ENTER || event.code === SPACE) {
      const toBeActivatedTab = this.tabChildren.find(
        (tab) => tab.tabindex === 0,
      );

      if (toBeActivatedTab) {
        const toDeactivateTab = this.tabChildren.find((tab) => tab.active);
        if (toDeactivateTab) {
          toDeactivateTab.active = false;
        }

        toBeActivatedTab.active = true;
        this.activetabid = toBeActivatedTab.tabid;
        this.dispatchEvent(new FluidTabGroupActiveTabChanged(this.activetabid));
      }
    }
    // Arrow control (navigate tabs)
    if (event.code === ARROW_RIGHT || event.code === ARROW_LEFT) {
      let index = this.tabChildren.findIndex(
        (tab: FluidTab) => tab.tabindex === 0,
      );
      const oldIndex = index;
      if (event.code === ARROW_RIGHT) {
        index += 1;
      }
      if (event.code === ARROW_LEFT) {
        index -= 1;
      }
      if (index > this.tabChildren.length - 1) {
        index = 0;
      } else if (index < 0) {
        index = this.tabChildren.length - 1;
      }

      this.tabChildren[index].tabbed = true;
      this.tabChildren[oldIndex].tabbed = false;
      this.tabChildren[index].focus();
    }
  }

  /** Event handler for key down events handling 'tab' key aswell. Prevention of default scroll behavior on the SPACE key */
  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.code === SPACE) {
      event.preventDefault();
    }
  }

  /** Checks whether the next tab is also disabled or not and sets the next available tab as active  */
  private _handleDisabled(disableTabEvent: FluidTabDisabledEvent): void {
    if (this.activetabid === disableTabEvent.tabId) {
      this.setFirstEnabledTabActive();
    }
  }

  /** Resets the tabindex if the user lost focus without activating the activated tab */
  private _handleBlur(event: FluidTabBlurredEvent): void {
    // Sets the selected but not activated tabs tabindex to -1
    const toDisableTabIndexTab = this.tabChildren.find(
      (tab) => tab.tabid === event.tabId,
    );
    if (toDisableTabIndexTab) {
      toDisableTabIndexTab.tabindex = -1;
    }
    // Sets the active tabs tabindex to 0
    const toEnableTabIndexTab = this.tabChildren.find((tab) => tab.active);
    if (toEnableTabIndexTab) {
      toEnableTabIndexTab.tabindex = 0;
    }
  }

  /** Handles changes in the slot. Initially sets the active item (default is first) */
  private _slotchange(): void {
    this.tabChildren = Array.from(this.querySelectorAll('fluid-tab'));
    // Set all tabindexes to -1 because the default is 0
    for (const tab of this.tabChildren) {
      tab.tabindex = -1;
    }
    this.checkForMutipleActiveTabs();
    // Set a tab to active
    const activeTab = this.tabChildren.find((tab) => tab.active);
    if (activeTab) {
      activeTab.tabindex = 0;
      this.activetabid = activeTab.tabid;
    } else {
      this.setFirstEnabledTabActive();
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
        @activeSet="${this._setActiveTabId}"
        @tabActivated="${this._handleClick}"
        @blur="${this._handleBlur}"
        @keyup="${this._handleKeyUp}"
        @keydown="${this._handleKeyDown}"
        @disabled="${this._handleDisabled}"
      >
        <slot @slotchange="${this._slotchange}"></slot>
      </div>
    `;
  }

  /** Sets an available tab to active. (Not disabled) */
  setFirstEnabledTabActive(): void {
    let tabToEnable;
    if (this.activetabid) {
      tabToEnable = this.tabChildren.find(
        (tab) => tab.tabid === this.activetabid,
      );
    } else {
      tabToEnable = this.tabChildren.find((tab) => !tab.disabled);
    }
    if (tabToEnable) {
      tabToEnable.active = true;
      this.activetabid = tabToEnable.tabid;
    }
  }

  /** Checks whether multiple tabs are active. If so every other tab but the first active tab will be deactivated */
  checkForMutipleActiveTabs(): void {
    if (this.tabChildren.length > 0) {
      const tabs = this.tabChildren.filter((tab) => {
        if (tab.active) {
          return tab;
        }
      });

      if (tabs.length > 1) {
        const activeTab = tabs[0];
        for (const tab of this.tabChildren) {
          tab.active = false;
        }
        const tabToBeActive = this.tabChildren.find(
          (tab) => tab.tabid === activeTab?.tabid,
        );
        if (tabToBeActive) {
          tabToBeActive.active = true;
        }
      }
    }
  }
}
