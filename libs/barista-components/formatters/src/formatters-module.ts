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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtBits } from './bits/bits';
import { DtBytes } from './bytes/bytes';
import { DtKilobytes } from './bytes/kilobytes';
import { DtMegabytes } from './bytes/megabytes';
import { DtCount } from './count/count';
import { DtDateRange } from './date/date-range';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';
/** @breaking-change Removed in 7.0.0 */
import { DtTime } from './time/time';

const FORMATTERS = [
  DtBytes,
  DtBits,
  DtKilobytes,
  DtMegabytes,
  DtCount,
  DtPercent,
  DtRate,
  DtDateRange,
  /** @breaking-change Removed in 7.0.0 */
  DtTime,
];

@NgModule({
  declarations: FORMATTERS,
  exports: FORMATTERS,
  imports: [CommonModule],
})
export class DtFormattersModule {}
