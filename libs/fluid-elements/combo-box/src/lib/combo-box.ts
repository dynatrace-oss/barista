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
  PropertyValues,
} from 'lit-element';
import { render, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import type { Placement } from '@popperjs/core/lib';

import {
  ENTER,
  ARROW_DOWN,
  ARROW_UP,
  ESCAPE,
} from '@dynatrace/shared/keycodes';
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
  FluidPopover,
  FluidPopoverMouseInsideChange,
  FluidPopoverOffset,
} from '@dynatrace/fluid-elements/popover';
import { SelectionModel } from './selection-model';
import {
  FLUID_INPUT_PADDING_BLOCK,
  FLUID_INPUT_PADDING_INLINE,
  FLUID_INPUT_PADDING,
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

// Virtual scroll constants
// Number of options to render each time until the container is filled up
const VIRTUAL_SCROLL_BATCH_SIZE = 1;
// Number of options to render in addition to the initially rendered items
const VIRTUAL_SCROLL_BUFFER_SIZE = 3;
// Threshold to dertermine when the observer should trigger the callback
const VIRTUAL_SCROLL_THRESHOLD = 0.5;

type VirtualScrollRenderAtPosition = `start` | `end`;

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

      fluid-popover {
        z-index: 10;
      }

      .fluid-combo-box-empty {
        padding: ${unsafeCSS(FLUID_INPUT_PADDING)};
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
    this._resetVirtualScroll();
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
  @query(`.fluid-combo-box-input`)
  private _input: HTMLInputElement;

  /** Reference of the popover component */
  @query(`fluid-popover`)
  private _popover: FluidPopover;

  /** Used to correctly handle blurring the input */
  private _insidePopover = false;

  /** Selection model for handling items selection */
  private _selectionModel: SelectionModel<any>;

  /** Index of the currently focused item */
  private _focusedOptionIndex = -1;

  /** Defines whether the initially visible options have been rendered */
  private _initialVirtualRenderDone = false;

  /** Amount of batches of items rendered to fill the available space */
  private _initialVirtualBatchesRendered = 0;

  /** Currently rendered virtual scroll items */
  private _renderedVirtualScrollItems: TemplateResult[] = [];

  /** Map of template results to load items from if it has been rendered before */
  private _cachedVirtuallScrollItems: Map<number, TemplateResult> = new Map();

  /** Total number of options */
  private _optionsCount: number;

  /** Defines the index of the first visible virtual scroll item */
  private _virtualScrollStartIndex = 0;

  /** Defines if there is sufficient buffer on top of the list */
  private _virtualScrollBufferStart = false;

  /** Observer for updating the index of the currently visible topmost item */
  private _virtualScrollIndexObserver: IntersectionObserver;

  /**
   * Observer for updating the virtual scroll buffer when
   * an item enters the container at the start or end of the list
   */
  private _virtualScrollBufferObserver: IntersectionObserver;

  /**
   * Set storing the indizes of observed items to avoid handling
   * an observed item intersection when it was just added to the observer
   */
  private _observedItemsVirtualScrollBuffer: Set<number> = new Set();

  /** Index of the item observed for adjusting the buffer when scrolling up */
  private _bufferStartObservedItemIndex = -1;

  /** Index of the item observed for adjusting the buffer when scrolling down */
  private _bufferEndObservedItemIndex = -1;

  /** Index of the currently first rendered item */
  private _virtualScrollFirstRenderedIndex = 0;

  /** Index of the currently last rendered item */
  private _virtualScrollLastRenderedItemIndex = -1;

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

    if (this._popoverOpen && this._initialVirtualRenderDone) {
      requestAnimationFrame(() => this._calculateVirtualContainerScroll());
    }

    if (!this._popoverOpen) {
      this._focusedOptionIndex = -1;
    }
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
    option.selected = this._selectionModel.isSelected(optionIndex);

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
   * Handle keydown events
   * @param event
   */
  private _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.code;

    switch (keyCode) {
      case ENTER:
        // Open popover if not already opened,
        // else select the currently focused option
        if (!this._popoverOpen) {
          this._setPopoverState(true);
        } else if (this._focusedOptionIndex > -1) {
          this._setSelectedOption();
        }
        break;
      case ESCAPE:
        // Close popover
        if (this._popoverOpen) {
          this._setPopoverState(false);
        }
        break;
      case ARROW_DOWN:
      case ARROW_UP:
        // Open popover if closed and navigate through options
        if (!this._popoverOpen) {
          this._setPopoverState(true);
        }
        this._setFocusedOptionIndex(keyCode);
        break;
      default:
        break;
    }
  }

  /** Handle keyup events */
  private _handleKeyup(): void {
    if (!this._popoverOpen && this._input.value) {
      this._setPopoverState(true);
    }
  }

  /** Set selected property of currently focused option */
  private _setSelectedOption(): void {
    const option = this._popover.shadowRoot!.querySelector(
      `[data-index="${this._focusedOptionIndex}"]`,
    ) as FluidOption;
    if (option) {
      option.selected = !option.selected;
    }
  }

  /**
   * TODO: switch to utility function as soon as the button-group PR is merged
   * Sets the index of the currently focused combo-box-option
   * @param keyCode Right or left arrow keycode
   */
  private _setFocusedOptionIndex(keyCode: string): void {
    this._setOptionFocus(false);

    if (keyCode === ARROW_UP) {
      this._focusedOptionIndex -= 1;
      if (this._focusedOptionIndex < 0) {
        this._focusedOptionIndex = this.options.length - 1;
      }
    } else {
      this._focusedOptionIndex += 1;
      if (this._focusedOptionIndex >= this._options.length) {
        this._focusedOptionIndex = 0;
      }
    }

    this._setOptionFocus(true);
  }

  /**
   * Set the focus of option at currently focused index
   * @param focus
   */
  private _setOptionFocus(focus: boolean): void {
    if (this._focusedOptionIndex >= 0) {
      const option = this._popover.shadowRoot!.querySelector(
        `.fluid-combo-box-option[data-index="${this._focusedOptionIndex}"]`,
      ) as FluidOption;

      if (option) {
        option.focused = focus;
      }
    }
  }

  /** Reset virtual scroll */
  private _resetVirtualScroll(): void {
    this._initialVirtualRenderDone = false;
    this._initialVirtualBatchesRendered = 0;
    this._renderedVirtualScrollItems = [];
    this._optionsCount = this._options.length;
    this._virtualScrollStartIndex = 0;
  }

  /** Render items to display when the popover is first opened */
  private _renderInitialVirtualScrollItems(): void {
    this._renderVirtualScrollItems(VIRTUAL_SCROLL_BATCH_SIZE);
    this._checkVirtualScrollItemsHeight();
    this._initialVirtualBatchesRendered += 1;
  }

  /**
   * Render items above/below the fold and add needed items to
   * the list of observed items to handle addition/removal of items
   */
  private _renderVirtualScrollPadding(
    bufferPosition: VirtualScrollRenderAtPosition = `end`,
  ): void {
    let startAt: number | null = null;

    if (bufferPosition === `start`) {
      startAt =
        this._virtualScrollLastRenderedItemIndex -
        VIRTUAL_SCROLL_BATCH_SIZE * this._initialVirtualBatchesRendered -
        2 * VIRTUAL_SCROLL_BUFFER_SIZE;
    }

    this._renderVirtualScrollItems(
      VIRTUAL_SCROLL_BUFFER_SIZE,
      bufferPosition,
      startAt !== null ? startAt : this._virtualScrollLastRenderedItemIndex,
    );

    requestAnimationFrame(() => {
      // Scroll container to display the correct item first
      if (this._initialVirtualRenderDone && this._virtualScrollBufferStart) {
        this._calculateVirtualContainerScroll();
      }

      this._observeVirtualScrollPadding();
    });
  }

  /** Render new virtual scroll items and add them to the list of rendered items */
  private _renderVirtualScrollItems(
    itemsToRenderCount: number,
    appendTo: VirtualScrollRenderAtPosition = `end`,
    startAt: number = this._virtualScrollLastRenderedItemIndex,
  ): void {
    const renderedItems: TemplateResult[] = [];
    for (let i = 0; i < itemsToRenderCount; i += 1) {
      // Next item's index
      let index = startAt + i + 1;

      // When rendering new items at the start of the list when the user is
      // scrolling back up, the index might be negative, depending on the virtual
      // scroll buffer size and current scroll position
      // In this case, continue looping to render all the items of the scroll buffer
      // that are not rendered yet
      if (index < 0) {
        continue;
      }

      // Stop rendering if there are no more items
      if (index >= this._optionsCount) {
        this._initialVirtualRenderDone = true;
        break;
      }

      // Return cached item if available, else create TemplateResult for new item
      let renderedItem: TemplateResult;

      if (this._cachedVirtuallScrollItems.has(index)) {
        console.log(`add cached item`);
        renderedItem = this._cachedVirtuallScrollItems.get(index)!;
      } else {
        renderedItem = html`
          <fluid-option
            class="fluid-combo-box-option"
            @selectedChange=${this._handleSelectedChange.bind(this)}
            data-index=${index}
            ?checkbox=${this.multiselect}
            ?selectedIndicator=${!this.multiselect}
          >
            ${unsafeHTML(this.renderOptionFn(this._options[index]))}
          </fluid-option>
        `;
        // ?selected=${this._selectionModel.isSelected(index)}
        // ?focused=${this._focusedOptionIndex === index}

        this._cachedVirtuallScrollItems.set(index, renderedItem);
      }

      // Observe intersections of items for setting the current start index
      requestAnimationFrame(() => {
        const option = this._popover._popoverContainer.querySelector(
          `.fluid-combo-box-option[data-index="${index}"]`,
        );

        if (option) {
          this._virtualScrollIndexObserver.observe(option);
        }
      });

      // Push the new item to the list of rendered items
      renderedItems.push(renderedItem);

      // Store index of last rendered item
      if (index > this._virtualScrollLastRenderedItemIndex) {
        this._virtualScrollLastRenderedItemIndex = index;
      }
    }

    if (appendTo === `end`) {
      this._renderedVirtualScrollItems.push(...renderedItems);
    } else {
      this._renderedVirtualScrollItems = [
        ...renderedItems,
        ...this._renderedVirtualScrollItems,
      ];
    }

    render(
      html`${this._renderedVirtualScrollItems}`,
      this._popover._popoverElementsContainer,
    );
  }

  /**
   * In case the render method gets called due to an update to
   * one of the observed properties, we have to also re-render
   * the currently displayed virtual scroll items
   */
  private _renderExistingVirtualScrollItems(): void {
    render(
      html`${this._renderedVirtualScrollItems}`,
      this._popover._popoverElementsContainer,
    );

    this.requestUpdate();
  }

  /**
   * Observe intersections of the middle item of the scroll buffer
   * As soon as it is half visible, another batch of items is rendered
   */
  private _observeVirtualScrollPadding(): void {
    // Get indizes of the items to observe
    this._bufferEndObservedItemIndex =
      this._virtualScrollLastRenderedItemIndex === this.options.length
        ? this._virtualScrollLastRenderedItemIndex +
          Math.floor(VIRTUAL_SCROLL_BUFFER_SIZE * 0.5)
        : this._virtualScrollLastRenderedItemIndex -
          Math.floor(VIRTUAL_SCROLL_BUFFER_SIZE * 0.5);
    this._bufferStartObservedItemIndex =
      this._bufferEndObservedItemIndex -
      this._initialVirtualBatchesRendered * VIRTUAL_SCROLL_BATCH_SIZE -
      VIRTUAL_SCROLL_BUFFER_SIZE;

    // Get elements to observe and add them to the observer
    const observedItemEnd = this._popover._popoverContainer.querySelector(
      `.fluid-combo-box-option[data-index="${this._bufferEndObservedItemIndex}"]`,
    );

    if (observedItemEnd) {
      this._virtualScrollBufferObserver.observe(observedItemEnd);
    }

    const observedItemStart = this._popover._popoverContainer.querySelector(
      `.fluid-combo-box-option[data-index="${this._bufferStartObservedItemIndex}"]`,
    );

    if (observedItemStart) {
      this._virtualScrollBufferObserver.observe(observedItemStart);
    }

    console.log(
      `buffer observers:`,
      this._bufferStartObservedItemIndex,
      this._bufferEndObservedItemIndex,
    );
  }

  /**
   * Handle intersection of observed item and update the index of the
   * currently first visible virtual scroll item
   * @param observedItems
   */
  private _handleIndexIntersection(
    observedItems: IntersectionObserverEntry[],
  ): void {
    if (this._popoverOpen) {
      observedItems.some((entry) => {
        const item = entry.target as FluidOption;
        const itemIndex = parseInt(item.dataset.index!);

        // Ignore intersections of items at the end of the list
        if (!(entry.boundingClientRect.bottom > entry.rootBounds!.bottom)) {
          // Handle intersection of the currently first rendered item
          if (entry.isIntersecting) {
            if (!item.previousElementSibling) {
              // First rendered item is visible
              this._virtualScrollStartIndex = itemIndex;
            } else {
              // First rendered item is not visible
              // Get index of first visible item to account for fast scrolling
              this._virtualScrollStartIndex = this._getFirstVisibleItemIndex();
            }
          } else if (
            !entry.isIntersecting &&
            entry.boundingClientRect.top <= entry.rootBounds!.top
          ) {
            this._virtualScrollStartIndex = this._getFirstVisibleItemIndex();
          }

          // New index is already set --> stop looping
          return true;
        }

        return false;
      });
    }
  }

  /**
   * Handle intersection of items observed for updating the virtual scroll buffer
   * @param observedItems List of observed items whose intersection ratio changed
   */
  private _handlePaddingIntersection(
    observedItems: IntersectionObserverEntry[],
  ): void {
    if (this._popoverOpen) {
      observedItems.forEach((entry) => {
        const item = entry.target as FluidOption;
        const itemIndex = parseInt(item.dataset.index!);

        // Don't handle intersection triggered when adding an observed item
        if (!this._observedItemsVirtualScrollBuffer.has(itemIndex)) {
          this._observedItemsVirtualScrollBuffer.add(itemIndex);
        } else {
          if (entry.isIntersecting) {
            this._clearVirtualScrollBufferObserver();

            let removePaddingAt: VirtualScrollRenderAtPosition =
              itemIndex === this._bufferStartObservedItemIndex
                ? `end`
                : `start`;
            this._removeVirtualScrollItems(removePaddingAt);

            if (removePaddingAt === `start`) {
              this._renderVirtualScrollPadding();
            } else {
              this._renderVirtualScrollPadding(`start`);
            }
          }
        }
      });
    }
  }

  /** Clear items observed for handling the virtual scroll buffer */
  private _clearVirtualScrollBufferObserver(): void {
    this._virtualScrollBufferObserver.disconnect();

    this._observedItemsVirtualScrollBuffer.delete(
      this._bufferStartObservedItemIndex,
    );
    this._observedItemsVirtualScrollBuffer.delete(
      this._bufferEndObservedItemIndex,
    );
  }

  /**
   * Checks, if the rendered items are filling up the available space
   * If a suffiecient amount of items is rendered, render scroll buffer
   * and set up listeners for scrolling
   * Else, render another batch of items and check again
   */
  private _checkVirtualScrollItemsHeight(): void {
    requestAnimationFrame(() => {
      if (
        this._popover._popoverContainer.clientHeight <
        this._popover._popoverElementsContainer.clientHeight
      ) {
        this._initialVirtualRenderDone = true;
        this._renderVirtualScrollPadding();
      } else if (!this._initialVirtualRenderDone) {
        this._renderInitialVirtualScrollItems();
      }
    });
  }

  /** Get the index of the first visible item in the virtual scroll container */
  private _getFirstVisibleItemIndex(): number {
    let visibleItemIndex = -1;

    const virtualScrollContainerBCR = this._popover._popoverContainer.getBoundingClientRect();
    const visibleItems = this._popover._popoverContainer.querySelectorAll<
      FluidOption
    >(`.fluid-combo-box-option`);

    for (const item of Array.from(visibleItems)) {
      const bcr = item.getBoundingClientRect();

      if (
        bcr.top >=
        virtualScrollContainerBCR.top - bcr.height * VIRTUAL_SCROLL_THRESHOLD
      ) {
        visibleItemIndex = parseInt(item.dataset.index!);
        break;
      }
    }

    return visibleItemIndex;
  }

  /** Scroll the virtual scroll container to the correct position */
  private _calculateVirtualContainerScroll(): void {
    // Get item that should be the first visible
    const virtualScrollStartOption = this._popover._popoverContainer.querySelector(
      `.fluid-combo-box-option[data-index="${this._virtualScrollStartIndex}"]`,
    );

    // Get bounding client rects needed for calculating the correct scroll position
    const virtualScrollContainerBCR = this._popover._popoverContainer.getBoundingClientRect();
    const virtualScrollStartOptionBCR = virtualScrollStartOption!.getBoundingClientRect();

    // Calculate offset between target and current position
    const scrollOffset =
      virtualScrollStartOptionBCR.top - virtualScrollContainerBCR.top;
    // Set scroll position of container
    this._popover._popoverContainer.scrollTop =
      this._popover._popoverContainer.scrollTop + scrollOffset;
  }

  /**
   * Remove items according to the virtual scroll buffer size
   * from the start or end of the list of currently rendered items
   * @param removeFrom Whether items should be removed at the start or end of the list
   */
  private _removeVirtualScrollItems(
    removeFrom: VirtualScrollRenderAtPosition = `start`,
  ): void {
    // Remove items if buffer exists at the start and end of the list
    if (
      this._renderedVirtualScrollItems.length ===
      VIRTUAL_SCROLL_BUFFER_SIZE * 2 +
        VIRTUAL_SCROLL_BATCH_SIZE * this._initialVirtualBatchesRendered
    ) {
      if (removeFrom === `start`) {
        let bufferStartHeight = 0;
        for (let i = 0; i < VIRTUAL_SCROLL_BUFFER_SIZE; i += 1) {
          console.log(`remove`, this._virtualScrollFirstRenderedIndex + i);
          const item = this._popover._popoverContainer.querySelector(
            `.fluid-combo-box-option[data-index="${
              this._virtualScrollFirstRenderedIndex + i
            }"]`,
          )!;

          bufferStartHeight += item.clientHeight;
        }

        this._renderedVirtualScrollItems = this._renderedVirtualScrollItems.slice(
          VIRTUAL_SCROLL_BUFFER_SIZE,
        );
        this._virtualScrollFirstRenderedIndex += VIRTUAL_SCROLL_BUFFER_SIZE;

        requestAnimationFrame(
          () =>
            (this._popover._popoverContainer.scrollTop -= bufferStartHeight),
        );
      } else {
        this._renderedVirtualScrollItems = this._renderedVirtualScrollItems.slice(
          0,
          -VIRTUAL_SCROLL_BUFFER_SIZE,
        );
        this._virtualScrollFirstRenderedIndex -= VIRTUAL_SCROLL_BUFFER_SIZE;
        this._virtualScrollLastRenderedItemIndex -= VIRTUAL_SCROLL_BUFFER_SIZE;

        requestAnimationFrame(() => {
          let bufferStartHeight = 0;
          for (let i = 0; i < VIRTUAL_SCROLL_BUFFER_SIZE; i += 1) {
            console.log(i);
            const item = this._popover._popoverContainer.querySelector(
              `.fluid-combo-box-option[data-index="${
                this._virtualScrollFirstRenderedIndex + i
              }"]`,
            )!;

            if (item) {
              bufferStartHeight += item.clientHeight;
            }
          }

          this._popover._popoverContainer.scrollTop += bufferStartHeight;
        });
      }
    }
  }

  /**
   * Create intersection observers for observing
   * the items in the virtual scroll container
   */
  firstUpdated(props: PropertyValues): void {
    super.firstUpdated(props);

    // The popover container is not yet available when 'firstUpdated' gets called
    // --> wrap creation of the observers in 'requestAnimationFrame'
    requestAnimationFrame(() => {
      // Intersection observer for observing items relevant for updating
      // the index of the currently visible topmost item
      this._virtualScrollIndexObserver = new IntersectionObserver(
        this._handleIndexIntersection.bind(this),
        {
          root: this._popover._popoverContainer,
          threshold: VIRTUAL_SCROLL_THRESHOLD,
        },
      );

      // Intersection observer for observing items relevant for updating
      // the currently rendered items
      this._virtualScrollBufferObserver = new IntersectionObserver(
        this._handlePaddingIntersection.bind(this),
        {
          root: this._popover._popoverContainer,
          threshold: 0.5,
        },
      );
    });
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    console.count(`rendering`);
    if (this._popover?._popoverContainer && this._options.length) {
      if (!this._initialVirtualRenderDone) {
        this._renderInitialVirtualScrollItems();
      } else {
        this._renderExistingVirtualScrollItems();
      }
    }

    return html`
      <fluid-input>
        ${this.label
          ? html`<label slot="label" for="fluid-combo-box-input-${_unique}"
              >${this.label}</label
            >`
          : nothing}
        <input
          id="fluid-combo-box-input-${_unique}"
          class="fluid-combo-box-input"
          type="text"
          aria-label=${ifDefined(this.arialabel)}
          aria-labelledby=${ifDefined(this.arialabelledby)}
          placeholder=${this.placeholder}
          @blur=${this._handleBlur}
          @keydown=${this._handleKeydown}
          @keyup=${this._handleKeyup}
          ?required=${this.required}
          ?disabled=${this.disabled}
        />
        <fluid-icon name="overview" slot="icon"></fluid-icon>
      </fluid-input>
      <fluid-popover
        @mouseInsideChange=${this._handleInsidePopover}
        .anchor=${this._input}
        .open=${this._popoverOpen}
        .offset=${_offset}
        .fallbackplacement=${FALLBACK_PLACEMENT}
      >
        ${this._optionsCount
          ? nothing
          : html`<div class="fluid-combo-box-empty">Nothing to select</div>`}
      </fluid-popover>
    `;
  }
}
