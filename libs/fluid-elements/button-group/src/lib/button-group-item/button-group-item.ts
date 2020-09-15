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
  css,
  LitElement,
  CSSResult,
  TemplateResult,
  property,
  customElement,
  unsafeCSS,
  PropertyValues,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { FluidButtonGroupItemCheckedChangeEvent } from '../button-group-events';

import { ENTER, SPACE, TAB } from '@dynatrace/shared/keycodes';

import {
  fluidDtText,
  FLUID_SPACING_2X_SMALL,
  FLUID_SPACING_SMALL,
} from '@dynatrace/fluid-design-tokens';

let uniqueCounter = 0;

/**
 * A basic representation of the button-group-item
 * @element fluid-button-group-item
 * @slot - Default slot lets the user provide a label for the button-group-item.
 * @fires checkedChange - Event that is being fired when the button-group-item checked state changes due
 * to user interaction.
 * @cssprop --fluid-button-group-item--label-color - Customize the label color.
 * @cssprop --fluid-button-group-item--radio-hover-color - Customize the color of the button-group-item nob when hovering.
 * @cssprop --fluid-button-group-item--radio-active-color - Customize the color of the button-group-item nob when active.
 */
@customElement('fluid-button-group-item')
export class FluidButtonGroupItem extends LitElement {
  /**
   * Unique identifier used for the id and label connection
   * within the button group item.
   */
  private _unique = `fluid-button-group-item-${uniqueCounter++}`;

  /** Reference to the input container */
  private _inputElement: HTMLInputElement;

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

        cursor: pointer;

