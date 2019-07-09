// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { compareValues, compareStrings, compareNumbers } from './compare-util';

describe('CompareUtil', () => {
  describe('compareValues', () => {
    it('should sort number values ascending', () => {
      const numbers = [8, 27, 5000, 17, 123, 591, 182];
      const sorted = numbers.sort((a, b) => compareValues(a, b, 'asc'));
      expect(sorted).toEqual([8, 17, 27, 123, 182, 591, 5000]);
    });

    it('should sort number values descending', () => {
      const numbers = [8, 27, 5000, 17, 123, 591, 182];
      const sorted = numbers.sort((a, b) => compareValues(a, b, 'desc'));
      expect(sorted).toEqual([5000, 591, 182, 123, 27, 17, 8]);
    });

    it('should sort numbers and null values ascending', () => {
      const numbers = [8, 27, 5000, null, 17, 123, null, 591, 182];
      const sorted = numbers.sort((a, b) => compareValues(a, b, 'asc'));
      expect(sorted).toEqual([8, 17, 27, 123, 182, 591, 5000, null, null]);
    });

    it('should sort number and null values descending', () => {
      const numbers = [8, 27, 5000, null, 17, 123, null, 591, 182];
      const sorted = numbers.sort((a, b) => compareValues(a, b, 'desc'));
      expect(sorted).toEqual([null, null, 5000, 591, 182, 123, 27, 17, 8]);
    });

    it('should sort string values ascending', () => {
      const strings = ['host', 'memory', 'metric', 'center'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(sorted).toEqual(['center', 'host', 'memory', 'metric']);
    });

    it('should sort string values descending', () => {
      const strings = ['host', 'memory', 'metric', 'center'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(sorted).toEqual(['metric', 'memory', 'host', 'center']);
    });

    it('should sort strings and null values ascending', () => {
      const strings = ['host', 'memory', 'metric', null, 'center'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(sorted).toEqual(['center', 'host', 'memory', 'metric', null]);
    });

    it('should sort string and null values descending', () => {
      const strings = ['host', 'memory', 'metric', null, 'center'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(sorted).toEqual([null, 'metric', 'memory', 'host', 'center']);
    });

    it('should sort strings correctly even with different cases ascending', () => {
      const strings = ['Host', 'memory', 'Metric', 'center'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(sorted).toEqual(['center', 'Host', 'memory', 'Metric']);
    });

    it('should sort strings correctly even with different cases descending', () => {
      const strings = ['Host', 'memory', 'Metric', 'center'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(sorted).toEqual(['Metric', 'memory', 'Host', 'center']);
    });

    it('should sort strings correctly even with custom characters ascending', () => {
      const strings = ['Entity', 'éntity', 'èlaborate', 'çonstant'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'asc'));
      expect(sorted).toEqual(['çonstant', 'èlaborate', 'Entity', 'éntity']);
    });

    it('should sort strings correctly even with custom characters descending', () => {
      const strings = ['Entity', 'éntity', 'èlaborate', 'çonstant'];
      const sorted = strings.sort((a, b) => compareValues(a, b, 'desc'));
      expect(sorted).toEqual(['éntity', 'Entity', 'èlaborate', 'çonstant']);
    });
  });

  describe('compareNumbers', () => {
    it('should sort number values by descending default', () => {
      const numbers = [8, 27, 5000, 17, 123, 591, 182];
      const sorted = numbers.sort((a, b) => compareNumbers(a, b));
      expect(sorted).toEqual([5000, 591, 182, 123, 27, 17, 8]);
    });

    it('should sort number and null values by descending default', () => {
      const numbers = [8, 27, 5000, null, 17, 123, null, 591, 182];
      const sorted = numbers.sort((a, b) => compareNumbers(a, b));
      expect(sorted).toEqual([null, null, 5000, 591, 182, 123, 27, 17, 8]);
    });
  });

  describe('compareStrings', () => {
    it('should sort string values ascending default', () => {
      const strings = ['host', 'memory', 'metric', 'center'];
      const sorted = strings.sort((a, b) => compareStrings(a, b));
      expect(sorted).toEqual(['center', 'host', 'memory', 'metric']);
    });

    it('should sort strings and null values ascending default', () => {
      const strings = ['host', 'memory', 'metric', null, 'center'];
      const sorted = strings.sort((a, b) => compareStrings(a, b));
      expect(sorted).toEqual(['center', 'host', 'memory', 'metric', null]);
    });
  });
});
