import { BehaviorSubject, Observable, merge, of as observableOf, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, filter, share } from 'rxjs/operators';
import { isObject } from '@dynatrace/angular-components/core';
import {
  DtFilterFieldDataSource,
} from './filter-field-data-source';
import {
  getDtFilterFieldDataSourceUnkownOptionOrGroupTypeError,
  getDtFilterFieldDataSourceUnkownOptionTypeError,
  getDtFilterFieldDataSourceUnknowdDataTypeError
} from './filter-field-data-source-errors';
import { NodeDef, autocompleteDef, optionDef, groupDef, NodeFlags, isAutocompleteDef, isGroupDef } from '../types';

/** Shape of an object to be usable as a option in an autocomplete */
type Option = { name: string } | string;

/** Whether the provided data object is of type OptionData */
// tslint:disable-next-line: no-any
function isOption(data: any): data is Option {
  return typeof data === 'string' || (isObject(data) && typeof data.name === 'string');
}

/** Shape of an object to be usable as a group in an autocomplete */
interface Group {
  name: string;
  options: Option[];
}

/** Whether the provided data object is of type GroupData */
// tslint:disable-next-line: no-any
function isGroup(data: any): data is Group {
  return isObject(data) && typeof data.name === 'string' && Array.isArray(data.options);
}

/** Shape of an object to be usable as an autocomplete */
interface Autocomplete {
  autocomplete: Array<Option | Group>;
  distinct?: boolean;
}

/** Whether the provided data object is of type AutocompleteData */
// tslint:disable-next-line: no-any
function isAutocomplete(data: any): data is Autocomplete {
  return isObject(data) && Array.isArray(data.autocomplete);
}

/** Shape of an object to be usable as a free text variant */
interface FreeText {
  suggestions: Array<Option | Group>;
}

/** Whether the provided data object is of type FreeTextData */
// tslint:disable-next-line: no-any
function isFreeText(data: any): data is FreeText {
  return isObject(data) && Array.isArray(data.suggestions);
}

// tslint:disable: no-bitwise

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
 * It is also possible to set a distinct property on the autocomplete object, so the user can select options only once:
 *  {
 *    distinct: true,
 *    autocomplete: [
 *      { name: "Option 1" },
 *      "Option 2"
 *    ]
 *  }
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
export class DtFilterFieldDefaultDataSource<T>{

  private readonly _data: BehaviorSubject<T>;
  private readonly _autocompleteFilter = new BehaviorSubject<string>('');

  private _distinctValues = new Set<string>();
  private _distinctValuesFromRoot = '';
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
  = (optionOrGroup: NodeDef, filter: string): boolean => {
    // if (isDtFilterFieldAutocompleteGroup(optionOrGroup)) {
    //   return !!optionOrGroup.options.length;
    // }

    // // Transform the data into a lowercase string of all property values.
    // const dataStr = Object.keys(optionOrGroup.data).reduce(
    //   // tslint:disable-next-line: arrow-return-shorthand prefer-template restrict-plus-operands
    //   (currentTerm: string, key: string) => currentTerm + optionOrGroup.data[key] + DELIMITER, '').toLowerCase();

    // // Transform the filter and viewValue by converting it to lowercase and removing whitespace.
    // const transformedFilter = filter.trim().toLowerCase();
    // const transformedViewValue = optionOrGroup.viewValue.trim().toLowerCase();
    // return transformedViewValue.indexOf(transformedFilter) !== -1 || dataStr.indexOf(transformedFilter) !== -1;
    return true;
  }

  constructor(initialData: T = null as unknown as T) {
    this._data = new BehaviorSubject<T>(initialData);
  }

  /**
   * Used by the DtFilterField. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterFieldViewer (filter-field)
   */
  connect(): Observable<NodeDef | null> {
    return this._data.pipe(map((data) => this._transformObject(data)));
  }

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  disconnect(): void {
    this._distinctValues.clear();
  }

  /** Transforms the provided data into an internal data structure that can be used by the filter-field. */
  // tslint:disable-next-line: no-any
  private _transformObject(data: any | null, parent: NodeDef | null = null): NodeDef | null {
    this._isDistinct = false;
    let def: NodeDef | null = null;
    if (isAutocomplete(data)) {
      def = autocompleteDef([], !!data.distinct, data, null);
      def.autocomplete!.optionsOrGroups = this._transformList(data.autocomplete, def);
    } else if (isFreeText(data)) {
    }

    let parentAutocomplete = isAutocompleteDef(parent) ? parent as NodeDef : null;
    if (isGroup(data)) {
      def = groupDef(data.name, [], data, def, parentAutocomplete);
      def.group!.options = this._transformList(data.options, def);
    } else if (isOption(data)) {
      const parentGroup = isGroupDef(parent) ? parent : null;
      parentAutocomplete = parentAutocomplete || (parentGroup && parentGroup.group.parentAutocomplete || null);
      def = optionDef(typeof data === 'string' ? data : data.name, data, def, parentAutocomplete, parentGroup);
    }
    return def;
  }

  // tslint:disable-next-line: no-any
  private _transformList(list: any[], parent: NodeDef | null = null): NodeDef[] {
    return list.map((item) => this._transformObject(item, parent))
      .filter((item) => item !== null) as NodeDef[];
  }
}
