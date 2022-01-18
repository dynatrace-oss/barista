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

import { InjectionToken } from '@angular/core';
import {
  defaultEditionDataForFilterValuesParser,
  defaultTagDataForFilterValuesParser,
} from './filter-field-util';
import { DtFilterValue, DtFilterFieldTagData } from './types';

/** InjectionToken of the Filter Field options. */
export const DT_FILTER_FIELD_CONFIG = new InjectionToken<string>(
  'DT_FILTER_FIELD_CONFIG',
);

/** The config that can be passed to the dt-filter-field component for customization */
export interface DtFilterFieldConfig {
  /** Message displayed in the options panel when partial results are listed */
  partialHintMessage: string;
}

export const DT_FILTER_FIELD_DEFAULT_CONFIG: DtFilterFieldConfig = {
  partialHintMessage: 'Pick or provide free text',
};

/** User defined parser function for tag key:values, overrides default parser function */
export type TagParserFunction = (
  filterValues: DtFilterValue[],
  editable?: boolean,
  deletable?: boolean,
) => DtFilterFieldTagData | null;

export type EditionParserFunction = (filterValues: DtFilterValue[]) => string;

/** Injection token for the external configuration of the filter-field component */
export const DT_FILTER_VALUES_PARSER_CONFIG =
  new InjectionToken<TagParserFunction>('dt-filter-value-config');
export const DT_FILTER_EDITION_VALUES_PARSER_CONFIG =
  new InjectionToken<EditionParserFunction>('dt-filter-edition-value-config');

export const DT_FILTER_VALUES_DEFAULT_PARSER_CONFIG: TagParserFunction =
  defaultTagDataForFilterValuesParser;
export const DT_FILTER_EDITION_VALUES_DEFAULT_PARSER_CONFIG: EditionParserFunction =
  defaultEditionDataForFilterValuesParser;
