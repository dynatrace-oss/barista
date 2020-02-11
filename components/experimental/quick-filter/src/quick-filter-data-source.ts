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

import {
  DtFilterFieldDataSource,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceAutocomplete,
  DtFilterFieldDefaultDataSourceFreeText,
  DtFilterFieldDefaultDataSourceRange,
  DtFilterFieldDefaultDataSourceSimpleGroup,
  DtFilterFieldDefaultDataSourceSimpleOption,
} from '@dynatrace/barista-components/filter-field';

export abstract class DtQuickFilterDataSource extends DtFilterFieldDataSource {}

/** The simple Shape of an object to be usable as a option in an autocomplete or free-text */
export interface DtQuickFilterDefaultDataSourceSimpleOption
  extends DtFilterFieldDefaultDataSourceSimpleOption {}

export type DtQuickFilterDefaultDataSourceOption =
  | DtQuickFilterDefaultDataSourceSimpleOption
  | (DtFilterFieldDefaultDataSourceAutocomplete &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtFilterFieldDefaultDataSourceFreeText &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtFilterFieldDefaultDataSourceRange &
      DtQuickFilterDefaultDataSourceSimpleOption);

/** Shape of an object to be usable as a group in a free-text */
export interface DtQuickFilterDefaultDataSourceSimpleGroup
  extends DtFilterFieldDefaultDataSourceSimpleGroup {
  options: Array<DtFilterFieldDefaultDataSourceSimpleOption>;
}

/** Shape of an object to be usable as a group in an autocomplete */
export interface DtQuickFilterDefaultDataSourceGroup
  extends DtQuickFilterDefaultDataSourceSimpleGroup {
  options: Array<DtQuickFilterDefaultDataSourceOption>;
}

/** Shape of an object to be usable as an autocomplete */
export interface DtQuickFilterDefaultDataSourceAutocomplete
  extends DtFilterFieldDefaultDataSourceAutocomplete {
  autocomplete: Array<
    DtQuickFilterDefaultDataSourceOption | DtQuickFilterDefaultDataSourceGroup
  >;
  quickFilter?: boolean;
}

/** Shape of an object to be usable as a free text variant */
export interface DtQuickFilterDefaultDataSourceFreeText {
  suggestions: Array<
    | DtQuickFilterDefaultDataSourceSimpleOption
    | DtQuickFilterDefaultDataSourceSimpleGroup
  >;
}

export interface DtQuickFilterDefaultDataSourceRange
  extends DtFilterFieldDefaultDataSourceRange {}

export type DtQuickFilterDefaultDataSourceType =
  | DtQuickFilterDefaultDataSourceOption
  | DtQuickFilterDefaultDataSourceGroup
  | DtQuickFilterDefaultDataSourceAutocomplete
  | DtQuickFilterDefaultDataSourceFreeText
  | DtQuickFilterDefaultDataSourceRange;

export class DtQuickFilterDefaultDataSource<
  T = { name: string; [key: string]: any }
> extends DtFilterFieldDefaultDataSource<any> {
  constructor(initialData: T = (null as unknown) as T) {
    super(initialData);
  }
}
