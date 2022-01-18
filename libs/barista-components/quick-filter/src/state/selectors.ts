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
import { isDefined } from '@dynatrace/barista-components/core';
import {
  applyDtOptionIds,
  DtNodeDef,
  isDtAutocompleteDef,
  isDtGroupDef,
} from '@dynatrace/barista-components/filter-field';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { DtQuickFilterDataSource } from '../quick-filter-data-source';
import { QuickFilterState } from './store';

/** @internal Select all autocompletes from the root Node Def from the store */
export const getAutocompletes = (
  state$: Observable<QuickFilterState>,
): Observable<DtNodeDef[]> =>
  state$.pipe(
    map((state) => {
      // apply the ids to the node to identify them later on
      if (state.nodeDef) {
        applyDtOptionIds(state.nodeDef);
      }
      return state.nodeDef;
    }),
    filter((nodeDef) => isDefined(nodeDef) && isDtAutocompleteDef(nodeDef)),
    withLatestFrom(
      getDataSource(state$).pipe(filter<DtQuickFilterDataSource>(Boolean)),
      state$.pipe(map(({ groupInDetailView }) => groupInDetailView)),
    ),
    map(([nodeDef, dataSource, detailGroup]) => {
      const filtered = filterNodeDefs(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nodeDef!.autocomplete!.optionsOrGroups,
      ).filter((node) => dataSource.showInSidebarFunction(node.data));

      if (detailGroup) {
        return filtered.filter((node) => node.option?.uid === detailGroup);
      }

      return filtered;
    }),
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

/** @internal Get if the show more detail page is shown */
export const getIsDetailView = (state$: Observable<QuickFilterState>) =>
  state$.pipe(map(({ groupInDetailView }) => Boolean(groupInDetailView)));

/**
 * Filter out all display able autocomplete out of the defs and groups
 *
 * @param nodeDefs The defs that should be checked
 */
function filterNodeDefs(nodeDefs: DtNodeDef[]): DtNodeDef[] {
  const defs: DtNodeDef[] = [];

  nodeDefs.forEach((def) => {
    // Add all autocomplete defs to the defs array
    if (isDtAutocompleteDef(def)) {
      defs.push(def);
    }

    if (isDtGroupDef(def)) {
      // parse the children of a group as well
      defs.push(...filterNodeDefs(def.group.options));
    }
  });

  return defs;
}
