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

import { css, unsafeCSS, CSSResult } from 'lit-element';
import {
  FLUID_INPUT_BOX_SHADOW,
  FLUID_INPUT_PADDING,
  FLUID_INPUT_PADDING_INLINE,
  fluidDtText,
} from '@dynatrace/fluid-design-tokens';

export const inputStyles: CSSResult = css`
  :host {
    /*
    TODO
    change hover/focus colors to rgba, according to figma colors
   */
    display: inline-block;

    --fluid-input--padding: ${unsafeCSS(FLUID_INPUT_PADDING)};

    --fluid-input--foreground-key: var(--color-neutral-140);
    --fluid-input--background-key: var(--color-neutral-140);
    --fluid-input--border-key: var(--color-neutral-100);
    --fluid-input--foreground-key-hover: var(--color-primary-100);
    --fluid-input--background-key-hover: var(--color-neutral-50);
    --fluid-input--border-key-hover: var(--color-primary-100);
    --fluid-input--foreground-key-focus: var(--color-primary-100);
    --fluid-input--background-key-focus: var(--color-neutral-50);
    --fluid-input--border-key-focus: var(--color-primary-100);

    --fluid-input--foreground-negative: var(--color-error-80);
    --fluid-input--border-negative: var(--color-error-80);
    --fluid-input--foreground-negative-hover: var(--color-error-80);
    --fluid-input--border-negative-hover: var(--color-error-80);
    --fluid-input--foreground-negative-focus: var(--color-error-80);
    --fluid-input--border-negative-focus: var(--color-error-80);

    --fluid-input--foreground-disabled: var(--color-neutral-100);
    --fluid-input--background-disabled: var(--color-neutral-60);
    --fluid-input--border-disabled: var(--color-neutral-100);

    --fluid-input--placeholder: var(--color-neutral-100);
    --fluid-input--hint: var(--color-neutral-100);
  }

  /* COLORS */
  .fluid-color--main {
    --fluid-input--foreground: var(--fluid-input--foreground-key);
    --fluid-input--background: var(--fluid-input--background-key);
    --fluid-input--border: var(--fluid-input--border-key);

    --fluid-input--foreground-hover: var(--fluid-input--foreground-key-hover);
    --fluid-input--background-hover: var(--fluid-input--background-key-hover);
    --fluid-input--border-hover: var(--fluid-input--border-key-hover);

    --fluid-input--foreground-focus: var(--fluid-input--foreground-key-focus);
    --fluid-input--background-focus: var(--fluid-input--background-key-focus);
    --fluid-input--border-focus: var(--fluid-input--border-key-focus);
  }

  .fluid-color--error {
    --fluid-input--foreground: var(--fluid-input--foreground-negative);
    --fluid-input--border: var(--fluid-input--border-negative);

    --fluid-input--foreground-hover: var(--fluid-input--foreground-negative);
    --fluid-input--border-hover: var(--fluid-input--border-negative);
  }

  /* DISABLED */
  .fluid-color--disabled {
    --fluid-input--foreground: var(--fluid-input--foreground-disabled);
    --fluid-input--background: var(--fluid-input--background-disabled);
    --fluid-input--border: var(--fluid-input--border-disabled);
  }

  .fluid-input-container:hover {
    --fluid-input--foreground: var(--fluid-input--foreground-hover);
    --fluid-input--background: var(--fluid-input--background-hover);
    --fluid-input--border: var(--fluid-input--border-hover);
  }

  .fluid-input-container--focus {
    --fluid-input--foreground: var(--fluid-input--foreground-focus);
    --fluid-input--background: var(--fluid-input--background-focus);
    --fluid-input--border: var(--fluid-input--border-focus);
  }

  .fluid-input {
    ${unsafeCSS(fluidDtText())};
    display: inline-grid;
    color: var(--fluid-input--foreground);
  }

  .fluid-input-hint-container {
    display: inline-grid;
  }

  .fluid-input-container {
    position: relative;
    display: inline-grid;
    grid-template-columns: auto auto;
    align-items: center;
    padding: 0 ${unsafeCSS(FLUID_INPUT_PADDING_INLINE)};
    transition: background-color 100ms ease-in-out;
  }

  .fluid-input-container--focus {
    background-color: var(--fluid-input--background-focus);
    box-shadow: ${unsafeCSS(FLUID_INPUT_BOX_SHADOW)} rgba(21, 23, 27, 0.2);
  }

  .fluid-input-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${unsafeCSS(FLUID_INPUT_PADDING_INLINE)};
    width: calc(100% - 2 * ${unsafeCSS(FLUID_INPUT_PADDING_INLINE)});
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(--fluid-input--border);
    will-change: left width;
    transition: left 100ms ease-in-out, width 100ms ease-in-out;
  }

  .fluid-input-container--focus::after {
    left: 0;
    width: 100%;
  }

  .fluid-input--label-left {
    display: inline-block;
  }

  .fluid-icon-container {
    height: 1rem;
  }

  .fluid-input-hint {
    padding-left: ${unsafeCSS(FLUID_INPUT_PADDING_INLINE)};
    color: var(--fluid-input--hint);
    font-size: 0.8rem;
  }

  /* SLOTTED ELEMENTS STYLES */
  ::slotted(label) {
    padding-left: ${unsafeCSS(FLUID_INPUT_PADDING_INLINE)};
    font-size: 0.8rem;
  }

  .fluid-input--label-left ::slotted(label) {
    padding-right: ${unsafeCSS(FLUID_INPUT_PADDING_INLINE)};
    font-size: 1rem;
  }

  ::slotted(input) {
    ${unsafeCSS(fluidDtText())};
    padding: ${unsafeCSS(FLUID_INPUT_PADDING)} 0;
    width: 100%;
    appearance: none;
    background: none;
    border: none;
    color: var(--fluid-input--foreground-key);
    text-overflow: ellipsis;
  }

  ::slotted(input:focus) {
    outline: none;
  }

  ::slotted(input)::placeholder {
    color: var(--fluid-input--placeholder);
    transition: opacity 100ms ease-in-out;
  }

  ::slotted(input:focus)::placeholder {
    opacity: 0;
  }

  ::slotted(fluid-icon) {
    height: 100%;
    --fluid-icon--primary-color: var(--fluid-input--foreground);
  }
`;