        --fluid-button-group-item--label-color: var(--color-neutral-150);
        --fluid-button-group-item--radio-hover-color: var(--color-neutral-100);
        --fluid-button-group-item--radio-active-color: var(--color-primary-100);
      }

      :host([disabled]) {
        pointer-events: none;
      }

      :host([disabled]) .fluid-label {
        opacity: 0.5;
      }

      :host([disabled]) .fluid-button-group-item-svg {
        opacity: 0.5;
      }

      .fluid-button-group-item {
        cursor: pointer;
        background-color: var(--color-neutral-60);
        display: inline-block;
        position: relative;
        width: max-content;
        text-align: center;
        padding-top: ${unsafeCSS(FLUID_SPACING_2X_SMALL)};
        padding-right: ${unsafeCSS(FLUID_SPACING_SMALL)};
      }

      .fluid-button-group-item-input {
        cursor: pointer;
        position: absolute;
        opacity: 0;
      }

      .fluid-button-group-item-label {
        cursor: pointer;
      }

      .fluid-button-group-item-svg {
        cursor: pointer;
        height: 18px;
        fill: transparent;
      }

      .fluid-button-group-item-svg:not(.fluid-state--tabbed) {
        outline: none;
      }

      .fluid-button-group-item:hover .fluid-button-group-item-svg-circle {
        fill: var(--fluid-button-group-item--radio-hover-color);
        opacity: 1;
      }

      .fluid-button-group-item-svg:focus .fluid-button-group-item-svg-circle {
        fill: var(--fluid-button-group-item--radio-hover-color);
        opacity: 1;
      }

      .fluid-state--checked .fluid-button-group-item-svg-circle {
        fill: var(--fluid-button-group-item--radio-active-color);
        opacity: 1;
      }

      .fluid-button-group-item:hover
        .fluid-state--checked
        .fluid-button-group-item-svg-circle {
        fill: var(--fluid-button-group-item--radio-active-color);
        opacity: 1;
      }

      .fluid-state--checked.fluid-button-group-item-svg:focus
        .fluid-button-group-item-svg-circle {
        fill: var(--fluid-button-group-item--radio-active-color);
        opacity: 1;
      }

      label {
        display: inline-flex;
        align-items: center;
        height: fit-content;
      }

      .fluid-label {
        ${unsafeCSS(fluidDtText())};
        margin-left: ${unsafeCSS(FLUID_SPACING_2X_SMALL)};
      }
    `;
  }

  /**
   * The id attribute of the native input element.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  id = this._unique;

  /**
   * The value attribute of the native input element.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: false })
  value: string;

  /**
   * The name attribute of the native input element.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: false })
  name: string;

  /**
   * Whether the button-group-item was navigated to using keys.
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: false })
  tabbed = false;

  /**
   * Whether the button-group-item is checked or not.
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const oldValue = this._checked;
    this._checked = value;
    this.requestUpdate('checked', oldValue);
    if (!this._checked) {
      this._inputElement!.checked = false;
    }
  }
  private _checked = false;

  /**
   * Whether the button-group-item is disabled or not.
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    const oldValue = this._disabled;
    this._disabled = value;
    this.requestUpdate('disabled', oldValue);
    if (this._disabled) {
      this._tabIndex = -1;
    }
  }
  private _disabled = false;

  /**
   * Property for the tabindex of the svg in the template.
   * @attr
   * @type number
   */
  @property({ type: Number, reflect: false })
  get tabIndex(): number {
    return this._tabIndex;
  }
  set tabIndex(value: number) {
    if (!this.disabled) {
      const oldValue = this._tabIndex;
      this._tabIndex = value;
      this.requestUpdate('tabIndex', oldValue);
    } else {
      this._tabIndex = -1;
    }
  }
  private _tabIndex = 0;

  /**
   * Role of the radio.
   * @private - An internal prop that should not appear in the readme and should
   * not be set by the outside.
   */
  @property({
    type: String,
    reflect: true,
  })
  role: string = 'radio';

  /**
   * Aria-checked attribute of the radio button.
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
  firstUpdated(props: PropertyValues): void {
    super.firstUpdated(props);
    this._inputElement = this.shadowRoot!.querySelector('input')!;
  }

  /** Update lifecycle */
  update(props: PropertyValues): void {
    // Aria-checked depends on the value of checked, but is never actually
    // set by the litElement reactivity. In the updated lifeCycle
    // we need to manually update the ariaChecked attribute here.
    if (props.has('checked')) {
      this.ariaChecked = this.checked.toString();
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
    const svgClassMapData = {
      'fluid-button-group-item-svg': true,
      'fluid-state--tabbed': this.tabbed,
      'fluid-state--checked': this.checked,
      'fluid-state--disabled': this.disabled,
    };

    return html`
      <div @click="${this._handleClick}" class="fluid-button-group-item">
        <input
          id=${this.id}
          class="fluid-button-group-item-input"
          type="radio"
          name="${this.name}"
          value="${this.value}"
          ?checked="${this.checked}"
          tabindex="-1"
        /><label class="fluid-button-group-item-label" for="${this.id}">
          <svg
            class=${classMap(svgClassMapData)}
            viewBox="0 0 10 22"
            tabindex="${this.tabIndex}"
            @keydown="${this._handleKeyDown}"
            @keyup="${this._handleKeyUp}"
            @blur="${this._handleBlur}"
          >
            <g transform="translate(5, 10)">
              <circle class="fluid-button-group-item-svg-circle" r="3.5" />
            </g>
          </svg>
          <span class="fluid-label">
            <slot></slot>
          </span>
        </label>
      </div>
    `;
  }

  /** Handler preventing default scrolling */
  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.code === SPACE) {
      event.preventDefault();
    }
  }

  /** Handles keyboard support for checking a button-group-item */
  private _handleKeyUp(event: KeyboardEvent): void {
    if (event.code === TAB) {
      this.tabbed = true;
    }
    if (event.code === SPACE || event.code === ENTER) {
      this.checked = true;
      this._dispatchCheckedChangedEvent();
    }
  }

  /** Handles changes in the native input by listening on click then sets the new checked value and dispatches the button-group-item id */
  private _handleClick(): void {
    if (!this.checked) {
      this.checked = true;
      this._dispatchCheckedChangedEvent();
    }
  }

  /** Handles blur setting the tabbed attribute to false */
  private _handleBlur(): void {
    this.tabbed = false;
  }

  /** Dispatches the custom event with the id of the fluid-button-group-item */
  private _dispatchCheckedChangedEvent(): void {
    this.dispatchEvent(new FluidButtonGroupItemCheckedChangeEvent(this.id));
  }
}
