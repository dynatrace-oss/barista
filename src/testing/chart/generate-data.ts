import { DataPoint } from 'highcharts';

import { randomize } from './randomize';

export function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number,
  generateGaps?: boolean,
): DataPoint[] {
  if (amount < 0) {
    throw new Error('Amount must not be negative');
  }
  if (min > max) {
    throw new Error(
      `Min value (${min}) must not be larger than max value (${max})`,
    );
  }

  const data = new Array<DataPoint>(amount);

  for (let i = 0; i < amount; i++) {
    data[i] = {
      x: timestampStart + timestampTick * i,
      y:
        // tslint:disable-next-line: no-magic-numbers
        generateGaps === true && Math.random() > 0.75
          ? undefined
          : randomize(min, max),
    };
  }
  return data;
}
