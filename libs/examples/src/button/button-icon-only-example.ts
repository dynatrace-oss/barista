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

// tslint:disable:max-line-length
import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <button
      dt-icon-button
      aria-label="An example button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <a
      dt-icon-button
      href="#"
      aria-label="An example button containing a proxy icon"
    >
      <dt-icon name="proxy"></dt-icon>
    </a>
    <button
      dt-icon-button
      variant="secondary"
      aria-label="An example secondary button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      variant="nested"
      aria-label="An example nested button containing an agent icon"
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
      color="warning"
      variant="secondary"
      aria-label="An example warning button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="warning"
      variant="nested"
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
    <button
      dt-icon-button
      color="cta"
      variant="secondary"
      aria-label="An example CTA button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="cta"
      variant="nested"
      aria-label="An example CTA button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class ButtonIconOnlyExample {}
// tslint:enable:max-line-length
