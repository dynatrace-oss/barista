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

/* eslint-disable no-magic-numbers */
import {
  getSum,
  getEndAngle,
  generatePieArcData,
  getPercentages,
  getRoundedPercentages,
} from './radial-chart-utils';

const FULL_CIRCLE = Math.PI * 2;

describe('DtRadialChart util functions', () => {
  describe('getSum', () => {
    it('should return the sum of all positive values', () => {
      const values = [1, 2, 3, 4, 5];
      const sum = getSum(values);
      expect(sum).toBe(15);
    });

    it('should return the sum of all values, negative ones included', () => {
      const values = [-1, 0, 1, 2, 3];
      const sum = getSum(values);
      expect(sum).toBe(5);
    });

    it('should return the sum of all negative values', () => {
      const values = [-1, -2, -3];
      const sum = getSum(values);
      expect(sum).toBe(-6);
    });
  });

  describe('getEndAngle', () => {
    it('should return the correct angle value for 75%', () => {
      const maxValue = 100;
      const sumValue = 75;
      const result = getEndAngle(maxValue, sumValue);
      expect(result).toBeCloseTo(FULL_CIRCLE * 0.75, 5);
    });

    it('should return 2*PI when the maximum value is lower than the sum', () => {
      const maxValue = 50;
      const sumValue = 75;
      const result = getEndAngle(maxValue, sumValue);
      expect(result).toBeCloseTo(FULL_CIRCLE, 5);
    });

    it('should return PI for 50%', () => {
      const maxValue = 100;
      const sumValue = 50;
      const result = getEndAngle(maxValue, sumValue);
      expect(result).toBeCloseTo(Math.PI, 5);
    });
  });

  describe('generatePieArcData', () => {
    it('should return arc data that adds up to 100% when no maximum value is given', () => {
      const values = [20, 11, 7, 38];
      const arcData = generatePieArcData(values, null);
      expect(arcData).toHaveLength(4);
      expect(arcData[0].startAngle).toBe(0);
      expect(arcData[2].endAngle).toBeCloseTo(Math.PI, 5);
      expect(arcData[3].startAngle).toBeCloseTo(Math.PI, 5);
      expect(arcData[3].endAngle).toBeCloseTo(Math.PI * 2, 5);
    });

    it('should return arc data that adds up to 50% when a maximum value is given', () => {
      const values = [20, 11, 7];
      const maxValue = 76;
      const arcData = generatePieArcData(values, maxValue);
      expect(arcData).toHaveLength(3);
      expect(arcData[0].startAngle).toBe(0);
      expect(arcData[2].endAngle).toBeCloseTo(Math.PI, 5);
    });

    it('should not change the sort order of the given values', () => {
      const values = [20, 11, 35];
      const arcData = generatePieArcData(values, null);
      expect(arcData).toHaveLength(3);
      expect(arcData[0].value).toBe(20);
      expect(arcData[1].value).toBe(11);
      expect(arcData[2].value).toBe(35);
    });
  });

  describe('getPercentages', () => {
    it('should return percentages with precision 2 when total is higher than the sum of values', () => {
      const values = [10, 21, 8];
      const total = 75;
      const percentages = getPercentages(values, total, 2);
      expect(percentages).toEqual([13.33, 28, 10.67]);
    });

    it('should return percentages with precision 2 when total is equal to sum of values', () => {
      const values = [10, 21, 8];
      const total = 39;
      const percentages = getPercentages(values, total, 2);
      expect(percentages).toEqual([25.64, 53.85, 20.51]);
    });
  });

  describe('getRoundedPercentages', () => {
    it('should return rounded percentages with precision 0', () => {
      const values = [10, 21, 8];
      const percentages = getRoundedPercentages(values, 0);
      expect(percentages).toEqual([26, 54, 20]);
    });
  });
});

/* eslint-enable no-magic-numbers */
