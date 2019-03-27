import { unifySeriesData } from './chart';

// tslint:disable no-magic-numbers
describe('DtMicroChart - Core', () => {
  let data;
  beforeEach(() => {
    data = [0, 15, 187, 182];
  });

  it('should unify the input data into a DtMicroChartDataPoint', () => {
    const unifiedData = unifySeriesData(data);
    expect(unifiedData[0]).toEqual({ x: 0, y: 0 });
    expect(unifiedData[1]).toEqual({ x: 1, y: 15 });
    expect(unifiedData[2]).toEqual({ x: 2, y: 187 });
    expect(unifiedData[3]).toEqual({ x: 3, y: 182 });
  });

  it('should unify input data when it contains null values', () => {
    data[2] = null;
    const unifiedData = unifySeriesData(data);
    expect(unifiedData[0]).toEqual({ x: 0, y: 0 });
    expect(unifiedData[1]).toEqual({ x: 1, y: 15 });
    expect(unifiedData[2]).toEqual({ x: 2, y: null });
    expect(unifiedData[3]).toEqual({ x: 3, y: 182 });
  });

  it('should not modifiy the array if input data is already number[][]', () => {
    data = [[0, 0], [10, 15], [27, 187], [162, 182]];
    const unifiedData = unifySeriesData(data);
    expect(unifiedData[0]).toEqual({ x: 0, y: 0 });
    expect(unifiedData[1]).toEqual({ x: 10, y: 15 });
    expect(unifiedData[2]).toEqual({ x: 27, y: 187 });
    expect(unifiedData[3]).toEqual({ x: 162, y: 182 });
  });
});
