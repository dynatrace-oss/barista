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

import { prepareTooltipData } from './highcharts-tooltip-extensions';
import { Point } from 'highcharts';
/**
 * These tests have dummy input that is passed in by highcharts
 * Note: these tests will still pass if highcharts internally change the objects
 * but they ensure that any we can handle single or array input
 */
describe('highcharts-tooltip-extensions', () => {
  const dummyConfig = {
    x: 0,
    y: 0,
    total: 1,
    color: '#ffffff',
    colorIndex: 0,
    category: 0,
    percentage: 0,
    point: { x: 0, y: 0 },
    series: {},
    key: 0,
  };
  const dummyConfig1 = {
    x: 10,
    y: 10,
    total: 1,
    color: '#ffffff',
    colorIndex: 0,
    category: 0,
    percentage: 0,
    point: { x: 0, y: 0 },
    series: {},
    key: 0,
  };

  const dummyArr = [
    { category: 0, y: 0, getLabelConfig: () => dummyConfig },
    { category: 1, y: 1, getLabelConfig: () => dummyConfig1 },
  ] as unknown as Point[];

  it('should return the correct data for multiple metrics', () => {
    const tooltipData = prepareTooltipData(dummyArr);
    expect(tooltipData.x).toBe(0);
    expect(tooltipData.y).toBe(0);
    expect(tooltipData.point).toBeUndefined();
    expect(tooltipData.points).toEqual([dummyConfig, dummyConfig1]);
  });

  it('should return the correct data for single metrics or pie charts', () => {
    const dummyConfigSingle = {
      x: 0,
      y: 0,
      getLabelConfig: () => ({
        x: 0,
        y: 0,
        total: 1,
        color: '#ffffff',
        colorIndex: 0,
        percentage: 0,
        point: { x: 0, y: 0 },
        series: {},
        key: 0,
      }),
    } as unknown as Point;

    const tooltipData = prepareTooltipData(dummyConfigSingle);
    expect(tooltipData.x).toBe(0);
    expect(tooltipData.y).toBe(0);
    expect(tooltipData.points).toBeUndefined();
    expect(tooltipData.point).toEqual({
      x: 0,
      y: 0,
      total: 1,
      color: '#ffffff',
      colorIndex: 0,
      percentage: 0,
      point: { x: 0, y: 0 },
      series: {},
      key: 0,
    });
  });
});
