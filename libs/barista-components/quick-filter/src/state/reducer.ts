/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DtLogger,
  DtLoggerFactory,
  isObject,
} from '@dynatrace/barista-components/core';
import { DtAutocompleteValue } from '@dynatrace/barista-components/filter-field';
import { Action, ActionType } from './actions';
import { QuickFilterState } from './store';

const logger: DtLogger = DtLoggerFactory.create('DtQuickFilter State');

/** @internal Type of a reducer */
export type Reducer = (
  state: QuickFilterState,
  action: Action,
) => QuickFilterState;

/**
 * @internal
 * The Quick Filter reducer is the place where we handle all the state updates
 * To have a single entry point. Every action can trigger an update of the state.
 * It has to be a pure function that always returns a new object of the state.
 * @param state The state that should be modified.
 * @param action The current action that should be handled.
 */
export function quickFilterReducer(
  state: QuickFilterState,
  action: Action,
): QuickFilterState {
  logger.debug(`Reducer <${action.type}> `, action);

  switch (action.type) {
    case ActionType.SWITCH_DATA_SOURCE:
      if (state.dataSource) {
        state.dataSource.disconnect();
      }
      return { ...state, dataSource: action.payload };
    case ActionType.UPDATE_DATA_SOURCE:
      return {
        ...state,
        nodeDef: action.payload,
      };
    case ActionType.SET_FILTERS:
      // reset the initial filters as we have already applied them if there are one.
      return { ...state, filters: action.payload, initialFilters: undefined };
    case ActionType.ADD_INITIAL_FILTERS:
      return { ...state, initialFilters: action.payload };
    case ActionType.UNSET_FILTER_GROUP:
      return {
        ...state,
        filters: unsetFilterGroup(state.filters, action.payload),
      };
    case ActionType.ADD_FILTER:
      return { ...state, filters: addFilter(state.filters, action.payload) };
    case ActionType.UPDATE_FILTER:
      return { ...state, filters: updateFilter(state.filters, action.payload) };
    case ActionType.REMOVE_FILTER:
      return { ...state, filters: removeFilter(state.filters, action.payload) };
    case ActionType.HIGHLIGHT_GROUP:
      return { ...state, groupInDetailView: action.payload };
    default:
      // Default return the same state as it was passed so don't modify anything
      return state;
  }
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// #
// # HELPER functions for modifying the filters
// #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

/** @internal Add a filter to the filters array */
export function addFilter(
  filters: DtAutocompleteValue<any>[][],
  filter: DtAutocompleteValue<any>[],
): DtAutocompleteValue<any>[][] {
  return [...filters, filter];
}

/** @internal Remove a filter from the filters array */
export function removeFilter(
  filters: DtAutocompleteValue<any>[][],
  uid: string,
): DtAutocompleteValue<any>[][] {
  const index = findSelectedOption(filters, uid, false);
  const updatedState = [...filters];

  if (index > -1) {
    delete updatedState[index];
  }

  return updatedState.filter(Boolean);
}

/** @internal Update a filter inside the filters array */
export function updateFilter(
  filters: DtAutocompleteValue<any>[][],
  filter: DtAutocompleteValue<any>[],
): DtAutocompleteValue<any>[][] {
  const updatedState = [...filters];
  const uid = filter[filter.length - 1].option.uid;
  const index = findSelectedOption(updatedState, uid, true);
  // if the filter is not in the filters list add it
  if (index < 0) {
    return addFilter(updatedState, filter);
  }
  // replace the existing filter
  updatedState[index] = filter;
  return updatedState;
}

/** @internal Remove a group from the filters array */
export function unsetFilterGroup(
  filters: DtAutocompleteValue<any>[][],
  group: DtAutocompleteValue<any>,
): DtAutocompleteValue<any>[][] {
  const index = findSelectedOption(filters, group.option.uid, true);
  return filters.filter((_, i) => i !== index);
}

/** @internal Find a filter inside the filters array based on a NodeDef */
export function findSelectedOption(
  filters: DtAutocompleteValue<any>[][],
  uid: string | null,
  distinct: boolean = false,
): number {
  return filters.findIndex((path) => {
    if (!uid) {
      return false;
    }
    // if the option is distinct we only have to check for the groups name because
    // there can only be one distinct option selected so we know immediately if it is selected
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (distinct && uid.startsWith(path[0].option.uid!)) {
      return true;
    }
    // if the last items uid in the path is equal to the uid, then we found our option.
    if (
      isObject(path[path.length - 1].option) &&
      uid === path[path.length - 1].option.uid
    ) {
      return true;
    }
  });
}
