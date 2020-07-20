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
  TemplateResult,
  html,
  property,
  CSSResult,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { FluidSwitchChangeEvent } from './switch-events';
import styles from './switch.scss';
import { SPACE } from '@dynatrace/shared/keycodes';

let uniqueCounter = 0;

/**
 * A basic representation of the switch input
 * @element fluid-switch
 * @slot - Default slot lets the user provide a label for the switch.
 * @fires change - Event that is being fired when the switch state changes due
 * to user interaction.
 * @cssprop --fluid-switch--label-color - Customize the label color.
 * @cssprop --fluid-switch--fill - Customize the switch fill color.
 * @cssprop --fluid-switch--container - Customize the container color.
 * @cssprop --fluid-switch--container-fill-checked - Customize the fill color when
 * the switch is in the checked state.
 * @cssprop --fluid-switch--knob-checked - Customize the knob color when
 * the switch is in the checked state.
 * @cssprop --fluid-switch--knob - Customize the knob color.
 * @cssprop --fluid-switch--focus - Customize the focus color.
 */
export class FluidSwitch extends LitElement {
  /**
   * Unique identifier used for the id and label connection
   * within the checkbox.
   */
  private _unique = `fluid-switch-${uniqueCounter++}`;

  /** Reference to the native input within the shadowed template. */
  private _inputElement: HTMLInputElement;

  /** Styles for the button component */
  static get styles(): CSSResult {
    return styles;
  }

  /** Whether the switch is disabled or not */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** The value attribute of the native input element */
  @property({ type: String, reflect: true })
  // Default string for the value is 'on' from MDN (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox#Additional_attributes)
  value = 'on';

  /** Whether the switch is considered `on` or `off`. */
  @property({ type: Boolean, reflect: true })
  set checked(value: boolean) {
    const oldValue = this.checked;
    this._checked = value;
    this.requestUpdate('checked', oldValue);
  }
  get checked(): boolean {
    return this._checked;
  }
  private _checked = false;

  /** First updated lifecycle */
  firstUpdated(props: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(props);
    this._inputElement = this.shadowRoot?.querySelector('input')!;
  }

  /**
   * Render function.
   */
  render(): TemplateResult {
    const svgClassMapData = {
      checked: this.checked,
      'fluid-svg-switch': true,
    };

    return html`<div class="fluid-switch">
      <input
        id="${this._unique}"
        class="fluid-switch-input"
        tabindex="-1"
        focusable="false"
        type="checkbox"
        value="${this.value}"
        ?checked="${this.checked}"
        ?disabled="${this.disabled}"
        @change="${this._handleInputChange}"
      />
      <label for="${this._unique}" class="fluid-switch-label">
        <svg
          class="${classMap(svgClassMapData)}"
          tabindex="${this.disabled ? -1 : 0}"
          @keydown="${this._handleKeyDown}"
          @keyup="${this._handleKeyUp}"
          width="55"
          height="40"
          viewBox="-10 -10 55 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            class="fluid-switch-fill"
            x="0.5"
            y="0.5"
            width="35"
            height="19"
            rx="9.5"
          />
          <rect
            class="fluid-switch-container"
            x="0.5"
            y="0.5"
            width="35"
            height="19"
            rx="9.5"
          />
          <circle class="fluid-switch-knob" cx="10" cy="10" r="7" />
          <circle class="fluid-switch-glow" cx="10" cy="10" r="18" />
        </svg>
        <span class="fluid-label">
          <slot></slot>
        </span>
      </label>
    </div>`;
  }

  /**
   * Dispatches a change event for the checkbox
   */
  private _dispatchChangeEvent(): void {
    this.dispatchEvent(new FluidSwitchChangeEvent(this.checked));
  }

  /**
   * Handles the change of the native checkbox element and routes the
   * event out.
   */
  private _handleInputChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this._dispatchChangeEvent();
  }

  /**
   * Handling the key down event on the svg.
   * @param event
   */
  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.code === SPACE) {
      event.preventDefault();
    }
  }

  /**
   * Handling the key up event on the svg.
   */
  private _handleKeyUp(event: KeyboardEvent): void {
    if (event.code === SPACE) {
      this._inputElement.click();
    }
  }

  /** Toggle the checked state */
  toggle(): void {
    this.checked = !this.checked;
  }
}

if (!customElements.get('fluid-switch')) {
  customElements.define('fluid-switch', FluidSwitch);
}
