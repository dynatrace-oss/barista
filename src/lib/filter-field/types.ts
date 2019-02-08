import { isDefined, isObject } from '@dynatrace/angular-components/core';

// tslint:disable:no-bitwise no-magic-numbers no-any
export enum NodeFlags {
  None = 0,
  TypeAutocomplete = 1 << 0,
  TypeFreeText = 1 << 1,
  TypeOption = 1 << 2,
  TypeGroup = 1 << 3,
  RenderTypes = TypeAutocomplete | TypeFreeText,
  Types = TypeAutocomplete | TypeFreeText | TypeOption | TypeGroup,
}

export interface NodeDef {
  nodeFlags: NodeFlags;
  autocomplete: AutocompleteDef | null;
  option: OptionDef | null;
  group: GroupDef | null;
  operator: OperatorDef | null;
  freeText: FreeTextDef | null;
  range: RangeDef | null;
  // tslint:disable-next-line: no-any
  data: any;
}

export interface AutocompleteDef {
  distinct: boolean;
  operators: NodeDef[];
  optionsOrGroups: NodeDef[];
}

export interface FreeTextDef {
  suggestions: NodeDef[];
}

interface GroupDef {
  label: string;
  options: NodeDef[];
  parentAutocomplete: NodeDef | null;
}

export interface OptionDef {
  viewValue: string;
  distinctId: string | null;
  parentGroup: NodeDef | null;
  parentAutocomplete: NodeDef | null;
}

const enum OperatorTypes {
  And = 0,
  Or = 1,
  Not = 2,
  In = 4,
}

export interface OperatorDef {
  type: OperatorTypes;
}

const enum RangeOperatorFlags {
  Equal = 1 << 0,
  LowerEqual = 1 << 1,
  GreatEqual = 1 << 2,
  Range = 1 << 3,
  Types = Equal | LowerEqual | GreatEqual | Range,
}

export interface RangeDef {
  operatorFlags: RangeOperatorFlags;
}

export function autocompleteDef(
  optionsOrGroups: NodeDef[], distinct: boolean, data: any, existingNodeDef: NodeDef | null): NodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    autocomplete: { optionsOrGroups, distinct, operators: [] },
  };
  def.nodeFlags |= NodeFlags.TypeAutocomplete;
  return def;
}

/** Whether the provided def object is of type NodeDef */
export function isAutocompleteDef(def: any): def is NodeDef & { autocomplete: AutocompleteDef } {
  return isNodeDef(def) && !!(def.nodeFlags & NodeFlags.TypeAutocomplete);
}

export function optionDef(
  viewValue: string,
  data: any,
  existingNodeDef: NodeDef | null,
  parentAutocomplete: NodeDef | null,
  parentGroup: NodeDef | null): NodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    option: {
      viewValue,
      distinctId: null,
      parentAutocomplete,
      parentGroup,
    },
  };
  def.nodeFlags |= NodeFlags.TypeOption;
  return def;
}

export function isOptionDef(def: NodeDef): def is NodeDef & { option: OptionDef } {
  return isNodeDef(def) && !!(def.nodeFlags & NodeFlags.TypeOption);
}

export function groupDef(
  label: string, options: NodeDef[], data: any, existingNodeDef: NodeDef | null, parentAutocomplete: NodeDef | null): NodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    group: {
      label,
      options,
      parentAutocomplete,
    },
  };
  def.nodeFlags |= NodeFlags.TypeGroup;
  return def;
}

export function isGroupDef(def: any): def is NodeDef & { group: GroupDef } {
  return isNodeDef(def) && !!(def.nodeFlags & NodeFlags.TypeGroup);
}

export function freeTextDef(suggestions: NodeDef[], data: any, existingNodeDef: NodeDef | null): NodeDef {
  const def = {
    ...nodeDef(data, existingNodeDef),
    freeText: { suggestions },
  };
  def.nodeFlags |= NodeFlags.TypeFreeText;
  return def;
}

export function isFreeTextDef(def: NodeDef): def is NodeDef & { freeText: FreeTextDef } {
  return isNodeDef(def) && !!(def.nodeFlags & NodeFlags.TypeFreeText);
}

function nodeDef(data: any, existingNodeDef: NodeDef | null): NodeDef {
  // if (existingNodeDef && data && existingNodeDef.data !== data) {
  //   throw new Error('TODO');
  // }

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

function isNodeDef(def: any): def is NodeDef {
  return isObject(def) && isDefined(def.nodeFlags);
}

// ######################################
//     DATA
// ######################################

export interface NodeData {
  def: NodeDef;
  autocomplete: AutocompleteData | null;
  freeText: FreeTextData | null;
  group: GroupData | null;
  option: OptionData | null;
  range: RangeData | null;
}

export interface AutocompleteData {
  optionsOrGroups: NodeData[];
  selectedOption: NodeData | null;
}

export interface FreeTextData {
  suggestions: NodeData[];
  selectedSuggestion: NodeData | null;
  textValue: string | null;
}

export interface GroupData {
  label: string;
  options: NodeData[];
}

export interface OptionData {
  viewValue: string;
}

export interface RangeData {
  value: number |  null;
  minValue: number | null;
  maxValue: number | null;
}

export interface FilterDataViewValues {
  key: string | null;
  value: string | null;
  separator: string | null;
}

export interface FilterData {
  nodes: NodeData[];
  viewValues: FilterDataViewValues;
}

export function autocompleteData(def: NodeDef, optionsOrGroups: NodeData[]): NodeData {
  return {
    ...nodeData(def),
    autocomplete: { optionsOrGroups, selectedOption: null },
  };
}

/** Whether the provided NodeData object is of type AutocompleteData */
export function isAutocompleteData(data: any): data is NodeData & { autocomplete: AutocompleteData } {
  return isNodeData(data) && isAutocompleteDef(data.def);
}

export function groupData(def: NodeDef, options: NodeData[]): NodeData {
  return {
    ...nodeData(def),
    group: { label: def.group!.label, options },
  };
}

/** Whether the provided NodeData object is of type GroupData */
export function isGroupData(data: any): data is NodeData & { group: GroupData } {
  return isNodeData(data) && isGroupDef(data.def);
}

export function optionData(def: NodeDef): NodeData {
  return {
    ...nodeData(def),
    option: { viewValue: def.option!.viewValue },
  };
}

/** Whether the provided NodeData object is of type OptionData */
export function isOptionData(data: any): data is NodeData & { option: OptionData } {
  return isNodeData(data) && isOptionDef(data.def);
}

export function freeTextData(def: NodeDef, suggestions: NodeData[]): NodeData {
  return {
    ...nodeData(def),
    freeText: { suggestions, selectedSuggestion: null, textValue: null },
  };
}

/** Whether the provided NodeData object is of type FreeTextData */
export function isFreeTextData(data: any): data is NodeData & { freeText: FreeTextData } {
  return isNodeData(data) &&  isFreeTextDef(data.def);
}

function nodeData(def: NodeDef): NodeData {
  return {
    def,
    autocomplete: null,
    freeText: null,
    group: null,
    option: null,
    range: null,
  };
}

function isNodeData(data: any): data is NodeData {
  return isObject(data) && isNodeDef(data.def);
}

export function filterData(nodes: NodeData[]): FilterData {
  return { nodes, viewValues: { key: null, value: null, separator: null } };
}

export function getNodeDataViewValue(data: NodeData): string | null {
  if (isAutocompleteData(data)) {
    return data.autocomplete.selectedOption && data.autocomplete.selectedOption.option!.viewValue || null;
  } else if (isFreeTextData(data)) {
    return data.freeText.textValue || null;
  }
  return null;
}
