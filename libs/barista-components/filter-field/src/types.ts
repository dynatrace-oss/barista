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

import { isDefined, isObject } from '@dynatrace/barista-components/core';

import { getDtFilterFieldRangeNoOperatorsError } from './filter-field-errors';
import { DtFilterFieldValidator } from './filter-field-validation';

// tslint:disable:no-bitwise no-magic-numbers no-any
export enum DtNodeFlags {
  None = 0,
  TypeAutocomplete = 1 << 0,
  TypeFreeText = 1 << 1,
  TypeOption = 1 << 2,
  TypeGroup = 1 << 3,
  TypeRange = 1 << 4,
  RenderTypes = TypeAutocomplete | TypeFreeText | TypeRange,
  Types = TypeAutocomplete | TypeFreeText | TypeOption | TypeGroup,
}

export interface DtNodeDef {
  nodeFlags: DtNodeFlags;
  autocomplete: DtAutocompleteDef | null;
  option: DtOptionDef | null;
  group: DtGroupDef | null;
  operator: DtOperatorDef | null;
  freeText: DtFreeTextDef | null;
  range: DtRangeDef | null;
  // tslint:disable-next-line: no-any
  data: any;
}

export interface DtAutocompleteDef {
  distinct: boolean;
  async: boolean;
  operators: DtNodeDef[];
  optionsOrGroups: DtNodeDef[];
}

export interface DtFreeTextDef {
  suggestions: DtNodeDef[];
  validators: DtFilterFieldValidator[];
  unique: boolean;
}

export interface DtGroupDef {
  label: string;
  options: DtNodeDef[];
  parentAutocomplete: DtNodeDef | null;
}

export interface DtOptionDef {
  viewValue: string;
  uid: string | null;
  parentGroup: DtNodeDef | null;
  parentAutocomplete: DtNodeDef | null;
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
export function dtRangeDef(
  data: any,
  existingNodeDef: DtNodeDef | null,
  hasRangeOperator: boolean,
  hasEqualOperator: boolean,
  hasGreaterEqualOperator: boolean,
  hasLowerEqualOperator: boolean,
  unit: string,
  unique: boolean,
): DtNodeDef {
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
export function isDtRangeDef(def: any): def is DtNodeDef & DtRangeDef {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeRange);
}

/** Creates a new DtAutocompleteDef onto a provided existing NodeDef or a newly created one. */
export function dtAutocompleteDef(
  data: any,
  existingNodeDef: DtNodeDef | null,
  optionsOrGroups: DtNodeDef[],
  distinct: boolean,
  async: boolean,
): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    autocomplete: { optionsOrGroups, distinct, async, operators: [] },
  };
  def.nodeFlags |= DtNodeFlags.TypeAutocomplete;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an AutocompleteDef */
export function isDtAutocompleteDef(
  def: any,
): def is DtNodeDef & { autocomplete: DtAutocompleteDef } {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeAutocomplete);
}

export function isAsyncDtAutocompleteDef(
  def: any,
): def is DtNodeDef & { autocomplete: DtAutocompleteDef; option: DtOptionDef } {
  return (
    isDtAutocompleteDef(def) && isDtOptionDef(def) && def.autocomplete.async
  );
}

/** Creates a new DtOptionDef onto a provided existing NodeDef or a newly created one. */
export function dtOptionDef(
  data: any,
  existingNodeDef: DtNodeDef | null,
  viewValue: string,
  uid: string | null,
  parentAutocomplete: DtNodeDef | null,
  parentGroup: DtNodeDef | null,
): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    option: {
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
export function isDtOptionDef(
  def: any,
): def is DtNodeDef & { option: DtOptionDef } {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeOption);
}

/** Creates a new DtGroupDef onto a provided existing NodeDef or a newly created one. */
export function dtGroupDef(
  data: any,
  existingNodeDef: DtNodeDef | null,
  label: string,
  options: DtNodeDef[],
  parentAutocomplete: DtNodeDef | null,
): DtNodeDef {
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
export function isDtGroupDef(
  def: any,
): def is DtNodeDef & { group: DtGroupDef } {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeGroup);
}

/** Creates a new DtFreeTextDef onto a provided existing NodeDef or a newly created one. */
export function dtFreeTextDef(
  data: any,
  existingNodeDef: DtNodeDef | null,
  suggestions: DtNodeDef[],
  validators: DtFilterFieldValidator[],
  unique: boolean,
): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    freeText: { suggestions, validators, unique },
  };
  def.nodeFlags |= DtNodeFlags.TypeFreeText;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an FreeTextDef */
export function isDtFreeTextDef(
  def: any,
): def is DtNodeDef & { freeText: DtFreeTextDef } {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeFreeText);
}

/** Whether the provided def object is of type RenderType */
export function isDtRenderType(def: any): def is DtNodeDef {
  return isDtNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.RenderTypes);
}

/** Creates a new DtNodeDef or returns the provided existing one. */
function nodeDef(data: any, existingNodeDef: DtNodeDef | null): DtNodeDef {
  return (
    existingNodeDef || {
      nodeFlags: 0,
      autocomplete: null,
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
export function isDtNodeDef(def: any): def is DtNodeDef {
  return isObject(def) && isDefined(def.nodeFlags);
}

/** @internal Holds all the view values and the original filter source for providing it to the DtFilterFieldTag to display. */
// tslint:disable-next-line: class-name
export class _DtFilterFieldTagData {
  constructor(
    public key: string | null,
    public value: string | null,
    public separator: string | null,
    public isFreeText: boolean,
    public filterValues: _DtFilterValue[],
    public editable: boolean = true,
    public deletable: boolean = true,
  ) {}
}

/** @internal */
export type _DtFreeTextValue = string;

/** @internal */
export function isDtFreeTextValue(value: any): value is _DtFreeTextValue {
  return typeof value === 'string';
}

/** @internal */
export type _DtAutocompleteValue = DtNodeDef & { option: DtOptionDef };

/** @internal */
export function _isDtAutocompleteValue(
  value: any,
): value is _DtAutocompleteValue {
  return isDtOptionDef(value);
}

/** @internal */
// tslint:disable-next-line: class-name
export interface _DtRangeValue {
  range: number | [number, number];
  operator: string;
  unit?: string;
}

/** @internal */
export function _isDtRangeValue(value: any): value is _DtRangeValue {
  return (
    isObject(value) &&
    value.hasOwnProperty('operator') &&
    value.hasOwnProperty('range')
  );
}

/** @internal */
export type _DtFilterValue =
  | _DtAutocompleteValue
  | _DtFreeTextValue
  | _DtRangeValue;

/** @internal */
export function _getSourceOfDtFilterValue<T>(value: _DtFilterValue): T {
  return isDtNodeDef(value) ? value.data : value;
}

/** @internal */
export function _getSourcesOfDtFilterValues(values: _DtFilterValue[]): any[] {
  return values.map(value => _getSourceOfDtFilterValue<any>(value));
}
