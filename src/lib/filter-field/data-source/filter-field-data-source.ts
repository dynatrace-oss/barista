import { Observable } from 'rxjs';
import { isObject } from '@dynatrace/angular-components/core';

export interface DtFilterFieldDataType {
  dataType: string;
}

export interface DtFilterFieldAutocompleteOption extends DtFilterFieldDataType {
  dataType: 'option';
  viewValue: string;
// tslint:disable-next-line: no-any
  data: any;
}

// tslint:disable-next-line: no-any
export function isDtFilterFieldAutocompleteOption(option: any): option is DtFilterFieldAutocompleteOption {
  return isObject(option) && option.dataType === 'option';
}

export interface DtFilterFieldAutocompleteGroup extends DtFilterFieldDataType {
  dataType: 'group';
  viewValue: string;
  options: DtFilterFieldAutocompleteOption[];
}

// tslint:disable-next-line: no-any
export function isDtFilterFieldAutocompleteGroup(group: any): group is DtFilterFieldAutocompleteGroup {
  return isObject(group) && Array.isArray(group.options) && group.dataType === 'group';
}

export interface DtFilterFieldAutocompleteData extends DtFilterFieldDataType {
  dataType: 'autocomplete';
  optionsOrGroups: Array<DtFilterFieldAutocompleteOption | DtFilterFieldAutocompleteGroup>;
}

// tslint:disable-next-line: no-any
export function isDtFilterFieldAutocompleteData(data: any): data is DtFilterFieldAutocompleteData {
  return isObject(data) && Array.isArray(data.optionsOrGroups) && data.dataType === 'autocomplete';
}

export interface DtFilterFieldFreeTextData extends DtFilterFieldDataType {
  dataType: 'free-text';
  suggestions?: DtFilterFieldAutocompleteOption[];
}

// tslint:disable-next-line: no-any
export function isDtFilterFieldFreeTextData(data: any): data is DtFilterFieldFreeTextData {
  return isObject(data) && data.dataType === 'free-text';
}

export type DtFilterFieldData = DtFilterFieldAutocompleteData | DtFilterFieldFreeTextData | null;

/** Interface for a component (filter field) that should be connected to a DtFilterFieldDataSource */
export interface DtFilterFieldViewer<T> {
  dataStateChanges: Observable<T>;
  submitFilter(viewValue?: string): void;
}

export abstract class DtFilterFieldDataSource<T> {

  /**
   * Used by the DtFilterField. Filter term that should be used to filter out objects from the autocomplete
   * data array.
   * To override how data objects match to this filter string, provide a custom function for autocompleteFilterPredicate.
   */
  abstract autocompleteFilter: string;

  /**
   * Used by the DtFilterField.
   * Checks if an autocomplete option or group object matches the data source's filter string.
   */
  abstract autocompleteFilterPredicate:
    (optionOrGroup: DtFilterFieldAutocompleteOption | DtFilterFieldAutocompleteGroup, filter: string) => boolean;

  /**
   * Used by the DtFilterField. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * diesplayed by the DtFilterFieldViewer (DtFilterField)
   */
  abstract connect(viewer: DtFilterFieldViewer<T>): Observable<DtFilterFieldData>;

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  abstract disconnect(): void;
}
