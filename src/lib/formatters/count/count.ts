import { Pipe, PipeTransform } from '@angular/core';
import { DtUnit } from '../unit';
import { FormattedValue } from '../formatted-value';
import { _isNumberValue, coerceNumberProperty } from '@angular/cdk/coercion';
import { FormatterUtil, Multiples } from '../formatter-util';

@Pipe({
  name: 'dtCount',
})
export class DtCount implements PipeTransform {

  private readonly THOUSAND = 'k';
  private readonly MILLION = 'mil';
  private readonly BILLION = 'bil';
  private readonly multiples: Multiples;

  constructor(private readonly _formatterUtil: FormatterUtil) {
    this.multiples = this._formatterUtil.standardMultiples;
  }

  transform(input: number, inputUnit: string = DtUnit.COUNT, inputRateUnit?: string): FormattedValue {

    const formattedValue = new FormattedValue(input, inputUnit, inputRateUnit);
    if (_isNumberValue(input)) {
      const value = (coerceNumberProperty(input));

      formattedValue.displayValue = value >= this.multiples.lvl1
        ? this.abbreviate(value)
        : this._formatterUtil.adjustPrecision(value);

      formattedValue.displayUnit = inputUnit !== DtUnit.COUNT
        ? inputUnit
        : undefined;
    }

    return formattedValue;
  }

  private abbreviate(sourceValue: number): string {

    let value = sourceValue;
    let formattedValue: string;

    if (value >= this.multiples.lvl3) {
      value =  value / this.multiples.lvl3;
      formattedValue =  this._formatterUtil.adjustPrecision(value);

      return `${formattedValue}${this.BILLION}`;
    }

    if (value >= this.multiples.lvl2) {
      value =  value / this.multiples.lvl2;
      formattedValue =  this._formatterUtil.adjustPrecision(value);

      return `${formattedValue}${this.MILLION}`;
    }

    value =  value / this.multiples.lvl1;
    formattedValue =  this._formatterUtil.adjustPrecision(value);

    return `${formattedValue}${this.THOUSAND}`;
  }
}
