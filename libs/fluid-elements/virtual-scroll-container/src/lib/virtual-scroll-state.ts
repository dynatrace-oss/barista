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

export interface FluidVirtualScrollOptions {
  itemsBatchSize?: number;
  itemsBufferSize?: number;
}

// Number of items to render each time until the container is filled up
const VIRTUAL_SCROLL_BATCH_SIZE = 5;
// Number of items to render in addition to the initially rendered items
const VIRTUAL_SCROLL_BUFFER_SIZE = 3;

/**
 * @internal This class holds all the values representing the
 * current state of a virtual scroll container
 */
export class FluidVirtualScrollState {
  /** Average item height */
  avgItemHeight: number;

  /** Index of the first rendered item */
  renderedItemsRangeStart = -1;

  /** Index of the first rendered item */
  renderedItemsRangeEnd = -1;

  /** Empty placeholder before the rendered items to correctly render the scrollbar */
  startPlaceholderSize = 0;

  /** Empty placeholder after the rendered items to correctly render the scrollbar */
  endPlaceholderSize = 0;

  /** Number of currently rendered start buffer items */
  startItemsBufferSize = 0;

  /** Number of currently rendered end buffer items */
  endItemsBufferSize = 0;

  /** Index of the item to observe for adjusting the start buffer */
  bufferStartObservedItemIndex = -1;

  /** Index of the item to observe for adjusting the end buffer */
  bufferEndObservedItemIndex = -1;

  /** Total number of items in the virtual scroll panel */
  itemsCount = 0;

  /** Number of items to render when initialising */
  itemsBatchSize: number;

  /** Number of initial batches rendered to fill up the whole container */
  initialBatches = 0;

  /** Number of items rendered above and below the fold */
  itemsBufferSize: number;

  constructor({
    itemsBatchSize,
    itemsBufferSize,
  }: FluidVirtualScrollOptions = {}) {
    this.itemsBatchSize = itemsBatchSize ?? VIRTUAL_SCROLL_BATCH_SIZE;
    this.itemsBufferSize = itemsBufferSize ?? VIRTUAL_SCROLL_BUFFER_SIZE;
  }
}
