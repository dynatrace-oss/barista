import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { DtUnit, DtRateUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { formatCount } from '../count/count-util';
import { adjustNumber } from '../formatter-util';

@Injectable()
export class DtRateFormatter {

  private readonly TIME_CONVERSION_FACTOR = 60;
  private readonly notAcceptedUnits = new Set()
    .add(DtUnit.PERCENT);

  formatRate(source: DtFormattedValue | number, rateUnit: string): DtFormattedValue {

    return (source instanceof DtFormattedValue)
      ? this.addRateToFormattedValue(source, rateUnit)
      : this.addRateToNumber(source, rateUnit);
  }

  private addRateToNumber(value: number, rateUnit: string): DtFormattedValue {

    const formatted = formatCount(value);
    formatted.displayRateUnit = rateUnit;

    return formatted;
  }

  private addRateToFormattedValue(formattedValue: DtFormattedValue, rateUnit: string): DtFormattedValue {
    let formatted = formattedValue;

    if (!this.notAcceptedUnits.has(formatted.sourceUnit)) {
      const sourceRateUnit = formatted.sourceRateUnit;
      if (sourceRateUnit !== undefined && sourceRateUnit !== rateUnit) {
        formatted = this.recalculateValue(formatted, rateUnit);
      }

      formatted.displayRateUnit = rateUnit;
    }

    return formattedValue;
  }

  private recalculateValue(formatted: DtFormattedValue, rateUnit: string): DtFormattedValue {
    if (rateUnit === DtRateUnit.PER_SECOND) {
      return this.toPerSecond(formatted);
    } else if (rateUnit === DtRateUnit.PER_MINUTE) {
      return this.toPerMinute(formatted);
    }

    return formatted;
  }

  private toPerSecond(formatted: DtFormattedValue): DtFormattedValue {
    const value = coerceNumberProperty(formatted.transformedValue, NaN);

    if (formatted.sourceRateUnit === DtRateUnit.PER_MINUTE && !isNaN(value)) {
      formatted.transformedValue = coerceNumberProperty(value) / this.TIME_CONVERSION_FACTOR;
      formatted.displayValue = adjustNumber(formatted.transformedValue, formatted.useAbbreviation);
    }

    return formatted;
  }

  private toPerMinute(formatted: DtFormattedValue): DtFormattedValue {
    const value = coerceNumberProperty(formatted.transformedValue, NaN);
    if (formatted.sourceRateUnit === DtRateUnit.PER_SECOND && !isNaN(value)) {
      formatted.transformedValue = coerceNumberProperty(value) * this.TIME_CONVERSION_FACTOR;
      formatted.displayValue = adjustNumber(formatted.transformedValue, formatted.useAbbreviation);
    }

    return formatted;
  }

}
