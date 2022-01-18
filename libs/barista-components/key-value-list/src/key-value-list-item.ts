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

import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

/** Key of a keyValueList, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-key-value-list-key, [dtKeyValueListKey]`,
  exportAs: 'dtKeyValueListKey',
})
export class DtKeyValueListKey {}

/** Value of a keyValueList, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-key-value-list-value, [dtKeyValueListValue]`,
  exportAs: 'dtKeyValueListValue',
})
export class DtKeyValueListValue {}

@Component({
  selector: 'dt-key-value-list-item',
  templateUrl: 'key-value-list-item.html',
  styleUrls: ['key-value-list-item.scss'],
  host: {
    class: 'dt-key-value-list-item',
  },
  exportAs: 'dtKeyValueListItem',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueListItem {}
