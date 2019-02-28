import { DtFilterFieldDataSource } from './filter-field-data-source';
import { Observable, merge, BehaviorSubject, Subject } from 'rxjs';
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
  isDtRenderTypeData
} from '../types';

// tslint:disable: no-bitwise

export interface DtFilterNodesChangesEvent {
  added: DtNodeData | null;
  removed: DtNodeData[] | null;
}

export interface DtFilterFieldViewer {
  submitFilter(): void;
  _filterNodesChanges: Observable<DtFilterNodesChangesEvent>;
}

// Use an obscure Unicode character to delimit the words in the concatenated string.
// This avoids matches where the values of two columns combined will match the user's query
// (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
// that has a very low chance of being typed in by somebody in a text field. This one in
// particular is "White up-pointing triangle with dot" from
// https://en.wikipedia.org/wiki/List_of_Unicode_characters
const DELIMITER = '◬';

export class DtFilterFieldControl {

  private _distinctIds = new Set<string>();
  private _currentDistinctId = '';
  private _dataSourceDef$ = new BehaviorSubject<DtNodeDef | null>(null);
  private _renderDef$ = new Subject<DtNodeDef |  null>();
  private _currendDef: DtNodeDef | null;
  private _changes = merge(this._dataSourceDef$, this._renderDef$).pipe(
    map((def) => def ? this._transformData(def) : null),
    tap((data) => { this._currendDef = data ? data.def : null; }));

  /** Stream of transformed and filtered data */
  get changes(): Observable<DtNodeData | null> {
    return this._changes;
  }

  constructor(dataSource: DtFilterFieldDataSource, private _viewer: DtFilterFieldViewer) {
    dataSource.connect().subscribe((def) => { this._dataSourceDef$.next(def); });
    this._viewer._filterNodesChanges.subscribe((event) => {
      let shouldEmit = false;
      if (event.removed) {
        event.removed.forEach((nodeData) => {
          if (isDtAutocompleteData(nodeData) && nodeData.autocomplete.selectedOption &&
            nodeData.autocomplete.selectedOption.def.option!.distinctId) {
            this._distinctIds.delete(nodeData.autocomplete.selectedOption.def.option!.distinctId!);
            shouldEmit = true;
          }
        });
      }
      if (event.added) {
        if (isDtAutocompleteData(event.added) && isDtOptionData(event.added.autocomplete.selectedOption)) {
          const option = event.added.autocomplete.selectedOption;
          const def = event.added.autocomplete.selectedOption.def;
          this._distinctIds.add(peekDistinctId(def, this._currentDistinctId));
          if (isDtRenderTypeData(option)) {
            this._currentDistinctId += def.option!.distinctId || '';
            this._renderDef$.next(def);
          } else {
            this._switchToRootData();
          }
        } else if (isDtRenderTypeData(event.added)) {
          this._switchToRootData();
        } else if (shouldEmit) {
          this._renderDef$.next(this._currendDef);
        }
      }
    });
  }

  private _switchToRootData(): void {
    this._currentDistinctId = '';
    this._dataSourceDef$.next(this._dataSourceDef$.value);
    this._viewer.submitFilter();
  }

  private _transformData(def: DtNodeDef): DtNodeData | null {
    if (isDtAutocompleteDef(def)) {
      return this._transformAutocompleteData(def, this._distinctIds);
    }
    if (isDtFreeTextDef(def)) {
      return this._transformFreeTextData(def);
    }
    return null;
  }

  private _transformAutocompleteData(def: DtNodeDef, distinctIds: Set<string>): DtNodeData | null {
    const optionsOrGroups = def.autocomplete!.optionsOrGroups
      .map((optionOrGroup) => isDtGroupDef(optionOrGroup) ?
        this._transformGroupData(optionOrGroup, distinctIds) :
        this._transformOptionData(optionOrGroup, distinctIds))
      .filter((optionsOrGroup) => optionsOrGroup !== null) as DtNodeData[];
    return optionsOrGroups.length ? dtAutocompleteData(def, optionsOrGroups) : null;
  }

  private _transformFreeTextData(def: DtNodeDef): DtNodeData {
    const suggestions = def.freeText!.suggestions ?
      def.freeText!.suggestions.map((option) => this._transformOptionData(option) as DtNodeData) : [];
    return dtFreeTextData(def, suggestions);
  }

  private _transformGroupData(def: DtNodeDef, distinctIds: Set<string>): DtNodeData | null {
    const options = def.group!.options.filter((option) =>
      filterDistinctDefPredicate(option, distinctIds)).map((option) => dtOptionData(option));
    return options.length ? dtGroupData(def, options) : null;
  }

  private _transformOptionData(def: DtNodeDef, distinctIds?: Set<string>): DtNodeData | null {
    return !distinctIds || filterDistinctDefPredicate(def, distinctIds) ? dtOptionData(def) : null;
  }
}

/** Predicate function to check whether the provided node def should be in the filtered result. */
export function filterDistinctDefPredicate(def: DtNodeDef, distinctIds: Set<string>): boolean {
  if (isDtGroupDef(def)) {
    return def.group.options.some((option) => filterDistinctDefPredicate(option, distinctIds));
  }

  // Check whether option should be filtered out
  // (when its distinct value is listed in the distinctIds and the parent autocomplete is marked as distinct)
  if (isDtOptionDef(def) && def.option.distinctId &&
    distinctIds.has(def.option.distinctId) &&
    isDtAutocompleteDef(def.option.parentAutocomplete) &&
    def.option.parentAutocomplete.autocomplete.distinct) {
    return false;
  }

  if (isDtAutocompleteDef(def)) {
    return def.autocomplete.optionsOrGroups.some((optionOrGroup) => filterDistinctDefPredicate(optionOrGroup, distinctIds));
  }
  return true;
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
