import { DtFilterFieldDataSource } from './filter-field-data-source';
import { Observable, merge, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import {
  DtNodeDef,
  DtNodeData,
  dtAutocompleteData,
  dtOptionData,
  dtGroupData,
  isDtAutocompleteDef,
  isDtGroupDef,
  isDtOptionDef,
  isDtAutocompleteData,
  isDtOptionData,
  isDtFreeTextDef,
  dtFreeTextData,
  isDtRenderTypeData,
  DtOptionDef
} from '../types';

// tslint:disable: no-bitwise

export interface DtFilterNodesChanges {
  added: DtNodeData | null;
  removed: DtNodeData[] | null;
}

export interface DtFilterFieldViewer {
  submitFilter(): void;
}

// Use an obscure Unicode character to delimit the words in the concatenated string.
// This avoids matches where the values of two columns combined will match the user's query
// (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
// that has a very low chance of being typed in by somebody in a text field. This one in
// particular is "White up-pointing triangle with dot" from
// https://en.wikipedia.org/wiki/List_of_Unicode_characters
const DELIMITER = '◬';

export class DtFilterFieldControl {

  private _inputText$ = new BehaviorSubject('');
  private _distinctIds = new Set<string>();
  private _currentDistinctId = '';
  private _dataSourceDef$ = new BehaviorSubject<DtNodeDef | null>(null);
  private _renderDef$ = new Subject<DtNodeDef |  null>();
  private _currendDef: DtNodeDef | null;
  private _dataSourceSub: Subscription;
  private _changes = merge(
      this._dataSourceDef$,
      this._renderDef$,
      this._inputText$.pipe(map(() => this._currendDef))
    ).pipe(
      tap((def) => { this._currendDef = def || null; }),
      map((def) => def ? this._transformData(def) : null));

  constructor(private _dataSource: DtFilterFieldDataSource, private _viewer: DtFilterFieldViewer) {
   this._dataSourceSub = this._dataSource.connect().subscribe((def) => { this._dataSourceDef$.next(def); });
  }

  connect(): Observable<DtNodeData | null> {
    return this._changes;
  }

  disconnect(): void {
    this._dataSourceDef$.complete();
    this._renderDef$.complete();
    this._inputText$.complete();
    this._currendDef = null;
    this._distinctIds.clear();
    this._dataSourceSub.unsubscribe();
    this._dataSource.disconnect();
  }

  filterNodeChanges(changes: DtFilterNodesChanges): void {
    let shouldEmit = false;
    if (changes.removed) {
      changes.removed.forEach((nodeData) => {
        if (isDtAutocompleteData(nodeData) && nodeData.autocomplete.selectedOption &&
          nodeData.autocomplete.selectedOption.def.option!.distinctId) {
          this._distinctIds.delete(nodeData.autocomplete.selectedOption.def.option!.distinctId!);
          shouldEmit = true;
          if (nodeData.autocomplete.selectedOption.def === this._currendDef) {
            this._currendDef = null;
          }
        }
      });
    }
    if (changes.added) {
      if (isDtAutocompleteData(changes.added) && isDtOptionData(changes.added.autocomplete.selectedOption)) {
        const option = changes.added.autocomplete.selectedOption;
        const def = changes.added.autocomplete.selectedOption.def;
        this._distinctIds.add(peekDistinctId(def, this._currentDistinctId));
        if (isDtRenderTypeData(option)) {
          this._currentDistinctId += def.option!.distinctId || '';
          this._renderDef$.next(def);
        } else {
          this._switchToRootData();
        }
        shouldEmit = false;
      } else if (isDtRenderTypeData(changes.added)) {
        this._switchToRootData();
        shouldEmit = false;
      }
    }
    if (shouldEmit) {
      if (this._currendDef) {
        this._renderDef$.next(this._currendDef);
      } else {
        this._switchToRootData();
      }
    }
  }

  filterInputChanges(input: string): void {
    this._inputText$.next(input);
  }

  private _switchToRootData(): void {
    this._currentDistinctId = '';
    this._dataSourceDef$.next(this._dataSourceDef$.value);
    this._viewer.submitFilter();
  }

  private _transformData(def: DtNodeDef): DtNodeData | null {
    if (isDtAutocompleteDef(def)) {
      return this._transformAutocompleteData(def, this._distinctIds, this._inputText$.value);
    }
    if (isDtFreeTextDef(def)) {
      return this._transformFreeTextData(def, this._inputText$.value);
    }
    return null;
  }

  /**
   * Transforms a provided autocomplete definition into a data object with a filtered options or groups list.
   * Returns null if there are no more options or groups left after filtering.
   */
  private _transformAutocompleteData(def: DtNodeDef, distinctIds: Set<string>, filterText?: string): DtNodeData | null {
    const optionsOrGroups = def.autocomplete!.optionsOrGroups
      .map((optionOrGroup) => isDtGroupDef(optionOrGroup) ?
        this._transformGroupData(optionOrGroup, distinctIds, filterText) :
        this._transformOptionData(optionOrGroup, distinctIds, filterText))
      .filter((optionsOrGroup) => optionsOrGroup !== null) as DtNodeData[];
    return optionsOrGroups.length ? dtAutocompleteData(def, optionsOrGroups) : null;
  }

  /** Transforms a provided free text definition into a data object with a filtered suggestion list. */
  private _transformFreeTextData(def: DtNodeDef, filterText?: string): DtNodeData {
    const suggestions = def.freeText!.suggestions ?
      (def.freeText!.suggestions
      .map((option) => this._transformOptionData(option, undefined, filterText || ''))
      .filter((optionsOrGroup) => optionsOrGroup !== null) as DtNodeData[]) : [];
    return dtFreeTextData(def, suggestions);
  }

  /** Transforms a provided group definition into a data object or null if is should not be in the resulting options array. */
  private _transformGroupData(def: DtNodeDef, distinctIds: Set<string>, filterText?: string): DtNodeData | null {
    const options = def.group!.options.filter((option) =>
      defDistinctPredicate(option, distinctIds) &&  optionFilterTextPredicate(option, filterText || ''))
      .map((option) => dtOptionData(option));
    return options.length ? dtGroupData(def, options) : null;
  }

  /** Transforms a provided option definition into a data object or null if is should not be in the resulting options array. */
  private _transformOptionData(def: DtNodeDef, distinctIds?: Set<string>, filterText?: string): DtNodeData | null {
    return optionFilterTextPredicate(def, filterText || '') &&
      (!distinctIds || defDistinctPredicate(def, distinctIds)) ? dtOptionData(def) : null;
  }
}

/** Predicate function to check whether the provided node def should be in the filtered result. */
export function defDistinctPredicate(def: DtNodeDef, distinctIds: Set<string>): boolean {
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

/** Generates a new distinct id for the provided node def. */
export function generateDtFilterFieldDistinctId(def: DtNodeDef, prefix: string = ''): string {
  const groupRef = def.option!.parentGroup ? `${def.option!.parentGroup!.group!.label}${DELIMITER}` : '';
  return `${prefix}${groupRef}${def.option!.viewValue}${DELIMITER}`;
}

/** Peeks into a option node definition and returns its distinct id or creates a new one. */
function peekDistinctId(def: DtNodeDef, prefix: string = ''): string {
  const id = def.option!.distinctId ? def.option!.distinctId! : generateDtFilterFieldDistinctId(def, prefix);
  def.option!.distinctId = id;
  return id;
}
