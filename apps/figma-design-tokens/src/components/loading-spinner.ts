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
  customElement,
  TemplateResult,
  css,
  CSSResult,
} from 'lit-element';

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  // adapted from https://projects.lukehaas.me/css-loaders/
  static get styles(): CSSResult {
    return css`
      .loader,
      .loader:after {
        border-radius: 50%;
        width: 10em;
        height: 10em;
      }

      .loader {
        margin: 60px auto;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        border: 1.1em solid white;
        border-left: 1.1em solid black;
        transform: translateZ(0);
        animation: load 1.1s infinite linear;
      }

      @keyframes load {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `;
  }

  render(): TemplateResult {
    return html`<div class="loader">Loading...</div>`;
  }
}
