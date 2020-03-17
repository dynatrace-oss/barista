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
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import styles from './button.scss';

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
export class FluidButton extends LitElement {
  /** Styles for the button component */
  static get styles(): CSSResult {
    return styles;
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

if (!customElements.get('fluid-button')) {
  customElements.define('fluid-button', FluidButton);
}
