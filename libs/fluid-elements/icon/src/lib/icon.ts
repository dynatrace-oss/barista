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
  version="1.1"
  id="Layer_1"
  xmlns="http://www.w3.org/2000/svg"
  xlink="http://www.w3.org/1999/xlink"
  x="0px"
  y="0px"
  viewBox="0 0 512 512"
  enable-background="new 0 0 512 512"
  space="preserve"
>
  <path
    d="M258.06592,108.0001h-4.13184c-136.58691,0-221.93408,148-221.93408,148s84.53418,148,221.93408,148h4.13184	c137.3999,0,221.93408-148,221.93408-148S394.65283,108.0001,258.06592,108.0001z M332.3667,332.36874	c-20.39893,20.39795-47.52148,31.63135-76.37207,31.63135c-28.85596,0-55.97998-11.23535-76.375-31.63574	C159.22949,311.96884,148,284.84872,148,256.00058c0-28.84912,11.22949-55.96924,31.61963-76.36475	c20.39502-20.40088,47.51855-31.63574,76.375-31.63574c28.85059,0,55.97363,11.2334,76.37207,31.63135	C352.76562,200.02939,364,227.15097,364,256.00058C364,284.8497,352.76562,311.97079,332.3667,332.36874z"
  ></path>
  <path
    d="M255.99475,188.00009c37.5625,0,68.00525,30.44301,68.00525,68.00067	c0,37.55618-30.44275,67.99933-68.00525,67.99933C218.422,324.00009,188,293.55695,188,256.00076	C188,218.4431,218.422,188.00009,255.99475,188.00009z"
  ></path>
</svg>`;

export type FluidIconType = 'overview';

@customElement('fluid-icon')
export class FluidIcon extends LitElement {
  /** */
  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
      }

      svg {
        height: 100%;
        fill: var(--fluid-input--foreground);
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
      case 'overview':
        return ARROW_DOWN_ICON;
      default:
        throw new Error('No icon selected');
    }
  }
}
