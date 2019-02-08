import { DtFilterFieldDataSource } from './filter-field-data-source';
import { Observable, merge, of as observableOf, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import {
  NodeDef,
  NodeFlags,
  NodeData,
  autocompleteData,
  optionData,
  groupData,
  isAutocompleteDef,
  isGroupDef,
  isOptionDef,
  isAutocompleteData,
  isOptionData
} from '../types';

// tslint:disable: no-bitwise

export interface DtFilterNodesChangesEvent {
  added: NodeData | null;
  removed: NodeData[] | null;
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
  private _currentDistinctReference = '';
  private _dataSourceDef = new BehaviorSubject<NodeDef | null>(null);

  _currentDef = new Subject<NodeDef>();

  get changes(): Observable<NodeData | null> {
    const currentDef$ = this._currentDef.pipe(
      tap((currentDef) => { this._distinctIds.add(peekDistinctId(currentDef, this._currentDistinctReference)); }),
      switchMap((currentDef) => currentDef && currentDef.nodeFlags & NodeFlags.RenderTypes ?
        observableOf(currentDef).pipe(
          tap((def) => { this._currentDistinctReference += currentDef.option!.distinctId; })) :
        this._dataSourceDef.pipe(tap(() => {
          this._currentDistinctReference = '';
          this._viewer.submitFilter();
        })))
    );
    return merge(this._dataSourceDef, currentDef$).pipe(map((def) => {
      if (isAutocompleteDef(def)) {
        return this._transformAutocompleteData(def, this._distinctIds);
      }
      return null;
    }));
  }

  constructor(dataSource: DtFilterFieldDataSource, private _viewer: DtFilterFieldViewer) {
    dataSource.connect().subscribe((def) => { this._dataSourceDef.next(def); });
    _viewer._filterNodesChanges.subscribe((event) => {
      if (event.added && isAutocompleteData(event.added) && isOptionData(event.added.autocomplete.selectedOption)) {
        this._currentDef.next(event.added.autocomplete.selectedOption.def);
      }
      if (event.removed) {
        event.removed.forEach((nodeData) => {
        });
      }
    });
  }

  private _transformAutocompleteData(def: NodeDef, distinctIds: Set<string>): NodeData | null {
    const optionsOrGroups = def.autocomplete!.optionsOrGroups
      .map((optionOrGroup) => isGroupDef(optionOrGroup) ?
        this._transformGroupData(optionOrGroup, distinctIds) :
        this._transformOptionData(optionOrGroup, distinctIds))
      .filter((optionsOrGroup) => optionsOrGroup !== null) as NodeData[];
    return optionsOrGroups.length ? autocompleteData(def, optionsOrGroups) : null;
  }

  private _transformGroupData(def: NodeDef, distinctIds: Set<string>): NodeData | null {
    const options = def.group!.options.filter((option) =>
      filterDistinctDefPredicate(option, distinctIds)).map((option) => optionData(option));
    return options.length ? groupData(def, options) : null;
  }

  private _transformOptionData(def: NodeDef, distinctIds: Set<string>): NodeData | null {
    return filterDistinctDefPredicate(def, distinctIds) ? optionData(def) : null;
  }
}

export function filterDistinctDefPredicate(def: NodeDef, distinctIds: Set<string>): boolean {
  if (isGroupDef(def)) {
    return def.group.options.some((option) => filterDistinctDefPredicate(option, distinctIds));
  }

  // Check whether option should be filtered out
  // (when its distinct value is listed in the distinctIds and the parent autocomplete is marked as distinct)
  if (isOptionDef(def) && def.option.distinctId &&
    // tslint:disable-next-line: no-unnecessary-type-assertion
    distinctIds.has(def.option.distinctId!) &&
    isAutocompleteDef(def.option.parentAutocomplete) &&
    def.option.parentAutocomplete.autocomplete.distinct) {
    return false;
  }

  if (isAutocompleteDef(def)) {
    return def.autocomplete.optionsOrGroups.some((optionOrGroup) => filterDistinctDefPredicate(optionOrGroup, distinctIds));
  }
  return true;
}

export function generateDtFilterFieldDistinctId(def: NodeDef, prefix: string = ''): string {
  // tslint:disable-next-line: no-unnecessary-type-assertion
  const groupRef = def.option!.parentGroup ? `${def.option!.parentGroup!.group!.label}${DELIMITER}` : '';
  return `${prefix}${groupRef}${def.option!.viewValue}${DELIMITER}`;
}

function peekDistinctId(def: NodeDef, prefix: string = ''): string {
  // tslint:disable-next-line: no-unnecessary-type-assertion
  const id = def.option!.distinctId ? def.option!.distinctId! : generateDtFilterFieldDistinctId(def, prefix);
  def.option!.distinctId = id;
  return id;
}
