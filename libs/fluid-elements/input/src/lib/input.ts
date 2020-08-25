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
  customElement,
  html,
  property,
} from 'lit-element';

import { classMap } from 'lit-html/directives/class-map';

import { inputStyles } from './input.styles';

/** Defines the possible positions of the fluid-input label. */
export type FluidInputLabelPosition = `top` | `left` | null;

/**
 * This is an experimental input element built with lit-elements and
 * web-components. It registers itself as `fluid-input` custom element.
 * @element fluid-input
 * @cssprop --fluid-input--foreground-key - Controls the foreground color for the default state.
 * @cssprop --fluid-input--background-key - Controls the background color for the default state.
 * @cssprop --fluid-input--border-key - Controls the border color for the default state.
 * @cssprop --fluid-input--foreground-key-hover - Controls the foreground hover color for the default state.
 * @cssprop --fluid-input--background-key-hover - Controls the background hover color for the default state.
 * @cssprop --fluid-input--border-key-hover - Controls the border hover color for the default state.
 * @cssprop --fluid-input--foreground-key-focus - Controls the foreground focus color for the default state.
 * @cssprop --fluid-input--background-key-focus - Controls the background focus color for the default state.
 * @cssprop --fluid-input--border-key-focus - Controls the border focus color for the default state.
 * @cssprop --fluid-input--foreground-negative - Controls the foreground color for the negative state.
 * @cssprop --fluid-input--border-negative - Controls the border color for the negative state.
 * @cssprop --fluid-input--foreground-negative-hover - Controls the foreground hover color for the negative state.
 * @cssprop --fluid-input--border-negative-hover - Controls the border hover color for the negative state.
 * @cssprop --fluid-input--foreground-negative-focus - Controls the foreground focus color for the negative state.
 * @cssprop --fluid-input--border-negative-focus - Controls the border focus color for the negative state.
 * @cssprop --fluid-input--foreground-disabled - Controls the foreground color for the disabled state.
 * @cssprop --fluid-input--background-disabled - Controls the background color for the disabled state.
 * @cssprop --fluid-input--border-disabled - Controls the border color for the disabled state.
 * @cssprop --fluid-input--placeholder - Controls the placeholder color.
 * @cssprop --fluid-input--hint - Controls the hint color.
 */
@customElement('fluid-input')
export class FluidInput extends LitElement {
  /** Styles for the input component */
  static get styles(): CSSResult {
    return inputStyles;
  }

  /**
   * Defines the aria label of the input input field.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  labelposition: FluidInputLabelPosition = `top`;

  /**
   * Defines the hint of the input input field.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  hint: string = ``;

  /**
   * @internal Defines if the input should be blurred
   * Used in the fluid-combo-box to keep the input
   * focused when clicking in the popover
   */
  _preventBlur = false;

  /**
   * Defines whether the input is disabled.
   * Used for styling the input container
   */
  @property({ type: Boolean, attribute: false })
  private _disabled = false;

  /**
   * Defines whether the input is focused.
   * Used for styling the container
   */
  @property({ type: Boolean, attribute: false })
  private _focus = false;

  /**
   * Validate slotted element(s) and add event listeners
   * for focusing and blurring an input
   */
  private _handleSlotChange({ target }: { target: HTMLSlotElement }): void {
    const slottedElements = target.assignedElements({
      flatten: true,
    });

    // Only accept one element per slot
    if (slottedElements.length > 1) {
      throw new Error(
        `The fluid-input only takes one input element in the default slot.`,
      );
    }

    const element = slottedElements[0];

    // Only accept input or label element as slotted elements
    if (element.tagName !== `INPUT` && element.tagName !== `LABEL`) {
      throw new Error(
        `The fluid-input only takes an input element or a label as slotted elements.`,
      );
    }

    // Add focus and blur listeners to the input element
    if (element.tagName === `INPUT`) {
      this._disabled = (element as HTMLInputElement).disabled;
      element.addEventListener(`focus`, this._handleFocus.bind(this));
      element.addEventListener(`blur`, this._handleBlur.bind(this));
    }
  }

  /** Set the fluid input focus to apply styles */
  private _handleFocus(): void {
    this._focus = true;
  }

  /** Set the fluid input focus to apply styles */
  private _handleBlur(): void {
    if (!this._preventBlur) {
      this._focus = false;
    }
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    const classMapData = {
      'fluid-input': true,
      'fluid-color--main': true,
      /* TODO: validation */
      'fluid-color--error': false,
      'fluid-color--disabled': this._disabled,
      'fluid-input--label-left': this.labelposition === `left`,
    };

    const classMapDataInputContainer = {
      'fluid-input-container': true,
      'fluid-input-container--focus': this._focus,
    };

    return html`
      <div class=${classMap(classMapData)}>
        <slot name="label" @slotchange=${this._handleSlotChange}></slot>
        <div class="fluid-input-hint-container">
          <div class=${classMap(classMapDataInputContainer)}>
            <slot @slotchange=${this._handleSlotChange}></slot>
            <div class="fluid-icon-container">
              <slot name="icon"></slot>
            </div>
          </div>
          ${this.hint
            ? html`<span class="fluid-input-hint">${this.hint}</span>`
            : html`<span class="fluid-input-hint">&nbsp;</span>`}
        </div>
      </div>
    `;
  }
}
