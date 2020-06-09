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

import { Injectable } from '@angular/core';
import { isEqual } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export abstract class StatefulServiceBase<TState extends {}> {
  private _previousState: TState | undefined;

  /** Observable with the current state */
  protected state$ = new BehaviorSubject<TState>({} as any);

  constructor() {
    // Show a warning message if there are unsaved changes when closing the page
    window.addEventListener('beforeunload', (event) => {
      if (this.hasPendingChanges) {
        event.preventDefault();
        event.returnValue = ''; // Required for some browsers
      }
    });
  }

  /** Returns the current state mapped to the given selector */
  selectState<T>(selector: (state: TState) => T): T {
    return selector(this.state$.getValue());
  }

  /** Overwrites the current state */
  modifyState(changeFn: (state: TState) => TState): void {
    const currentState = this.state$.getValue();
    const newState = changeFn(currentState);

    if (!isEqual(currentState, newState)) {
      this.state$.next(newState);
    }
  }

  /** Records the current state to be able to restore it later */
  saveStateSnapshot(): void {
    this._previousState = this.state$.getValue();
  }

  /** Applies changes to the edited theme, deleting the previously stored snapshot. */
  applyChanges(): void {
    this._previousState = undefined;
    this.state$.next(this.state$.getValue());
  }

  /** Restores the last saved state. */
  revertChanges(): void {
    if (this._previousState) {
      this.state$.next(this._previousState);
      this._previousState = undefined;
    }
  }

  /** Whether the current state has pending changes */
  get hasPendingChanges(): boolean {
    // To check for changes between the current and the saved state,
    // we need to get rid of the generated colors in the palettes since
    // they are lazily generated when displaying the page
    return this.checkStateModified((state) => state);
  }

  /**
   * Checks whether some properties have changed from the previous state.
   * Can be used to determine if the current state is "dirty".
   * @param propertySelector Function that takes a state and returns which properties should be compared
   */
  protected checkStateModified(
    propertySelector: (state: TState) => Object,
  ): boolean {
    if (!this._previousState) {
      return false;
    }

    return !isEqual(
      propertySelector(this.state$.getValue()),
      propertySelector(this._previousState),
    );
  }
}
