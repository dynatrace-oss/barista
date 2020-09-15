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
  property,
  TemplateResult,
  html,
  css,
  unsafeCSS,
  customElement,
  PropertyValues,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import {
  FluidTabDisabledEvent,
  FluidTabBlurredEvent,
  FluidTabActiveSetEvent,
} from '../tab-events';

import {
  FLUID_SPACING_3X_SMALL,
  FLUID_SPACING_MEDIUM,
  fluidDtText,
} from '@dynatrace/fluid-design-tokens';

/** A unique id */
let _unique = 0;

/**
 * This is a experimental version of the tab component
 * It registers itself as `fluid-tab` custom element.
 * @element fluid-tab
 * @slot - Default slot to provide a label for the tab.
 */
@customElement('fluid-tab')
export class FluidTab extends LitElement {
  /** Styles for the tab component */
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
        margin-right: ${unsafeCSS(FLUID_SPACING_MEDIUM)};

        --fluid-tab--label-color: var(--color-neutral-100);
        --fluid-tab--label-hover-color: var(--color-neutral-150);
        --fluid-tab--label-active-color: var(--color-neutral-150);
        --fluid-tab--label-disabled-color: var(--color-neutral-80);
        --fluid-tab--active-underline-color: var(--color-primary-100);
        --fluid-tab--hover-underline-color: var(--color-neutral-100);
      }

      /**
       * Disabled state
       */
      :host([disabled]) {
        pointer-events: none;
      }
      :host([disabled]) .fluid-tab {
        color: var(--fluid-tab--label-disabled-color);
      }
      :host([disabled]) .fluid-tab:hover::after {
        background-color: none;
      }

      ::slotted(*) {
        text-decoration: none;
        color: var(--fluid-tab--label-color);
      }

      .fluid-tab {
        ${unsafeCSS(fluidDtText())};
        cursor: pointer;
        display: inline-block;
        position: relative;
        color: var(--fluid-tab--label-color);
        white-space: unset;
      }

      .fluid-tab::after {
        position: absolute;
        width: 100%;
        height: ${unsafeCSS(FLUID_SPACING_3X_SMALL)};
        background-color: transparent;
        bottom: -${unsafeCSS(FLUID_SPACING_3X_SMALL)};
        left: 0;
        content: '';
      }
      .fluid-tab:hover {
        color: var(--fluid-tab--label-hover-color);
      }
      .fluid-tab:hover::after {
        background-color: var(--fluid-tab--hover-underline-color);
      }

      .fluid-state--active {
        color: var(--fluid-tab--label-active-color);
      }
      .fluid-state--active:hover::after {
        background-color: var(--fluid-tab--active-underline-color);
      }
      .fluid-state--active::after {
        background-color: var(--fluid-tab--active-underline-color);
      }

      .fluid-tab:not(.fluid-state--tabbed) {
        outline: none;
      }
    `;
  }

  /**
   * Defines the tab element with an id attribute
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  tabid = `fluid-tab-${_unique++}`;

  /**
   * Defines whether a tab is disabled or not
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    const oldValue = this._disabled;
    if (this._disabled !== value) {
      this._disabled = value;
      this.requestUpdate('disabled', oldValue);
      if (this._disabled) {
        this._active = false;
        this.tabindex = -1;
        this.dispatchEvent(new FluidTabDisabledEvent(this.tabid));
      }
    }
  }
  private _disabled = false;

  /**
   * Defines the tabindex attribute
   * @attr
   * @type number
   */
  @property({ type: Number, reflect: false })
  tabindex = 0;

  /**
   * Defines whether a tab is active or not
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: false })
  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    const oldActive = this._active;
    // Only set active true if not disabled
    this._active = this.disabled === false ? value : false;
    this.requestUpdate('active', oldActive);
    this.tabindex = this._active ? 0 : -1;
    if (value) {
      this._dispatchActiveSetEvent();
    }
  }
  private _active = false;

  /**
   * Role of the tab.
   * @private - An internal prop that should not appear in the readme and should
   * not be set by the outside.
   */
  @property({
    type: String,
    reflect: true,
  })
  role: string = 'tab';

  /**
   * Aria-selected attribute of the checkbox.
   * @private - An internal prop that should not appear in the readme and should
   * not be set by the outside.
   */
  @property({
    type: String,
    reflect: true,
    attribute: 'aria-selected',
  })
  ariaSelected: string = 'false';

  /** Update lifecycle */
  update(props: Map<string | number | symbol, unknown>): void {
    // Aria-selected depends on the value of active, but is never actually
    // set by the litElement reactivity. In the updated lifeCycle
    // we need to manually update the ariaSelected attribute here.
    this.ariaSelected = this._active.toString();
    // Changing the aria-selected or any observed property in the update, will
    // add it to the updated properties. When calling super first in, the change
    // of properties in the update call will trigger an update, as the properties
    // will have changed after the super.update() call. To prevent an additional
    // cycle, we make the modifications before calling the super lifecycle
    super.update(props);
  }

  /** Defines whether the user focused an element by tabbing or not */
  @property({ type: Boolean, reflect: false })
  get tabbed(): boolean {
    return this._tabbed;
  }
  set tabbed(value: boolean) {
    const oldTabbed = this._tabbed;
    this._tabbed = value;
    this.requestUpdate('tabbed', oldTabbed);
    this.tabindex = value === true ? 0 : -1;
  }
  private _tabbed = false;

  /** Contains the span element of this template */
  private _rootElement: HTMLSpanElement;

  /** First updated lifecycle */
  firstUpdated(props: PropertyValues): void {
    super.firstUpdated(props);
    this._rootElement = this.shadowRoot?.querySelector(
      '.fluid-tab',
    )! as HTMLSpanElement;
  }

  private _dispatchActiveSetEvent(): void {
    this.dispatchEvent(new FluidTabActiveSetEvent(this.tabid));
  }

  /** Dispatches the custom event with the this tabid  */
  private _dispatchActiveTabEvent(): void {
    this.dispatchEvent(new FluidTabActiveSetEvent(this.tabid));
  }

  /** Handles the click event. Dispatches the tab when a new tab was clicked */
  private handleClick(): void {
    if (!this._active) {
      this.active = true;
      this._dispatchActiveTabEvent();
    }
  }

  /** Fires an event if the focused tab was tabbed to but not set to active */
  private handleBlur(): void {
    if (this._tabbed && !this._active) {
      this.dispatchEvent(new FluidTabBlurredEvent(this.tabid));
    }
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    const classes = {
      'fluid-tab': true,
      'fluid-state--tabbed': this._tabbed,
      'fluid-state--active': this._active,
    };

    // Linebreak causes the element to have a space
    return html`<span
      class=${classMap(classes)}
      tabindex=${this.tabindex}
      ?disabled="${this.disabled}"
      @click="${this.handleClick}"
      @blur="${this.handleBlur}"
    >
      <slot></slot>
    </span>`;
  }

  /** Focuses the span element in the template */
  focus(): void {
    this._rootElement.focus();
  }
}
