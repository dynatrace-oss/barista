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
  CSSResult,
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
  unsafeCSS,
} from 'lit-element';
import { nothing } from 'lit-html';
import '@dynatrace/fluid-elements/checkbox';
import { FLUID_INPUT_PADDING } from '@dynatrace/fluid-design-tokens';

import { FluidOptionSelectedChangeEvent } from './option-events';

let _unique = 0;

@customElement(`fluid-option`)
export class FluidOption extends LitElement {
  /** Styles for the option component */
  static get styles(): CSSResult {
    return css`
      :host {
        cursor: pointer;
        display: block;

        --fluid-option--background-key: 108, 115, 135;
        --fluid-option--background-opacity-hover: 0.2;
      }

      :host([focused]),
      :host(:hover) {
        background-color: rgba(
          var(--fluid-option--background-key),
          var(--fluid-option--background-opacity-hover)
        );
      }

      .combo-box-option {
        display: inline-grid;
        grid-auto-flow: column;
        align-items: center;
        padding: ${unsafeCSS(FLUID_INPUT_PADDING)};
      }
    `;
  }

  /**
   * Defines the id of the option element
   * @attr
   */
  @property({ type: String, reflect: true })
  optionid = `fluid-option-${_unique++}`;

  /**
   * Defines whether a selection checkbox is displayed
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  checkbox = true;

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

  /**
   * Defines whether the selected indicator is displayed
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  selectedindicator = false;

  private _handleClick(): void {
    this.dispatchEvent(new FluidOptionSelectedChangeEvent(this.optionid));
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`
      <div
        id=${this.optionid}
        class="combo-box-option"
        @click=${this._handleClick}
      >
        ${this.checkbox
          ? html`<fluid-checkbox ?checked=${this.selected}></fluid-checkbox>`
          : nothing}
        <slot></slot>
        ${this.selectedindicator && this.selected
          ? html`<span>selected</span>`
          : nothing}
      </div>
    `;
  }
}
