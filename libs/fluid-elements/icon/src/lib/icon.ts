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
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

const ARROW_DOWN_ICON = html`<svg
  viewBox="0 0 12 12"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    transform="translate(0,2)"
    d="M10.59 0.590088L6 5.17009L1.41 0.590088L0 2.00009L6 8.00009L12 2.00009L10.59 0.590088Z"
  />
</svg>`;

const CHECKMARK_ICON = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 12 12"
>
  <polygon
    points="4.1,9.3 0,5.2 1.4,3.9 4.1,6.6 10.6,0 12,1.4 "
    transform="translate(0,1)"
  />
</svg>`;

export type FluidIconType = 'arrow-down' | 'checkmark';

@customElement('fluid-icon')
export class FluidIcon extends LitElement {
  /** Returns styles for FluidIcon component. */
  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;

        --fluid-icon--color: var(--color-neutral-100);
      }

      svg {
        height: 100%;
        min-height: 14px;
        fill: var(--fluid-icon--color);
      }
    `;
  }

  /**
   * Defines the icon to be displayed.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: false })
  name: FluidIconType;

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    switch (this.name) {
      case 'arrow-down':
        return ARROW_DOWN_ICON;
      case 'checkmark':
        return CHECKMARK_ICON;
      default:
        console.error('No icon selected');
        return html``;
    }
  }
}
