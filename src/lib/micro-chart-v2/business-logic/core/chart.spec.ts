import { unifySeriesData } from './chart';

fdescribe('DtMicroChart - Core', () => {
  let simpleLineSeries;
  beforeEach(() => {
    simpleLineSeries = {
      data: [0, 15, 187, 182],
      type: 'line',
    };
  });

  it('should unify the input data into a number[][]', () => {
    const newSeries = unifySeriesData(simpleLineSeries);
    expect(newSeries._transformedData[0]).toEqual([0, 0]);
    expect(newSeries._transformedData[1]).toEqual([1, 15]);
    expect(newSeries._transformedData[2]).toEqual([2, 187]);
    expect(newSeries._transformedData[3]).toEqual([3, 182]);
  });

  it('should unify input data when it contains null values', () => {
    simpleLineSeries.data[2] = null;
    const newSeries = unifySeriesData(simpleLineSeries);
    expect(newSeries._transformedData[0]).toEqual([0, 0]);
    expect(newSeries._transformedData[1]).toEqual([1, 15]);
    expect(newSeries._transformedData[2]).toEqual([2, null]);
    expect(newSeries._transformedData[3]).toEqual([3, 182]);
  });

  it('should not modifiy the array if input data is already number[][]', () => {
    simpleLineSeries.data = [[0, 0], [10, 15], [27, 187], [162, 182]];
    const newSeries = unifySeriesData(simpleLineSeries);
    expect(newSeries._transformedData[0]).toEqual([0, 0]);
    expect(newSeries._transformedData[1]).toEqual([10, 15]);
    expect(newSeries._transformedData[2]).toEqual([27, 187]);
    expect(newSeries._transformedData[3]).toEqual([162, 182]);
  });
});
