import { DataPoint } from 'highcharts';

import { isNumber } from '@dynatrace/angular-components/core';

import { randomize } from './randomize';

export function generateAreaRangeData(
  amountOrLineSeries: number | DataPoint[],
  min: number,
  max: number,
  timestampStart?: number,
  timestampTick?: number,
): DataPoint[] {
  if (min > max) {
    throw new Error(
      `Min value (${min}) must not be larger than max value (${max})`,
    );
  }

  let data: DataPoint[];

  if (isNumber(amountOrLineSeries)) {
    if (amountOrLineSeries < 0) {
      throw new Error('Amount must not be negative');
    }
    if (timestampStart === undefined || timestampTick === undefined) {
      throw new Error(
        'Parameters timestampStart and timestampTick are required',
      );
    }

    const amount = amountOrLineSeries as number;

    data = new Array<DataPoint>(amount);

    for (let i = 0; i < amount; i++) {
      data[i] = {
        x: timestampStart + timestampTick * i,
        low: randomize(min, max),
        high: randomize(min, max),
      };
    }
  } else {
    const lineSeries = amountOrLineSeries as DataPoint[];

    data = new Array<DataPoint>(lineSeries.length);

    for (let i = 0; i < lineSeries.length; i++) {
      const series = lineSeries[i];
      const x = series.x;
      const y = series.y;

      if (x === undefined) {
        throw new Error('Invalid data point: no x value is defined');
      }

      data[i] = {
        x,
        low: y !== undefined ? y - randomize(min, max) : undefined,
        high: y !== undefined ? y + randomize(min, max) : undefined,
      };
    }
  }

  return data;
}
