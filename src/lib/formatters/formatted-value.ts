import { DtRateUnit, DtUnit } from './unit';

export interface SourceData {
  value: number;
  unit: DtUnit | string;
  rateUnit?: DtRateUnit | string;
  useAbbreviation: boolean;
}

export interface FormattedData {
  transformedValue?: number;
  displayValue?: string;
  displayUnit?: string;
  displayRateUnit?: string;
}

export class DtFormattedValue {

  private readonly NO_DATA = '-';

  constructor(private _sourceData: SourceData, private _formattedData: FormattedData) {}

  get sourceData(): SourceData {
    return this._sourceData;
  }

  get displayData(): FormattedData {
    return this._formattedData;
  }

  toString(): string {
    if (this._formattedData.displayValue === undefined) {
      return this.NO_DATA;
    }

    let text = `${this._formattedData.displayValue}`;
    if (this._formattedData.displayUnit !== undefined) {
      text = `${text} ${this._formattedData.displayUnit}`;
    }
    if (this._formattedData.displayRateUnit !== undefined) {
      text = `${text}/${this._formattedData.displayRateUnit}`;
    }

    return text;
  }
}
