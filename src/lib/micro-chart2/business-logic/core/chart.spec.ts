import { unifySeriesData } from './chart';

// tslint:disable no-magic-numbers
describe('DtMicroChart - Core', () => {
  let data;
  beforeEach(() => {
    data = [0, 15, 187, 182];
  });

  it('should unify the input data into a number[][]', () => {
    const unifiedData = unifySeriesData(data);
    expect(unifiedData[0]).toEqual([0, 0]);
    expect(unifiedData[1]).toEqual([1, 15]);
    expect(unifiedData[2]).toEqual([2, 187]);
    expect(unifiedData[3]).toEqual([3, 182]);
  });

  it('should unify input data when it contains null values', () => {
    data[2] = null;
    const unifiedData = unifySeriesData(data);
    expect(unifiedData[0]).toEqual([0, 0]);
    expect(unifiedData[1]).toEqual([1, 15]);
    expect(unifiedData[2]).toEqual([2, null]);
    expect(unifiedData[3]).toEqual([3, 182]);
  });

  it('should not modifiy the array if input data is already number[][]', () => {
    data = [[0, 0], [10, 15], [27, 187], [162, 182]];
    const unifiedData = unifySeriesData(data);
    expect(unifiedData[0]).toEqual([0, 0]);
    expect(unifiedData[1]).toEqual([10, 15]);
    expect(unifiedData[2]).toEqual([27, 187]);
    expect(unifiedData[3]).toEqual([162, 182]);
  });
});
