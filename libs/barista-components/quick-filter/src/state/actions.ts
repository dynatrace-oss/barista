/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  DtFilterFieldDataSource,
  DtFilterValue,
  DtNodeDef,
} from '@dynatrace/barista-components/filter-field';

/** @internal Enum for all the possible action types */
// eslint-disable-next-line no-shadow
export enum ActionType {
  INIT = '@@actions init',
  ADD_FILTER = '@@actions add filter',
  REMOVE_FILTER = '@@actions remove filter',
  UPDATE_FILTER = '@@actions update filter',
  SET_FILTERS = '@@actions set filters',
  ADD_INITIAL_FILTERS = '@@actions add initial filters',
  UNSET_FILTER_GROUP = '@@actions unset filter group',
  HIGHLIGHT_GROUP = '@@actions highlight filter group',
  SWITCH_DATA_SOURCE = '@@actions  switch dataSource',
  UPDATE_DATA_SOURCE = '@@actions update dataSource',
}

/** @internal Interface for an action */
export interface Action<T = any> {
  readonly type: ActionType;
  payload?: T;
}
/** @internal Function which helps to create actions without mistakes */
export const action = <T>(type: ActionType, payload?: T): Action<T> => ({
  type,
  payload,
});

/** @internal Action that sets filters (Bulk operation for addFilter) */
export const setFilters = (filters: DtFilterValue[][]) =>
  action<DtFilterValue[][]>(ActionType.SET_FILTERS, filters);

/** @internal Initial filters are set via binding on the quick filter so they are not in the value data format. */
export const addInitialFilters = (filters: any[][]) =>
  action<any[][]>(ActionType.ADD_INITIAL_FILTERS, filters);

/** @internal Action that unsets a filter group */
export const unsetFilterGroup = (group: DtNodeDef) =>
  action<DtNodeDef>(ActionType.UNSET_FILTER_GROUP, group);

/** @internal Highlights a filter group */
export const showGroupInDetailView = (id: string | undefined) =>
  action<string | undefined>(ActionType.HIGHLIGHT_GROUP, id);

/** @internal Action that adds a filter */
export const addFilter = (filter: DtNodeDef[]) =>
  action<DtNodeDef[]>(ActionType.ADD_FILTER, filter);

/** @internal Action that removes a filter */
export const removeFilter = (uid: string) =>
  action<string>(ActionType.REMOVE_FILTER, uid);

/** @internal Action that updates a filter */
export const updateFilter = (filter: DtNodeDef[]) =>
  action<DtNodeDef[]>(ActionType.UPDATE_FILTER, filter);

/** @internal Action that subscribes to a new data source */
export const switchDataSource = (item: DtFilterFieldDataSource<any>) =>
  action<DtFilterFieldDataSource<any>>(ActionType.SWITCH_DATA_SOURCE, item);

/** @internal Action that updates the data source */
export const updateDataSource = (nodeDef: DtNodeDef) =>
  action<DtNodeDef>(ActionType.UPDATE_DATA_SOURCE, nodeDef);

/** @internal Detects if an action should emit a change event to the consumer */
export function isFilterChangeAction(generalAction: Action): boolean {
  switch (generalAction.type) {
    case ActionType.ADD_FILTER:
    case ActionType.REMOVE_FILTER:
    case ActionType.UPDATE_FILTER:
    case ActionType.UNSET_FILTER_GROUP:
    case ActionType.SET_FILTERS:
      return true;
    default:
      return false;
  }
}
