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

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  isDefined,
  isNumber,
  isObject,
  isString,
} from '@dynatrace/barista-components/core';
import { DtFilterFieldValidator } from './filter-field-validation';
import { DtFilterFieldDataSource } from './filter-field-data-source';
import {
  DtNodeDef,
  dtAutocompleteDef,
  isDtGroupDef,
  isDtAutocompleteDef,
  dtOptionDef,
  dtGroupDef,
  dtFreeTextDef,
  dtRangeDef,
  dtMultiSelectDef,
} from './types';

/** The simple Shape of an object to be usable as a option in an autocomplete or free-text */
export interface DtFilterFieldDefaultDataSourceSimpleOption {
  name: string;
  id?: string | number;
  disabled?: boolean;
}

export type DtFilterFieldDefaultDataSourceOption =
  | DtFilterFieldDefaultDataSourceSimpleOption
  | (DtFilterFieldDefaultDataSourceAutocomplete &
      DtFilterFieldDefaultDataSourceSimpleOption)
  | (DtFilterFieldDefaultDataSourceFreeText &
      DtFilterFieldDefaultDataSourceSimpleOption)
  | (DtFilterFieldDefaultDataSourceRange &
      DtFilterFieldDefaultDataSourceSimpleOption)
  | (DtFilterFieldDefaultDataSourceMultiSelect &
      DtFilterFieldDefaultDataSourceSimpleOption);

/** Shape of an object to be usable as a group in a free-text */
export interface DtFilterFieldDefaultDataSourceSimpleGroup {
  name: string;
  options: Array<DtFilterFieldDefaultDataSourceSimpleOption>;
}

/** Shape of an object to be usable as a group in an autocomplete */
export interface DtFilterFieldDefaultDataSourceGroup
  extends DtFilterFieldDefaultDataSourceSimpleGroup {
  options: Array<DtFilterFieldDefaultDataSourceOption>;
}

/** Shape of an object to be usable as an autocomplete */
export interface DtFilterFieldDefaultDataSourceAutocomplete {
  autocomplete: Array<
    DtFilterFieldDefaultDataSourceOption | DtFilterFieldDefaultDataSourceGroup
  >;
  distinct?: boolean;
  async?: boolean;
  partial?: boolean;
  partialHintMessage?: string;
}

/** Shape of an object to be usable as an multiselect */
export interface DtFilterFieldDefaultDataSourceMultiSelect {
  multiOptions: Array<
    DtFilterFieldDefaultDataSourceOption | DtFilterFieldDefaultDataSourceGroup
  >;
  async?: boolean;
  partial?: boolean;
}

/** Shape of an object to be usable as a free text variant */
export interface DtFilterFieldDefaultDataSourceFreeText {
  suggestions: Array<
    | DtFilterFieldDefaultDataSourceSimpleOption
    | DtFilterFieldDefaultDataSourceSimpleGroup
  >;
  validators: DtFilterFieldValidator[];
  async?: boolean;
  unique?: boolean;
  defaultSearch?: boolean;
}

export interface DtFilterFieldDefaultDataSourceRange {
  range: {
    unit: string;
    operators: {
      range?: boolean;
      equal?: boolean;
      greaterThanEqual?: boolean;
      lessThanEqual?: boolean;
    };
  };
  unique?: boolean;
}

export type DtFilterFieldDefaultDataSourceType =
  | DtFilterFieldDefaultDataSourceOption
  | DtFilterFieldDefaultDataSourceGroup
  | DtFilterFieldDefaultDataSourceAutocomplete
  | DtFilterFieldDefaultDataSourceMultiSelect
  | DtFilterFieldDefaultDataSourceFreeText
  | DtFilterFieldDefaultDataSourceRange;

/* eslint-disable no-bitwise */

