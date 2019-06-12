import { isDefined, isObject } from '@dynatrace/angular-components/core';
import { getDtFilterFieldRangeNoOperatorsError } from './filter-field-errors';

// tslint:disable:no-bitwise no-magic-numbers no-any
export enum DtNodeFlags {
  None = 0,
  TypeAutocomplete = 1 << 0,
  TypeFreeText = 1 << 1,
  TypeOption = 1 << 2,
  TypeGroup = 1 << 3,
  TypeRange = 1 << 4,
  RenderTypes = TypeAutocomplete | TypeFreeText,
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
  existingNodeDef: DtNodeDef | null
): DtNodeDef {
  // if none of the operators are defined, throw an error.
  if (
    !(hasRangeOperator ||
      hasEqualOperator ||
      hasLowerEqualOperator ||
      hasGreaterEqualOperator)
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
export function isDtRangeDef(def: any): def is DtRangeDef {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeRange);
}

/** Creates a new DtAutocompleteDef onto a provided existing NodeDef or a newly created one. */
export function dtAutocompleteDef(
  optionsOrGroups: DtNodeDef[], distinct: boolean, async: boolean, data: any, existingNodeDef: DtNodeDef | null): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    autocomplete: { optionsOrGroups, distinct, async, operators: [] },
  };
  def.nodeFlags |= DtNodeFlags.TypeAutocomplete;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an AutocompleteDef */
export function isDtAutocompleteDef(def: any): def is DtNodeDef & { autocomplete: DtAutocompleteDef } {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeAutocomplete);
}

export function isAsyncDtAutocompleteDef(def: any): def is DtNodeDef & { autocomplete: DtAutocompleteDef } {
  return isDtAutocompleteDef(def) && def.autocomplete.async;
}

/** Creates a new DtOptionDef onto a provided existing NodeDef or a newly created one. */
export function dtOptionDef(
  viewValue: string,
  data: any,
  uid: string | null,
  existingNodeDef: DtNodeDef | null,
  parentAutocomplete: DtNodeDef | null,
  parentGroup: DtNodeDef | null): DtNodeDef {
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
export function isDtOptionDef(def: any): def is DtNodeDef & { option: DtOptionDef } {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeOption);
}

/** Creates a new DtGroupDef onto a provided existing NodeDef or a newly created one. */
export function dtGroupDef(
  label: string,
  options: DtNodeDef[],
  data: any,
  existingNodeDef: DtNodeDef | null,
  parentAutocomplete: DtNodeDef | null
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
export function isDtGroupDef(def: any): def is DtNodeDef & { group: DtGroupDef } {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeGroup);
}

/** Creates a new DtFreeTextDef onto a provided existing NodeDef or a newly created one. */
export function dtFreeTextDef(suggestions: DtNodeDef[], data: any, existingNodeDef: DtNodeDef | null): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    freeText: { suggestions },
  };
  def.nodeFlags |= DtNodeFlags.TypeFreeText;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an FreeTextDef */
export function isDtFreeTextDef(def: any): def is DtNodeDef & { freeText: DtFreeTextDef } {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeFreeText);
}

/** Whether the provided def object is of type RenderType */
export function isDtRenderType(def: any): def is DtNodeDef {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.RenderTypes);
}

/** Creates a new DtNodeDef or returns the provided existing one. */
function nodeDef(data: any, existingNodeDef: DtNodeDef | null): DtNodeDef {
  return existingNodeDef || {
    nodeFlags: 0,
    autocomplete: null,
    freeText: null,
    option: null,
    group: null,
    operator: null,
    range: null,
    data,
  };
}

/** Whether the provided def object is of type NodeDef */
function isNodeDef(def: any): def is DtNodeDef {
  return isObject(def) && isDefined(def.nodeFlags);
}

/** Holds all the view values and the original filter source for providing it to the DtFilterFieldTag to display. */
export class DtFilterFieldTagData {
  constructor(
    public key: string | null,
    public value: string | null,
    public separator: string | null,
    public filterSources: any[],
    public isFreeText: boolean) {}
}
