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
  PropertyValues,
  TemplateResult,
  css,
  customElement,
  html,
  property,
  query,
  unsafeCSS,
} from 'lit-element';

// tslint:disable-next-line: nx-enforce-module-boundaries
import { VirtualScrollState } from './virtual-scroll-state';
import { render } from 'lit-html';

import { FLUID_INPUT_PADDING } from '@dynatrace/fluid-design-tokens';

let _unique = 0;

// Threshold to dertermine when the observer should trigger the callback
const VIRTUAL_SCROLL_THRESHOLD = 0.5;

/**
 * This is an experimental virtual-scroll-container element built with lit-elements and
 * web-components. It registers itself as `fluid-virtual-scroll-container` custom element.
 * @element fluid-virtual-scroll-container
 */
@customElement('fluid-virtual-scroll-container')
export class FluidVirtualScrollContainer<T> extends LitElement {
  /** Styles for the virtual-scroll-container component */
  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .fluid-virtual-scroll-container {
        --virtual-scroll-item-height: 0;

        width: 100%;
        height: 100%;
        max-height: 250px;
        overflow: scroll;
      }

      .fluid-virtual-scroll-empty {
        padding: ${unsafeCSS(FLUID_INPUT_PADDING)};
      }

      .fluid-virtual-scroll-item--fixed-height {
        height: var(--virtual-scroll-item-height);
        overflow: hidden;
      }
    `;
  }

  /**
   * Defines the tab element with an id attribute
   * @attr
   */
  @property({ type: String, reflect: true })
  scrollcontainerid = `fluid-virtual-scroll-container-${_unique++}`;

  /**
   * Defines the class(es) to add to the rendered virtual scroll items
   * @attr
   */
  @property({ type: String, reflect: true })
  itemclass: string;

  /**
   * Defines what to display if there are no items to render
   * @attr
   */
  @property({ type: String, reflect: true })
  noitemsmessage = `No items to display.`;

  /**
   * Array of items to display in the scroll container.
   * @attr
   * @type array
   */
  @property({ type: Array, reflect: true })
  get items(): T[] {
    return this._items;
  }
  set items(value: T[]) {
    if (value !== this._items) {
      const oldItems = this._items;
      this._items = value;
      this._resetVirtualScroll();
      this.requestUpdate(`items`, oldItems);
    }
  }
  private _items: T[] = [];

  /**
   * Defines the function to use for rendering items
   * @attr
   * @type function
   */
  @property({ reflect: false, attribute: false })
  renderItemFn: (item: T) => TemplateResult;

  /**
   * Defines the function to use for rendering options
   * @attr
   * @type function
   */
  @property({ reflect: false, attribute: false })
  trackByFn: (option: T) => any = (option: T): any => option;

  /** @internal Reference of the scroll container */
  @query(`#fluid-virtual-scroll-container-${_unique}`)
  _scrollContainer: HTMLDivElement;

  @query(`.fluid-virtual-scroll-items-container`)
  private _scrollItemsContainer: HTMLDivElement;

  @query(`.fluid-virtual-scroll-start-placeholder`)
  private _scrollStartPlaceholder: HTMLDivElement;

  @query(`.fluid-virtual-scroll-end-placeholder`)
  private _scrollEndPlaceholder: HTMLDivElement;

  /** State of the virtual scroll */
  private _scrollState = new VirtualScrollState();

  /** Defines whether the initially visible items have been rendered */
  private _initialRenderDone = false;

  /** Currently rendered virtual scroll items */
  private _renderedItems: TemplateResult[] = [];

  /** Map of template results to load items from if it has been rendered before */
  private _cachedItems: Map<
    string,
    { template: TemplateResult; height: number }
  > = new Map();

  /**
   * Observer for updating the virtual scroll buffer when
   * an item enters the container at the start or end of the list
   */
  private _virtualScrollBufferObserver: IntersectionObserver;

  /**
   * Set storing the indizes of observed items to avoid handling
   * an observed item intersection when it was just added to the observer
   */
  private _observedItemsIndices: Set<number> = new Set();

  /** Reset virtual scroll */
  private _resetVirtualScroll(): void {
    this._scrollState.reset();
    this._initialRenderDone = false;
    if (this._virtualScrollBufferObserver) {
      this._virtualScrollBufferObserver.disconnect();
    }
    this._renderedItems = [];
    this._scrollState.itemsCount = this._items.length;
  }

  /** Render items to display when the popover is first opened */
  private _renderInitialVirtualScrollItems(): void {
    this._renderVirtualScrollItems();

    if (!this._initialRenderDone) {
      this._isInitialRenderDone();
    }
  }

