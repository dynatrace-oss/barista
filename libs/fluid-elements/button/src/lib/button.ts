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
  html,
  property,
  CSSResult,
  TemplateResult,
  css,
  unsafeCSS,
  customElement,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import {
  FLUID_BUTTON_PADDING_SMALL,
  FLUID_BUTTON_PADDING_MEDIUM,
  FLUID_BUTTON_PADDING_LARGE,
  fluidDtText,
} from '@dynatrace/fluid-design-tokens';

/** Defines the possible types of the Fluid buttons colors. */
export type FluidButtonColor = 'main' | 'positive' | 'warning' | 'error' | null;

/** Defines the possible types of the Fluid buttons sizes. */
export type FluidButtonSize = 'small' | 'medium' | 'large' | null;

/** Defines the possible types of the Fluid buttons emphasis. */
export type FluidButtonEmphasis = 'low' | 'medium' | 'high' | null;
/**
 * This is an experimental button element built with lit-elements and
 * web-components. It registers itself as `fluid-button` custom element.
 * @slot The content of the button will be put inside the button element.
 * @cssprop --fluid-button--padding-small - Controls the padding for small buttons.
 * @cssprop --fluid-button--padding-medium - Controls the padding for medium buttons.
 * @cssprop --fluid-button--padding-large - Controls the padding for large buttons.
 * @cssprop --fluid-button--foreground-key - Controls the foreground color for the key setting.
 * @cssprop --fluid-button--background-key - Controls the background color for the key setting.
 * @cssprop --fluid-button--foreground-key-hover - Controls the foreground hover color for the key setting.
 * @cssprop --fluid-button--background-key-hover - Controls the background hover color for the key setting.
 * @cssprop --fluid-button--foreground-key-active - Controls the foreground active color for the key setting.
 * @cssprop --fluid-button--background-key-active - Controls the background active color for the key setting.
 * @cssprop --fluid-button--foreground-positive - Controls the foreground color for the positive setting.
 * @cssprop --fluid-button--background-positive - Controls the background color for the positive setting.
 * @cssprop --fluid-button--foreground-positive-hover - Controls the foreground  hover color for the positive setting.
 * @cssprop --fluid-button--background-positive-hover - Controls the background  hover color for the positive setting.
 * @cssprop --fluid-button--foreground-positive-active - Controls the foreground active color for the positive setting.
 * @cssprop --fluid-button--background-positive-active - Controls the background active color for the positive setting.
 * @cssprop --fluid-button--foreground-warning - Controls the foreground color for the warning setting.
 * @cssprop --fluid-button--background-warning - Controls the background color for the warning setting.
 * @cssprop --fluid-button--foreground-warning-hover - Controls the foreground  hover color for the warning setting.
 * @cssprop --fluid-button--background-warning-hover - Controls the background  hover color for the warning setting.
 * @cssprop --fluid-button--foreground-warning-active - Controls the foreground active color for the warning setting.
 * @cssprop --fluid-button--background-warning-active - Controls the background active color for the warning setting.
 * @cssprop --fluid-button--foreground-negative - Controls the foreground color for the negative setting.
 * @cssprop --fluid-button--background-negative - Controls the background color for the negative setting.
 * @cssprop --fluid-button--foreground-negative-hover - Controls the foreground hover color for the negative setting.
 * @cssprop --fluid-button--background-negative-hover - Controls the background hover color for the negative setting.
 * @cssprop --fluid-button--foreground-negative-active - Controls the foreground active color for the negative setting.
 * @cssprop --fluid-button--background-negative-active - Controls the background active color for the negative setting.
 * @cssprop --fluid-button--foreground-disabled - Controls the foreground color for the disabled state.
 * @cssprop --fluid-button--background-disabled - Controls the background color for the disabled state.
 */
