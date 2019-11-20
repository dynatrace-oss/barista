/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <section class="dark" dtTheme=":dark">
      <div class="variant">
        <h4>Primary Button</h4>
        <p>
          <button dt-button>Default Button</button>
          <button dt-button color="warning">Warning Button</button>
          <button dt-button color="cta">CTA Button</button>
        </p>
        <p>
          <button dt-button>
            <dt-icon name="agent"></dt-icon>
            Default with icon
          </button>
          <button dt-button color="warning">
            <dt-icon name="agent"></dt-icon>
            Warning with icon
          </button>
          <button dt-button color="cta">
            <dt-icon name="agent"></dt-icon>
            CTA with icon
          </button>
        </p>
        <p>
          <button
            dt-icon-button
            aria-label="An example button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
          <button
            dt-icon-button
            color="warning"
            aria-label="An example warning button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
          <button
            dt-icon-button
            color="cta"
            aria-label="An example CTA button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
        </p>
      </div>
      <div class="variant">
        <h4>Secondary Button</h4>
        <p>
          <button dt-button variant="secondary">Secondary Button</button>
          <button dt-button variant="secondary" color="warning">
            Secondary Warning Button
          </button>
          <button dt-button variant="secondary" color="cta">
            Secondary CTA Button
          </button>
        </p>
        <p>
          <button dt-button variant="secondary">
            <dt-icon name="agent"></dt-icon>
            Default with icon
          </button>
          <button dt-button variant="secondary" color="warning">
            <dt-icon name="agent"></dt-icon>
            Warning with icon
          </button>
          <button dt-button variant="secondary" color="cta">
            <dt-icon name="agent"></dt-icon>
            CTA with icon
          </button>
        </p>
        <p>
          <button
            dt-icon-button
            variant="secondary"
            aria-label="An example button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
          <button
            dt-icon-button
            variant="secondary"
            color="warning"
            aria-label="An example warning button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
          <button
            dt-icon-button
            variant="secondary"
            color="cta"
            aria-label="An example CTA button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
        </p>
      </div>
      <div class="variant">
        <h4>Nested Button</h4>
        <button
          dt-icon-button
          variant="nested"
          aria-label="An example nested button containing an agent icon"
        >
          <dt-icon name="agent"></dt-icon>
        </button>
      </div>
      <div class="variant">
        <h4>Disabled Button</h4>
        <p>
          <button dt-button disabled>Disabled Button</button>
          <button dt-button disabled variant="secondary">
            Disabled Secondary Button
          </button>
        </p>
        <p>
          <button dt-button disabled>
            <dt-icon name="agent"></dt-icon>
            Default with icon
          </button>
          <button dt-button disabled variant="secondary">
            <dt-icon name="agent"></dt-icon>
            Warning with icon
          </button>
        </p>
        <p>
          <button
            dt-icon-button
            disabled
            aria-label="A disabled example button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
          <button
            dt-icon-button
            disabled
            variant="secondary"
            aria-label="A disabled example button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
          <button
            dt-icon-button
            disabled
            variant="nested"
            aria-label="A disabled example button containing an agent icon"
          >
            <dt-icon name="agent"></dt-icon>
          </button>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .variant + .variant {
        margin-top: 20px;
      }
      .dt-button + .dt-button {
        margin-left: 8px;
      }
    `,
  ],
})
export class ButtonDarkExample {}
