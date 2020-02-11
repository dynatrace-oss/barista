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
  DtFilterFieldDataSource,
  DtNodeDef,
} from '@dynatrace/barista-components/filter-field';
import { Action, ActionType } from './actions';

export type Reducer = (
  state: QuickFilterState,
  action: Action,
) => QuickFilterState;

export interface QuickFilterState {
  nodeDef?: DtNodeDef;
  dataSource?: DtFilterFieldDataSource;
  filters: any[][];
}

export function quickFilterReducer(
  state: QuickFilterState,
  action: Action,
): QuickFilterState {
  console.info(
    `%c Reducer <${action.type}> `,
    ' background-color: lightblue; color: black',
    action,
  );
  switch (action.type) {
    case ActionType.SWITCH_DATA_SOURCE:
      if (state.dataSource) {
        state.dataSource.disconnect();
      }
      return { ...state, dataSource: action.payload };
    case ActionType.UPDATE_DATA_SOURCE:
      return { ...state, nodeDef: action.payload };
    default:
      return state;
  }
}

// export function updateDataSource(
//   previousState: QuickFilterState,
//   action: Action<DtFilterFieldDataSource>,
// ): QuickFilterState {
//   return {
//     ...previousState,
//     dataSource: action.payload,
//   };
// }

// export function updateDataSourceReducer(
//   previousState: QuickFilterState,
//   action: Action<DtNodeDef>,
// ): QuickFilterState {
//   return {
//     ...previousState,
//     nodeDef: action.payload || null,
//   };
// }
