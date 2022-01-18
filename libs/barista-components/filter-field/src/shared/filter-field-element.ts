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

import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { TemplatePortal } from '@angular/cdk/portal';
import { EventEmitter } from '@angular/core';
import { DtOption } from '@dynatrace/barista-components/core';

export interface DtFilterFieldElement<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  focus: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  _markForCheck: Function;

  _isOpen: boolean;
  closed: EventEmitter<void>;
  opened: EventEmitter<void>;

  _portal: TemplatePortal;

  _keyManager?: ActiveDescendantKeyManager<DtOption<T>>;
}
