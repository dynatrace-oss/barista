import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';

export interface Multiples {
  lvl1: number;
  lvl2: number;
  lvl3: number;
  lvl4: number;
  lvl5: number;
}

@Injectable()
export class FormatterUtil {

  // tslint:disable:no-magic-numbers
  readonly BINARY_MULTIPLIER = 1024;
  readonly STANDARD_MULTIPLIER = 1000;

  readonly standardMultiples: Multiples = {
    lvl1: this.STANDARD_MULTIPLIER,
    lvl2: Math.pow(this.STANDARD_MULTIPLIER, 2),
    lvl3: Math.pow(this.STANDARD_MULTIPLIER, 3),
    lvl4: Math.pow(this.STANDARD_MULTIPLIER, 4),
    lvl5: Math.pow(this.STANDARD_MULTIPLIER, 5),
  };

  readonly binaryMultiples: Multiples = {
    lvl1: this.BINARY_MULTIPLIER,
    lvl2: Math.pow(this.BINARY_MULTIPLIER, 2),
    lvl3: Math.pow(this.BINARY_MULTIPLIER, 3),
    lvl4: Math.pow(this.BINARY_MULTIPLIER, 4),
    lvl5: Math.pow(this.BINARY_MULTIPLIER, 5),
  };
  // tslint:enable:no-magic-numbers

  adjustPrecision(value: number): string {
    // tslint:disable:no-magic-numbers
    let digits = 0;
    if (value < 1) {
      digits = 3;
    } else if (value < 10) {
      digits = 2;
    } else if (value < 100) {
      digits = 1;
    }
    // tslint:enable:no-magic-numbers

    return formatNumber(value, 'en-US', `0.0-${digits}`);
  }

}
