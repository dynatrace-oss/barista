/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

/** Determines the items that need to be transplanted by checking which items fit into the container width */
export function determineOverflowingItems<T>(
  containerRect: DOMRect,
  itemsWidthMap: Map<T, number>,
  reservedSpace: number = 0,
): T[] {
  // Calculate the sum of all item widths
  const totalItemWidth = Array.from(itemsWidthMap.values()).reduce(
    (sum, itemWidth) => sum + itemWidth,
    0,
  );
  if (totalItemWidth < containerRect.width) {
    // no items overflowing
    return [];
  }
  // Substract the width the reservedSpace needs because we already know
  // that we need to transplant some items that are overflowing
  let remainingContainerWidth = containerRect.width - reservedSpace;

  const items = Array.from(itemsWidthMap.keys()).reverse();

  // Check whether the last item's width is larger than the available space
  // if it is return every item except the last item, because the last will always be visible
  if (
    items.length > 0 &&
    remainingContainerWidth <= (itemsWidthMap.get(items[0]) ?? 0)
  ) {
    return items.slice(1).reverse();
  }

  // We now know that we have some overflowing items, but not all items
  // Substract each item's width one by one until we find the item
  // that causes the overflow starting from the last item
  for (const [index, item] of items.entries()) {
    // substract the item width from the container width
    remainingContainerWidth =
      remainingContainerWidth - (itemsWidthMap.get(item) || 0);
    if (remainingContainerWidth < 0) {
      return items.slice(index).reverse();
    }
  }
  return [];
}
