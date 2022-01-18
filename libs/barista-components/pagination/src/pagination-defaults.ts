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

/** @internal The default page size if there is no page size and there are no provided page size options. */
export const DEFAULT_PAGE_SIZE = 50;
/** @internal The offset from the start and the end when it should start adding the ellipsis character */
export const BOUND = 3;
/** @internal The maximum amount of pages that are displayed in a row */
export const MAX_PAGINATION_ITEMS = 7;

/** @internal Aria label for the previous page Button. */
export const ARIA_DEFAULT_PREVIOUS_LABEL = 'Previous page';
/** @internal Aria label for the next page Button. */
export const ARIA_DEFAULT_NEXT_LABEL = 'Next page';
/** @internal Aria label for the pagination. */
export const ARIA_DEFAULT_LABEL = 'Pagination';
/** @internal Aria label for the ellipsis character. */
export const ARIA_DEFAULT_ELLIPSES = 'The next pages are ellipses';
/** @internal Aria label for a page button (Page 1,2,3...). */
export const ARIA_DEFAULT_PAGE_LABEL = 'page';
/** @internal Aria label for the current page button. */
export const ARIA_DEFAULT_CURRENT_LABEL = 'You are currently on page';
