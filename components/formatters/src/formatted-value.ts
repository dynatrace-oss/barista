/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DtUnit } from './unit';

export interface SourceData {
  readonly input: number;
  readonly unit: DtUnit | string;
}

export interface FormattedData {
  readonly transformedValue?: number;
  readonly displayValue?: string;
  readonly displayUnit?: string;
  readonly displayRateUnit?: string;
}

export const NO_DATA = '-';

/**
 * Class used in formatting functions and pipes
 */
export class DtFormattedValue {
  constructor(
    private _sourceData: SourceData,
    private _formattedData: FormattedData,
  ) {}

  /** Source data containing value, unit, rate unit */
  get sourceData(): SourceData {
    return this._sourceData;
  }

  /** Display data containing the transformed values, units and rate units */
  get displayData(): FormattedData {
    return this._formattedData;
  }

  /** @return the string as a combination of the display data */
  toString(): string {
    if (this._formattedData.displayValue === undefined) {
      return NO_DATA;
    }

    let text = this._formattedData.displayValue;
    if (this._formattedData.displayUnit !== undefined) {
      text = `${text} ${this._formattedData.displayUnit}`;
    }
    if (this._formattedData.displayRateUnit !== undefined) {
      text =
        this._formattedData.displayUnit !== undefined
          ? `${text}/${this._formattedData.displayRateUnit}`
          : `${text} /${this._formattedData.displayRateUnit}`;
    }

    return text;
  }
}
