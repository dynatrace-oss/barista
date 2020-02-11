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
import { pluck, tap, filter, map } from 'rxjs/operators';
import {
  isDtAutocompleteDef,
  DtNodeDef,
} from '@dynatrace/barista-components/filter-field';
import { applyDtOptionIds } from '../../../../filter-field/src/filter-field-util';
import { QuickFilterState } from './reducer';
import { Observable } from 'rxjs';

export const getAutocompletes = (
  state$: Observable<QuickFilterState>,
): Observable<DtNodeDef[]> =>
  state$.pipe(
    pluck('nodeDef'),
    filter(Boolean),
    tap((nodeDef: DtNodeDef) => {
      // apply the ids to the node to identify them later on
      applyDtOptionIds(nodeDef);
      console.log('Applied ids');
    }),
    filter(isDtAutocompleteDef),
    map(({ autocomplete }) =>
      autocomplete.optionsOrGroups.filter(isDtAutocompleteDef),
    ),
  );

export const getDataSource = (state$: Observable<QuickFilterState>) =>
  state$.pipe(pluck('dataSource'));
