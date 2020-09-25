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
import { isDefined } from '@dynatrace/barista-components/core';
import {
  applyDtOptionIds,
  DtNodeDef,
  isDtAutocompleteDef,
} from '@dynatrace/barista-components/filter-field';
import { Observable } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { DtQuickFilterDataSource } from '../quick-filter-data-source';
import { QuickFilterState } from './store';

/** @internal Select all autocompletes from the root Node Def from the store */
export const getAutocompletes = (
  state$: Observable<QuickFilterState>,
): Observable<DtNodeDef[]> =>
  state$.pipe(
    tap((state) => {
      // apply the ids to the node to identify them later on
      if (state.nodeDef) {
        applyDtOptionIds(state.nodeDef);
      }
    }),
    map(({ nodeDef }) => nodeDef),
    filter((state) => isDefined(state) && isDtAutocompleteDef(state)),
    withLatestFrom(
      getDataSource(state$).pipe(filter<DtQuickFilterDataSource>(Boolean)),
    ),
    map(([nodeDef, dataSource]) =>
      nodeDef!.autocomplete!.optionsOrGroups.filter(
        (node) =>
          isDtAutocompleteDef(node) &&
          dataSource.showInSidebarFunction(node.data),
      ),
    ),
  );

/** @internal Select the data Source from the store */
export const getDataSource = (state$: Observable<QuickFilterState>) =>
  state$.pipe(map((state) => state?.dataSource));

/** @internal Select the actual applied filters */
export const getFilters = (state$: Observable<QuickFilterState>) =>
  state$.pipe(map(({ filters }) => filters));

/** @internal Get the initial filters */
export const getInitialFilters = (state$: Observable<QuickFilterState>) =>
  state$.pipe(map(({ initialFilters }) => initialFilters));
