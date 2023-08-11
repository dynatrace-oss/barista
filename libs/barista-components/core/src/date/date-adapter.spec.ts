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
import { createDateWithOverflow } from './date-adapter';

describe(`createDateWithOverflow`, () => {
  it.each`
    year    | month | date  | expectedYear | expectedMonth | expectedDate
    ${2020} | ${1}  | ${25} | ${2020}      | ${1}          | ${25}
    ${1900} | ${2}  | ${1}  | ${1900}      | ${2}          | ${1}
    ${1899} | ${6}  | ${15} | ${1899}      | ${6}          | ${15}
    ${1627} | ${10} | ${28} | ${1627}      | ${10}         | ${28}
    ${64}   | ${6}  | ${18} | ${64}        | ${6}          | ${18}
    ${19}   | ${0}  | ${10} | ${19}        | ${0}          | ${10}
  `(
    `should create Date instance for $date-$month-$year`,
    ({ year, month, date, expectedYear, expectedMonth, expectedDate }) => {
      // when
      const result = createDateWithOverflow(year, month, date);

      // then
      expect(result.getFullYear()).toBe(expectedYear);
      expect(result.getMonth()).toBe(expectedMonth);
      expect(result.getDate()).toBe(expectedDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    },
  );
});
