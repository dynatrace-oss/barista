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

import '@dynatrace/fluid-elements/checkbox';

import {
  CSSResult,
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
  unsafeCSS,
} from 'lit-element';

import { FLUID_INPUT_PADDING } from '@dynatrace/fluid-design-tokens';
import { FluidComboBoxOptionSelectedChangeEvent } from './combo-box-option-events';

let _unique = 0;

@customElement(`fluid-combo-box-option`)
export class FluidComboBoxOption extends LitElement {
  /** Styles for the option component */
  static get styles(): CSSResult {
    return css`
      :host {
        cursor: pointer;
        display: block;

        --fluid-combo-box-option--background-key: 108, 115, 135;
        --fluid-combo-box-option--background-opacity-hover: 0.2;
      }

      :host([focused]) {
        background-color: rgba(
          var(--fluid-combo-box-option--background-key),
          var(--fluid-combo-box-option--background-opacity-hover)
        );
      }

      .fluid-combo-box-option {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: start;
        padding: ${unsafeCSS(FLUID_INPUT_PADDING)};
      }

      .fluid-icon {
        width: auto;
        height: 1rem;
      }
    `;
  }

  /**
   * Defines the id of the option element
   * @attr
   */
  @property({ type: String, reflect: true })
  optionid = `fluid-combo-box-option-${_unique++}`;

  /**
   * Defines whether a selection checkbox is displayed
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  checkbox = false;

  /**
   * Defines whether the option is selected
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Defines whether the option is focused
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  focused = false;

  private _handleClick(): void {
    this.dispatchEvent(
      new FluidComboBoxOptionSelectedChangeEvent(this.optionid),
    );
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`
      <div
        id=${this.optionid}
        class="fluid-combo-box-option"
        @click=${this._handleClick}
      >
        ${this.checkbox
          ? html`<fluid-checkbox ?checked=${this.selected}></fluid-checkbox>`
          : html`<span></span>`}
        <slot></slot>
        ${!this.checkbox && this.selected
          ? html`<fluid-icon
              class="fluid-icon"
              name="dropdownopen"
            ></fluid-icon>`
          : html`<span></span>`}
      </div>
    `;
  }
}
