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

import { isDefined, isObject } from '@dynatrace/barista-components/core';
import { getDtFilterFieldRangeNoOperatorsError } from './filter-field-errors';
import { DtFilterFieldValidator } from './filter-field-validation';

/* eslint-disable no-bitwise, no-magic-numbers, @typescript-eslint/no-explicit-any, no-shadow */
export enum DtNodeFlags {
  None = 0,
  TypeAutocomplete = 1 << 0,
  TypeFreeText = 1 << 1,
  TypeOption = 1 << 2,
  TypeGroup = 1 << 3,
  TypeRange = 1 << 4,
  TypeMultiSelect = 1 << 5,
  RenderTypes = TypeAutocomplete | TypeFreeText | TypeRange | TypeMultiSelect,
  Types = TypeAutocomplete |
    TypeFreeText |
    TypeOption |
    TypeGroup |
    TypeMultiSelect,
}

export interface DefaultSearchOption<T> {
  defaultSearchDef: DtAutocompleteValue<T>;
  inputValue: string;
}

export interface DtNodeDef<D = unknown> {
  nodeFlags: DtNodeFlags;
  autocomplete: DtAutocompleteDef | null;
  option: DtOptionDef | null;
  group: DtGroupDef | null;
  operator: DtOperatorDef | null;
  freeText: DtFreeTextDef | null;
  range: DtRangeDef | null;
  multiSelect: DtMultiSelectDef | null;
  data: D;
}

export interface DtAutocompleteDef<OpGr = unknown, Op = unknown> {
  distinct: boolean;
  async: boolean;
  partial?: boolean;
  partialHintMessage?: string;
  operators: DtNodeDef<Op>[];
  optionsOrGroups: DtNodeDef<OpGr>[];
}

export interface DtFreeTextDef<S = unknown> {
  suggestions: DtNodeDef<S>[];
  validators: DtFilterFieldValidator[];
  async?: boolean;
  unique: boolean;
  defaultSearch?: boolean;
}

export interface DtMultiSelectDef<MOpt = unknown, Opr = unknown> {
  async: boolean;
  partial?: boolean;
  multiOptions: DtNodeDef<MOpt>[];
  operators: DtNodeDef<Opr>[];
}

export interface DtGroupDef<O = unknown> {
  label: string;
  options: DtNodeDef<O>[];
  parentAutocomplete: DtNodeDef<unknown> | null;
}

export interface DtOptionDef {
  disabled?: boolean;
  viewValue: string;
  uid: string | null;
  parentGroup: DtNodeDef<unknown> | null;
  parentAutocomplete: DtNodeDef<unknown> | null;
}

export const enum DtOperatorTypes {
  And = 0,
  Or = 1,
  Not = 2,
  In = 4,
}

export interface DtOperatorDef {
  type: DtOperatorTypes;
}

export const enum DtRangeOperatorFlags {
  Equal = 1 << 0,
  LowerEqual = 1 << 1,
  GreatEqual = 1 << 2,
  Range = 1 << 3,
  Types = Equal | LowerEqual | GreatEqual | Range,
}

export interface DtRangeDef {
  operatorFlags: DtRangeOperatorFlags;
  unit: string;
  unique: boolean;
}

