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

import { PointOptionsObject } from 'highcharts';

import { randomize } from './randomize';

export function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number,
  generateGaps?: boolean,
): PointOptionsObject[] {
  if (amount < 0) {
    throw new Error('Amount must not be negative');
  }
  if (min > max) {
    throw new Error(
      `Min value (${min}) must not be larger than max value (${max})`,
    );
  }

  const data = new Array<PointOptionsObject>(amount);

  for (let i = 0; i < amount; i++) {
    data[i] = {
      x: timestampStart + timestampTick * i,
      y:
        // eslint-disable-next-line no-magic-numbers
        generateGaps === true && Math.random() > 0.75
          ? undefined
          : randomize(min, max),
    };
  }
  return data;
}
