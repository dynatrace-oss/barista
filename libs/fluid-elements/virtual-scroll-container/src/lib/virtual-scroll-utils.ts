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

import { FluidVirtualScrollState } from './virtual-scroll-state';

/**
 * @internal Adds one batch of items to be intially rendered in the virtual scroll container
 * @returns New scroll state with updated values
 */
export function virtualScrollAddInitialItemsBatch(
  state: FluidVirtualScrollState,
): FluidVirtualScrollState {
  if (!state.itemsCount) {
    return state;
  }

  const newState = appendItems(state, state.itemsBatchSize);
  return { ...newState, initialBatches: state.initialBatches += 1 };
}

/**
 * @internal Adds new items to the start of the list, removes items from the end
 * @returns New scroll state with updated values
 */
export function virtualScrollUpdateStartScrollBuffer(
  state: FluidVirtualScrollState,
): FluidVirtualScrollState {
  if (!state.itemsCount) {
    return state;
  }

  let newState = { ...state };
  const prevRenderedItemsCount = renderedItemsCount(newState);

  // Add items to the start
  newState = prependItems(newState, newState.itemsBufferSize);

  // Calculate start buffer size
  newState.startItemsBufferSize =
    renderedItemsCount(newState) - prevRenderedItemsCount;

  // Remove items from the end depending on the amount of newly rendered items
  newState.renderedItemsRangeEnd -= newState.startItemsBufferSize;

  // Calculate number of items of the end buffer
  newState.endItemsBufferSize =
    renderedItemsCount(newState) -
    newState.initialBatches * newState.itemsBatchSize -
    newState.startItemsBufferSize;

  return { ...newState, ...calculateObservedItemsIndices(newState) };
}

/**
 * @internal Adds new items to the end of the list, remove items from the start
 * @returns New scroll state with updated values
 */
export function virtualScrollUpdateEndScrollBuffer(
  state: FluidVirtualScrollState,
): FluidVirtualScrollState {
  if (!state.itemsCount) {
    return state;
  }

  let newState = { ...state };
  const prevRenderedItemsCount = renderedItemsCount(newState);

  // Add items to the end
  newState = appendItems(newState, newState.itemsBufferSize);

  // Calculate end buffer size
  newState.endItemsBufferSize =
    renderedItemsCount(newState) - prevRenderedItemsCount;

  // Remove items from the start depending on the amount of newly rendered items
  if (newState.startItemsBufferSize > 0) {
    newState.renderedItemsRangeStart += newState.endItemsBufferSize;
  }

  // Calculate number of items of the start buffer
  newState.startItemsBufferSize =
    renderedItemsCount(newState) -
    newState.initialBatches * newState.itemsBatchSize -
    newState.endItemsBufferSize;
  newState.startItemsBufferSize = Math.max(0, newState.startItemsBufferSize);

  return { ...newState, ...calculateObservedItemsIndices(newState) };
}

/**
 * @internal Calculates the size of the start and end placeholder based on the average item height
 * @returns New scroll state with updated values
 */
export function virtualScrollCalculatePlaceholderSize(
  state: FluidVirtualScrollState,
): FluidVirtualScrollState {
  if (!state.itemsCount) {
    return state;
  }

  return {
    ...state,
    startPlaceholderSize: state.renderedItemsRangeStart * state.avgItemHeight,
    endPlaceholderSize:
      (state.itemsCount - state.renderedItemsRangeEnd - 1) *
      state.avgItemHeight,
  };
}

/**
 * @internal Resets the virtual scroll state
 * @returns New scroll state with default values
 */
export function virtualScrollResetState(
  state: FluidVirtualScrollState,
): FluidVirtualScrollState {
  return new FluidVirtualScrollState({
    itemsBatchSize: state.itemsBatchSize,
    itemsBufferSize: state.itemsBufferSize,
  });
}

/**
 * @internal Adds items to the end of the rendered items array
 * @returns New scroll state with updated items range
 */