/** Creates a new DtRangeDef onto a provided existing NodeDef or a newly created one. */
export function dtRangeDef<D = unknown>(
  data: D,
  existingNodeDef: DtNodeDef | null,
  hasRangeOperator: boolean,
  hasEqualOperator: boolean,
  hasGreaterEqualOperator: boolean,
  hasLowerEqualOperator: boolean,
  unit: string,
  unique: boolean,
): DtNodeDef<D> & { range: DtRangeDef } {
  // if none of the operators are defined, throw an error.
  if (
    !(
      hasRangeOperator ||
      hasEqualOperator ||
      hasLowerEqualOperator ||
      hasGreaterEqualOperator
    )
  ) {
    throw getDtFilterFieldRangeNoOperatorsError();
  }

  // Define which operators are enabled.
  let operatorFlags: DtRangeOperatorFlags = 0;
  if (hasRangeOperator) {
    operatorFlags |= DtRangeOperatorFlags.Range;
  }
  if (hasEqualOperator) {
    operatorFlags |= DtRangeOperatorFlags.Equal;
  }
  if (hasGreaterEqualOperator) {
    operatorFlags |= DtRangeOperatorFlags.GreatEqual;
  }
  if (hasLowerEqualOperator) {
    operatorFlags |= DtRangeOperatorFlags.LowerEqual;
  }
  const def = {
    ...nodeDef(data, existingNodeDef),
    range: {
      operatorFlags,
      unit,
      unique,
    },
  };
  def.nodeFlags |= DtNodeFlags.TypeRange;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an RangeDef. */
export function isDtRangeDef<D = unknown>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & DtRangeDef {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeRange);
}

/** Creates a new DtMultiSelectDef onto a provided existing NodeDef or a newly created one. */
export function dtMultiSelectDef<D = unknown, OG = unknown, Op = unknown>(
  data: D,
  existingNodeDef: DtNodeDef | null,
  multiOptions: DtNodeDef<OG>[],
  async: boolean,
  partial: boolean = false,
): DtNodeDef<D> & { multiSelect: DtMultiSelectDef<OG, Op> } {
  const def = {
    ...nodeDef(data, existingNodeDef),
    multiSelect: { multiOptions, async, partial, operators: [] },
  };
  def.nodeFlags |= DtNodeFlags.TypeMultiSelect;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an MultiSelectDef. */
export function isDtMultiSelectDef<D = unknown>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & DtMultiSelectDef {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeMultiSelect);
}

export function isAsyncDtMultiSelectDef<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & {
  multiSelect: DtMultiSelectDef;
  option: DtOptionDef;
} {
  return (
    isDtMultiSelectDef<D>(def) &&
    isDtOptionDef<D>(def) &&
    Boolean(def.multiSelect?.async)
  );
}

export function isPartialDtMultiSelectDef(def: any): def is DtNodeDef & {
  multiSelect: DtMultiSelectDef;
  option: DtOptionDef;
} {
  return (
    isDtMultiSelectDef(def) && isDtOptionDef(def) && !!def.multiSelect?.partial
  );
}

/** Whether the provided def object is an object and consists of a DefaultSearchDef */
export function isDefaultSearchOption<T>(
  option: any,
): option is DefaultSearchOption<T> {
  return isObject(option) && isDtAutocompleteValue(option.defaultSearchDef);
}

/** Creates a new DtAutocompleteDef onto a provided existing NodeDef or a newly created one. */
export function dtAutocompleteDef<D = unknown, OG = unknown, Op = unknown>(
  data: D,
  existingNodeDef: DtNodeDef | null,
  optionsOrGroups: DtNodeDef<OG>[],
  distinct: boolean,
  async: boolean,
  partial: boolean = false,
  partialHintMessage?: string,
): DtNodeDef<D> & { autocomplete: DtAutocompleteDef<OG, Op> } {
  const def = {
    ...nodeDef(data, existingNodeDef),
    autocomplete: {
      optionsOrGroups,
      distinct,
      async,
      partial,
      partialHintMessage,
      operators: [],
    },
  };
  def.nodeFlags |= DtNodeFlags.TypeAutocomplete;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an AutocompleteDef */
export function isDtAutocompleteDef<D = unknown, OpGr = unknown, Op = unknown>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & { autocomplete: DtAutocompleteDef<OpGr, Op> } {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeAutocomplete);
}

export function isAsyncDtAutocompleteDef<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & {
  autocomplete: DtAutocompleteDef;
  option: DtOptionDef;
} {
  return (
    isDtAutocompleteDef<D>(def) &&
    isDtOptionDef<D>(def) &&
    def.autocomplete.async
  );
}

