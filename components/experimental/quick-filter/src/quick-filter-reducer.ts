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
import { DELIMITER } from '../../../filter-field/src/filter-field-util';

interface Action {
  type: string;
}

export class AddFilter implements Action {
  type = 'AddFilter';
  constructor(public item: DtNodeDef) {}
}

export class RemoveFilter implements Action {
  type = 'RemoveFilter';
  constructor(public item: DtNodeDef) {}
}

export class UpdateFilter implements Action {
  type = 'UpdateFilter';
  constructor(public item: DtNodeDef) {}
}

export type QuickFilterActions = AddFilter | RemoveFilter | UpdateFilter;

export type QuickFilterState = any[][];

export function quickFilterReducer(
  state: QuickFilterState,
  action: QuickFilterActions,
): QuickFilterState {
  switch (action.type) {
    case 'AddFilter':
      return addFilter(state, action.item);
    case 'RemoveFilter':
      return removeFilter(state, action.item);
    case 'UpdateFilter':
      return updateFilter(state, action.item);
    default:
      return state;
  }
}

export function addFilter(
  state: QuickFilterState,
  item: DtNodeDef,
): QuickFilterState {
  return [...state, buildData(item)];
}

export function removeFilter(
  state: QuickFilterState,
  item: DtNodeDef,
): QuickFilterState {
  const index = findSelectedOption(state, item, false);
  const updatedState = [...state];

  if (index > -1) {
    delete updatedState[index];
  }

  return updatedState.filter(Boolean);
}

export function updateFilter(
  state: QuickFilterState,
  item: DtNodeDef,
): QuickFilterState {
  const index = findSelectedOption(state, item, true);

  if (index < 0) {
    return addFilter(state, item);
  }

  state[index] = buildData(item);

  return state;
}

export function buildData(item: DtNodeDef): any[] {
  const data = [item.data];

  if (item.option && item.option.parentAutocomplete) {
    data.unshift(item.option.parentAutocomplete.data);
  }
  return data;
}

export function findSelectedOption(
  state: QuickFilterState,
  item: DtNodeDef,
  distinct: boolean = false,
): number {
  return state.findIndex(path => {
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
