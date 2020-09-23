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
  CSSResult,
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
  query,
  unsafeCSS,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { fluidDtText } from '@dynatrace/fluid-design-tokens';

import type { Placement } from '@popperjs/core/lib';
import { Instance, createPopper, Rect } from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';
import offset from '@popperjs/core/lib/modifiers/offset';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';

/**
 * Set defaults for preventing overflow
 * Applied to all instances of the FluidPopover
 */
preventOverflow.options = {
  mainAxis: true,
  altAxis: true,
};

export type FluidPopoverOffsetFunction = ({
  popper,
  reference,
  placement,
}: {
  popper: Rect;
  reference: Rect;
  placement: Placement;
}) => [number | null | undefined, number | null | undefined];

export type FluidPopoverOffset =
  | FluidPopoverOffsetFunction
  | [number | null | undefined, number | null | undefined]
  | undefined;

/**
 * This is an experimental popover element built with lit-elements and
 * web-components. It registers itself as `fluid-popover` custom element.
 * @element fluid-popover
 * @cssprop --fluid-popover--foreground-key - Controls the foreground color for the key setting.
 * @cssprop --fluid-popover--background-key - Controls the background color for the key setting.
 * @cssprop --fluid-popover--background-key - Controls the background color for the key setting.
 * @cssprop --fluid-popover--foreground-key-hover - Controls the foreground hover color for the key setting.
 * @cssprop --fluid-popover--background-key-hover - Controls the background hover color for the key setting.
 * @cssprop --fluid-popover--foreground-disabled - Controls the foreground color for the disabled state.
 * @cssprop --fluid-popover--background-disabled - Controls the background color for the disabled state.
 */
@customElement('fluid-popover')
export class FluidPopover extends LitElement {
  /** Styles for the popover component */
  static get styles(): CSSResult {
    return css`
      :host {
        display: block;

        --fluid-popover--background: var(--color-neutral-50);
      }

      .fluid-popover {
        ${unsafeCSS(fluidDtText())};
        display: none;
        overflow: scroll;
        background: var(--fluid-popover--background);
        box-shadow: 0 3px 10px rgba(21, 23, 27, 0.2);
        transition: opacity 1500ms ease-in-out;
        z-index: 10;
      }

      .fluid-popover--open {
        display: block;
      }
    `;
  }

  /**
   * Defines whether the popover is open.
   * @attr
   * @type boolean
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    const oldOpen = this._open;
    this._open = value;
    this._togglePopover();
    this.requestUpdate(`open`, oldOpen);
  }
  private _open = false;

  /**
   * The element to connect the popover to
   * @type HTMLElement
   */
  @property({ attribute: false })
  anchor: HTMLElement;

  /** Defines the placement of the popper.js popover */
  @property({ type: String, reflect: true })
  placement: Placement = `bottom-start`;

  /** Defines the placement of the popper.js popover */
  @property({ type: Array, reflect: true })
  get fallbackplacement(): Placement[] {
    return this._fallbackplacement;
  }
  set fallbackplacement(value: Placement[]) {
    const oldFallbackPlacement = this._fallbackplacement;
    this._fallbackplacement = value;
    // Set fallback options for popper.js directive
    this._flipModifier.options = {
      fallbackPlacements: this._fallbackplacement,
    };
    this.requestUpdate(`fallbackplacement`, oldFallbackPlacement);
  }
  private _fallbackplacement: Placement[];

  /** Defines the offset of the popper.js popover */
  @property({ type: Array, reflect: true })
  get offset(): FluidPopoverOffset {
    return this._offset;
  }
  set offset(value: FluidPopoverOffset) {
    const oldOffset = this._offset;
    this._offset = value;
    // Set offset for popper.js directive
    this._offsetModifier.options = {
      offset: this._offset,
    };
    this.requestUpdate(`fallbackplacement`, oldOffset);
  }
  private _offset: FluidPopoverOffset;

  /**
   * FLuid popover container element
   * @type HTMLDivElement
   */
  @query(`.fluid-popover`)
  private _popover: HTMLDivElement;

  /** Clone of the offset modifier to be able to adjust the offsets of individual popovers */
  private _offsetModifier = Object.assign({}, offset);

  /** Clone of the flip modifier to be able to adjust the flip behaviour of individual popovers */
  private _flipModifier = Object.assign({}, flip);

  /** Instance of the created popper.js popover */
  private _popperPopoverInstance: Instance | null;

  /**
   * Creates or destroys the options overlay and sets `open` accordingly
   * Else, popperjs would calculate the updates for an existing overlay even if it is not visible
   */
  private _togglePopover(): void {
    requestAnimationFrame(() => {
      if (this.open) {
        this._createPopover();
      } else {
        this._destroyPopover();
      }
    });
  }

  /** Create a popperjs popover */
  private _createPopover(): void {
    this._popperPopoverInstance = createPopper(this.anchor, this._popover, {
      placement: this.placement,
      modifiers: [preventOverflow, this._flipModifier, this._offsetModifier],
    });
  }

  /** Destroy the popperjs popover instance */
  private _destroyPopover(): void {
    if (this._popperPopoverInstance) {
      this._popperPopoverInstance.destroy();
      this._popperPopoverInstance = null;
    }
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    const classMapData = {
      'fluid-popover': true,
      'fluid-popover--open': this.open,
    };

    return html`
      <div class=${classMap(classMapData)}>
        <slot></slot>
      </div>
    `;
  }
}
