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

import { lerp, normalizeToRange, remapRange } from './math';

describe('lerp', () => {
  test.each`
    min     | max                 | t      | output
    ${0}    | ${1}                | ${0}   | ${0}
    ${0}    | ${1}                | ${1}   | ${1}
    ${0}    | ${1}                | ${0.5} | ${0.5}
    ${-100} | ${100}              | ${0}   | ${-100}
    ${-100} | ${100}              | ${1}   | ${100}
    ${-100} | ${100}              | ${0.5} | ${0}
    ${0}    | ${Number.MAX_VALUE} | ${0}   | ${0}
    ${0}    | ${Number.MAX_VALUE} | ${1}   | ${Number.MAX_VALUE}
  `(
    'results in $output with min=$min, max=$max and t=$t',
    ({ min, max, t, output }: any) => {
      expect(lerp(min, max, t)).toBe(output);
    },
  );
});

describe('normalizeToRange', () => {
  test.each`
    min     | max                 | value               | output
    ${0}    | ${1}                | ${0}                | ${0}
    ${0}    | ${1}                | ${1}                | ${1}
    ${0}    | ${1}                | ${0.5}              | ${0.5}
    ${-100} | ${100}              | ${-100}             | ${0}
    ${-100} | ${100}              | ${100}              | ${1}
    ${-100} | ${100}              | ${0}                | ${0.5}
    ${0}    | ${Number.MAX_VALUE} | ${0}                | ${0}
    ${0}    | ${Number.MAX_VALUE} | ${Number.MAX_VALUE} | ${1}
  `(
    'results in $output with min=$min, max=$max and value=$value',
    ({ min, max, value, output }: any) => {
      expect(normalizeToRange(min, max, value)).toBe(output);
    },
  );
});

describe('remapRange', () => {
  test.each`
    fromMin | fromMax | toMin  | toMax  | value  | output
    ${0}    | ${1}    | ${0}   | ${1}   | ${0}   | ${0}
    ${0}    | ${1}    | ${0}   | ${1}   | ${1}   | ${1}
    ${0}    | ${1}    | ${0}   | ${1}   | ${0.5} | ${0.5}
    ${-50}  | ${50}   | ${0}   | ${100} | ${-50} | ${0}
    ${-50}  | ${50}   | ${0}   | ${100} | ${50}  | ${100}
    ${-50}  | ${50}   | ${0}   | ${100} | ${0}   | ${50}
    ${0}    | ${100}  | ${-50} | ${50}  | ${0}   | ${-50}
    ${0}    | ${100}  | ${-50} | ${50}  | ${100} | ${50}
    ${0}    | ${100}  | ${-50} | ${50}  | ${50}  | ${0}
  `(
    'results in $output when remapping from [$fromMin, $fromMax] to [$toMin, $toMax] with value=$value',
    ({ fromMin, fromMax, toMin, toMax, value, output }: any) => {
      expect(remapRange(fromMin, fromMax, toMin, toMax, value)).toBe(output);
    },
  );
});
