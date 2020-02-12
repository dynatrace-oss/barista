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

import { DELIMITER } from '../../../filter-field/src/filter-field-util';

export function buildIdPathsFromFilters(filters: any[][]): string[] {
  return filters.map(path =>
    path.reduce(
      (previousValue, currentValue) =>
        `${previousValue.name}${DELIMITER}${currentValue.name}${DELIMITER}`,
    ),
  );
}
