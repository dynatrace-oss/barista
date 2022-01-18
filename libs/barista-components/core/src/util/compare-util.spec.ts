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

import { compareNumbers, compareStrings, compareValues } from './compare-util';

describe('CompareUtil', () => {
  describe('compareValues', () => {
    it('should sort number values ascending', () => {
      const numbers = [8, 27, 5000, 17, 123, 591, 182];
      numbers.sort((a, b) => compareValues(a, b, 'asc'));
      expect(numbers).toEqual([8, 17, 27, 123, 182, 591, 5000]);
    });

    it('should sort number values descending', () => {
      const numbers = [8, 27, 5000, 17, 123, 591, 182];
      numbers.sort((a, b) => compareValues(a, b, 'desc'));
      expect(numbers).toEqual([5000, 591, 182, 123, 27, 17, 8]);
    });

    it('should sort numbers and null values ascending', () => {
      const numbers = [8, 27, 5000, null, 17, 123, null, 591, 182];
      numbers.sort((a, b) => compareValues(a, b, 'asc'));
      expect(numbers).toEqual([null, null, 8, 17, 27, 123, 182, 591, 5000]);
    });

    it('should sort number and null values descending', () => {
      const numbers = [8, 27, 5000, null, 17, 123, null, 591, 182];
      numbers.sort((a, b) => compareValues(a, b, 'desc'));
      expect(numbers).toEqual([5000, 591, 182, 123, 27, 17, 8, null, null]);
    });

    it('should sort string values ascending', () => {
      const strings = ['host', 'memory', 'metric', 'center'];
      strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(strings).toEqual(['center', 'host', 'memory', 'metric']);
    });

    it('should sort string values descending', () => {
      const strings = ['host', 'memory', 'metric', 'center'];
      strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(strings).toEqual(['metric', 'memory', 'host', 'center']);
    });

    it('should sort strings and null values ascending', () => {
      const strings = ['host', 'memory', 'metric', null, 'center'];
      strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(strings).toEqual(['center', 'host', 'memory', 'metric', null]);
    });

    it('should sort string and null values descending', () => {
      const strings = ['host', 'memory', 'metric', null, 'center'];
      strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(strings).toEqual([null, 'metric', 'memory', 'host', 'center']);
    });

    it('should sort strings correctly even with different cases ascending', () => {
      const strings = ['Host', 'memory', 'Metric', 'center'];
      strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(strings).toEqual(['center', 'Host', 'memory', 'Metric']);
    });

    it('should sort strings correctly even with different cases descending', () => {
      const strings = ['Host', 'memory', 'Metric', 'center'];
      strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(strings).toEqual(['Metric', 'memory', 'Host', 'center']);
    });

    it('should sort strings correctly even with custom characters ascending', () => {
      const strings = ['Entity', 'éntity', 'èlaborate', 'çonstant'];
      strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(strings).toEqual(['çonstant', 'èlaborate', 'Entity', 'éntity']);
    });

    it('should sort strings correctly even with custom characters descending', () => {
      const strings = ['Entity', 'éntity', 'èlaborate', 'çonstant'];
      strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(strings).toEqual(['éntity', 'Entity', 'èlaborate', 'çonstant']);
    });
  });

  describe('compareNumbers', () => {
    it('should sort number values by descending default', () => {
      const numbers = [8, 27, 5000, 17, 123, 591, 182];
      numbers.sort((a, b) => compareNumbers(a, b));
      expect(numbers).toEqual([5000, 591, 182, 123, 27, 17, 8]);
    });

    it('should sort number and null values by descending default', () => {
      const numbers = [8, 27, 5000, null, 17, 123, null, 591, 182];
      numbers.sort((a, b) => compareNumbers(a, b));
      expect(numbers).toEqual([5000, 591, 182, 123, 27, 17, 8, null, null]);
    });
  });

  describe('compareStrings', () => {
    it('should sort string values ascending default', () => {
      const strings = ['host', 'memory', 'metric', 'center'];
      strings.sort((a, b) => compareStrings(a, b));
      expect(strings).toEqual(['center', 'host', 'memory', 'metric']);
    });

    it('should sort strings and null values ascending default', () => {
      const strings = ['host', 'memory', 'metric', null, 'center'];
      strings.sort((a, b) => compareStrings(a, b));
      expect(strings).toEqual(['center', 'host', 'memory', 'metric', null]);
    });
  });
});