  /** Render new virtual scroll items and add them to the list of rendered items */
  private _renderVirtualScrollItems(): void {
    // First and last index of the range to be rendered
    const { first, last } = this._scrollState.renderedItemsRange;

    // Array of rendered items
    const renderedItems: TemplateResult[] = [];

    for (let i = first; i <= last; i += 1) {
      // Return cached item if available, else create TemplateResult for new item
      let renderedItem: TemplateResult;
      const itemId = this.trackByFn(this._items[i]);

      if (this._cachedItems.has(itemId)) {
        renderedItem = this._cachedItems.get(itemId)!.template;
      } else {
        renderedItem = html`
          <div
            class="fluid-virtual-scroll-item ${this.itemclass}"
            data-index="${i}"
          >
            ${this.renderItemFn(this._items[i])}
          </div>
        `;

        this._cachedItems.set(itemId, { template: renderedItem, height: 0 });
      }

      // Push the new item to the list of rendered items
      renderedItems.push(renderedItem);
    }

    this._renderedItems = [...renderedItems];

    if (!renderedItems.length) {
      this._renderedItems = [
        html`<div class="fluid-virtual-scroll-empty">
          ${this.noitemsmessage}
        </div>`,
      ];
      this._setPlaceholders();
    }

    // Render items into the virtual scroll container
    render(html`${this._renderedItems}`, this._scrollItemsContainer);

    requestAnimationFrame(() => {
      if (
        parseInt(
          window
            .getComputedStyle(this._scrollContainer)
            .getPropertyValue(`--virtual-scroll-item-height`),
        ) === 0
      ) {
        const item = this._scrollContainer.querySelector(
          `.fluid-virtual-scroll-item[data-index="${first}"]`,
        );

        this._scrollContainer.style.setProperty(
          `--virtual-scroll-item-height`,
          `${item?.getBoundingClientRect().height || 0}px`,
        );
      }

      // Store the height of the rendered item
      for (let i = first; i <= last; i += 1) {
        if (!this._cachedItems.get(this.trackByFn(this._items[i]))?.height) {
          const item = this._scrollContainer.querySelector(
            `.fluid-virtual-scroll-item[data-index="${i}"]`,
          );

          if (item) {
            item.classList.add(`fluid-virtual-scroll-item--fixed-height`);

            const itemId = this.trackByFn(this._items[i]);
            this._cachedItems.get(
              itemId,
            )!.height = item.getBoundingClientRect().height;
          }
        }
      }

      // Update observed items
      this._observeVirtualScrollPadding();
    });
  }

  /**
   * In case the render method gets called due to an update to
   * one of the observed properties, we have to also re-render
   * the currently displayed virtual scroll items
   */
  private _renderExistingVirtualScrollItems(): void {
    render(html`${this._renderedItems}`, this._scrollItemsContainer);

    this.requestUpdate();
  }

  /**
   * Observe intersections of the middle item of the scroll buffer
   * As soon as it is half visible, another batch of items is rendered
   */
  private _observeVirtualScrollPadding(): void {
    // Get elements to observe and add them to the observer
    const observedItemStart = this._scrollContainer.querySelector(
      `.fluid-virtual-scroll-item[data-index="${this._scrollState.bufferStartObservedItemIndex}"]`,
    );

    if (observedItemStart) {
      this._virtualScrollBufferObserver.observe(observedItemStart);
    }

    const observedItemEnd = this._scrollContainer.querySelector(
      `.fluid-virtual-scroll-item[data-index="${this._scrollState.bufferEndObservedItemIndex}"]`,
    );

    if (observedItemEnd) {
      this._virtualScrollBufferObserver.observe(observedItemEnd);
    }
  }

  /**
   * Handle intersection of items observed for updating the virtual scroll buffer
   * @param observedItems List of observed items whose intersection ratio changed
   */
  private _handlePaddingIntersection(
    observedItems: IntersectionObserverEntry[],
  ): void {
    observedItems.forEach((entry) => {
      const item = entry.target as HTMLDivElement;
      const itemIndex = parseInt(item.dataset.index!);

      // Don't handle intersection triggered when adding an observed item
      // except when the item has already passed the position where it is normally
      // intersecting for the first time (end observed item at the bottom/right edge of the container,
      // start observed item at the top/left edge)
      // This might happen when the user is scrolling very fast and the observer
      // calls the callback only when the item is already past the bottom/right edge of the
      // container when scrolling downwards or the top/left edge when scrolling upwards
      if (!this._observedItemsIndices.has(itemIndex)) {
        if (
          itemIndex === this._scrollState.bufferEndObservedItemIndex &&
          item.getBoundingClientRect().bottom -
            this._cachedItems.get(this.trackByFn(this._items[itemIndex]))!
              .height *
              VIRTUAL_SCROLL_THRESHOLD <=
            entry.rootBounds!.bottom
        ) {
          // Observed item is at the end of the list, the item is already above the
          // bottom edge of the container, hence the observer would not trigger again
          // when scrolling further down
          this._clearVirtualScrollBufferObserver();
          this._scrollState.updateEndScrollBuffer();
          this._renderVirtualScrollItems();
          this._updatePlaceholders();
        } else if (
          itemIndex === this._scrollState.bufferStartObservedItemIndex &&
          item.getBoundingClientRect().top +
            this._cachedItems.get(this.trackByFn(this._items[itemIndex]))!
              .height *
              VIRTUAL_SCROLL_THRESHOLD >=
            entry.rootBounds!.top
        ) {
          // Observed item is at the start of the list, the item is already below the
          // bottom edge of the container, hence the observer would not trigger again
          // when scrolling further up
          this._clearVirtualScrollBufferObserver();
          this._scrollState.updateStartScrollBuffer();
          this._renderVirtualScrollItems();
          this._updatePlaceholders();
        }

        this._observedItemsIndices.add(itemIndex);
      } else {
        // Request buffer update and render updated items
        if (entry.isIntersecting) {
          this._clearVirtualScrollBufferObserver();

          if (itemIndex === this._scrollState.bufferStartObservedItemIndex) {
            this._scrollState.updateStartScrollBuffer();
          } else {
            this._scrollState.updateEndScrollBuffer();
          }

          this._renderVirtualScrollItems();
          this._updatePlaceholders();
        }
      }
    });
  }

