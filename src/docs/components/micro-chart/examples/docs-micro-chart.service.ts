// tslint:disable:no-magic-numbers

import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DtChartSeries } from '@dynatrace/angular-components';

export function randomize(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateData(
    amount: number,
    min: number,
    max: number,
    timestampStart: number,
    timestampTick: number
  ): Array<[number, number]> {
    return Array.from(Array(amount).keys())
      .map((v) => [
        timestampStart + (timestampTick * v),
        randomize(min, max),
      ] as [number, number]);
}

@Injectable({providedIn: 'root'})
export class MicroChartService {
  getSingleStreamedChartdata(): Observable<DtChartSeries> {
    return timer(1000, 5000)
      .pipe(map(() => ({
          name: 'Requests',
          type: 'column',
          data: generateData(40, 0, 200, 1370304000000, 900000),
        })));
  }
}

// tslint:enable:no-magic-numbers
