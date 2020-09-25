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
  PropertyValues,
} from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { classMap } from 'lit-html/directives/class-map';
import { debounce } from 'lodash-es';

import {
  getNextGroupItemIndex,
  SelectionModel,
} from '@dynatrace/fluid-elements/core';
import {
  FLUID_INPUT_PADDING_BLOCK,
  FLUID_INPUT_PADDING_INLINE,
} from '@dynatrace/fluid-design-tokens';
import {
  ARROW_DOWN,
  ARROW_UP,
  ENTER,
  ESCAPE,
  TAB,
} from '@dynatrace/shared/keycodes';

import '@dynatrace/fluid-elements/icon';
import '@dynatrace/fluid-elements/input';
import '@dynatrace/fluid-elements/popover';
import '@dynatrace/fluid-elements/virtual-scroll-container';
// tslint:disable-next-line: no-duplicate-imports
import { FluidInput } from '@dynatrace/fluid-elements/input';
// tslint:disable-next-line: no-duplicate-imports
import {
  FluidPopover,
  FluidPopoverOffset,
} from '@dynatrace/fluid-elements/popover';
// tslint:disable-next-line: no-duplicate-imports
import {
  FluidVirtualScrollContainer,
  FluidVirtualScrollContainerRenderedItemsChange,
} from '@dynatrace/fluid-elements/virtual-scroll-container';

import './combo-box-option/combo-box-option';
// tslint:disable-next-line: no-duplicate-imports
import { FluidComboBoxOption } from './combo-box-option/combo-box-option';
import { FluidComboBoxOptionSelectedChangeEvent } from './combo-box-option/combo-box-option-events';

import { FluidComboBoxFilterChange } from './combo-box-events';

let _unique = 0;

/**
 * This is an experimental combo-box element built with lit-elements and
 * web-components. It registers itself as `fluid-combo-box` custom element.
 * @element fluid-combo-box
 */
