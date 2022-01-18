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

import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
  SHIFT,
} from '@angular/cdk/keycodes';
import {
  getKeyCodeValue,
  getSliderPositionBasedOnValue,
  getSliderValueForCoordinate,
  roundToSnap,
} from './slider-utils';

describe('unit test functions', () => {
  describe('getSliderPositionBasedOnValue', () => {
    it('should return with the right values', () => {
      expect(getSliderPositionBasedOnValue({ value: 0, min: 0, max: 1 })).toBe(
        0,
      );
      expect(getSliderPositionBasedOnValue({ value: 1, min: 0, max: 1 })).toBe(
        1,
      );
      expect(
        getSliderPositionBasedOnValue({ value: 0.5, min: 0, max: 1 }),
      ).toBe(0.5);
      expect(
        getSliderPositionBasedOnValue({ value: 20, min: 0, max: 80 }),
      ).toBe(0.25);
      expect(
        getSliderPositionBasedOnValue({ value: 20, min: 20, max: 80 }),
      ).toBe(0);
      expect(
        getSliderPositionBasedOnValue({ value: 100, min: 0, max: 80 }),
      ).toBe(1.25);
      expect(
        getSliderPositionBasedOnValue({ value: 0, min: 20, max: 80 }),
      ).toBe(-0.3333333333333333);
    });
  });
  describe('roundToSnap', () => {
    it('should return with the right values', () => {
      expect(roundToSnap(0, 1, 0, 100)).toBe(0);
      expect(roundToSnap(-5, 1, 0, 100)).toBe(0);
      expect(roundToSnap(100, 1, 0, 100)).toBe(100);
      expect(roundToSnap(100, 1, 0, 80)).toBe(80);
      expect(roundToSnap(40, 1, 50, 80)).toBe(50);
      expect(roundToSnap(52, 5, 0, 80)).toBe(50);
      expect(roundToSnap(53, 5, 0, 80)).toBe(55);
      expect(roundToSnap(52.5, 5, 0, 80)).toBe(55);
      expect(roundToSnap(52.5, 0.5, 0, 80)).toBe(52.5);
      expect(roundToSnap(52.7, 0.5, 0, 80)).toBe(52.5);
      expect(roundToSnap(52.8, 0.5, 0, 80)).toBe(53);
      expect(roundToSnap(52.75, 0.5, 0, 80)).toBe(53);
    });
  });
  describe('getKeyCodeValue', () => {
    it('should return with the right values', () => {
      expect(getKeyCodeValue(100, 1, RIGHT_ARROW)).toBe(1);
      expect(getKeyCodeValue(100, 2, RIGHT_ARROW)).toBe(2);
      expect(getKeyCodeValue(100, 0.1, RIGHT_ARROW)).toBe(0.1);
      expect(getKeyCodeValue(100, 1, UP_ARROW)).toBe(1);
      expect(getKeyCodeValue(100, 2, UP_ARROW)).toBe(2);
      expect(getKeyCodeValue(100, 0.1, UP_ARROW)).toBe(0.1);

      expect(getKeyCodeValue(100, 1, LEFT_ARROW)).toBe(-1);
      expect(getKeyCodeValue(100, 2, LEFT_ARROW)).toBe(-2);
      expect(getKeyCodeValue(100, 0.1, LEFT_ARROW)).toBe(-0.1);
      expect(getKeyCodeValue(100, 1, DOWN_ARROW)).toBe(-1);
      expect(getKeyCodeValue(100, 2, DOWN_ARROW)).toBe(-2);
      expect(getKeyCodeValue(100, 0.1, DOWN_ARROW)).toBe(-0.1);

      expect(getKeyCodeValue(100, 1, HOME)).toBe(-100);
      expect(getKeyCodeValue(1, 1, HOME)).toBe(-1);
      expect(getKeyCodeValue(5.67, 1, HOME)).toBe(-5.67);
      expect(getKeyCodeValue(5.67, 1, END)).toBe(5.67);
      expect(getKeyCodeValue(1, 1, END)).toBe(1);
      expect(getKeyCodeValue(100, 1, END)).toBe(100);

      expect(getKeyCodeValue(100, 1, PAGE_UP)).toBe(10);
      expect(getKeyCodeValue(10, 5, PAGE_UP)).toBe(50);
      expect(getKeyCodeValue(5.67, 0.2, PAGE_UP)).toBe(2);
      expect(getKeyCodeValue(5.67, 1, PAGE_DOWN)).toBe(-10);
      expect(getKeyCodeValue(1, 5, PAGE_DOWN)).toBe(-50);
      expect(getKeyCodeValue(100, 0.2, PAGE_DOWN)).toBe(-2);

      expect(getKeyCodeValue(100, 0.2, SHIFT)).toBe(0); //default is 0
    });
  });
  describe('getSliderValueForCoordinate', () => {
    it('should return with the right values', () => {
      const additionalConfig = {
        width: 100,
        step: 0.5,
        roundShift: 1,
        offset: 5,
        min: 0,
        max: 10,
      };
      expect(
        getSliderValueForCoordinate({
          coordinate: 5,
          ...additionalConfig,
        }),
      ).toBe(0);
      expect(
        getSliderValueForCoordinate({
          coordinate: 105,
          ...additionalConfig,
        }),
      ).toBe(10);
      expect(
        getSliderValueForCoordinate({
          coordinate: 48,
          ...additionalConfig,
        }),
      ).toBe(4.5);
      expect(
        getSliderValueForCoordinate({
          coordinate: 55,
          ...additionalConfig,
        }),
      ).toBe(5);
      expect(
        getSliderValueForCoordinate({
          coordinate: 200,
          ...additionalConfig,
        }),
      ).toBe(10);
    });
  });
});
