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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { clampRange } from './clamp-range';

describe('DtChartRange clamp values', () => {
  const maxWidth = 500;
  const minWidth = 10;

  it('should not clamp range when the provided range is inside the min and max constraints', () => {
    const range = { left: 10, width: 100 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 10, width: 100 });
  });

  it('should clamp the left value to 0 if it is below', () => {
    const range = { left: -20, width: 100 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 100 });
  });

  it('should clamp the width if it exceeds the maxWidth', () => {
    const range = { left: 0, width: 600 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 500 });
  });

  it('should clamp the width if it exceeds the maxWidth', () => {
    const range = { left: 100, width: 500 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 100, width: 400 });
  });

  it('should clamp the width if the width is below the minimum', () => {
    const range = { left: 100, width: 1 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 100, width: 10 });
  });

  it('should clamp the width if the left value is to large for the max width', () => {
    const range = { left: 500, width: 100 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 490, width: 10 });
  });

  it('should clamp the width if the left is 0 and the width is to big', () => {
    const range = { left: 0, width: 600 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 500 });
  });

  it('should clamp the width and left when both does not meet the constraints', () => {
    const range = { left: -10, width: 600 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 500 });
  });
});
