import {
  DtNodeDef,
  isDtGroupDef,
  isDtOptionDef,
  isDtAutocompleteDef,
  dtGroupDef,
  dtAutocompleteDef,
  dtFreeTextDef,
  DtFilterFieldTagData,
  isDtFreeTextDef,
  isDtRenderType,
  isDtRangeDef,
} from './types';

/**
 * Either returns the provided autocomplete def or null on whether the autocomplete still contains
 * options or groups after filtering them based on the predicate functions below.
 */
export function filterAutocompleteDef(def: DtNodeDef, distinctIds: Set<string>, filterText?: string): DtNodeDef | null {
  const optionsOrGroups = def.autocomplete!.optionsOrGroups
    .map((optionOrGroup) => isDtGroupDef(optionOrGroup) ?
      filterGroupDef(optionOrGroup, distinctIds, filterText) : filterOptionDef(optionOrGroup, distinctIds, filterText))
    .filter((optionOrGroup) => optionOrGroup !== null) as DtNodeDef[];
  return def.autocomplete!.async || optionsOrGroups.length ?
    dtAutocompleteDef(optionsOrGroups, def.autocomplete!.distinct, def.autocomplete!.async , def.data, def) : null;
}

/** Filters the list of suggestions (options) based on the predicate functions below. */
export function filterFreeTextDef(def: DtNodeDef, filterText?: string): DtNodeDef {
  const suggestions = def.freeText!.suggestions ?
    def.freeText!.suggestions.filter((option) => filterOptionDef(option, new Set(), filterText)) : [];
  return dtFreeTextDef(suggestions, def.data, def);
}

/**
 * Either returns the provided group def or null on whether the group still contains options
 * after filtering them based on the predicate functions below.
 */
export function filterGroupDef(def: DtNodeDef, selectedOptionIds: Set<string>, filterText?: string): DtNodeDef | null {
  const options = def.group!.options.filter((option) => filterOptionDef(option, selectedOptionIds, filterText));
  return options.length ? dtGroupDef(def.group!.label, options, def.data, def, def.group!.parentAutocomplete) : null;
}

/** Either returns the provided option def or null based on the predicate functions below. */
export function filterOptionDef(def: DtNodeDef, selectedOptionIds: Set<string>, filterText?: string): DtNodeDef | null {
  return defDistinctPredicate(
    def,
    selectedOptionIds,
    !!def.option!.parentAutocomplete && def.option!.parentAutocomplete.autocomplete!.distinct
  ) && optionFilterTextPredicate(def, filterText || '') ? def : null;
}

/** Predicate function to check whether the provided node def should be in the filtered result. */
export function defDistinctPredicate(def: DtNodeDef, selectedOptionIds: Set<string>, isDistinct: boolean): boolean {
  if (isDtGroupDef(def)) {
    return optionOrGroupListFilteredPredicate(def.group.options, selectedOptionIds, isDistinct);
  }

  if (isDtOptionDef(def) && !optionOrGroupFilteredPredicate(def, selectedOptionIds, isDistinct)) {
    return false;
  }

  if (isDtAutocompleteDef(def)) {
    return def.autocomplete.async ||
      optionOrGroupListFilteredPredicate(def.autocomplete.optionsOrGroups, selectedOptionIds, def.autocomplete.distinct);
  }
  return true;
}

/** Whether a filtered list of options or groups contains items. */
export function optionOrGroupListFilteredPredicate(
  optionsOrGroups: DtNodeDef[],
  selectedOptionIds: Set<string>,
  isDistinct: boolean
): boolean {
  if (isDistinct) {
    return !optionsOrGroups.some((optionOrGroup) => !optionOrGroupFilteredPredicate(optionOrGroup, selectedOptionIds, isDistinct));
  }
  return optionsOrGroups.some((optionOrGroup) => optionOrGroupFilteredPredicate(optionOrGroup, selectedOptionIds, isDistinct));
}

/** Whether an option or Group is filtered (visible) */
export function optionOrGroupFilteredPredicate(
  optionOrGroup: DtNodeDef,
  selectedOptionIds: Set<string>,
  isDistinct: boolean
): boolean {
  return isDtGroupDef(optionOrGroup) ?
    optionOrGroupListFilteredPredicate(optionOrGroup.group.options, selectedOptionIds, isDistinct) :
    optionSelectedPredicate(optionOrGroup, selectedOptionIds, isDistinct);
}