export function isPartialDtAutocompleteDef(def: any): def is DtNodeDef & {
  autocomplete: DtAutocompleteDef;
  option: DtOptionDef;
} {
  return (
    isDtAutocompleteDef(def) && isDtOptionDef(def) && !!def.autocomplete.partial
  );
}

/** Creates a new DtOptionDef onto a provided existing NodeDef or a newly created one. */
export function dtOptionDef<D = unknown>(
  data: D,
  existingNodeDef: DtNodeDef | null,
  viewValue: string,
  uid: string | null,
  parentAutocomplete: DtNodeDef<unknown> | null,
  parentGroup: DtNodeDef<unknown> | null,
  disabled: boolean = false,
): DtNodeDef<D> & { option: DtOptionDef } {
  const def = {
    ...nodeDef(data, existingNodeDef),
    option: {
      disabled,
      viewValue,
      uid,
      parentAutocomplete,
      parentGroup,
    },
  };
  def.nodeFlags |= DtNodeFlags.TypeOption;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an OptionDef */
export function isDtOptionDef<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & { option: DtOptionDef } {
  return isDtNodeDef<D>(def) && !!(def.nodeFlags & DtNodeFlags.TypeOption);
}

/** Creates a new DtGroupDef onto a provided existing NodeDef or a newly created one. */
export function dtGroupDef<D = unknown, O = unknown>(
  data: D,
  existingNodeDef: DtNodeDef | null,
  label: string,
  options: DtNodeDef<O>[],
  parentAutocomplete: DtNodeDef<unknown> | null,
): DtNodeDef<D> & { group: DtGroupDef<O> } {
  const def = {
    ...nodeDef(data, existingNodeDef),
    group: {
      label,
      options,
      parentAutocomplete,
    },
  };
  def.nodeFlags |= DtNodeFlags.TypeGroup;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an GroupDef */
export function isDtGroupDef<D = unknown, O = unknown>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & { group: DtGroupDef<O> } {
  return isDtNodeDef<D>(def) && !!(def.nodeFlags & DtNodeFlags.TypeGroup);
}

/** Creates a new DtFreeTextDef onto a provided existing NodeDef or a newly created one. */
export function dtFreeTextDef<D = unknown, S = unknown>(
  data: D,
  existingNodeDef: DtNodeDef | null,
  suggestions: DtNodeDef<S>[],
  validators: DtFilterFieldValidator[],
  unique: boolean,
  defaultSearch: boolean = false,
  async: boolean = false,
): DtNodeDef<D> & { freeText: DtFreeTextDef<S> } {
  const def = {
    ...nodeDef<D>(data, existingNodeDef),
    freeText: { suggestions, validators, unique, async, defaultSearch },
  };
  def.nodeFlags |= DtNodeFlags.TypeFreeText;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an FreeTextDef */
export function isDtFreeTextDef<D = unknown, S = unknown>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & { freeText: DtFreeTextDef<S> } {
  return isDtNodeDef<D>(def) && !!(def.nodeFlags & DtNodeFlags.TypeFreeText);
}

/** Whether the provided def object is of type NodeDef, consists of an FreeTextDef, and has the async option enabled. */
export function isAsyncDtFreeTextDef<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & {
  freeText: DtFreeTextDef;
  option: DtOptionDef;
} {
  return (
    isDtFreeTextDef<D>(def) &&
    isDtOptionDef<D>(def) &&
    Boolean(def.freeText?.async)
  );
}

/** Whether the provided def object is a valid NodeDef type, and has the async option enabled. */
export function isAsyncDtOptionDef<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & {
  option: DtOptionDef;
} {
  return (
    isAsyncDtAutocompleteDef(def) ||
    isAsyncDtMultiSelectDef(def) ||
    isAsyncDtMultiSelectDef(def) ||
    isAsyncDtFreeTextDef(def)
  );
}

/** Whether the provided def object is a valid NodeDef type, and has the partial option enabled. */
export function isPartialDtOptionDef<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> & {
  option: DtOptionDef;
} {
  return isPartialDtAutocompleteDef(def) || isPartialDtMultiSelectDef(def);
}

/** Whether the provided def object is of type RenderType */
export function isDtRenderType<D>(
  def: DtNodeDef<D> | null,
): def is DtNodeDef<D> {
  return isDtNodeDef<D>(def) && !!(def.nodeFlags & DtNodeFlags.RenderTypes);
}

/** Creates a new DtNodeDef or returns the provided existing one. */
function nodeDef<D = unknown>(
  data: D,
  existingNodeDef: DtNodeDef<any> | null,
): DtNodeDef<D> {
  return (
    existingNodeDef || {
      nodeFlags: 0,
      autocomplete: null,
      multiSelect: null,
      freeText: null,
      option: null,
      group: null,
      operator: null,
      range: null,
      data,
    }
  );
}

/** Whether the provided def object is of type NodeDef */
export function isDtNodeDef<D = unknown>(def: any): def is DtNodeDef<D> {
  return isObject(def) && isDefined<DtNodeFlags>(def.nodeFlags);
}

/** Holds all the view values and the original filter source for providing it to the DtFilterFieldTag to display. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class DtFilterFieldTagData {
  constructor(
    public key: string | null,
    public value: string | null,
    public separator: string | null,
    public isFreeText: boolean,
    public filterValues: DtFilterValue[],
    public editable: boolean = true,
    public deletable: boolean = true,
  ) {}
}

/** Possible categories of values that one filter tag can be */
export type DtFilterValue =
  | DtAutocompleteValue<any>
  | DtFreeTextValue
  | DtRangeValue
  | DtMultiSelectValue<any>;

/** One of the categories of values that one filter tag can be */
export type DtFreeTextValue = string;

/** Checks if a given value is of category DtFreeTextValue */
export function isDtFreeTextValue(value: any): value is DtFreeTextValue {
  return typeof value === 'string';
}

/** One of the categories of values that one filter tag can be */
export type DtAutocompleteValue<T> = DtNodeDef<T> & { option: DtOptionDef };

/** Checks if a given value is of category DtAutocompleteValue */
export function isDtAutocompleteValue<T>(
  value: any,
): value is DtAutocompleteValue<T> {
  return isDtOptionDef(value);
}

/** One of the categories of values that one filter tag can be */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface DtRangeValue {
  range: number | [number, number];
  operator: string;
  unit?: string;
}

/** Checks if a given value is of category DtRangeValue */
export function isDtRangeValue(value: any): value is DtRangeValue {
  return (
    isObject(value) &&
    value.hasOwnProperty('operator') &&
    value.hasOwnProperty('range')
  );
}

/** @internal */
export type DtMultiSelectValue<T> = DtNodeDef<T> & {
  multiOptions: DtOptionDef[];
};
/** Checks if a given value is of category DtMultiSelectValue */
export function isDtMultiSelectValue<T>(
  value: any,
): value is DtMultiSelectValue<T> {
  return (
    isObject(value) &&
    value.hasOwnProperty('multiSelect') &&
    value.multiSelect !== void 0 &&
    value.multiSelect !== null
  );
}

/** @internal */
export type _DtFilterValue =
  | DtAutocompleteValue<any>
  | DtFreeTextValue
  | DtRangeValue
  | DtMultiSelectValue<any>;

/** @internal */
export function _getSourceOfDtFilterValue<T>(value: DtFilterValue): T {
  return isDtNodeDef(value) ? value.data : value;
}

/** @internal */
export function _getSourcesOfDtFilterValues(values: DtFilterValue[]): any[] {
  return values.map((value) => _getSourceOfDtFilterValue<any>(value));
}