  /** Clear items observed for handling the virtual scroll buffer */
  private _clearVirtualScrollBufferObserver(): void {
    this._virtualScrollBufferObserver.disconnect();
    this._observedItemsIndices.clear();
  }

  /**
   * Checks, if the rendered items are filling up the available space
   * If a suffiecient amount of items is rendered, render scroll buffer
   * and set up listeners for scrolling
   * Else, render another batch of items and check again
   */
  private _isInitialRenderDone(): void {
    requestAnimationFrame(() => {
      if (
        this._scrollContainer.clientHeight <
        this._scrollItemsContainer.clientHeight
      ) {
        // The container is completely filled up
        this._initialRenderDone = true;

        // Call scroll state update end buffer to add the buffer items
        this._scrollState.updateEndScrollBuffer();

        this._renderInitialVirtualScrollItems();
        // Update the placeholders to correctly display the scrollbar
        this._updatePlaceholders();
      } else if (
        this._scrollState.renderedItemsRange.last ===
        this.items.length - 1
      ) {
        // The last item is already rendered
        this._initialRenderDone = true;
      } else if (!this._initialRenderDone) {
        // Add another batch of items to the container
        this._scrollState.addInitialItemsBatch();

        // Rerender the items
        this._renderInitialVirtualScrollItems();
      }
    });
  }

  /**
   * Calculate average item height of the currently rendered items
   * and set the height of the placeholders
   */
  private _updatePlaceholders(): void {
    requestAnimationFrame(() => {
      // Calculate average item height and set it in the scroll state
      const { first, last } = this._scrollState.renderedItemsRange;
      let totalHeight = 0;
      for (let i = first; i <= last; i += 1) {
        totalHeight += this._cachedItems.get(this.trackByFn(this._items[i]))!
          .height;
      }

      const avgItemHeight = totalHeight / (last - first + 1);
      this._scrollState.avgItemHeight = avgItemHeight;

      // Set height of the placeholders above and below the rendered items
      // to correctly display the scroll bar
      // Store the current scrollTop and reset it after setting the height to avoid jumping
      const currentScroll = this._scrollContainer.scrollTop;

      // Recalculate the size of the placeholders
      this._scrollState.calculatePlaceholderSize();
      this._setPlaceholders();

      this._scrollContainer.scrollTop = currentScroll;
    });
  }

  /** Set the height of the placeholder */
  private _setPlaceholders(): void {
    if (this._items.length) {
      this._scrollStartPlaceholder.style.height = `${this._scrollState.startPlaceholderSize}px`;
      this._scrollEndPlaceholder.style.height = `${this._scrollState.endPlaceholderSize}px`;
    } else {
      this._scrollStartPlaceholder.style.height = `0`;
      this._scrollEndPlaceholder.style.height = `0`;
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
      // the currently rendered items
      this._virtualScrollBufferObserver = new IntersectionObserver(
        this._handlePaddingIntersection.bind(this),
        {
          root: this._scrollContainer,
          threshold: VIRTUAL_SCROLL_THRESHOLD,
        },
      );
    });
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    if (this._scrollContainer) {
      if (!this._initialRenderDone) {
        this._renderInitialVirtualScrollItems();
      } else {
        this._renderExistingVirtualScrollItems();
      }
    }

    return html`
      <div id=${this.scrollcontainerid} class="fluid-virtual-scroll-container">
        <div class="fluid-virtual-scroll-start-placeholder"></div>
        <div class="fluid-virtual-scroll-items-container"></div>
        <div class="fluid-virtual-scroll-end-placeholder"></div>
      </div>
    `;
  }
}