/**
 * DataSource that accepts a client side data object with a specific structure (described below)
 * and includes support for filtering autocomplete options and groups, as well as suggestions for free text fields.
 * It also allows for customizing the predicate function which will be used to filter options and groups.
 *
 * The DataSource can take object structures like the following:
 *
 * To render an autocomplete
 * ```
 *  {
 *    autocomplete: [
 *      { name: "Option 1" }, // An option can be an object with a name property
 *      "Option 2", // Or just a string
 *      {
 *        name: "Group 1", // It also accepts a group, that consists of a name property
 *        options: [ // or child options
 *          { name: "Option 3"},
 *          "Option 4"
 *        ]
 *      }
 *    ]
 *  }
 * ```
 *
 * It is also possible to set a distinct property on the autocomplete object, so the user can select options only once:
 *  {
 *    distinct: true,
 *    autocomplete: [
 *      { name: "Option 1" },
 *      "Option 2"
 *    ]
 *  }
 *
 * To render a free-text input
 * ```
 *  {
 *    suggestions: [] // To render just an input field provide an empty suggestion array
 *  }
 * ```
 * or
 * ```
 *  {
 *    suggestions: [ // Provide autocomplete options as suggestions
 *      { name: "Suggestion 1" },
 *      "Suggestion 2"
 *    ]
 *  }
 * ```
 *
 * To render a range input for all operators and the value is in seconds.
 * ```
 * {
 *   range: {
 *     unit: 's',
 *     operators: {
 *       range: true,
 *       equal: true,
 *       greaterThanEqual: true,
 *       lessThanEqual: true,
 *     },
 *   }
 * }
 */
