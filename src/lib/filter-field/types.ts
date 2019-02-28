import { isDefined, isObject } from '@dynatrace/angular-components/core';

// tslint:disable:no-bitwise no-magic-numbers no-any
export enum DtNodeFlags {
  None = 0,
  TypeAutocomplete = 1 << 0,
  TypeFreeText = 1 << 1,
  TypeOption = 1 << 2,
  TypeGroup = 1 << 3,
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
  distinctId: string | null;
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

const enum DtRangeOperatorFlags {
  Equal = 1 << 0,
  LowerEqual = 1 << 1,
  GreatEqual = 1 << 2,
  Range = 1 << 3,
  Types = Equal | LowerEqual | GreatEqual | Range,
}

export interface DtRangeDef {
  operatorFlags: DtRangeOperatorFlags;
}

/** Creates a new DtAutocompleteDef onto a provided existing NodeDef or a newly created one. */
export function dtAutocompleteDef(
  optionsOrGroups: DtNodeDef[], distinct: boolean, data: any, existingNodeDef: DtNodeDef | null): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    autocomplete: { optionsOrGroups, distinct, operators: [] },
  };
  def.nodeFlags |= DtNodeFlags.TypeAutocomplete;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an AutocompleteDef */
export function isDtAutocompleteDef(def: any): def is DtNodeDef & { autocomplete: DtAutocompleteDef } {
  return isNodeDef(def) && !!(def.nodeFlags & DtNodeFlags.TypeAutocomplete);
}

/** Creates a new DtOptionDef onto a provided existing NodeDef or a newly created one. */
export function dtOptionDef(
  viewValue: string,
  data: any,
  existingNodeDef: DtNodeDef | null,
  parentAutocomplete: DtNodeDef | null,
  parentGroup: DtNodeDef | null): DtNodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    option: {
      viewValue,
      distinctId: null,
      parentAutocomplete,
      parentGroup,
    },
  };
  def.nodeFlags |= DtNodeFlags.TypeOption;
  return def;
}

/** Whether the provided def object is of type NodeDef and consists of an OptionDef */
export function isDtOptionDef(def: DtNodeDef): def is DtNodeDef & { option: DtOptionDef } {
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

// ######################################
//     DATA
// ######################################

export interface DtNodeData {
  def: DtNodeDef;
  autocomplete: DtAutocompleteData | null;
  freeText: DtFreeTextData | null;
  group: DtGroupData | null;
  option: DtOptionData | null;
  range: DtRangeData | null;
}

export interface DtAutocompleteData {
  optionsOrGroups: DtNodeData[];
  selectedOption: DtNodeData | null;
}

export interface DtFreeTextData {
  suggestions: DtNodeData[];
  selectedSuggestion: DtNodeData | null;
  textValue: string | null;
}

export interface DtGroupData {
  label: string;
  options: DtNodeData[];
}

export interface DtOptionData {
  viewValue: string;
}

export interface DtRangeData {
  value: number |  null;
  minValue: number | null;
  maxValue: number | null;
}

export interface DtFilterDataViewValues {
  key: string | null;
  value: string | null;
  separator: string | null;
}

export interface DtFilterData {
  nodes: DtNodeData[];
  viewValues: DtFilterDataViewValues;
}

export function dtAutocompleteData(def: DtNodeDef, optionsOrGroups: DtNodeData[]): DtNodeData {
  return {
    ...nodeData(def),
    autocomplete: { optionsOrGroups, selectedOption: null },
  };
}

/** Whether the provided NodeData object is of type AutocompleteData */
export function isDtAutocompleteData(data: any): data is DtNodeData & { autocomplete: DtAutocompleteData } {
  return isNodeData(data) && isDtAutocompleteDef(data.def);
}

export function dtGroupData(def: DtNodeDef, options: DtNodeData[]): DtNodeData {
  return {
    ...nodeData(def),
    group: { label: def.group!.label, options },
  };
}

/** Whether the provided NodeData object is of type GroupData */
export function isDtGroupData(data: any): data is DtNodeData & { group: DtGroupData } {
  return isNodeData(data) && isDtGroupDef(data.def);
}

export function dtOptionData(def: DtNodeDef): DtNodeData {
  return {
    ...nodeData(def),
    option: { viewValue: def.option!.viewValue },
  };
}

/** Whether the provided NodeData object is of type OptionData */
export function isDtOptionData(data: any): data is DtNodeData & { option: DtOptionData } {
  return isNodeData(data) && isDtOptionDef(data.def);
}

export function dtFreeTextData(def: DtNodeDef, suggestions: DtNodeData[]): DtNodeData {
  return {
    ...nodeData(def),
    freeText: { suggestions, selectedSuggestion: null, textValue: null },
  };
}

/** Whether the provided NodeData object is of type FreeTextData */
export function isDtFreeTextData(data: any): data is DtNodeData & { freeText: DtFreeTextData } {
  return isNodeData(data) &&  isDtFreeTextDef(data.def);
}

/** Whether the provided data object is a render type. */
export function isDtRenderTypeData(data: any): data is DtNodeData {
  return isNodeData(data) && isDtRenderType(data.def);
}

/** Creates a new NodeData object based on a node definition. */
function nodeData(def: DtNodeDef): DtNodeData {
  return {
    def,
    autocomplete: null,
    freeText: null,
    group: null,
    option: null,
    range: null,
  };
}

/** Whether the provided data object is of type NodeData. */
function isNodeData(data: any): data is DtNodeData {
  return isObject(data) && isNodeDef(data.def);
}

/** Create a new filter data object based on a NodeData list. */
export function dtFilterData(nodes: DtNodeData[]): DtFilterData {
  return { nodes, viewValues: { key: null, value: null, separator: null } };
}

/** Returns the view value of a provided NodeData object. */
export function getDtNodeDataViewValue(data: DtNodeData): string | null {
  if (isDtAutocompleteData(data)) {
    return data.autocomplete.selectedOption && data.autocomplete.selectedOption.option!.viewValue || null;
  } else if (isDtFreeTextData(data)) {
    return data.freeText.textValue || null;
  }
  return null;
}
