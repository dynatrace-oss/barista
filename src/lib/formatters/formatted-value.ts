import { DtRateUnit, DtUnit } from './unit';

export interface SourceData {
  readonly value: number;
  readonly unit: DtUnit | string;
  readonly rateUnit?: DtRateUnit | string;
  readonly useAbbreviation: boolean;
}

export interface FormattedData {
  readonly transformedValue?: number;
  readonly displayValue?: string;
  readonly displayUnit?: string;
  readonly displayRateUnit?: string;
}

const NO_DATA = '-';

export class DtFormattedValue {

  constructor(private _sourceData: SourceData, private _formattedData: FormattedData) {}

  get sourceData(): SourceData {
    return this._sourceData;
  }

  get displayData(): FormattedData {
    return this._formattedData;
  }

  toString(): string {
    if (this._formattedData.displayValue === undefined) {
      return NO_DATA;
    }

    let text = this._formattedData.displayValue;
    if (this._formattedData.displayUnit !== undefined) {
      text = `${text} ${this._formattedData.displayUnit}`;
    }
    if (this._formattedData.displayRateUnit !== undefined) {
      text = `${text}/${this._formattedData.displayRateUnit}`;
    }

    return text;
  }
}
