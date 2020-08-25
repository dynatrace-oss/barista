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
} from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import type { Placement } from '@popperjs/core/lib';

import '@dynatrace/fluid-elements/icon';
import '@dynatrace/fluid-elements/input';
import '@dynatrace/fluid-elements/option';
import '@dynatrace/fluid-elements/popover';
// tslint:disable-next-line: no-duplicate-imports
import { FluidInput } from '@dynatrace/fluid-elements/input';
// tslint:disable-next-line: no-duplicate-imports
import {
  FluidOption,
  FluidOptionSelectedChangeEvent,
} from '@dynatrace/fluid-elements/option';
// tslint:disable-next-line: no-duplicate-imports
import {
  FluidPopoverMouseInsideChange,
  FluidPopoverOffset,
} from '@dynatrace/fluid-elements/popover';
import { SelectionModel } from './selection-model';
import {
  FLUID_INPUT_PADDING_BLOCK,
  FLUID_INPUT_PADDING_INLINE,
} from '@dynatrace/fluid-design-tokens';

let _unique = 0;

// Offset of the popover
const _offset: FluidPopoverOffset = ({ placement }) => {
  if (placement.includes(`right`) || placement.includes(`left`)) {
    return [0, 3 * parseInt(FLUID_INPUT_PADDING_INLINE)];
  }

  return [
    -parseInt(FLUID_INPUT_PADDING_INLINE),
    parseInt(FLUID_INPUT_PADDING_BLOCK),
  ];
};

// Fallback placement of the popover
const FALLBACK_PLACEMENT: Placement[] = [`right`, `left`, `top-start`];

/**
 * This is an experimental combo-box element built with lit-elements and
 * web-components. It registers itself as `fluid-combo-box` custom element.
 * @element fluid-combo-box
 * @cssprop --fluid-combo-box--foreground-key - Controls the foreground color for the key setting.
 * @cssprop --fluid-combo-box--background-key - Controls the background color for the key setting.
 * @cssprop --fluid-combo-box--border-key - Controls the border color for the key setting.
 * @cssprop --fluid-combo-box--foreground-key-hover - Controls the foreground hover color for the key setting.
 * @cssprop --fluid-combo-box--background-key-hover - Controls the background hover color for the key setting.
 * @cssprop --fluid-combo-box--border-key-hover - Controls the border hover color for the key setting.
 * @cssprop --fluid-combo-box--foreground-key-focus - Controls the foreground focus color for the key setting.
 * @cssprop --fluid-combo-box--background-key-focus - Controls the background focus color for the key setting.
 * @cssprop --fluid-combo-box--border-key-focus - Controls the border focus color for the key setting.
 * @cssprop --fluid-combo-box--foreground-negative - Controls the foreground color for the negative setting.
 * @cssprop --fluid-combo-box--border-negative - Controls the border color for the negative setting.
 * @cssprop --fluid-combo-box--foreground-negative-hover - Controls the foreground hover color for the negative setting.
 * @cssprop --fluid-combo-box--border-negative-hover - Controls the border hover color for the negative setting.
 * @cssprop --fluid-combo-box--foreground-negative-focus - Controls the foreground focus color for the negative setting.
 * @cssprop --fluid-combo-box--border-negative-focus - Controls the border focus color for the negative setting.
 * @cssprop --fluid-combo-box--foreground-disabled - Controls the foreground color for the disabled state.
 * @cssprop --fluid-combo-box--background-disabled - Controls the background color for the disabled state.
 */
