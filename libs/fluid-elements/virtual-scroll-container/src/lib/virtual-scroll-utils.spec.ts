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

import {
  virtualScrollAddInitialItemsBatch,
  virtualScrollCalculatePlaceholderSize,
  virtualScrollResetState,
  virtualScrollUpdateEndScrollBuffer,
} from './virtual-scroll-utils';

const BATCH_SIZE = 5;
const BUFFER_SIZE = 3;
const AVG_ITME_HEIGHT = 20;

function checkScrollState(
  instance: FluidVirtualScrollState,
  renderedItemsRangeStart: number,
  renderedItemsRangeEnd: number,
  startPlaceholderSize: number,
  endPlaceholderSize: number,
  startItemsBufferSize: number,
  endItemsBufferSize: number,
  bufferStartObservedItemIndex: number,
  bufferEndObservedItemIndex: number,
): void {
  expect(instance.renderedItemsRangeStart).toEqual(renderedItemsRangeStart);
  expect(instance.renderedItemsRangeEnd).toEqual(renderedItemsRangeEnd);
  expect(instance.startPlaceholderSize).toEqual(startPlaceholderSize);
  expect(instance.endPlaceholderSize).toEqual(endPlaceholderSize);
  expect(instance.startItemsBufferSize).toEqual(startItemsBufferSize);
  expect(instance.endItemsBufferSize).toEqual(endItemsBufferSize);
  expect(instance.bufferStartObservedItemIndex).toEqual(
    bufferStartObservedItemIndex,
  );
  expect(instance.bufferEndObservedItemIndex).toEqual(
    bufferEndObservedItemIndex,
  );
}

describe(`Fluid virtual scroll state`, () => {
  let instance: FluidVirtualScrollState;

  beforeEach(() => {
    instance = new FluidVirtualScrollState({
      itemsBatchSize: BATCH_SIZE,
      itemsBufferSize: BUFFER_SIZE,
    });
  });

  it(`should create the scroll state instance`, () => {
    expect(instance).not.toBe(null);
    expect(instance.avgItemHeight).toBeUndefined();
    checkScrollState(instance, -1, -1, 0, 0, 0, 0, -1, -1);
  });

  it(`should not update items range as long as items count is 0`, () => {
    instance = virtualScrollAddInitialItemsBatch(instance);
    expect(instance.renderedItemsRangeStart).toEqual(-1);
    expect(instance.renderedItemsRangeEnd).toEqual(-1);
  });

  describe(`no need to scroll due to too little items`, () => {
    beforeEach(() => {
      instance = virtualScrollResetState(instance);
      instance.itemsCount = 3;
    });

    it(`should reset the virtual scroll state when the items count changes`, () => {
      expect(instance.avgItemHeight).toBeUndefined();
      checkScrollState(instance, -1, -1, 0, 0, 0, 0, -1, -1);
    });

    it(`should not add more items than available`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      checkScrollState(instance, 0, 2, 0, 0, 0, 0, -1, -1);

      instance = virtualScrollAddInitialItemsBatch(instance);
      instance = virtualScrollAddInitialItemsBatch(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      checkScrollState(instance, 0, 2, 0, 0, 0, 0, -1, -1);
    });
  });

  describe(`items count = 20`, () => {
    beforeEach(() => {
      instance.itemsCount = 20;
      instance.avgItemHeight = AVG_ITME_HEIGHT;
    });

    it(`should add one batch of items`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      checkScrollState(instance, 0, 4, 0, 0, 0, 0, -1, -1);
    });

    it(`should add two batches of items`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      instance = virtualScrollAddInitialItemsBatch(instance);
      checkScrollState(instance, 0, 9, 0, 0, 0, 0, -1, -1);
    });

    it(`should add items plus buffer`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      checkScrollState(instance, 0, 7, 0, 0, 0, 3, -1, 6);
    });

    it(`should not remove items at start, if there is no buffer yet`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      instance = virtualScrollCalculatePlaceholderSize(instance);
      checkScrollState(instance, 0, 10, 0, 180, 3, 3, 1, 9);
    });

    it(`should remove items at the start`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      instance = virtualScrollUpdateEndScrollBuffer(instance);
      instance = virtualScrollCalculatePlaceholderSize(instance);
      checkScrollState(instance, 3, 13, 60, 120, 3, 3, 4, 12);
    });
  });

  describe(`initialise virtual scroll state with options`, () => {
    beforeEach(() => {
      instance = new FluidVirtualScrollState({
        itemsBatchSize: 10,
        itemsBufferSize: 5,
      });
    });

    it(`should not update items range as long as items count is 0`, () => {
      instance = virtualScrollAddInitialItemsBatch(instance);
      expect(instance.renderedItemsRangeStart).toEqual(-1);
      expect(instance.renderedItemsRangeEnd).toEqual(-1);
    });

    describe(`items count = 50`, () => {
      beforeEach(() => {
        instance.itemsCount = 50;
        instance.avgItemHeight = AVG_ITME_HEIGHT;
      });

      it(`should add one batch of items`, () => {
        instance = virtualScrollAddInitialItemsBatch(instance);
        checkScrollState(instance, 0, 9, 0, 0, 0, 0, -1, -1);
      });

      it(`should add two batches of items`, () => {
        instance = virtualScrollAddInitialItemsBatch(instance);
        instance = virtualScrollAddInitialItemsBatch(instance);
        checkScrollState(instance, 0, 19, 0, 0, 0, 0, -1, -1);
      });

      it(`should add items plus buffer`, () => {
        instance = virtualScrollAddInitialItemsBatch(instance);
        instance = virtualScrollUpdateEndScrollBuffer(instance);
        checkScrollState(instance, 0, 14, 0, 0, 0, 5, -1, 12);
      });

      it(`should not remove items at start, if there is no buffer yet`, () => {
        instance = virtualScrollAddInitialItemsBatch(instance);
        instance = virtualScrollUpdateEndScrollBuffer(instance);
        instance = virtualScrollUpdateEndScrollBuffer(instance);
        instance = virtualScrollCalculatePlaceholderSize(instance);
        checkScrollState(instance, 0, 19, 0, 600, 5, 5, 2, 17);
      });

      it(`should remove items at the start`, () => {
        instance = virtualScrollAddInitialItemsBatch(instance);
        instance = virtualScrollUpdateEndScrollBuffer(instance);
        instance = virtualScrollUpdateEndScrollBuffer(instance);
        instance = virtualScrollUpdateEndScrollBuffer(instance);
        instance = virtualScrollCalculatePlaceholderSize(instance);
        checkScrollState(instance, 5, 24, 100, 500, 5, 5, 7, 22);
      });
    });
  });
});
