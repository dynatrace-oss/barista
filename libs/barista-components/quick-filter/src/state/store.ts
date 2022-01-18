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

import {
  DtAutocompleteValue,
  DtNodeDef,
} from '@dynatrace/barista-components/filter-field';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { DtQuickFilterDataSource } from '../quick-filter-data-source';
import { Action, ActionType } from './actions';
import { Effect, switchDataSourceEffect } from './effects';
import { Reducer } from './reducer';

/** @internal Interface that describes the QuickFilter state */
export interface QuickFilterState {
  /** The root NodeDef of the dataSource */
  nodeDef?: DtNodeDef;
  /** The dataSource that is connected with the QuickFilter */
  dataSource?: DtQuickFilterDataSource;
  /** Array of all active filter values (internal filter representation of the filter field) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: DtAutocompleteValue<any>[][];
  /** Initial Filter array that might be added via a binding to the quick filter */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFilters?: any[][];
  /** The group that is displayed in detail through the show more */
  groupInDetailView?: string;
}

/** @internal The initial QuickFilter state */
export const initialState: QuickFilterState = {
  filters: [],
};

/** Array of side effects */
const effects: Effect[] = [switchDataSourceEffect];

/**
 * The Quick Filter Store is one place where the state is handled.
 * It is a minimal implementation of a redux like architecture to handle
 * state in an immutable and on-directional way.
 *
 * This makes testing and debugging way easier, because there is always a
 * clear state that can only be modified through actions.
 *
 * 1. Action gets dispatched (An action indicates a change in the store)
 * 2. The reducer gets an action and the current state, and according to the action
 * modifies the state.
 * 3. A Selector can always read the latest value from the store and displays it in
 * a template. So the only way to modify the state is dispatching an action.
 * 4. If some async work has to be done the effect is responsible for that.
 * Effects are listening for actions then doing some async work and dispatching some
 * Other actions with the payload of the async stuff.
 */
class QuickFilterStore {
  /** The current action that got dispatched */
  private readonly action$ = new BehaviorSubject<Action>({
    type: ActionType.INIT,
  });

  /** The current state that is present */
  private readonly state$: BehaviorSubject<QuickFilterState>;

  constructor(reducer: Reducer, initialStoreState: QuickFilterState) {
    this.state$ = new BehaviorSubject<QuickFilterState>(initialStoreState);

    this.action$
      .pipe(
        shareReplay(),
        withLatestFrom(this.state$),
        map(([action, state]) => reducer(state, action)),
      )
      .subscribe((state) => {
        // Here the state gets modified through the outcome of the reducer
        this.state$.next(state);
      });

    // Each effect will get the stream of actions and will dispatch other actions in return
    // The emitted actions will be immediately dispatched through the normal store.dispatch()
    merge(...effects.map((epic) => epic(this.action$, this.state$))).subscribe(
      (action: Action) => {
        this.dispatch(action);
      },
    );
  }

  /** Dispatch a new Action that modifies the store */
  dispatch(action: Action): void {
    this.action$.next(action);
  }

  /** Use a provided selector function to get a State out of the store */
  select<T>(selector: (state$: Observable<QuickFilterState>) => T): T {
    return selector(this.state$);
  }
}

/** @internal This function creates the store for the quick filter  */
export function createQuickFilterStore(reducer: Reducer): QuickFilterStore {
  return new QuickFilterStore(reducer, initialState);
}