@customElement('fluid-combo-box')
export class FluidComboBox extends LitElement {
  /** Styles for the combo-box component */
  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
      }

      :host([disabled]) {
        pointer-events: none;
      }

      /* TODO: Implement proper popover handling */
      fluid-popover {
        z-index: 10;
      }
    `;
  }

  /**
   * Defines the tab element with an id attribute
   * @attr
   */
  @property({ type: String, reflect: true })
  comboboxid = `fluid-combo-box-${_unique++}`;

  /**
   * Defines whether the combo-box is disabled.
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Defines whether the combo-box selection is valid.
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * Defines whether the combo-box selection is valid.
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  valid = true;

  /**
   * Defines the aria label of the combo-box input field.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  label: string;

  /**
   * Defines the placeholder of the combo-box input field.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: false })
  placeholder: string = '';

  /**
   * Array of options to display in the popover.
   * @attr
   * @type array
   */
  @property({ type: Array, reflect: true })
  get options(): any[] {
    return this._options;
  }
  set options(value: any[]) {
    const oldOptions = this._options;
    this._options = value;
    this.requestUpdate(`options`, oldOptions);
  }
  private _options: any[] = [];

  /**
   * Defines whether multiple items can be selected.
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  multiselect = true;

  /**
   * Defines the aria label of the combo-box input field.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  arialabel: string;

  /**
   * Defines the aria label of the combo-box input field.
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  arialabelledby: string;

  /**
   * Defines the function to use for rendering options
   * @attr
   * @type function
   */
  @property({ reflect: false, attribute: false })
  renderOptionFn: (option: any) => string = this._defaultOptionTemplate;

  /** Default implementation for rendering options */
  private _defaultOptionTemplate(option: string): string {
    return `<option>${option}</option>`;
  }

  /** Defines whether the popover is open */
  @property({ type: Boolean, attribute: false })
  private _popoverOpen = false;

  /** Reference of the fluid input element */
  @query(`fluid-input`)
  private _fluidInput: FluidInput;

  /** Reference of the native input element */
  @query(`.combo-box-input`)
  private _input: HTMLInputElement;

  /** Used to correctly handle blurring the input */
  private _insidePopover = false;

  /** Selection model for handling items selection */
  private _selectionModel: SelectionModel<any>;

  /** Index of the currently focused item */
  private _focusedItemIndex = -1;

  constructor() {
    super();

    // Selection model for handling selected options
    this._selectionModel = new SelectionModel(this.multiselect);
  }

  /**
   * Creates or destroys the options popover and sets `_popoverOpen` accordingly
   * Else, popperjs would calculate the updates for an existing popover even if it is not visible
   */
  private _setPopoverState(value: boolean): void {
    this._popoverOpen = value;
  }

  /**
   * Add selected option to the selection model and close the popover
   * @param event
   */
  private _handleSelectedChange(event: FluidOptionSelectedChangeEvent): void {
    const option = event.target as FluidOption;
    const optionIndex = parseInt(option.dataset.index!);
    // Toggle selection of target item
    this._selectionModel.toggle(optionIndex);

    // Close popover if multiselect is disabled
    if (!this.multiselect) {
      this._setPopoverState(false);
    }

    this.requestUpdate();
  }

  /**
   * Set flag to determine if the focus should be kept on
   * the input when the input would usually be blurred
   * @param event Event emitted when the mouse enters/leaves the popover
   */
  private _handleInsidePopover(event: FluidPopoverMouseInsideChange): void {
    this._insidePopover = event.insidePopover;
    if (this._insidePopover) {
      this._fluidInput._preventBlur = true;
    } else {
      this._fluidInput._preventBlur = false;
    }
  }

  /**
   * Handles blurring of the input field
   * As long as the user is inside the popover,
   * the input should keep the focus
   */
  private _handleBlur(): void {
    if (!this._insidePopover) {
      this._setPopoverState(false);
    } else {
      this._input.focus();
    }
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`
      <fluid-icon></fluid-icon>
      <fluid-input>
        ${this.label
          ? html`<label slot="label" for="combo-box-input-${_unique}"
              >${this.label}</label
            >`
          : nothing}
        <input
          id="combo-box-input-${_unique}"
          class="combo-box-input"
          type="text"
          aria-label=${ifDefined(this.arialabel)}
          aria-labelledby=${ifDefined(this.arialabelledby)}
          placeholder=${this.placeholder}
          @focus=${() => this._setPopoverState(true)}
          @blur=${this._handleBlur}
          ?required=${this.required}
          ?disabled=${this.disabled}
        />
        <svg
          slot="icon"
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
        </svg>
      </fluid-input>
      <fluid-popover
        @mouseInsideChange=${this._handleInsidePopover}
        .anchor=${this._input}
        .open=${this._popoverOpen}
        .offset=${_offset}
        .fallbackplacement=${FALLBACK_PLACEMENT}
      >
        ${this._options.length
          ? this._options.map(
              (option, index) => html`
                <fluid-option
                  class="combo-box-option"
                  @selectedChange=${this._handleSelectedChange}
                  data-index=${index}
                  ?selected=${this._selectionModel.selected.includes(index)}
                  ?checkbox=${this.multiselect}
                  ?selectedIndicator=${!this.multiselect}
                  ?focused=${this._focusedItemIndex === index}
                >
                  ${unsafeHTML(this.renderOptionFn(option))}
                </fluid-option>
              `,
            )
          : html`<p>Nothing to select</p>`}
      </fluid-popover>
    `;
  }
}