function appendItems(
  state: FluidVirtualScrollState,
  itemCount: number,
): FluidVirtualScrollState {
  return {
    ...state,
    ...calculateRenderedItemsRange(
      state,
      itemCount,
      state.renderedItemsRangeEnd,
    ),
  };
}

/**
 * @internal Adds items to the beginning of the rendered items array
 * @returns New scroll state with updated items range
 */
function prependItems(
  state: FluidVirtualScrollState,
  itemCount: number,
): FluidVirtualScrollState {
  const startAt = state.renderedItemsRangeStart - state.itemsBufferSize;
  return {
    ...state,
    ...calculateRenderedItemsRange(state, itemCount, startAt),
  };
}

/**
 * @internal Calculates the range of items to render
 * @returns Range start and end
 */
function calculateRenderedItemsRange(
  state: FluidVirtualScrollState,
  itemCount: number,
  startAt: number,
): { renderedItemsRangeStart: number; renderedItemsRangeEnd: number } {
  // Index of last item to add to the rendered items
  const newItemsEndIndex = startAt + itemCount;
  let { renderedItemsRangeStart, renderedItemsRangeEnd } = state;

  // If the index of the first item to render is smaller than the currently
  // first rendered item's index (items are prepended), set the range's
  // start index to the new startAt index
  if (
    state.renderedItemsRangeStart === -1 ||
    startAt < state.renderedItemsRangeStart
  ) {
    renderedItemsRangeStart = Math.max(0, startAt);
  }

  // If the index of the last item to render is bigger than the currently
  // last rendered item's index (items are appended), set the range's
  // end index to the new end index
  if (newItemsEndIndex > state.renderedItemsRangeEnd) {
    renderedItemsRangeEnd =
      newItemsEndIndex > state.itemsCount - 1
        ? state.itemsCount - 1
        : newItemsEndIndex;
  }

  return { renderedItemsRangeStart, renderedItemsRangeEnd };
}

/**
 * @internal Calculates the indices of the first and last item to be observed
 * @returns Index of first and last item to observe
 */
function calculateObservedItemsIndices(
  state: FluidVirtualScrollState,
): {
  bufferStartObservedItemIndex: number;
  bufferEndObservedItemIndex: number;
} {
  // No need to observe anything since there are not enough items to scroll virtually
  if (state.itemsCount <= renderedItemsCount(state)) {
    return {
      bufferStartObservedItemIndex: -1,
      bufferEndObservedItemIndex: -1,
    };
  }

  // Last item of the list is rendered, no need to observe the end of the list
  // Observe the start of the list to adjust the buffer when scrolling towards the start
  if (state.renderedItemsRangeEnd === state.itemsCount - 1) {
    return {
      bufferStartObservedItemIndex:
        state.renderedItemsRangeEnd -
        state.initialBatches * state.itemsBatchSize -
        Math.floor(state.itemsBufferSize * 0.5),
      bufferEndObservedItemIndex: -1,
    };
  }

  // First item of the list is rendered, no need to observe the start of the list
  // Observe the end of the list to adjust the buffer when scrolling towards the end
  if (state.startItemsBufferSize < state.itemsBufferSize) {
    return {
      bufferStartObservedItemIndex: -1,
      bufferEndObservedItemIndex:
        state.renderedItemsRangeEnd - Math.floor(state.itemsBufferSize * 0.5),
    };
  }

  // Observe start and end of the rendered items
  const bufferEndObservedItemIndex =
    state.renderedItemsRangeEnd - Math.floor(state.itemsBufferSize * 0.5);

  return {
    bufferStartObservedItemIndex:
      bufferEndObservedItemIndex -
      state.initialBatches * state.itemsBatchSize -
      state.itemsBufferSize,
    bufferEndObservedItemIndex,
  };
}

/** @internal Number of currently rendered items */
function renderedItemsCount(state: FluidVirtualScrollState): number {
  return state.renderedItemsRangeEnd - state.renderedItemsRangeStart + 1;
}
