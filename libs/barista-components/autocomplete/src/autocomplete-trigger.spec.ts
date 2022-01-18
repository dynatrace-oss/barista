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

import { calculateOptionHeight } from './autocomplete-trigger';

describe('calculateOptionHeight()', () => {
  function expectCalculatedHeight(
    preferredOptionHeight: number,
    actualHeight: number,
    actualMaxPanelHeight: number,
  ): void {
    const heightConfig = calculateOptionHeight(preferredOptionHeight);

    expect(heightConfig.height).toBe(actualHeight);
    expect(heightConfig.maxPanelHeight).toBe(actualMaxPanelHeight);
  }

  it('should calculate an option height of 28 and an maximum panel height of 256 when the preferred option height is 0', () => {
    expectCalculatedHeight(0, 28, 256);
  });

  it('should calculate an option height of 28 and an maximum panel height of 256 when the preferred option height is 27', () => {
    expectCalculatedHeight(27, 28, 256);
  });

  it('should calculate an option height of 28 and an maximum panel height of 256 when the preferred option height is 28', () => {
    expectCalculatedHeight(28, 28, 256);
  });

  it('should calculate an option height of 40 and an maximum panel height of 256 when the preferred option height is 40', () => {
    expectCalculatedHeight(40, 40, 256);
  });

  it('should calculate an option height of 256 and an maximum panel height of 384 when the preferred option height is 256', () => {
    expectCalculatedHeight(256, 256, 384);
  });

  it('should calculate an option height of 276 and an maximum panel height of 414 when the preferred option height is 276', () => {
    expectCalculatedHeight(276, 276, 414);
  });
});
