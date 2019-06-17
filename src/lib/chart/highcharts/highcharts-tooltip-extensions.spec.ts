// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { prepareTooltipData } from './highcharts-tooltip-extensions';
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
  ];

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
    };

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
