/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { DtNodeDef } from '@dynatrace/barista-components/filter-field';
import { Action, ActionType } from './actions';
import { DELIMITER } from '../../../../filter-field/src/filter-field-util';
import { QuickFilterState, initialState } from './store';

export type Reducer = (
  state: QuickFilterState,
  action: Action,
) => QuickFilterState;

/**
 * The Quick Filter reducer is the place where we handle all the state updates
 * To have a single entry point. Every action can trigger an update of the state.
 * It has to be a immutable function that always returns a new object of the state.
 * @param state The state that should be modified.
 * @param action The current action that should be handled.
 */
export function quickFilterReducer(
  state: QuickFilterState,
  action: Action,
): QuickFilterState {
  console.info(
    `%c Reducer <${action.type}> `,
    ' background-color: lightblue; color: black; font-size: 1.2em; padding: 5px; border-radius: 1em',
    action,
  );

  switch (action.type) {
    case ActionType.SWITCH_DATA_SOURCE:
      if (state.dataSource) {
        state.dataSource.disconnect();
      }
      return { ...initialState, dataSource: action.payload };
    case ActionType.UPDATE_DATA_SOURCE:
      return { ...state, nodeDef: action.payload };
    case ActionType.ADD_FILTER:
      return { ...state, filters: addFilter(state.filters, action.payload) };
    case ActionType.UPDATE_FILTER:
      return { ...state, filters: updateFilter(state.filters, action.payload) };
    case ActionType.REMOVE_FILTER:
      return { ...state, filters: removeFilter(state.filters, action.payload) };
    default:
      return state;
  }
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// #
// # HELPER functions for modifying the filters
// #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

/** @internal Add a filter to the filters array */
export function addFilter(filters: any[][], item: DtNodeDef): any[][] {
  return [...filters, buildData(item)];
}

/** @internal Remove a filter from the filters array */
export function removeFilter(filters: any[][], item: DtNodeDef): any[][] {
  const index = findSelectedOption(filters, item, false);
  const updatedState = [...filters];

  if (index > -1) {
    delete updatedState[index];
  }

  return updatedState.filter(Boolean);
}

/** @internal Update a filter inside the filters array */
export function updateFilter(filters: any[][], item: DtNodeDef): any[][] {
  const index = findSelectedOption(filters, item, true);

  if (index < 0) {
    return addFilter(filters, item);
  }

  filters[index] = buildData(item);

  return filters;
}

/** @internal Add a filter to the filters array */
export function buildData(item: DtNodeDef): any[] {
  const data = [item.data];

  if (item.option && item.option.parentAutocomplete) {
    data.unshift(item.option.parentAutocomplete.data);
  }
  return data;
}

/** @internal Find a filter inside the filters array based on a NodeDef */
export function findSelectedOption(
  filters: any[][],
  item: DtNodeDef,
  distinct: boolean = false,
): number {
  return filters.findIndex(path => {
    if (item.option && item.option.uid) {
      const parts = item.option.uid.split(DELIMITER);

      if (distinct && parts[0] === path[0].name) {
        return true;
      }

      const dataPath = path.reduce(
        (previousValue, currentValue) =>
          `${previousValue.name}${DELIMITER}${currentValue.name}${DELIMITER}`,
      );

      if (item.option.uid === dataPath) {
        return true;
      }
    }

    return false;
  });
}
