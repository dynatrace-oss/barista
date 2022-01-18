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

import { isCloseTo } from './is-close-to';

it('should be close to when value and expectation are equal', () => {
  expect(isCloseTo(10, 10, 3)).toBe(true);
});

it('should be close to when float value and float expectation are equal', () => {
  expect(isCloseTo(129.5, 129.5, 10)).toBe(true);
});

it('should not be close to when expectation is outside the threshold (lower)', () => {
  expect(isCloseTo(119, 129.5, 10)).toBe(false);
});

it('should not be close to when expectation is outside the threshold (higher)', () => {
  expect(isCloseTo(140, 129.5, 10)).toBe(false);
});

it('should be close to when expectation is right on the threshold (lower)', () => {
  expect(isCloseTo(119.5, 129.5, 10)).toBe(true);
});

it('should be close to when expectation is right on the threshold (higher)', () => {
  expect(isCloseTo(139.5, 129.5, 10)).toBe(true);
});
