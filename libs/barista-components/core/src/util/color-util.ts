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

import { isString } from './type-util';

/**
 * @internal
 * Checks if the given value is a valid hexadecimal color value
 * used e.g. in CSS. 3- and 6-digit values, starting with # are valid.
 */
export function _isValidColorHexValue(value: string): boolean {
  return (
    isString(value) &&
    Boolean(value.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/))
  );
}
