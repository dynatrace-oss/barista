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
  css,
  TemplateResult,
  html,
  property,
  customElement,
  unsafeCSS,
} from 'lit-element';
import { FluidButtonGroupItem } from '../button-group-item/button-group-item';
import { FluidButtonGroupItemCheckedChangeEvent } from '../button-group-events';
import { SPACE, ARROW_RIGHT, ARROW_LEFT } from '@dynatrace/shared/keycodes';
import { FLUID_SPACING_X_SMALL } from '@dynatrace/fluid-design-tokens';
import { getNextGroupItemIndex } from '@dynatrace/fluid-elements/core';

let uniqueCounter = 0;

/**
 * A basic representation of the button-group wrapper for button-group-items
 * @element fluid-button-group
 * @slot - Default slot lets the user provide a label for the button-group.
 * to user interaction.
 */
@customElement('fluid-button-group')
export class FluidButtonGroup extends LitElement {
  private _buttonGroupItems: FluidButtonGroupItem[] = [];

  private _unique = `fluid-button-group-${uniqueCounter++}`;

  /** Styles for the button-group component */
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

        --fluid-button-group-background-color: var(--color-neutral-60);
      }

      .fluid-button-group {
        background-color: var(--fluid-button-group-background-color);
        width: max-content;
        padding-left: ${unsafeCSS(FLUID_SPACING_X_SMALL)};
      }
    `;
  }

  /**
   * Contains the currently checked button-group-item ID.
   * @attr
   * @type string || null
   */
  @property({ type: String, reflect: true })
  get checkedId(): string | null {
    return this._checkedId;
  }
  set checkedId(value: string | null) {
    const oldValue = this._checkedId;
    this._checkedId = value;
    this.requestUpdate('checkedId', oldValue);
  }
  private _checkedId: string | null;

  /**
   * Whether the children are disabled or not.
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  get disableAll(): boolean {
    return this._disableAll;
  }
  set disableAll(value: boolean) {
    const oldValue = value;
    this._disableAll = value;
    this.requestUpdate('disableAll', oldValue);
    this._setDisabledOnEveryItem();
  }
  private _disableAll = false;

  /**
   * Role of the radio-group.
   * @private - An internal prop that should not appear in the readme and should
   * not be set by the outside.
   */
  @property({
    type: String,
    reflect: true,
  })
  role: string = 'radio-group';

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`<div
      id="${this._unique}"
      class="fluid-button-group"
      @checkedChange=${this._handleCheckedChange}
      @keydown=${this._handleKeyDown}
      @keyup=${this._handleKeyUp}
    >
      <slot @slotchange=${this._handleSlotChange}></slot>
    </div>`;
  }

  /** Handles changes in the slot of the template */
  private _handleSlotChange(): void {
    this._buttonGroupItems = Array.from(
      this.querySelectorAll('fluid-button-group-item'),
    );

    if (this._buttonGroupItems.length > 0) {
      if (this.checkedId) {
        const toCheckedItem = this._buttonGroupItems.find(
          (item) => item.id === this.checkedId,
        );
        if (toCheckedItem) {
          toCheckedItem.checked = true;
        } else {
          this.checkedId = null;
        }
      } else {
        this._setFirstTabIndex();
      }
    }

    const buttonGroupItem = this._buttonGroupItems.find((item) => item.checked);
    if (buttonGroupItem) {
      this.checkedId = buttonGroupItem.id;
    }
  }

  /** Called when the checkedChanged event is called. Handles checking/unchecking button-group-items */
  private _handleCheckedChange(
    buttonGroupItemEvent: FluidButtonGroupItemCheckedChangeEvent,
  ): void {
    for (const buttonGroupItem of this._buttonGroupItems) {
      if (
        buttonGroupItem.id !== buttonGroupItemEvent.checkedId &&
        buttonGroupItem.checked === true
      ) {
        buttonGroupItem.checked = false;
      } else if (this.checkedId !== buttonGroupItemEvent.checkedId) {
        this.checkedId = buttonGroupItem.id;
      }
    }
  }

  /** Handler preventing default scrolling */
  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.code === SPACE) {
      event.preventDefault();
    }
  }

  /** Handles keyboard support. E.g Arrow navigation and tab support */
  private _handleKeyUp(event: KeyboardEvent): void {
    if (event.code === ARROW_RIGHT || event.code === ARROW_LEFT) {
      let index = this._buttonGroupItems.findIndex(
        (item) => item.tabIndex === 0,
      );
      const oldIndex = index;
      index = getNextGroupItemIndex(
        index,
        this._buttonGroupItems.length,
        event.code,
      );
      this._buttonGroupItems[oldIndex].tabIndex = -1;
      this._buttonGroupItems[oldIndex].tabbed = false;
      this._buttonGroupItems[index].tabIndex = 0;
      this._buttonGroupItems[index].tabbed = true;
      this._buttonGroupItems[index].shadowRoot?.querySelector('svg')?.focus();
    }
  }

  /** Sets the first available button-group-item's tabindex to 0 */
  private _setFirstTabIndex(): void {
    let set = false;
    for (const item of this._buttonGroupItems) {
      item.tabIndex = -1;
      if (!item.disabled && !set) {
        item.tabIndex = 0;
        set = true;
      }
    }
  }

  /** Disables every item in the group */
  private _setDisabledOnEveryItem(): void {
    for (const item of this._buttonGroupItems) {
      item.disabled = this._disableAll;
    }
  }
}
