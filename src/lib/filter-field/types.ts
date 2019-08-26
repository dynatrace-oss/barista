import { isDefined, isObject } from '@dynatrace/angular-components/core';

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
  // @breaking-change 5.0.0 To be non optional
  validators?: DtFilterFieldValidator[];
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
}

/** Creates a new DtRangeDef onto a provided existing NodeDef or a newly created one. */
export function dtRangeDef(
  hasRangeOperator: boolean,
  hasEqualOperator: boolean,
  hasGreaterEqualOperator: boolean,
  hasLowerEqualOperator: boolean,
  unit: string,
  data: any,
  existingNodeDef: DtNodeDef | null,
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
  optionsOrGroups: DtNodeDef[],
  distinct: boolean,
  async: boolean,
  data: any,
  existingNodeDef: DtNodeDef | null,
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
  viewValue: string,
  data: any,
  uid: string | null,
  existingNodeDef: DtNodeDef | null,
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
  label: string,
  options: DtNodeDef[],
  data: any,
  existingNodeDef: DtNodeDef | null,
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

/**
 * @deprecated
 * Creates a new DtFreeTextDef onto a provided existing NodeDef or a newly created one.
 *
 * @breaking-change 5.0.0 To be removed, validators required
 */
export function dtFreeTextDef(
  suggestions: DtNodeDef[],
  data: any,
  existingNodeDef: DtNodeDef | null,
): DtNodeDef;

/** Creates a new DtFreeTextDef onto a provided existing NodeDef or a newly created one. */
export function dtFreeTextDef(
  suggestions: DtNodeDef[],
  validators: DtFilterFieldValidator[],
  data: any,
  existingNodeDef: DtNodeDef | null,
): DtNodeDef;

export function dtFreeTextDef(
  suggestions: DtNodeDef[],
  dataOrValidators: any | DtFilterFieldValidator[],
  existingNodeDefOrData: DtNodeDef | null,
  existingNodeDef: DtNodeDef | null = null,
): DtNodeDef {
  let data: any = dataOrValidators;
  let validators: DtFilterFieldValidator[] = [];
  let currentNodeDef: DtNodeDef | null = existingNodeDefOrData;
  if (!isDtNodeDef(existingNodeDefOrData)) {
    data = existingNodeDefOrData;
    validators = dataOrValidators;
    currentNodeDef = existingNodeDef;
  }

  const def = {
    ...nodeDef(data, currentNodeDef),
    freeText: { suggestions, validators },
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
export class DtFilterFieldTagData {
  constructor(
    public key: string | null,
    public value: string | null,
    public separator: string | null,
    public isFreeText: boolean,
    public filterValues: DtFilterValue[],
  ) {}
}

/** @internal */
export type DtFreeTextValue = string;

/** @internal */
export function isDtFreeTextValue(value: any): value is DtFreeTextValue {
  return typeof value === 'string';
}

/** @internal */
export type DtAutocompletValue = DtNodeDef & { option: DtOptionDef };

/** @internal */
export function isDtAutocompletValue(value: any): value is DtAutocompletValue {
  return isDtOptionDef(value);
}

/** @internal */
export interface DtRangeValue {
  range: number | [number, number];
  operator: string;
  unit?: string;
}

/** @internal */
export function isDtRangeValue(value: any): value is DtRangeValue {
  return (
    isObject(value) &&
    value.hasOwnProperty('operator') &&
    value.hasOwnProperty('range')
  );
}

/** @internal */
export type DtFilterValue = DtAutocompletValue | DtFreeTextValue | DtRangeValue;

export function getSourceOfDtFilterValue<T>(value: DtFilterValue): T {
  return isDtNodeDef(value) ? value.data : value;
}
export function getSourcesOfDtFilterValues(values: DtFilterValue[]): any[] {
  return values.map(value => getSourceOfDtFilterValue<any>(value));
}