@customElement('fluid-combo-box')
export class FluidComboBox<T> extends LitElement {
  /** Styles for the combo-box component */
  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
      }

      :host([disabled]) {
        pointer-events: none;
      }

      fluid-popover {
        z-index: 10;
      }

      .fluid-combo-box-input--disabled {
        cursor: pointer;
      }

      .fluid-icon {
        cursor: pointer;
        transition: transform 100ms ease-in-out;
      }

      .fluid-icon.fluid-popover-open {
        transform: rotate(180deg);
      }
    `;
  }

  /**
   * Defines the tab element with an id attribute
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  comboboxid = `fluid-combo-box-${_unique++}`;

  /**
   * Defines whether the combo-box is disabled
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Defines whether the combo-box selection is required
   * @attr
   * @type: boolean
   */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * Defines whether the combo-box selection is valid
   * @attr
   * @type: boolean
   */
  @property({ type: Boolean, reflect: true })
  valid = true;

  /**
   * Defines the label of the combo-box input field
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  label: string;

  /**
   * Defines the placeholder of the combo-box input field
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  placeholder: string = ``;

  /**
   * Defines the text to display if no options are available
   * @prop
   * @type string
   */
  @property({ type: String, reflect: false })
  emptymessage: string = `No options to choose from.`;

  /**
   * Array of options to display in the popover
   * @prop
   * @type array
   */
  @property({ type: Array, reflect: false })
  get options(): T[] {
    return this._options;
  }
  set options(value: T[]) {
    const oldOptions = this._options;
    this._options = value;
    this._setOptionFocus(false);
    this._focusedOptionIndex = -1;
    this._filteredOptions = this.filterOptionsFn(this._options, this._filter);
    this.requestUpdate(`options`, oldOptions);
  }
  private _options: T[] = [];

  /**
   * Array of selected items
   * @prop
   * @type array
   */
  @property({ type: Array, reflect: false })
  get selected(): T[] {
    return this._selectionModel.selected.map(
      (selectedItemIndex) => this._options[selectedItemIndex],
    );
  }
  set selected(value: T[]) {
    const oldSelected = this._selected;
    this._selectionModel.clear();

    const newSelected: T[] = [];
    value.forEach((option) => {
      const optionIndex = this._options.indexOf(option);

      if (optionIndex > -1) {
        this._selectionModel.select(optionIndex);
        newSelected.push(option);
      } else {
        console.warn(
          `Option could not be selected. Make sure the option exists in the options array. Option: ${option}`,
        );
      }
    });
    this._selected = newSelected;
    this._setInputValue();
    this.requestUpdate(`selected`, oldSelected);
  }
  private _selected: T[] = [];

  /**
   * Comma separated string of selected options' display names
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  get value(): string {
    const displayNames: string[] = [];

    for (const optionIndex of this._selectionModel.selected) {
      displayNames.push(this.displayNameFn(this._options[optionIndex]));
    }

    return displayNames.join(`, `);
  }

  /**
   * @internal Array of filtered options ultimately displayed in the popover
   * @prop
   * @type array
   */
  @property({ type: Array, reflect: false })
  _filteredOptions: T[];

  /**
   * Defines whether the options can be filtered
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  filterable = true;

  /**
   * Defines whether multiple options can be selected
   * @attr
   * @type boolean
   */
  @property({ type: Boolean, reflect: true })
  multiselect = true;

  /**
   * Defines the aria label of the combo-box input field
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  arialabel: string;

  /**
   * Defines the aria labelled by of the combo-box input field
   * @attr
   * @type string
   */
  @property({ type: String, reflect: true })
  arialabelledby: string;

  /**
   * Defines the function to use for rendering options
   * By default returns the option as string
   * @prop
   * @type function
   */
  @property({ reflect: false, attribute: false })
  renderOptionFn: (option: T) => string = (option: T) => `${option}`;

  /**
   * Defines the function to use for getting the selected option's display name
   * By default returns the option as string
   * @prop
   * @type function
   */
  @property({ reflect: false, attribute: false })
  displayNameFn: (option: T) => string = (option: T) => `${option}`;

  /**
   * Defines the function to use for filtering the options
   * By default checks if the option string includes the filter value
   * @prop
   * @type function
   */
  @property({ reflect: false, attribute: false })
  filterOptionsFn: (options: T[], filter: string) => T[] = (options, filter) =>
    options.filter((option) => `${option}`.includes(filter));

  /**
   * Defines whether the popover is open
   * @prop
   * @type boolean
   */
  @property({ type: Boolean, attribute: false })
  private _popoverOpen = false;

  /** Reference of the fluid input element */
  @query(`fluid-input`)
  private _fluidInput: FluidInput;

  /** Reference of the native input element */
  @query(`.fluid-combo-box-input`)
  private _input: HTMLInputElement;

  /** Reference of the popover component */
  @query(`fluid-popover`)
  private _popover: FluidPopover;

  /** Reference of the virtual scroll container */
  @query(`fluid-virtual-scroll-container`)
  private _virtualScrollContainer: FluidVirtualScrollContainer<T>;

  /** Current value the list of items is filtered by */
  private _filter = ``;

  /**
   * Used to correctly handle blurring the input
   * The input would lose focus when the user clicks inside the popover
   * This flag is used to correctly handle this case
   */
  private _insidePopover = false;

  /** Selection model for handling options' selection */
  private _selectionModel: SelectionModel<number>;

  /**
   * Index of the currently focused option
   * Corresponds to the index of the option in the filtered options array
   */
  private _focusedOptionIndex = -1;

  // Offset of the popover
  private _offset: FluidPopoverOffset = [
    -parseInt(FLUID_INPUT_PADDING_INLINE),
    parseInt(FLUID_INPUT_PADDING_BLOCK),
  ];

  /** Render function used for rendering options in the virtual scroll container */
  private _renderVirtualScrollItemFn = (option: T) => {
    return html`
      <fluid-combo-box-option
        class="fluid-combo-box-option"
        data-index=${this._getOptionIndex(option)}
        @mousemove=${this._handleOptionMousemove.bind(this)}
        @selectedChange=${this._handleSelectedChange.bind(this)}
        .checkbox=${this.multiselect}
        .selectedIndicator=${!this.multiselect}
      >
        ${unsafeHTML(this.renderOptionFn(option))}
      </fluid-combo-box-option>
    `;
  };

  /** Returns the index of the option in the unfiltered options array */
  private _getOptionIndex(option: T): number {
    return this._options.indexOf(option);
  }

  /** Toggles the popover state when clicking on the icon */
  private _handleIconClick(): void {
    if (this._popoverOpen) {
      this._closePopover();
    } else {
      this._input.focus();
      this._openPopover();
    }
  }

  /** Handles focus events of the input field */
  private _handleFocus(): void {
    if (!this.filterable) {
      this._openPopover();
    }
    this._input.value = this._filter;
  }

  /**
   * Handles blur events of the input field
   * As long as the user is inside the popover,
   * the input should keep the focus
   */
  private _handleBlur(): void {
    if (!this._insidePopover) {
      // Store current filter value
      this._filter = this._input.value;
      this._closePopover();
      this._setInputValue();
    } else {
      // Keep existing filter value
      const filter = this._input.value;
      this._input.focus();
      this._input.value = filter;
    }
  }

  /**
   * Handles keydown events
   * @param event
   */
  private _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.code;

    switch (keyCode) {
      case ENTER:
        // Open popover if not already opened,
        // else select the currently focused option
        if (!this._popoverOpen) {
          this._openPopover();
        } else if (this._focusedOptionIndex > -1) {
          this._setSelectedOption();
        }
        break;
      case TAB:
      case ESCAPE:
        // Close popover
        if (this._popoverOpen) {
          this._fluidInput._preventBlur = false;
          this._closePopover();
        }
        break;
      case ARROW_DOWN:
      case ARROW_UP:
        // Prevent default behaviour of scrolling the page up/down
        event.preventDefault();

        // Open popover if closed and navigate through options
        if (!this._popoverOpen) {
          this._openPopover();
        }
        this._updateFocusedOptionIndex(keyCode);
        break;
      default:
        break;
    }
  }

  /**
   * Handles keyup events
   * Opens the popover if not already open and if a filter value is present
   */
  private _handleKeyup({ code }: KeyboardEvent): void {
    if (
      code !== ESCAPE &&
      code !== ENTER &&
      !this._popoverOpen &&
      this._input.value
    ) {
      this._openPopover();
    }
  }

  /** Handles change of the input value */
  private _handleInput(): void {
    this._filteredOptions = this.filterOptionsFn(
      this._options,
      this._input.value,
    );

    this.dispatchEvent(new FluidComboBoxFilterChange(this._input.value));
  }

  /**
   * Handles mousedown on the icon
   * Prevents the input blur event from firing to correctly open/close the popover
   */
  private _handleIconMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  /**
   * Toggles the selected state of the target option
   * @param event
   */
  private _handleSelectedChange(
    event: FluidComboBoxOptionSelectedChangeEvent,
  ): void {
    let optionIndex;

    // Deselect currently selected option and close popover if multiselect is disabled
    if (!this.multiselect) {
      optionIndex = this._selectionModel.selected[0];
      const selectedOption = this._virtualScrollContainer.shadowRoot!.querySelector<
        FluidComboBoxOption
      >(`.fluid-combo-box-option[data-index="${optionIndex}"]`);

      if (selectedOption) {
        selectedOption.selected = false;
      }

      this._closePopover();
    }

    const option = event.target as FluidComboBoxOption;
    optionIndex = parseInt(option.dataset.index!);

    // Update selection model according to the target option's selected state
    if (event.data.selected) {
      this._selectionModel.select(optionIndex);
    } else {
      this._selectionModel.deselect(optionIndex);
    }

    // Set the input value if options are not filterable
    if (!this.filterable) {
      this._setInputValue();
    }
  }

  /**
   * Creates an overlay attached to the mouse position
   * that shows all the selected options if there is not enough
   * space to display all of them in the input.
   */
  private _handleHover(): void {}

  /**
   * Sets flag to determine if the focus should be kept on
   * the input when the input would usually be blurred
   */
  private _handlePopoverEnter(): void {
    this._insidePopover = true;
    this._fluidInput._preventBlur = true;
  }

  /**
   * Sets flag to determine if the focus should be kept on
   * the input when the input would usually be blurred
   */
  private _handlePopoverLeave(): void {
    this._insidePopover = false;
    this._fluidInput._preventBlur = false;
  }

  /**
   * Sets the index of the currently focused option when hovering an option
   * Using mouse move because it does not trigger when scrolling, which
   * makes focus handling a little easier
   */
  private _handleOptionMousemove(event: MouseEvent): void {
    const option = event.target as FluidComboBoxOption;

    if (option.focused) {
      return;
    }

    // Blur currently focused option
    this._setOptionFocus(false);

    // Store index of target option (for selecting) and set focus
    const optionIndex = parseInt(option.dataset.index!);

    this._focusedOptionIndex = this._filteredOptions.indexOf(
      this._options[optionIndex],
    );
    option.focused = true;
  }

  /**
   * Called when the range of items to render is updated by the virtual scroll container
   * Sets the selected and focused state of the rendered items
   */
  private _handleRenderedItemsChange(
    event: FluidVirtualScrollContainerRenderedItemsChange,
  ): void {
    for (let i = event.rangeStart; i <= event.rangeEnd; i += 1) {
      const optionIndex = this._getOptionIndex(this._filteredOptions[i]);
      const option = this._virtualScrollContainer.shadowRoot!.querySelector<
        FluidComboBoxOption
      >(`.fluid-combo-box-option[data-index="${optionIndex}"]`);

      if (option) {
        option.selected = this._selectionModel.isSelected(optionIndex);
        option.focused = i === this._focusedOptionIndex;
      }
    }
  }

  /** Opens the options popover and sets it's width to the width of the input */
  private _openPopover(): void {
    this._popoverOpen = true;

    // Set width of the popover container to the width of the combo-box
    const comboBoxWidth = this._fluidInput.getBoundingClientRect().width;

    this._popover._popoverContainer.style.width = `${comboBoxWidth}px`;
    // Render options in the virtual scroll container
    this._virtualScrollContainer.render();
  }

  /** Closes the options popover */
  private _closePopover(): void {
    this._popoverOpen = false;
  }

  /** Sets the value of the combo-box input */
  private _setInputValue(): void {
    this._input.value = this.value;
  }

  /** Triggers selected change with currently focused option */
  private _setSelectedOption(): void {
    let optionIndex = this._getOptionIndex(
      this._filteredOptions[this._focusedOptionIndex],
    );
    const option = this._virtualScrollContainer.shadowRoot!.querySelector<
      FluidComboBoxOption
    >(`.fluid-combo-box-option[data-index="${optionIndex}"]`);

    if (option) {
      // Emit click on option to trigger selected change event
      (option.shadowRoot!.firstElementChild as HTMLElement).click();
    }
  }

  /**
   * Sets the index of the currently focused combo-box-option
   * @param keyCode Right or left arrow keycode
   */
  private _updateFocusedOptionIndex(keyCode: string): void {
    // Prevent cycling
    if (
      (keyCode === ARROW_DOWN &&
        this._focusedOptionIndex === this._filteredOptions.length - 1) ||
      (keyCode === ARROW_UP && this._focusedOptionIndex === 0)
    ) {
      return;
    }

    // Reset focus of currently focused option
    this._setOptionFocus(false);

    // Increase/decrease index of focused option
    this._focusedOptionIndex = getNextGroupItemIndex(
      this._focusedOptionIndex,
      this._filteredOptions.length,
      keyCode,
    );

    // If the new index is outside the range of currently rendered options, which
    // might happen when the user first hovers an item, then scrolls up/down, get
    // the first or last visible item's index
    if (
      this._focusedOptionIndex <
        this._virtualScrollContainer._scrollState.renderedItemsRangeStart ||
      this._focusedOptionIndex >
        this._virtualScrollContainer._scrollState.renderedItemsRangeEnd
    ) {
      if (keyCode === ARROW_DOWN) {
        this._focusedOptionIndex = this._getFirstVisibleOptionIndex();
      }

      if (keyCode === ARROW_UP) {
        this._focusedOptionIndex = this._getLastVisibleOptionIndex();
      }
    }

    // Set the focus of the option at the new index
    this._setOptionFocus();
  }

  /** Iterates over currently rendered options and returns the index of the first visible */
  private _getFirstVisibleOptionIndex(): number {
    if (!this._options.length) {
      return -1;
    }

    let optionIndex = -1;
    let currentIndex = this._virtualScrollContainer._scrollState
      .renderedItemsRangeStart;
    const containerBounds = this._virtualScrollContainer.getBoundingClientRect();

    do {
      const option = this._virtualScrollContainer.shadowRoot!.querySelector(
        `.fluid-combo-box-option[data-index="${this._getOptionIndex(
          this._filteredOptions[currentIndex],
        )}"]`,
      )!;

      const optionBounds = option.getBoundingClientRect();
      if (optionBounds.top >= containerBounds.top) {
        optionIndex = currentIndex;
      }

      currentIndex += 1;
    } while (optionIndex === -1);

    return optionIndex;
  }

  /** Iterates over currently rendered options and returns the index of the last visible */
  private _getLastVisibleOptionIndex(): number {
    if (!this._options.length) {
      return -1;
    }

    let optionIndex = -1;
    let currentIndex = this._virtualScrollContainer._scrollState
      .renderedItemsRangeEnd;
    const containerBounds = this._virtualScrollContainer.getBoundingClientRect();

    do {
      const option = this._virtualScrollContainer.shadowRoot!.querySelector(
        `.fluid-combo-box-option[data-index="${this._getOptionIndex(
          this._filteredOptions[currentIndex],
        )}"]`,
      )!;

      const optionBounds = option.getBoundingClientRect();

      if (optionBounds.bottom <= containerBounds.bottom) {
        optionIndex = currentIndex;
      }

      currentIndex -= 1;
    } while (optionIndex === -1);

    return optionIndex;
  }

  /**
   * Sets the focus of the option at the currently focused index
   * @param focus
   */
  private _setOptionFocus(focus: boolean = true): void {
    if (this._focusedOptionIndex >= 0) {
      const optionIndex = this._getOptionIndex(
        this._filteredOptions[this._focusedOptionIndex],
      );
      const option = this._virtualScrollContainer.shadowRoot!.querySelector<
        FluidComboBoxOption
      >(`.fluid-combo-box-option[data-index="${optionIndex}"]`);

      if (option) {
        option.focused = focus;

        if (focus) {
          this._adjustVirtualScrollContainerScroll(option);
        }
      }
    }
  }

  /**
   * Adjusts the scroll position of the virtual scroll container
   * to fully show the currently focused option
   */
  private _adjustVirtualScrollContainerScroll(
    option: FluidComboBoxOption,
  ): void {
    const containerBounds = this._virtualScrollContainer.getBoundingClientRect();
    const optionBounds = option.getBoundingClientRect();

    if (optionBounds.top < containerBounds.top) {
      this._virtualScrollContainer._scrollContainer.scrollTop +=
        optionBounds.top - containerBounds.top;
    } else if (optionBounds.bottom > containerBounds.bottom) {
      this._virtualScrollContainer._scrollContainer.scrollTop +=
        optionBounds.bottom - containerBounds.bottom;
    }
  }

  /**
   * Creates selection model after the properties have been updated once,
   * else the multiselect property would not yet be set to the desired value
   */
  firstUpdated(props: PropertyValues): void {
    super.firstUpdated(props);

    // Selection model for handling selected options
    this._selectionModel = new SelectionModel(this.multiselect);
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    const iconClassMapData = {
      'fluid-icon': true,
      'fluid-popover-open': this._popoverOpen,
    };

    const inputClassMapData = {
      'fluid-combo-box-input': true,
      'fluid-combo-box-input--disabled': !this.multiselect,
    };

    return html`
      <fluid-input>
        ${this.label
          ? html`<label slot="label" for="fluid-combo-box-input-${_unique}"
              >${this.label}</label
            >`
          : nothing}
        <input
          id="fluid-combo-box-input-${_unique}"
          class=${classMap(inputClassMapData)}
          type="text"
          aria-label=${ifDefined(this.arialabel)}
          aria-labelledby=${ifDefined(this.arialabelledby)}
          placeholder=${this.placeholder}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?readonly=${!this.filterable}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @keydown=${this._handleKeydown}
          @keyup=${this._handleKeyup}
          @input=${debounce(this._handleInput, 250) as () => void}
          @hover=${this._handleHover}
        />
        <fluid-icon
          class=${classMap(iconClassMapData)}
          name="arrow-down"
          slot="icon"
          @mousedown=${this._handleIconMousedown}
          @click=${this._handleIconClick}
        ></fluid-icon>
      </fluid-input>
      <fluid-popover
        .anchor=${this._input}
        .open=${this._popoverOpen}
        .offset=${this._offset}
        @mouseenter=${this._handlePopoverEnter}
        @mouseleave=${this._handlePopoverLeave}
      >
        <fluid-virtual-scroll-container
          .items=${this._filteredOptions}
          .renderItemFn=${this._renderVirtualScrollItemFn}
          .noitemsmessage=${this.emptymessage}
          maxheight="350px"
          equalitemsheight
          @renderedItemsChange=${this._handleRenderedItemsChange}
        ></fluid-virtual-scroll-container>
      </fluid-popover>
    `;
  }
}
