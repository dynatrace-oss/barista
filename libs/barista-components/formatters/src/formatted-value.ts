/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  readonly displayWhiteSpace?: boolean;
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

  /** Formatted display unit composed by unit and rate unit */
  get formattedDisplayUnit(): string {
    const { displayUnit, displayWhiteSpace, displayRateUnit } =
      this._formattedData;

    if (displayUnit !== undefined && displayRateUnit !== undefined) {
      return `${displayUnit}${displayWhiteSpace ? ' ' : ''}/${displayRateUnit}`;
    }
    if (displayUnit !== undefined) {
      return displayUnit;
    }
    if (displayRateUnit !== undefined) {
      return `/${displayRateUnit}`;
    }

    return '';
  }

  /** @return the string as a combination of the display data */
  toString(): string {
    const { displayValue } = this._formattedData;
    if (displayValue === undefined) {
      return NO_DATA;
    }

    const displayUnit = this.formattedDisplayUnit;
    if (displayUnit === '') {
      return displayValue;
    }

    return `${displayValue} ${displayUnit}`;
  }
}
