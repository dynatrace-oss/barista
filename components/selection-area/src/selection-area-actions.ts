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

import { Directive } from '@angular/core';

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 * Action area in the overlay, needed as it's used as a selector in the API.
 */
@Directive({
  selector: `dt-selection-area-actions, [dt-selection-area-actions], [dtSelectionAreaActions]`,
  exportAs: 'dtSelectionAreaActions',
  host: {
    class: 'dt-selection-area-actions',
  },
})
export class DtSelectionAreaActions {}