@customElement('fluid-button')
export class FluidButton extends LitElement {
  /** Styles for the button component */
  static get styles(): CSSResult {
    return css`
      :host {
        --fluid-button--padding-small: ${unsafeCSS(FLUID_BUTTON_PADDING_SMALL)};
        --fluid-button--padding-medium: ${unsafeCSS(
          FLUID_BUTTON_PADDING_MEDIUM,
        )};
        --fluid-button--padding-large: ${unsafeCSS(FLUID_BUTTON_PADDING_LARGE)};

        --fluid-button--foreground-key: var(--color-primary-100);
        --fluid-button--background-key: var(--color-neutral-60);
        --fluid-button--foreground-key-hover: var(--color-primary-110);
        --fluid-button--background-key-hover: var(--color-neutral-60);
        --fluid-button--foreground-key-active: var(--color-primary-120);
        --fluid-button--background-key-active: var(--color-neutral-60);

        --fluid-button--foreground-positive: var(--color-positive-100);
        --fluid-button--background-positive: var(--color-neutral-60);
        --fluid-button--foreground-positive-hover: var(--color-positive-110);
        --fluid-button--background-positive-hover: var(--color-neutral-60);
        --fluid-button--foreground-positive-active: var(--color-positive-120);
        --fluid-button--background-positive-active: var(--color-neutral-60);

        --fluid-button--foreground-warning: var(--color-warning-100);
        --fluid-button--background-warning: var(--color-neutral-60);
        --fluid-button--foreground-warning-hover: var(--color-warning-110);
        --fluid-button--background-warning-hover: var(--color-neutral-60);
        --fluid-button--foreground-warning-active: var(--color-warning-120);
        --fluid-button--background-warning-active: var(--color-neutral-60);

        --fluid-button--foreground-negative: var(--color-negative-100);
        --fluid-button--background-negative: var(--color-neutral-60);
        --fluid-button--foreground-negative-hover: var(--color-negative-110);
        --fluid-button--background-negative-hover: var(--color-neutral-60);
        --fluid-button--foreground-negative-active: var(--color-negative-120);
        --fluid-button--background-negative-active: var(--color-neutral-60);

        --fluid-button--foreground-disabled: var(--color-neutral-100);
        --fluid-button--background-disabled: var(--color-neutral-60);
      }

      :host([disabled]) {
        pointer-events: none;
      }

      /* COLORS */
      .fluid-color--main {
        --fluid-button--foreground: var(--fluid-button--foreground-key);
        --fluid-button--background: var(--fluid-button--background-key);
        --fluid-button--foreground-hover: var(
          --fluid-button--foreground-key-hover
        );
        --fluid-button--background-hover: var(
          --fluid-button--background-key-hover
        );
        --fluid-button--foreground-active: var(
          --fluid-button--foreground-key-active
        );
        --fluid-button--background-active: var(
          --fluid-button--background-key-active
        );
      }

      .fluid-color--positive {
        --fluid-button--foreground: var(--fluid-button--foreground-positive);
        --fluid-button--background: var(--fluid-button--background-positive);
        --fluid-button--foreground-hover: var(
          --fluid-button--foreground-positive-hover
        );
        --fluid-button--background-hover: var(
          --fluid-button--background-positive-hover
        );
        --fluid-button--foreground-active: var(
          --fluid-button--foreground-positive-active
        );
        --fluid-button--background-active: var(
          --fluid-button--background-positive-active
        );
      }

      .fluid-color--warning {
        --fluid-button--foreground: var(--fluid-button--foreground-warning);
        --fluid-button--background: var(--fluid-button--background-warning);
        --fluid-button--foreground-hover: var(
          --fluid-button--foreground-warning-hover
        );
        --fluid-button--background-hover: var(
          --fluid-button--background-warning-hover
        );
        --fluid-button--foreground-active: var(
          --fluid-button--foreground-warning-active
        );
        --fluid-button--background-active: var(
          --fluid-button--background-warning-active
        );
      }

      .fluid-color--error {
        --fluid-button--foreground: var(--fluid-button--foreground-negative);
        --fluid-button--background: var(--fluid-button--background-negative);
        --fluid-button--foreground-hover: var(
          --fluid-button--foreground-negative-hover
        );
        --fluid-button--background-hover: var(
          --fluid-button--background-negative-hover
        );
        --fluid-button--foreground-active: var(
          --fluid-button--foreground-negative-active
        );
        --fluid-button--background-active: var(
          --fluid-button--background-negative-active
        );
      }

      /* DISABLED */
      .fluid-button[disabled] {
        --fluid-button--foreground: var(--fluid-button--foreground-disabled);
        --fluid-button--background: var(--fluid-button--background-disabled);
      }

      .fluid-button {
        appearance: none;
        ${unsafeCSS(fluidDtText())};
        border-width: 2px;
        border-style: solid;
        display: inline-block;
        cursor: pointer;
      }

      /* SIZE */
      .fluid-size--small {
        padding: var(--fluid-button--padding-small);
      }
      .fluid-size--medium {
        padding: var(--fluid-button--padding-medium);
      }
      .fluid-size--large {
        padding: var(--fluid-button--padding-large);
      }

      /* EMPHASIS */
      .fluid-emphasis--low {
        background: transparent;
        border-color: transparent;
        color: var(--fluid-button--foreground);
      }
      .fluid-emphasis--low:hover {
        background: transparent;
        border-color: transparent;
        color: var(--fluid-button--foreground-hover);
      }
      .fluid-emphasis--low:active {
        background: transparent;
        border-color: transparent;
        color: var(--fluid-button--foreground-active);
      }

      .fluid-emphasis--medium {
        background: var(--fluid-button--background);
        border-color: var(--fluid-button--foreground);
        color: var(--fluid-button--foreground);
      }
      .fluid-emphasis--medium:hover {
        background: var(--fluid-button--background-hover);
        border-color: var(--fluid-button--foreground-hover);
        color: var(--fluid-button--foreground-hover);
      }
      .fluid-emphasis--medium:active {
        background: var(--fluid-button--background-active);
        border-color: var(--fluid-button--foreground-active);
        color: var(--fluid-button--foreground-active);
      }

      .fluid-emphasis--high {
        background: var(--fluid-button--foreground);
        border-color: var(--fluid-button--foreground);
        color: var(--fluid-button--background);
      }
      .fluid-emphasis--high:hover {
        background: var(--fluid-button--foreground-hover);
        border-color: var(--fluid-button--foreground-hover);
        color: var(--fluid-button--background-hover);
      }
      .fluid-emphasis--high:active {
        background: var(--fluid-button--foreground-active);
        border-color: var(--fluid-button--foreground-active);
        color: var(--fluid-button--background-active);
      }
    `;
  }

