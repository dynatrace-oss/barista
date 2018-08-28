import { DtRateUnit, DtUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { Pipe, PipeTransform } from '@angular/core';
import { KILO_MULTIPLIER } from '../number-formatter';
import { formatBytes } from './bytes-formatter';

@Pipe({
  name: 'dtBytes',
})
export class DtBytes implements PipeTransform {

  transform(input: number, factor: number = KILO_MULTIPLIER, inputUnit: DtUnit = DtUnit.BYTES,
            inputRateUnit?: DtRateUnit | string, outputUnit?: DtUnit): DtFormattedValue {
    return formatBytes(input, factor, inputUnit, inputRateUnit, outputUnit);
  }
}
