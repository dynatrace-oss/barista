import { BehaviorSubject, Observable, merge, of as observableOf, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { isObject } from '@dynatrace/angular-components/core';
import {
  DtFilterFieldDataSource,
  DtFilterFieldViewer,
  DtFilterFieldAutocompleteData,
  DtFilterFieldAutocompleteGroup,
  DtFilterFieldAutocompleteOption,
  DtFilterFieldData,
  DtFilterFieldFreeTextData,
  isDtFilterFieldAutocompleteGroup
} from './filter-field-data-source';
import {
  getDtFilterFieldDataSourceUnkownOptionOrGroupTypeError,
  getDtFilterFieldDataSourceUnkownOptionTypeError,
  getDtFilterFieldDataSourceUnknowdDataTypeError
} from './filter-field-data-source-errors';

/** Shape of an object to be usable as a option in an autocomplete */
type OptionData = { name: string } | string;

/** Whether the provided data object is of type OptionData */
// tslint:disable-next-line: no-any
function isOptionData(data: any): data is OptionData {
  return typeof data === 'string' || (isObject(data) && typeof data.name === 'string');
}

/** Shape of an object to be usable as a group in an autocomplete */
interface GroupData {
  name: string;
  options: OptionData[];
}

/** Whether the provided data object is of type GroupData */
// tslint:disable-next-line: no-any
function isGroupData(data: any): data is GroupData {
  return isObject(data) && typeof data.name === 'string' && Array.isArray(data.options);
}

/** Shape of an object to be usable as an autocomplete */
interface AutocompleteData {
  autocomplete: Array<OptionData | GroupData>;
  distinct?: boolean;
}

/** Whether the provided data object is of type AutocompleteData */
// tslint:disable-next-line: no-any
function isAutocompleteData(data: any): data is AutocompleteData {
  return isObject(data) && Array.isArray(data.autocomplete);
}

/** Shape of an object to be usable as a free text variant */
interface FreeTextData {
  suggestions: Array<OptionData | GroupData>;
}

/** Whether the provided data object is of type FreeTextData */
// tslint:disable-next-line: no-any
function isFreeTextData(data: any): data is FreeTextData {
  return isObject(data) && Array.isArray(data.suggestions);
}

const THROW_IF_NOT_TRANSFORMABLE = new Object();
const SLICED_DATA_NOT_TRANSFORMABLE_VALUE = new Object();

/**
 * DataSource that accepts a client side data object with a specific structure (descibed below)
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
 */
export class DtFilterFieldDefaultDataSource<T> extends DtFilterFieldDataSource<T> {

  private readonly _data: BehaviorSubject<T>;
  private readonly _autocompleteFilter = new BehaviorSubject<string>('');

  private _distinctDataRepresentations = new Set<string>();
  private _pathDataRepresentation = '';
  private _isDistinct = false;

  /** Structure of data that is used, transformed and rendered by the filter-field. */
  get data(): T { return this._data.value; }
  set data(data: T) {
    this._data.next(data);
  }

  /**
   * Used by the DtFilterField. Filter term that should be used to filter out objects from the autocomplete
   * data array.
   * To override how data objects match to this filter string, provide a custom function for autocompleteFilterPredicate.
   */
  get autocompleteFilter(): string { return this._autocompleteFilter.value; }
  set autocompleteFilter(filter: string) { this._autocompleteFilter.next(filter); }

  /**
   * Used by the DtFilterField.
   * Checks if an autocomplete option or group object matches the data source's filter string.
   */
  autocompleteFilterPredicate
  = (optionOrGroup: DtFilterFieldAutocompleteOption | DtFilterFieldAutocompleteGroup, filter: string): boolean => {
    if (isDtFilterFieldAutocompleteGroup(optionOrGroup)) {
      return !!optionOrGroup.options.length;
    }

    // Transform the data into a lowercase string of all property values.
    const dataStr = convertToStringRepresentation(optionOrGroup.data);

    // Transform the filter and viewValue by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();
    const transformedViewValue = optionOrGroup.viewValue.trim().toLowerCase();
    return transformedViewValue.indexOf(transformedFilter) !== -1 || dataStr.indexOf(transformedFilter) !== -1;
  }

  constructor(initialData: T = null as unknown as T) {
    super();
    this._data = new BehaviorSubject<T>(initialData);
  }

  /**
   * Used by the DtFilterField. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * diesplayed by the DtFilterFieldViewer (filter-field)
   */
  connect(viewer: DtFilterFieldViewer<T>): Observable<DtFilterFieldData> {
    const transformedData = this._data.pipe(map((data) => this._transformData(data)));
    return combineLatest(
      merge(transformedData, viewer.dataStateChanges.pipe(
        map((slicedData) => this._transformData(slicedData, SLICED_DATA_NOT_TRANSFORMABLE_VALUE)),
        switchMap((transformedSlicedData) => transformedSlicedData !== SLICED_DATA_NOT_TRANSFORMABLE_VALUE ?
          observableOf(transformedSlicedData) :
          transformedData.pipe(tap(() => { viewer.submitFilter(); }))
        )
      )),
      this._autocompleteFilter).pipe(map(([transformedDataObj]) => this._filterData(transformedDataObj)));
  }

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  disconnect(): void {
    this._distinctDataRepresentations.clear();
  }

  /** Transforms the provided data into an internal data structure that can be used by the filter-field. */
  // tslint:disable-next-line: no-any
  private _transformData(data: T | null, notTransformableValue: any = THROW_IF_NOT_TRANSFORMABLE): DtFilterFieldData {
    this._isDistinct = false;
    if (isAutocompleteData(data)) {
      return this._transformAutocomplete(data);
    } else if (isFreeTextData(data)) {
      return this._transformFreeText(data);
    } else if (data !== null) {
      if (notTransformableValue === THROW_IF_NOT_TRANSFORMABLE) {
        throw getDtFilterFieldDataSourceUnknowdDataTypeError(data);
      }
      return notTransformableValue;
    }
    return null;
  }

  /** Transforms a AutocompleteData object into an internal data structure that can be used by the filter-field. */
  private _transformAutocomplete(data: AutocompleteData): DtFilterFieldAutocompleteData {
    this._isDistinct = !!data.distinct;
    return {
      dataType: 'autocomplete',
      optionsOrGroups: this._transformOptionsAndGroups(data.autocomplete),
    };
  }

  /** Transforms a FreeTextData object into an internal data structure that can be used by the filter-field. */
  private _transformFreeText(data: FreeTextData): DtFilterFieldFreeTextData {
    return {
      dataType: 'free-text',
      suggestions: this._transformOptions(data.suggestions),
    };
  }

  /** Transforms an array of option or group objects into an internal data structure that can be used by the filter-field. */
  private _transformOptionsAndGroups(optionsOrGroups: Array<OptionData | GroupData>):
    Array<DtFilterFieldAutocompleteOption | DtFilterFieldAutocompleteGroup> {
    return optionsOrGroups.map((optionOrGroup) => {
      if (isGroupData(optionOrGroup)) {
        return this._transformGroup(optionOrGroup);
      } else if (isOptionData(optionOrGroup)) {
        return this._transformOption(optionOrGroup);
      }
      throw getDtFilterFieldDataSourceUnkownOptionOrGroupTypeError(optionOrGroup);
    });
  }

  /** Transforms a GroupData object into an internal data structure that can be used by the filter-field. */
  private _transformGroup(groupData: GroupData): DtFilterFieldAutocompleteGroup {
    return {
      dataType: 'group',
      viewValue: groupData.name,
      options: this._transformOptions(groupData.options),
    };
  }

  /** Transforms an array of OptionData objects into an internal data structure that can be used by the filter-field. */
  private _transformOptions(options: OptionData[]): DtFilterFieldAutocompleteOption[] {
    return options.map((optionData) => {
      if (isOptionData(optionData)) {
        return this._transformOption(optionData);
      }
      throw getDtFilterFieldDataSourceUnkownOptionTypeError(optionData);
    });
  }

  /** Transforms a OptionData object into an internal data structure that can be used by the filter-field. */
  private _transformOption(optionData: OptionData): DtFilterFieldAutocompleteOption {
    return { viewValue: typeof optionData === 'string' ? optionData : optionData.name, data: optionData, dataType: 'option' };
  }

  /**
   * Filters the autocomplete options, groups or free-text suggestions using the
   * provided autocompleteFilterPredicate function.
   */
  private _filterData(data: DtFilterFieldData): DtFilterFieldData {
    if (data) {
      const cloned = { ...data};
      switch (cloned.dataType) {
        case 'autocomplete': {
          cloned.optionsOrGroups = this._filterOptionsOrGroups(cloned.optionsOrGroups);
          return cloned;
        }
        case 'free-text': {
          if (cloned.suggestions) {
            cloned.suggestions = this._filterOptionsOrGroups(cloned.suggestions) as DtFilterFieldAutocompleteOption[];
          }
          return cloned;
        }
        default: return cloned;
      }
    }
    return data;
  }

  /** Filters options and groups using the provided autocompleteFilterPredicate function. */
  private _filterOptionsOrGroups(optionsOrGroups: Array<DtFilterFieldAutocompleteOption | DtFilterFieldAutocompleteGroup>):
    Array<DtFilterFieldAutocompleteOption | DtFilterFieldAutocompleteGroup> {
    return optionsOrGroups.map((optionOrGroup) => {
      if (isDtFilterFieldAutocompleteGroup(optionOrGroup)) {
        return {...optionOrGroup, options: this._filterOptionsOrGroups(optionOrGroup.options) as DtFilterFieldAutocompleteOption[]};
      }
      return optionOrGroup;
    }).filter((optionOrGroup) => this.autocompleteFilterPredicate(optionOrGroup, this.autocompleteFilter));
  }

  private _applyDistinctValue(data: T): void {
    const representation = convertToStringRepresentation(data, this._pathDataRepresentation, true);
    this._pathDataRepresentation = representation;
    if (!this._distinctDataRepresentations.has(representation)) {
      this._distinctDataRepresentations.add(representation);
    }
  }
}

// Use an obscure Unicode character to delimit the words in the concatenated string.
// This avoids matches where the values of two columns combined will match the user's query
// (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
// that has a very low chance of being typed in by somebody in a text field. This one in
// particular is "White up-pointing triangle with dot" from
// https://en.wikipedia.org/wiki/List_of_Unicode_characters
const DELIMITER = '◬';

// tslint:disable-next-line: no-any
function convertToStringRepresentation(obj: any, prefix: string = '', includeKeyNames: boolean = false): string {
  let value = typeof obj === 'string' ? obj : '';
  if (isObject(obj)) {
    // Transform the data into a lowercase string of all property values.
    value = Object.keys(obj).reduce(
      // tslint:disable-next-line: arrow-return-shorthand prefer-template
      (currentTerm: string, key: string) => currentTerm + (includeKeyNames ? key + DELIMITER : '') +
      // tslint:disable-next-line: restrict-plus-operands
        (!Array.isArray(obj[key]) ? obj[key] + DELIMITER : ''),
      '').toLowerCase();
  } else {
    value = String(obj);
  }
  return prefix ? prefix + DELIMITER + value : value;
}
