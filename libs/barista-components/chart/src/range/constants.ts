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

/** @internal class for the arrows on the handles when it was released */
export const DT_RANGE_RELEASED_CLASS = 'dt-chart-range-released';

/** @internal class that indicates weather the range is valid or not */
export const DT_RANGE_INVALID_CLASS = 'dt-chart-range-invalid';

/** @internal Aria label for the left handle. */
export const ARIA_DEFAULT_LEFT_HANDLE_LABEL = 'left handle';

/** @internal Aria label for the right handle. */
export const ARIA_DEFAULT_RIGHT_HANDLE_LABEL = 'right handle';

/** @internal Aria label for the close button in the overlay. */
export const ARIA_DEFAULT_CLOSE_LABEL = 'close';

/** @internal Aria label for the selected area. */
export const ARIA_DEFAULT_SELECTED_AREA_LABEL = 'the selected area';

/** @internal The Default minimum is 5 minutes */
// eslint-disable-next-line  no-magic-numbers
export const DT_RANGE_DEFAULT_MIN = 5 * 60 * 1000;
