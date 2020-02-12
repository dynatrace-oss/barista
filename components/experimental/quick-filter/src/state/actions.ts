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
import {
  DtNodeDef,
  DtFilterFieldDataSource,
} from '@dynatrace/barista-components/filter-field';

export enum ActionType {
  INIT = '@@actions init',
  ADD_FILTER = '@@actions add filter',
  REMOVE_FILTER = '@@actions remove filter',
  UPDATE_FILTER = '@@actions update filter',
  SET_FILTERS = '@@actions set filters',
  UNSET_FILTER_GROUP = '@@actions unset filter group',
  SWITCH_DATA_SOURCE = '@@actions  switch dataSource',
  UPDATE_DATA_SOURCE = '@@actions update dataSource',
}

/** Interface for an action */
export interface Action<T = any> {
  readonly type: ActionType;
  payload?: T;
}
/** Function which helps to create actions without mistakes */
export const action = <T>(type: ActionType, payload?: T): Action<T> => ({
  type,
  payload,
});

export const setFilters = (filters: any[][]) =>
  action<any[][]>(ActionType.SET_FILTERS, filters);

export const unsetFilterGroup = (group: DtNodeDef) =>
  action<DtNodeDef>(ActionType.UNSET_FILTER_GROUP, group);

export const addFilter = (item: DtNodeDef) =>
  action<DtNodeDef>(ActionType.ADD_FILTER, item);

export const removeFilter = (item: DtNodeDef) =>
  action<DtNodeDef>(ActionType.REMOVE_FILTER, item);

export const updateFilter = (item: DtNodeDef) =>
  action<DtNodeDef>(ActionType.UPDATE_FILTER, item);

export const switchDataSource = (item: DtFilterFieldDataSource) =>
  action<DtFilterFieldDataSource>(ActionType.SWITCH_DATA_SOURCE, item);

export const updateDataSource = (nodeDef: DtNodeDef) =>
  action<DtNodeDef>(ActionType.UPDATE_DATA_SOURCE, nodeDef);
