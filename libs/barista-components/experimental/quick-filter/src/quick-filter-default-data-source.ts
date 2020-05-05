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
import { DtQuickFilterDataSource } from './quick-filter-data-source';
import { isDefined, isObject } from '@dynatrace/barista-components/core';
import {
  DtNodeDef,
  dtRangeDef,
  dtFreeTextDef,
  dtGroupDef,
  dtOptionDef,
  isDtAutocompleteDef,
  DtFilterFieldDefaultDataSourceAutocomplete,
  DtFilterFieldDefaultDataSourceSimpleGroup,
  DtFilterFieldDefaultDataSourceGroup,
  DtFilterFieldDefaultDataSourceFreeText,
  DtFilterFieldDefaultDataSourceRange,
  dtAutocompleteDef,
  isDtGroupDef,
} from '@dynatrace/barista-components/filter-field';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DtQuickFilterDefaultDataSourceSimpleOption {
  name: string;
}

export type DtQuickFilterDefaultDataSourceRange = DtFilterFieldDefaultDataSourceRange;
export type DtQuickFilterDefaultDataSourceFreeText = DtFilterFieldDefaultDataSourceFreeText;
export type DtQuickFilterDefaultDataSourceAutocomplete = DtFilterFieldDefaultDataSourceAutocomplete;
export type DtQuickFilterDefaultDataSourceGroup = DtFilterFieldDefaultDataSourceGroup;
export type DtQuickFilterDefaultDataSourceSimpleGroup = DtFilterFieldDefaultDataSourceSimpleGroup;

export type DtQuickFilterDefaultDataSourceType =
  | DtQuickFilterDefaultDataSourceOption
  | DtQuickFilterDefaultDataSourceGroup
  | DtQuickFilterDefaultDataSourceAutocomplete
  | DtQuickFilterDefaultDataSourceFreeText
  | DtQuickFilterDefaultDataSourceRange;

export type DtQuickFilterDefaultDataSourceOption =
  | DtQuickFilterDefaultDataSourceSimpleOption
  | (DtQuickFilterDefaultDataSourceAutocomplete &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtQuickFilterDefaultDataSourceFreeText &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtQuickFilterDefaultDataSourceRange &
      DtQuickFilterDefaultDataSourceSimpleOption);

export interface DtQuickFilterDefaultDataSourceConfig {
  showInSidebar: (node: any) => boolean;
}

export class DtQuickFilterDefaultDataSource<
  T extends DtQuickFilterDefaultDataSourceType
> implements DtQuickFilterDataSource {
  private readonly _data$: BehaviorSubject<T>;

  /** Structure of data that is used, transformed and rendered by the filter-field. */
  get data(): T {
    return this._data$.value;
  }
  set data(data: T) {
    this._data$.next(data);
  }

  constructor(
    initialData: T = (null as unknown) as T,
    config: DtQuickFilterDefaultDataSourceConfig,
  ) {
    this._data$ = new BehaviorSubject<T>(initialData);
    this.showInSidebarFunction = config.showInSidebar;
  }

  /** Function that evaluates if a node should be displayed in the quick filter sidebar */
  showInSidebarFunction: (node: any) => boolean;

  /**
   * Used by the DtQuickFilter. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtQuickFilterViewer (filter-field)
   */
  connect(): Observable<DtNodeDef | null> {
    return this._data$.pipe(map((data) => this.transformObject(data)));
  }

  /** Used by the DtQuickFilter. Called when it is destroyed. No-op. */
  disconnect(): void {
    this._data$.complete();
  }

  /** Whether the provided data object is of type AutocompleteData */
  isAutocomplete(
    data: any,
  ): data is DtQuickFilterDefaultDataSourceAutocomplete {
    return isObject(data) && Array.isArray(data.autocomplete);
  }

  /** Whether the provided data object is of type OptionData */
  isOption(data: any): data is DtQuickFilterDefaultDataSourceOption {
    return isObject(data) && typeof data.name === 'string';
  }

  /** Whether the provided data object is of type GroupData */
  isGroup(data: any): data is DtQuickFilterDefaultDataSourceGroup {
    return (
      isObject(data) &&
      typeof data.name === 'string' &&
      Array.isArray(data.options)
    );
  }

  /** Whether the provided data object is of type FreeTextData */
  isFreeText(data: any): data is DtQuickFilterDefaultDataSourceFreeText {
    return isObject(data) && Array.isArray(data.suggestions);
  }

  /** Whether the provided data object is of type RangeData */
  isRange(data: any): data is DtQuickFilterDefaultDataSourceRange {
    return isObject(data) && isObject(data.range);
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtAutocompleteDef. */
  transformAutocomplete(
    data: DtQuickFilterDefaultDataSourceAutocomplete,
  ): DtNodeDef {
    const def = dtAutocompleteDef(
      data,
      null,
      [],
      !!data.distinct,
      !!data.async,
    );
    def.autocomplete!.optionsOrGroups = this.transformList(
      data.autocomplete,
      def,
    );
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtOptionDef. */
  transformOption(
    data: DtQuickFilterDefaultDataSourceOption,
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
      data,
      existingDef,
      data.name,
      null,
      parentAutocomplete,
      parentGroup,
    );
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtGroupDef. */
  transformGroup(
    data: DtQuickFilterDefaultDataSourceGroup,
    parentAutocomplete: DtNodeDef | null = null,
    existingDef: DtNodeDef | null = null,
  ): DtNodeDef {
    const def = dtGroupDef(
      data,
      existingDef,
      data.name,
      [],
      parentAutocomplete,
    );
    def.group!.options = this.transformList(data.options, def);
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtFreeTextDef. */
  transformFreeText(data: DtQuickFilterDefaultDataSourceFreeText): DtNodeDef {
    const def = dtFreeTextDef(
      data,
      null,
      [],
      data.validators,
      isDefined(data.unique) ? data.unique! : false,
    );
    def.freeText!.suggestions = this.transformList(data.suggestions, def);
    return def;
  }

  /** Transforms the provided data into a DtNodeDef which contains a DtRangeDef. */
  transformRange(data: DtQuickFilterDefaultDataSourceRange): DtNodeDef {
    return dtRangeDef(
      data,
      null,
      !!data.range.operators.range,
      !!data.range.operators.equal,
      !!data.range.operators.greaterThanEqual,
      !!data.range.operators.lessThanEqual,
      data.range.unit,
      isDefined(data.unique) ? data.unique! : false,
    );
  }

  /** Transforms the provided data into a DtNodeDef. */
  transformObject(
    data: DtQuickFilterDefaultDataSourceType | null,
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
    list: Array<DtQuickFilterDefaultDataSourceType>,
    parent: DtNodeDef | null = null,
  ): DtNodeDef[] {
    return list
      .map((item) => this.transformObject(item, parent))
      .filter((item) => item !== null) as DtNodeDef[];
  }
}
