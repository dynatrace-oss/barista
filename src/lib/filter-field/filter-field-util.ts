import { DtNodeDef, isDtGroupDef, isDtOptionDef, isDtAutocompleteDef, dtGroupDef, dtAutocompleteDef, dtFreeTextData, dtFreeTextDef, DtFilterFieldSource, DtFilterFieldTagData, isDtFreeTextDef } from './types';

export function filterAutocompleteDef(def: DtNodeDef, distinctIds: Set<string>, filterText?: string): DtNodeDef | null {
  const optionsOrGroups = def.autocomplete!.optionsOrGroups
    .map((optionOrGroup) => isDtGroupDef(optionOrGroup) ?
      filterGroupDef(optionOrGroup, distinctIds, filterText) : filterOptionDef(optionOrGroup, distinctIds, filterText))
    .filter((optionOrGroup) => optionOrGroup !== null) as DtNodeDef[];
  return optionsOrGroups.length ? dtAutocompleteDef(optionsOrGroups, def.autocomplete!.distinct, def.data, def) : null;
}

export function filterFreeTextDef(def: DtNodeDef, filterText?: string): DtNodeDef {
  const suggestions = def.freeText!.suggestions ?
    def.freeText!.suggestions.filter((option) => filterOptionDef(option, new Set(), filterText)) : [];
  return dtFreeTextDef(suggestions, def.data, def);
}

function filterGroupDef(def: DtNodeDef, distinctIds: Set<string>, filterText?: string): DtNodeDef | null {
  const options = def.group!.options.filter((option) => filterOptionDef(option, distinctIds, filterText));
  return options.length ? dtGroupDef(def.group!.label, options, def.data, def, def.group!.parentAutocomplete) : null;
}

function filterOptionDef(def: DtNodeDef, distinctIds: Set<string>, filterText?: string): DtNodeDef | null  {
  return defDistinctPredicate(def, distinctIds) &&  optionFilterTextPredicate(def, filterText || '') ? def : null;
}

/** Predicate function to check whether the provided node def should be in the filtered result. */
function defDistinctPredicate(def: DtNodeDef, distinctIds: Set<string>): boolean {
  if (isDtGroupDef(def)) {
    return def.group.options.some((option) => defDistinctPredicate(option, distinctIds));
  }

  // Check whether option should be filtered out
  // (when its distinct value is listed in the distinctIds and the parent autocomplete is marked as distinct)
  if (isDtOptionDef(def) && !optionDistinctPredicate(def, distinctIds)) {
    return false;
  }

  if (isDtAutocompleteDef(def)) {
    return def.autocomplete.optionsOrGroups.some((optionOrGroup) =>
      defDistinctPredicate(optionOrGroup, distinctIds));
  }
  return true;
}

/** Predicate function for filtering options based on their distinct id. */
function optionDistinctPredicate(def: DtNodeDef, distinctIds: Set<string>): boolean {
  return !(def.option!.distinctId &&
    distinctIds.has(def.option!.distinctId!) &&
    isDtAutocompleteDef(def.option!.parentAutocomplete) &&
    def.option!.parentAutocomplete!.autocomplete!.distinct);
}

/** Predicate function for filtering options based on the view value and the text inserted by the user. */
function optionFilterTextPredicate(def: DtNodeDef, filterText: string): boolean {
  // Transform the filter and viewValue by converting it to lowercase and removing whitespace.
  const transformedFilter = filterText.trim().toLowerCase();
  const transformedViewValue = def.option!.viewValue.trim().toLowerCase();
  return !transformedFilter.length || transformedViewValue.indexOf(transformedFilter) !== -1;
}

export function transformSourceToTagData(sources: DtFilterFieldSource[], rootDef: DtNodeDef): DtFilterFieldTagData | null {
  let def = rootDef;
  let key: string | null = null;
  let value: string | null = null;
  let separator: string | null = null;

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const newDef = findDefForSourceObj(source, def);
    if (newDef === null) {
      return null;
    }
    def = newDef;
    if (i === 0 && sources.length > 1) {
      key = typeof source === 'string' ? source : def.option!.viewValue;
    }
    value = typeof source === 'string' ? source : def.option!.viewValue;
  }

  if (isDtFreeTextDef(def)) {
    value = `"${value}"`;
    if (sources.length > 1) {
      separator = '~';
    }
  }
  return sources.length ? new DtFilterFieldTagData(key, value, separator, sources[0]) : null;
}

function findDefForSourceObj(source: DtFilterFieldSource, def: DtNodeDef): DtNodeDef | null {
  if (isDtAutocompleteDef(def)) {
    for (const optionOrGroup of def.autocomplete.optionsOrGroups) {
      if (isDtOptionDef(optionOrGroup) && optionOrGroup.data === source) {
        return optionOrGroup;
      } else if (isDtGroupDef(optionOrGroup)) {
        for (const option of optionOrGroup.group.options) {
          if (option.data === source) {
            return option;
          }
        }
      }
    }
  }
  return null;
}
