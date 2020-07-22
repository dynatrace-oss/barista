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
  html,
  LitElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import styles from './checkbox.scss';
import { SPACE } from '@dynatrace/shared/keycodes';

let uniqueCounter = 0;

/**
 * Custom event implementation that mimics a native change event.
 */
export class FluidCheckboxChangeEvent extends CustomEvent<any> {
  constructor(public checked: boolean) {
    super('change', { bubbles: true, composed: true });
  }
}

/**
 * Custom event implementation for the IndeterminateChange event.
 */
export class FluidCheckboxIndeterminateChangeEvent extends CustomEvent<any> {
  constructor(public checked: boolean) {
    super('indeterminateChange', { bubbles: true, composed: true });
  }
}

// TODO: Add required property and validation?

/**
 * A basic representation of the checkbox input
 * @element fluid-checkbox
 * @slot - Default slot lets the user provide a label for the checkbox.
 * @fires change - Event that is being fired when the checkbox state changes due
 * to user interaction.
 * @fires indeterminateChange - Event that is being fired when the indeterminate
 * state of the checkbox changes.
 * @cssprop --fluid-checkbox--label-color - Customize the label color.
 * @cssprop --fluid-checkbox--box-glow-color - Customize the color of the checkbox glow when hovering.
 * @cssprop --fluid-checkbox--border-color - Customize the border color of the checkbox.
 * @cssprop --fluid-checkbox--background-color - Customize the background color of the checked/indeterminate checkbox.
 * @cssprop --fluid-checkbox--mark-color - Customize the color of the mark / indeterminate marker.
 */
export class FluidCheckbox extends LitElement {
  /**
   * Unique identifier used for the id and label connection
   * within the checkbox.
   */
  private _unique = `fluid-checkbox-${uniqueCounter++}`;

  /** Reference to the native input within the shadowed template. */
  private _inputElement: HTMLInputElement;

  /** Styles for the button component */
  static get styles(): CSSResult {
    return styles;
  }

  /**
   * Defines if the checkbox is disabled or not.
   * @attr
   * @type boolean
   */
  @property({
    type: Boolean,
    reflect: true,
  })
  disabled = false;

  /**
   * Defines if the checkbox is checked or not.
   * @attr
   * @type boolean
   */
  @property({
    type: Boolean,
    reflect: true,
  })
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    if (value !== this._checked) {
      const oldValue = this._checked;
      this._checked = value;
      this.requestUpdate('checked', oldValue);
    }
  }
  private _checked = false;

  /**
   * Indeterminate state property.
   * @attr
   * @type boolean
   */
  @property({
    type: Boolean,
    reflect: true,
  })
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    if (value !== this._indeterminate) {
      const oldValue = this._indeterminate;
      this._indeterminate = value;
      this.requestUpdate('indeterminate', oldValue);
      this._dispatchIndeterminateChangeEvent();
    }
  }
  private _indeterminate = false;

  /**
   * Role of the checkbox.
   * @private - An internal prop that should not appear in the readme and should
   * not be set by the outside.
   */
  @property({
    type: String,
    reflect: true,
  })
  role: string = 'checkbox';

  /**
   * Aria-checked attribute of the checkbox.
   * @private - An internal prop that should not appear in the readme and should
   * not be set by the outside.
   */
  @property({
    type: String,
    reflect: true,
    attribute: 'aria-checked',
  })
  ariaChecked: string = 'false';

  /** First updated lifecycle */
  firstUpdated(props: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(props);
    this._inputElement = this.shadowRoot?.querySelector('input')!;
  }

  /** Update lifecycle */
  update(props: Map<string | number | symbol, unknown>): void {
    // Aria-checked depends on the value of checked, but is never actually
    // set by the litElement reactivity. In the updated lifeCycle
    // we need to manually update the ariaChecked attribute here.
    if (props.has('checked') || props.has('indeterminate')) {
      // TODO: extract 'mixed' into a shared constant.
      this.ariaChecked = this.indeterminate ? 'mixed' : this.checked.toString();
    }
    // Changing the aria-checked or any observed property in the update, will
    // add it to the updated properties. When calling super first in, the change
    // of properties in the update call will trigger an update, as the properties
    // will have changed after the super.update() call. To prevent an additional
    // cycle, we make the modifications before calling the super lifecycle
    super.update(props);
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    const classMapData = {
      'fluid-svg-checkbox': true,
      'fluid-state--checked': this.checked && !this.indeterminate,
      'fluid-state--indeterminate': this.indeterminate,
    };

    return html`
      <div class="fluid-checkbox">
        <input
          type="checkbox"
          class="fluid-checkbox-input"
          id="${this._unique}"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          @change="${this._handleInputChange}"
          tabindex="-1"
        />
        <label for="${this._unique}">
          <svg
            class=${classMap(classMapData)}
            viewBox="0 0 24 24"
            tabindex="${this.disabled ? -1 : 0}"
            @keyup="${this._handleKeyup}"
            @keydown="${this._handleKeydown}"
          >
            <g transform="translate(12, 12)">
              <rect
                class="fluid-svg-checkbox-background"
                x="-12"
                y="-12"
                width="24"
                height="24"
              />
            </g>
            <rect
              class="fluid-svg-checkbox-rect"
              x="4.5"
              y="4.5"
              width="15"
              height="15"
              stroke-width="1"
            />
            <path
              class="fluid-svg-checkbox-tick"
              transform="translate(6.3, 7.4), scale(0.77)"
              d="M4.65833 8.81667L1.18333 5.34167L0 6.51667L4.65833 11.175L14.6583 1.175L13.4833 0L4.65833 8.81667Z"
            />
            <rect
              class="fluid-svg-checkbox-indeterminate"
              x="7"
              y="11"
              width="10"
              height="1.5"
              stroke-width="0"
            />
          </svg>
          <span class="fluid-label">
            <slot></slot>
          </span>
        </label>
      </div>
    `;
  }

  /**
   * Dispatches a change event for the checkbox
   */
  private _dispatchChangeEvent(): void {
    this.dispatchEvent(new FluidCheckboxChangeEvent(this.checked));
  }

  /**
   * Dispatches a new IndeterminateChange event.
   */
  private _dispatchIndeterminateChangeEvent(): void {
    this.dispatchEvent(
      new FluidCheckboxIndeterminateChangeEvent(this.indeterminate),
    );
  }

  /**
   * Handles the change of the native checkbox element and routes the
   * event out.
   */
  private _handleInputChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    if (this.indeterminate) {
      this.indeterminate = false;
      this._dispatchIndeterminateChangeEvent();
    }
    this._dispatchChangeEvent();
  }

  /**
   * Handles the keyup event on the checkbox to proxy it to the native input
   * element.
   */
  private _handleKeyup(event: KeyboardEvent): void {
    const proxiedEvent = new KeyboardEvent(event.type, event);
    this._inputElement.dispatchEvent(proxiedEvent);
  }

  /**
   * Event handler to prevent scroll.
   * @param event
   */
  private _handleKeydown(event: KeyboardEvent): void {
    if (event.code === SPACE) {
      event.preventDefault();
    }
  }

  /**
   * Toggles the state of the checkbox.
   * When called programmatically will not fire a `change` event.
   */
  toggle(): void {
    this.checked = !this.checked;
  }
}

if (!customElements.get('fluid-checkbox')) {
  customElements.define('fluid-checkbox', FluidCheckbox);
}
