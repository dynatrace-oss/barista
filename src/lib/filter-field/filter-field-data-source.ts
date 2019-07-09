import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isObject } from '@dynatrace/angular-components/core';
import {
  DtNodeDef,
  dtAutocompleteDef,
  dtOptionDef,
  dtGroupDef,
  isDtAutocompleteDef,
  isDtGroupDef,
  dtFreeTextDef,
  dtRangeDef,
} from './types';

export abstract class DtFilterFieldDataSource {
  /**
   * Used by the DtFilterFieldControl. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterField and the DtFilterFieldControl.
   */
  abstract connect(): Observable<DtNodeDef | null>;

  /** Used by the DtFilterField. Called when it is destroyed. */
  abstract disconnect(): void;
}

/** Shape of an object to be usable as a option in an autocomplete */
type Option = { name: string } | string;

/** Whether the provided data object is of type OptionData */
// tslint:disable-next-line: no-any
function isOption(data: any): data is Option {
  return (
    typeof data === 'string' ||
    (isObject(data) && typeof data.name === 'string')
  );
}

/** Shape of an object to be usable as a group in an autocomplete */
interface Group {
  name: string;
  options: Option[];
}

/** Whether the provided data object is of type GroupData */
// tslint:disable-next-line: no-any
function isGroup(data: any): data is Group {
  return (
    isObject(data) &&
    typeof data.name === 'string' &&
    Array.isArray(data.options)
  );
}

/** Shape of an object to be usable as an autocomplete */
interface Autocomplete {
  autocomplete: Array<Option | Group>;
  distinct?: boolean;
  async?: boolean;
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

interface Range {
  range: {
    unit: string;
    operators: {
      range?: boolean;
      equal?: boolean;
      greaterThanEqual?: boolean;
      lessThanEqual?: boolean;
    };
  };
}
/** Whether the provided data object is of type RangeData */
// tslint:disable-next-line: no-any
function isRange(data: any): data is Range {
  return isObject(data) && isObject(data.range);
}

// tslint:disable: no-bitwise

/**
 * DataSource that accepts a client side data object with a specific structure (described below)
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
 *
 * To render a range input for all operators and the value is in seconds.
 * ```
 * {
 *   range: {
 *     unit: 's',
 *     operators: {
 *       range: true,
 *       equal: true,
 *       greaterThanEqual: true,
 *       lessThanEqual: true,
 *     },
 *   }
 * }
 */
export class DtFilterFieldDefaultDataSource<T>
  implements DtFilterFieldDataSource {
  private readonly _data$: BehaviorSubject<T>;

  /** Structure of data that is used, transformed and rendered by the filter-field. */
  get data(): T {
    return this._data$.value;
  }
  set data(data: T) {
    this._data$.next(data);
  }

  constructor(initialData: T = (null as unknown) as T) {
    this._data$ = new BehaviorSubject<T>(initialData);
  }

  /**
   * Used by the DtFilterField. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterFieldViewer (filter-field)
   */
  connect(): Observable<DtNodeDef | null> {
    return this._data$.pipe(map(data => this._transformObject(data)));
  }

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  disconnect(): void {
    this._data$.complete();
  }

  /** Transforms the provided data into an internal data structure that can be used by the filter-field. */
  private _transformObject(
    data: any | null, // tslint:disable-line:no-any
    parent: DtNodeDef | null = null
  ): DtNodeDef | null {
    let def: DtNodeDef | null = null;
    if (isAutocomplete(data)) {
      def = dtAutocompleteDef([], !!data.distinct, !!data.async, data, null);
      def.autocomplete!.optionsOrGroups = this._transformList(
        data.autocomplete,
        def
      );
    } else if (isFreeText(data)) {
      def = dtFreeTextDef([], data, null);
      def.freeText!.suggestions = this._transformList(data.suggestions, def);
    } else if (isRange(data)) {
      def = dtRangeDef(
        !!data.range.operators.range,
        !!data.range.operators.equal,
        !!data.range.operators.greaterThanEqual,
        !!data.range.operators.lessThanEqual,
        data.range.unit,
        data,
        null
      );
    }

    let parentAutocomplete = isDtAutocompleteDef(parent)
      ? (parent as DtNodeDef)
      : null;
    if (isGroup(data)) {
      def = dtGroupDef(data.name, [], data, def, parentAutocomplete);
      def.group!.options = this._transformList(data.options, def);
    } else if (isOption(data)) {
      const parentGroup = isDtGroupDef(parent) ? parent : null;
      parentAutocomplete =
        parentAutocomplete ||
        ((parentGroup && parentGroup.group.parentAutocomplete) || null);
      def = dtOptionDef(
        typeof data === 'string' ? data : data.name,
        data,
        null,
        def,
        parentAutocomplete,
        parentGroup
      );
    }
    return def;
  }

  /** Transforms the provided list of data objects into an internal data structure that can be used by the filter field. */
  private _transformList(
    list: any[], // tslint:disable-line:no-any
    parent: DtNodeDef | null = null
  ): DtNodeDef[] {
    return list
      .map(item => this._transformObject(item, parent))
      .filter(item => item !== null) as DtNodeDef[];
  }
}
