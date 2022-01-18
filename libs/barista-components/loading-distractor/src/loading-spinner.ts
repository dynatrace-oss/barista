/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'dt-loading-spinner',
  exportAs: 'dtLoadingSpinner',
  templateUrl: 'loading-spinner.html',
  styleUrls: ['loading-spinner.scss'],
  host: {
    role: 'progressbar',
    'aria-busy': 'true',
    'aria-live': 'assertive',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtLoadingSpinner {
  // We have to disable the no-input-rename rule here because the
  // minus character can't be used in an variable name.
  /* eslint-disable @angular-eslint/no-input-rename */

  /** The aria-labelledby attribute. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** The aria-label attribute. */
  @Input('aria-label') ariaLabel: string;
  /* eslint-enable @angular-eslint/no-input-rename */
}