/** Predicate function for filtering options based on their id. */
export function optionSelectedPredicate(def: DtNodeDef, selectedIds: Set<string>, isDistinct: boolean): boolean {
  return !(def.option!.uid && selectedIds.has(def.option!.uid) && (!isDtRenderType(def) || isDistinct));
}

/** Predicate function for filtering options based on the view value and the text inserted by the user. */
export function optionFilterTextPredicate(def: DtNodeDef, filterText: string): boolean {
  // Transform the filter and viewValue by converting it to lowercase and removing whitespace.
  const transformedFilter = filterText.trim().toLowerCase();
  const transformedViewValue = def.option!.viewValue.trim().toLowerCase();
  return !transformedFilter.length || transformedViewValue.indexOf(transformedFilter) !== -1;
}

/** Transforms a RangeSource to the Tag data values. */
// tslint:disable-next-line: no-any
function transformRangeSourceToTagData(source: any): { separator: string; value: string } {
  if (source.operator === 'range') {
    return {
      separator: ':',
      value: `${source.range[0]}${source.unit} - ${source.range[1]}${source.unit}`,
    };
  }
  let separator;
  switch (source.operator) {
    case 'equal':
      separator = '=';
      break;
    case 'greater-equal':
      separator = '≥';
      break;
    case 'lower-equal':
      separator = '≤';
      break;
    default:
      separator = '-';
  }
  const value = `${source.range}${source.unit}`;

  return { separator, value };
}

/**
 * Transforms a list of sources to TagData, looks up view values, ...
 * Used for displaying filters as tags.
 */
// tslint:disable-next-line:no-any
export function transformSourceToTagData(sources: any[], rootDef: DtNodeDef): DtFilterFieldTagData | null {
  let def = rootDef;
  let key: string | null = null;
  let value: string | null = null;
  let isFreeText = false;
  let separator: string | null = null;
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const newDef = findDefForSourceObj(source, def);

    if (newDef === null && isDtAutocompleteDef(def)) {
      break;
    }

    if (isDtFreeTextDef(def) && typeof source === 'string') {
      value = `${source}`;
      isFreeText = true;
      if (sources.length > 1) {
        separator = '~';
      }
      break;
    }

    if (isDtRangeDef(def) && source.hasOwnProperty('operator') && source.hasOwnProperty('range')) {
      // Assigning variables destructed variables to already defined ones needs to be within braces.
      ({ value, separator } = transformRangeSourceToTagData(source));
      break;
    }

    if (newDef !== null) {
      def = newDef;
      if (i === 0 && sources.length > 1) {
        key = typeof source === 'string' ? source : def.option!.viewValue;
      }
      value = typeof source === 'string' ? source : def.option!.viewValue;
    } else {
      break;
    }
  }

  return sources.length && value !== null ? new DtFilterFieldTagData(key, value, separator, sources, isFreeText) : null;
}

/** Tries to find a definition for the provided source. It will start the lookup at the provided def. */
// tslint:disable-next-line:no-any
export function findDefForSourceObj(source: any, def: DtNodeDef): DtNodeDef | null {
  if (isDtAutocompleteDef(def)) {
    for (const optionOrGroup of def.autocomplete.optionsOrGroups) {
      if (isDtOptionDef(optionOrGroup) && optionOrGroup.data === source) {
        return optionOrGroup;
      }
      if (isDtGroupDef(optionOrGroup)) {
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

// Use an obscure Unicode character to delimit the words in the concatenated string.
// This avoids matches where the values of two columns combined will match the user's query
// (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
// that has a very low chance of being typed in by somebody in a text field. This one in
// particular is "White up-pointing triangle with dot" from
// https://en.wikipedia.org/wiki/List_of_Unicode_characters
export const DELIMITER = '◬';

/** Peeks into a option node definition and returns its distinct id or creates a new one. */
export function peekOptionId(def: DtNodeDef, prefix?: string): string {
  const id = def.option!.uid ? def.option!.uid : generateOptionId(def, prefix);
  def.option!.uid = id;
  return id;
}

/** Generates a new option id for the provided node def. */
export function generateOptionId(def: DtNodeDef, prefix: string = ''): string {
  const groupRef = def.option!.parentGroup ? `${def.option!.parentGroup.group!.label}${DELIMITER}` : '';
  return `${prefix}${groupRef}${def.option!.viewValue}${DELIMITER}`;
}
