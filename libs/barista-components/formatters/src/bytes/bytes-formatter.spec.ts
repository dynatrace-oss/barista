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

import { KIBI_MULTIPLIER } from '../number-formatter';
import { formatBytes } from './bytes-formatter';

describe('formatBytes', () => {
  it('should format positive million bytes', () => {
    // given
    const inputValue = 1000000.0;

    // when
    const result = formatBytes(inputValue, {
      factor: KIBI_MULTIPLIER,
      inputUnit: 'B',
    });

    // then
    expect(result.displayData.displayValue).toEqual('977');
    expect(result.displayData.displayUnit).toEqual('kiB');
  });

  it('should format negative million bytes', () => {
    // given
    const inputValue = -1000000.0;

    // when
    const result = formatBytes(inputValue, {
      factor: KIBI_MULTIPLIER,
      inputUnit: 'B',
    });

    // then
    expect(result.displayData.displayValue).toEqual('-977');
    expect(result.displayData.displayUnit).toEqual('kiB');
  });
});
