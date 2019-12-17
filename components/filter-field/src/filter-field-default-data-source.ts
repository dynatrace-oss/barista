/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
import { Validators } from '@angular/forms';
import { isDefined, isObject } from '@dynatrace/barista-components/core';
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
} from './types';

/** Shape of an object to be usable as a option in an autocomplete */
export type DtFilterFieldDefaultDataSourceOption = { name: string } | string;

/** Shape of an object to be usable as a group in an autocomplete */
export interface DtFilterFieldDefaultDataSourceGroup {
  name: string;
  options: DtFilterFieldDefaultDataSourceOption[];
}

/** Shape of an object to be usable as an autocomplete */
export interface DtFilterFieldDefaultDataSourceAutocomplete {
  autocomplete: Array<
    DtFilterFieldDefaultDataSourceOption | DtFilterFieldDefaultDataSourceGroup
  >;
  distinct?: boolean;
  async?: boolean;
}

/** Shape of an object to be usable as a free text variant */
export interface DtFilterFieldDefaultDataSourceFreeText {
  suggestions: Array<
    DtFilterFieldDefaultDataSourceOption | DtFilterFieldDefaultDataSourceGroup
  >;
  validators?: DtFilterFieldValidator[];
  unique?: boolean;
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
  | DtFilterFieldDefaultDataSourceFreeText
  | DtFilterFieldDefaultDataSourceRange;

// tslint:disable: no-bitwise

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
// @breaking-change 5.0.0 Generic `T` to be changed to `T extends DtFilterFieldDefaultDataSourceType
export class DtFilterFieldDefaultDataSource<T>
  implements DtFilterFieldDataSource {
  private readonly _data$: BehaviorSubject<T>;

  /** Structure of data that is used, transformed and rendered by the filter-field. */
  get data(): T {
    return this._data$.value;
  }
  set data(data: T) {
    this._data$.next(data);
  }

  constructor(initialData: T = (null as unknown) as T) {
    this._data$ = new BehaviorSubject<T>(initialData);
  }

  /**
   * Used by the DtFilterField. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterFieldViewer (filter-field)
   */
  connect(): Observable<DtNodeDef | null> {
    // @breaking-change 5.0.0 Type cast to `any` to be removed
    // tslint:disable-next-line: no-any
    return this._data$.pipe(map(data => this.transformObject(data as any)));
  }

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  disconnect(): void {
    this._data$.complete();
  }

  /** Whether the provided data object is of type AutocompleteData */
  isAutocomplete(
    // tslint:disable-next-line: no-any
    data: any,
  ): data is DtFilterFieldDefaultDataSourceAutocomplete {
    return isObject(data) && Array.isArray(data.autocomplete);
  }

  /** Whether the provided data object is of type OptionData */
  // tslint:disable-next-line: no-any
  isOption(data: any): data is DtFilterFieldDefaultDataSourceOption {
    return (
      typeof data === 'string' ||
      (isObject(data) && typeof data.name === 'string')
    );
  }

  /** Whether the provided data object is of type GroupData */
  // tslint:disable-next-line: no-any
  isGroup(data: any): data is DtFilterFieldDefaultDataSourceGroup {
    return (
      isObject(data) &&
      typeof data.name === 'string' &&
      Array.isArray(data.options)
    );
  }

  /** Whether the provided data object is of type FreeTextData */
  // tslint:disable-next-line: no-any
  isFreeText(data: any): data is DtFilterFieldDefaultDataSourceFreeText {
    return isObject(data) && Array.isArray(data.suggestions);
  }

  /** Whether the provided data object is of type RangeData */
  // tslint:disable-next-line: no-any
  isRange(data: any): data is DtFilterFieldDefaultDataSourceRange {
    return isObject(data) && isObject(data.range);
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtAutocompleteDef. */
  transformAutocomplete(
    data: DtFilterFieldDefaultDataSourceAutocomplete,
  ): DtNodeDef {
    const def = dtAutocompleteDef(
      [],
      !!data.distinct,
      !!data.async,
      data,
      null,
    );
    def.autocomplete!.optionsOrGroups = this.transformList(
      data.autocomplete,
      def,
    );
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtOptionDef. */
  transformOption(
    data: DtFilterFieldDefaultDataSourceOption,
    parentAutocompleteOrOption: DtNodeDef | null = null,
    existingDef: DtNodeDef | null = null,
  ): DtNodeDef {
    const parentGroup = isDtGroupDef(parentAutocompleteOrOption)
      ? parentAutocompleteOrOption
      : null;
    const parentAutocomplete =
      parentGroup !== null
        ? parentGroup.group.parentAutocomplete
        : isDtAutocompleteDef(parentAutocompleteOrOption)
        ? (parentAutocompleteOrOption as DtNodeDef)
        : null;
    return dtOptionDef(
      typeof data === 'string' ? data : data.name,
      data,
      null,
      existingDef,
      parentAutocomplete,
      parentGroup,
    );
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtGroupDef. */
  transformGroup(
    data: DtFilterFieldDefaultDataSourceGroup,
    parentAutocomplete: DtNodeDef | null = null,
    existingDef: DtNodeDef | null = null,
  ): DtNodeDef {
    const def = dtGroupDef(
      data.name,
      [],
      data,
      existingDef,
      parentAutocomplete,
    );
    def.group!.options = this.transformList(data.options, def);
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtFreeTextDef. */
  transformFreeText(data: DtFilterFieldDefaultDataSourceFreeText): DtNodeDef {
    // @breaking-change 5.0.0 data.validators is then required so `|| []` can be removed
    const def = dtFreeTextDef(
      [],
      data.validators || [
        // tslint:disable-next-line: no-unbound-method
        { validatorFn: Validators.required, error: 'Field is required' },
      ],
      isDefined(data.unique) ? data.unique! : false,
      data,
      null,
    );
    def.freeText!.suggestions = this.transformList(data.suggestions, def);
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtRangeDef. */
  transformRange(data: DtFilterFieldDefaultDataSourceRange): DtNodeDef {
    return dtRangeDef(
      !!data.range.operators.range,
      !!data.range.operators.equal,
      !!data.range.operators.greaterThanEqual,
      !!data.range.operators.lessThanEqual,
      data.range.unit,
      data,
      null,
      isDefined(data.unique) ? data.unique! : false,
    );
  }

  /** Transforms the provided data into a DtNodeDef. */
  transformObject(
    data: DtFilterFieldDefaultDataSourceType | null,
    parent: DtNodeDef | null = null,
  ): DtNodeDef | null {
    let def: DtNodeDef | null = null;
    if (this.isAutocomplete(data)) {
      def = this.transformAutocomplete(data);
    } else if (this.isFreeText(data)) {
      def = this.transformFreeText(data);
    } else if (this.isRange(data)) {
      def = this.transformRange(data);
    }

    if (this.isGroup(data)) {
      def = this.transformGroup(data);
    } else if (this.isOption(data)) {
      def = this.transformOption(data, parent, def);
    }
    return def;
  }

  /** Transforms the provided list of data objects into an array of DtNodeDefs. */
  transformList(
    list: DtFilterFieldDefaultDataSourceType[],
    parent: DtNodeDef | null = null,
  ): DtNodeDef[] {
    return list
      .map(item => this.transformObject(item, parent))
      .filter(item => item !== null) as DtNodeDef[];
  }
}
