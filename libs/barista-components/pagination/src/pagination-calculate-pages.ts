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

import { BOUND, MAX_PAGINATION_ITEMS } from './pagination-defaults';

/**
 * @internal
 * Calculates the numbers to be displayed by the pagination, according to the pagination State.
 * ellipsis pages that should not be shown.
 * @param numberOfPages the number of pages that should be displayed
 * @param currentPage the number of the current page (starts with 1)
 */
export function calculatePages(
  numberOfPages: number,
  currentPage: number,
): number[][] {
  if (currentPage > numberOfPages || currentPage < 1) {
    return [];
  }

  if (numberOfPages < MAX_PAGINATION_ITEMS) {
    // create an Array with the length of numberOfPages that starts with one and ends with n
    return [Array.from({ length: numberOfPages }, (_, index) => index + 1)];
  }

  const start = new Set<number>(
    Array.from({ length: BOUND }, (_, index) => index + 1),
  );
  const end = new Set<number>(
    Array.from(
      { length: BOUND },
      (_, index) => numberOfPages - BOUND + index + 1,
    ),
  );
  const middle = new Set<number>();

  if (start.has(currentPage)) {
    start.add(currentPage + 1);
  } else if (end.has(currentPage)) {
    end.add(currentPage - 1);
  } else {
    middle.add(currentPage - 1);
    middle.add(currentPage);
    middle.add(currentPage + 1);
  }

  const startArray = Array.from(start);
  const middleArray = Array.from(middle);
  const endArray = Array.from(end).sort((a, b) => a - b);

  if (middle.has(currentPage)) {
    return [[startArray[0]], middleArray, [endArray[endArray.length - 1]]];
  }

  if (start.has(currentPage)) {
    return [
      startArray,
      endArray.slice(startArray.length - MAX_PAGINATION_ITEMS + 1),
    ];
  }

  // current is in the end
  return [
    startArray.splice(0, MAX_PAGINATION_ITEMS - endArray.length - 1),
    endArray,
  ];
}
