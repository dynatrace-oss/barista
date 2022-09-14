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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';

import { createKeyboardEvent } from '@dynatrace/testing/browser';
import { DtChartSeries } from './chart.interface';
import { getKeyboardNavigationOffset, createChartAriaLabel } from './utils';

describe('DtChart utils', () => {
  describe('getKeyboardNavigationOffset', () => {
    it('should return 1 if the right arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', RIGHT_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(1);
    });

    it('should return 1 if the up arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', UP_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(1);
    });

    it('should return -1 if the left arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(-1);
    });

    it('should return -1 if the down arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(-1);
    });

    it('should return -10 if the page down key was pressed', () => {
      const event = createKeyboardEvent('keydown', PAGE_DOWN);

      expect(getKeyboardNavigationOffset(event)).toBe(-10);
    });

    it('should return -10 if the page up key was pressed', () => {
      const event = createKeyboardEvent('keydown', PAGE_UP);

      expect(getKeyboardNavigationOffset(event)).toBe(10);
    });
  });

  describe('createChartAriaLabel', () => {
    it('should return message for undefined series', () => {
      // given
      const series = undefined;

      // when
      const result = createChartAriaLabel(series);

      // then
      expect(result).toEqual('Showing empty chart.');
    });

    it('should return message for series array of length 0', () => {
      // given
      const series = [];

      // when
      const result = createChartAriaLabel(series);

      // then
      expect(result).toEqual('Showing empty chart.');
    });

    it('should return message for series array of length 1', () => {
      // given
      const series: DtChartSeries[] = [
        {
          name: 'CPU usage',
          type: 'line',
          data: [],
          color: '#92d9f8',
        },
      ];

      // when
      const result = createChartAriaLabel(series);

      // then
      expect(result).toEqual(
        "Showing 1 series. Series 'CPU usage' of type 'line'.",
      );
    });

    it('should return message for series array of length 2', () => {
      // given
      const series: DtChartSeries[] = [
        {
          name: 'CPU usage',
          type: 'line',
          data: [],
          color: '#92d9f8',
        },
        {
          name: 'Number of process group instances',
          type: 'column',
          yAxis: 1,
          data: [],
          color: '#006bba',
        },
      ];

      // when
      const result = createChartAriaLabel(series);

      // then
      expect(result).toEqual(
        "Showing 2 series. Series 'CPU usage' of type 'line', series 'Number of process group instances' of type 'column'.",
      );
    });

    it('should return message for series array of length 3', () => {
      // given
      const series: DtChartSeries[] = [
        {
          name: 'CPU usage',
          type: 'line',
          data: [],
          color: '#92d9f8',
        },
        {
          name: 'Number of process group instances',
          type: 'column',
          yAxis: 1,
          data: [],
          color: '#006bba',
        },
        {
          name: 'Another series',
          type: 'bar',
          yAxis: 1,
          data: [],
          color: '#006bbc',
        },
      ];

      // when
      const result = createChartAriaLabel(series);

      // then
      expect(result).toEqual(
        "Showing 3 series. Series 'CPU usage' of type 'line', series 'Number of process group instances' of type 'column', series 'Another series' of type 'bar'.",
      );
    });

    it('should return message for series with no name', () => {
      // given
      const series: DtChartSeries[] = [
        {
          type: 'line',
          data: [],
          color: '#92d9f8',
        },
      ];

      // when
      const result = createChartAriaLabel(series);

      // then
      expect(result).toEqual("Showing 1 series. Series of type 'line'.");
    });
  });
});