  /**
   * Defines if the button is disabled or not.
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Defines the color theme of the button.
   * @attr
   * @type {'main' | 'positive' | 'warning' | 'error' }
   * @default 'main'
   */
  @property({ type: String, reflect: false })
  get color(): FluidButtonColor {
    return this._color;
  }
  set color(value: FluidButtonColor) {
    const oldColor = this._color;
    this._color = value ? value : 'main';
    this.requestUpdate('color', oldColor);
  }
  private _color: FluidButtonColor = 'main';

  /**
   * Defines the emphasis of the button.
   * @attr
   * @type {'low' | 'medium' | 'high'}
   * @default 'medium'
   */
  @property({ type: String, reflect: false })
  get emphasis(): FluidButtonEmphasis {
    return this._emphasis;
  }
  set emphasis(value: FluidButtonEmphasis) {
    const oldEmphasis = this._emphasis;
    this._emphasis = value ? value : 'medium';
    this.requestUpdate('emphasis', oldEmphasis);
  }
  private _emphasis: FluidButtonEmphasis = 'medium';

  /**
   * Defines the size of the button.
   * @attr
   * @type {'small' | 'default' | 'large' }
   * @default 'large'
   */
  @property({ type: String, reflect: false })
  get size(): FluidButtonSize {
    return this._size;
  }
  set size(value: FluidButtonSize) {
    const oldSize = this._size;
    this._size = value ? value : 'large';
    this.requestUpdate('size', oldSize);
  }
  private _size: FluidButtonSize = 'large';

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    const classMapData = {
      'fluid-button': true,
      'fluid-color--main': this.color === 'main',
      'fluid-color--positive': this.color === 'positive',
      'fluid-color--warning': this.color === 'warning',
      'fluid-color--error': this.color === 'error',
      'fluid-emphasis--low': this.emphasis === 'low',
      'fluid-emphasis--medium': this.emphasis === 'medium',
      'fluid-emphasis--high': this.emphasis === 'high',
      'fluid-size--small': this.size === 'small',
      'fluid-size--medium': this.size === 'medium',
      'fluid-size--large': this.size === 'large',
    };

    return html`
      <button class=${classMap(classMapData)} ?disabled=${this.disabled}>
        <span class="fluid-button-label">
          <slot></slot>
        </span>
      </button>
    `;
  }
}