export class DtFilterFieldDefaultDataSource
  implements DtFilterFieldDataSource<DtFilterFieldDefaultDataSourceType>
{
  private readonly _data$: BehaviorSubject<DtFilterFieldDefaultDataSourceType | null>;

  /** Structure of data that is used, transformed and rendered by the filter-field. */
  get data(): DtFilterFieldDefaultDataSourceType | null {
    return this._data$.value;
  }
  set data(data: DtFilterFieldDefaultDataSourceType | null) {
    this._data$.next(data);
  }

  constructor(initialData?: DtFilterFieldDefaultDataSourceType) {
    this._data$ =
      new BehaviorSubject<DtFilterFieldDefaultDataSourceType | null>(
        initialData ? initialData : null,
      );
  }

  /**
   * Used by the DtFilterField. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterFieldViewer (filter-field)
   */
  connect(): Observable<DtNodeDef<DtFilterFieldDefaultDataSourceType> | null> {
    return this._data$.pipe(map((data) => this.transformObject(data)));
  }

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  disconnect(): void {
    this._data$.complete();
  }

  /** Whether the provided data object is of type AutocompleteData */
  isAutocomplete(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
  ): data is DtFilterFieldDefaultDataSourceAutocomplete {
    return isObject(data) && Array.isArray(data.autocomplete);
  }

  /** Whether the provided data object is of type OptionData */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isOption(data: any): data is DtFilterFieldDefaultDataSourceOption {
    return isObject(data) && typeof data.name === 'string';
  }

  /** Whether the provided data object is of type GroupData */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isGroup(data: any): data is DtFilterFieldDefaultDataSourceGroup {
    return (
      isObject(data) &&
      typeof data.name === 'string' &&
      Array.isArray(data.options)
    );
  }

  /** Whether the provided data object is of type FreeTextData */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isFreeText(data: any): data is DtFilterFieldDefaultDataSourceFreeText {
    return isObject(data) && Array.isArray(data.suggestions);
  }

  /** Whether the provided data object is of type MultiSelectData */
  isMultiSelect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
  ): data is DtFilterFieldDefaultDataSourceMultiSelect {
    return isObject(data) && Array.isArray(data.multiOptions);
  }

  /** Whether the provided data object is of type RangeData */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isRange(data: any): data is DtFilterFieldDefaultDataSourceRange {
    return isObject(data) && isObject(data.range);
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtAutocompleteDef. */
  transformAutocomplete(
    data: DtFilterFieldDefaultDataSourceAutocomplete,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceAutocomplete> {
    const def = dtAutocompleteDef(
      data,
      null,
      [],
      !!data.distinct,
      !!data.async,
      !!data.partial,
      data.partialHintMessage,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    def.autocomplete!.optionsOrGroups = this.transformList(
      data.autocomplete,
      def,
    );
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtMultiSelectDef. */
  transformMultiSelect(
    data: DtFilterFieldDefaultDataSourceMultiSelect,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceMultiSelect> {
    const def = dtMultiSelectDef(data, null, [], !!data.async, !!data.partial);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    def.multiSelect!.multiOptions = this.transformList(data.multiOptions, def);
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtOptionDef. */
  transformOption(
    data: DtFilterFieldDefaultDataSourceOption,
    parentAutocompleteOrOption: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null,
    existingDef: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceOption> {
    const parentGroup = isDtGroupDef<
      DtFilterFieldDefaultDataSourceGroup,
      DtFilterFieldDefaultDataSourceOption
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(parentAutocompleteOrOption as any)
      ? parentAutocompleteOrOption
      : null;
    const parentAutocomplete =
      parentGroup !== null
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parentGroup.group!.parentAutocomplete
        : isDtAutocompleteDef(parentAutocompleteOrOption)
        ? (parentAutocompleteOrOption as DtNodeDef)
        : null;
    return dtOptionDef<DtFilterFieldDefaultDataSourceOption>(
      data,
      existingDef,
      data.name,
      isNumber(data.id) || isString(data.id) ? `${data.id}` : null,
      parentAutocomplete,
      parentGroup,
      data.disabled,
    );
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtGroupDef. */
  transformGroup(
    data: DtFilterFieldDefaultDataSourceGroup,
    parentAutocomplete: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null,
    existingDef: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceGroup> {
    const def = dtGroupDef<
      DtFilterFieldDefaultDataSourceGroup,
      DtFilterFieldDefaultDataSourceOption
    >(data, existingDef, data.name, [], parentAutocomplete);
    def.group.options = this.transformList(
      data.options,
      def,
    ) as DtNodeDef<DtFilterFieldDefaultDataSourceOption>[];
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtFreeTextDef. */
  transformFreeText(
    data: DtFilterFieldDefaultDataSourceFreeText,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceFreeText> {
    const def = dtFreeTextDef(
      data,
      null,
      [],
      data.validators,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      isDefined(data.unique) ? data.unique! : false,
      !!data.defaultSearch,
      !!data.async,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    def.freeText!.suggestions = this.transformList(data.suggestions, def);
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtRangeDef. */
  transformRange(
    data: DtFilterFieldDefaultDataSourceRange,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceRange> {
    return dtRangeDef(
      data,
      null,
      !!data.range.operators.range,
      !!data.range.operators.equal,
      !!data.range.operators.greaterThanEqual,
      !!data.range.operators.lessThanEqual,
      data.range.unit,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      isDefined(data.unique) ? data.unique! : false,
    );
  }

  /** Transforms the provided data into a DtNodeDef. */
  transformObject(
    data: DtFilterFieldDefaultDataSourceType | null,
    parent: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceType> | null {
    let def: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null;
    if (this.isAutocomplete(data)) {
      def = this.transformAutocomplete(data);
    } else if (this.isFreeText(data)) {
      def = this.transformFreeText(data);
    } else if (this.isRange(data)) {
      def = this.transformRange(data);
    } else if (this.isMultiSelect(data)) {
      def = this.transformMultiSelect(data);
    }

    if (this.isGroup(data)) {
      def = this.transformGroup(data);
    } else if (this.isOption(data)) {
      def = this.transformOption(
        data,
        parent as DtNodeDef<DtFilterFieldDefaultDataSourceAutocomplete>,
        def,
      );
    }
    return def;
  }

  /** Transforms the provided list of data objects into an array of DtNodeDefs. */
  transformList(
    list: Array<DtFilterFieldDefaultDataSourceType>,
    parent: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null = null,
  ): DtNodeDef<DtFilterFieldDefaultDataSourceType>[] {
    return list
      .map((item) => this.transformObject(item, parent))
      .filter(
        (item) => item !== null,
      ) as DtNodeDef<DtFilterFieldDefaultDataSourceType>[];
  }
}
