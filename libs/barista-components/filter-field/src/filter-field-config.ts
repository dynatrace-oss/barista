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

import { InjectionToken } from '@angular/core';
import { defaultTagDataForFilterValuesParser } from './filter-field-util';
import { DtFilterValue, DtFilterFieldTagData } from './types';

/** User defined parser function for tag key:values, overrides default parser function */
export type TagParserFunction = (
  filterValues: DtFilterValue[],
  editable?: boolean,
  deletable?: boolean,
) => DtFilterFieldTagData | null;

/** Injection token for the external configuration of the filter-field component */
export const DT_FILTER_VALUES_PARSER_CONFIG = new InjectionToken<
  TagParserFunction
>('dt-filter-value-config');

export const DT_FILTER_VALUES_DEFAULT_PARSER_CONFIG: TagParserFunction = defaultTagDataForFilterValuesParser;
