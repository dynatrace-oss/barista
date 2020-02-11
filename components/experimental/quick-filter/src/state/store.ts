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

import { Observable, merge, BehaviorSubject } from 'rxjs';
import { shareReplay, tap, map, withLatestFrom } from 'rxjs/operators';
import { QuickFilterState, Reducer } from './reducer';
import { Action, ActionType } from './actions';
import { Effect, switchDataSourceEffect } from './effects';

/** The type for the quick filter store */
// export type QuickFilterStore = {
//   dispatch: (action: Action) => void;
//   subscribe: (observer: NextObserver<QuickFilterState>) => Subscription;
//   select: <T>(fn: (state$: Observable<QuickFilterState>) => T) => T;
// };

/** Array of side effects */
const effects: Effect[] = [switchDataSourceEffect];

class Store {
  private readonly action$ = new BehaviorSubject<Action>({
    type: ActionType.INIT,
  });
  private readonly state$: BehaviorSubject<QuickFilterState>;

  constructor(reducer: Reducer, initialState: QuickFilterState) {
    this.state$ = new BehaviorSubject<QuickFilterState>(initialState);

    this.action$
      .pipe(
        shareReplay(),
        tap(console.log),
        withLatestFrom(this.state$),
        map(([action, state]) => reducer(state, action)),
      )
      .subscribe(state => {
        this.state$.next(state);
      });

    // Each effect will get the stream of actions and will dispatch other actions in return
    // The emitted actions will be immediately dispatched through the normal store.dispatch()
    merge(...effects.map(epic => epic(this.action$, this.state$))).subscribe(
      (action: Action) => {
        this.dispatch(action);
      },
    );
  }

  dispatch(action: Action): void {
    this.action$.next(action);
  }

  select<T>(selector: (state$: Observable<QuickFilterState>) => T): T {
    return selector(this.state$);
  }
}

/** This function creates the store for the quick filter  */
export function createQuickFilterStore(reducer: Reducer): Store {
  const initialState: QuickFilterState = {
    filters: [],
  };

  return new Store(reducer, initialState);

  // // Create the Action Subject
  // const action$ = new BehaviorSubject<Action>({ type: ActionType.INIT });
  // // Each dispatched action will be reduced by the reducer.
  // const state$ = action$.pipe(
  //   scan(reducer, initialState),
  //   shareReplay(),
  // );

  // switchDataSourceEffect(action$, state$).subscribe(effect => {
  //   console.log("ALSKJDF:LKJ", effect)
  //   action$.next(effect);
  // })

  // // Each effect will get the stream of actions and will dispatch other actions in return
  // // The emitted actions will be immediately dispatched through the normal store.dispatch()
  // // merge(...effects.map(epic => epic(action$, state$))).subscribe(
  // //   (effect: Action) => {
  // //     action$.next(effect);
  // //   },
  // // );

  // return {
  //   dispatch: action$.next.bind(action$),
  //   subscribe: state$.subscribe.bind(state$),
  //   select: state$.pipe.bind(state$),
  // };
}
