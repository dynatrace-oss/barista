import { Constructor } from './constructor';
import { ErrorStateMatcher } from '../error';
import {
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { Subject } from 'rxjs';

export interface CanUpdateErrorState {
  updateErrorState(): void;
  readonly stateChanges: Subject<void>;
  errorState: boolean;
  errorStateMatcher: ErrorStateMatcher;
}

export interface HasErrorState {
  _parentFormGroup: FormGroupDirective;
  _parentForm: NgForm;
  _defaultErrorStateMatcher: ErrorStateMatcher;
  ngControl: NgControl;
}

/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState<T extends Constructor<HasErrorState>>(
  base: T
): Constructor<CanUpdateErrorState> & T {
  return class extends base {
    /** Whether the component is in an error state. */
    errorState = false;

    /** Stream that emits whenever the state of the input changes */
    readonly stateChanges = new Subject<void>();

    errorStateMatcher: ErrorStateMatcher;

    updateErrorState(): void {
      const oldState = this.errorState;
      const parent = this._parentFormGroup || this._parentForm;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      // Disable 'no-unnecessary-type-assertion' rule here as it is a bug in tslint and TS:
      // https://github.com/palantir/tslint/issues/3540
      // tslint:disable-next-line:no-unnecessary-type-assertion
      const control = this.ngControl
        ? (this.ngControl.control as FormControl)
        : null;
      const newState = matcher.isErrorState(control, parent);

      if (newState !== oldState) {
        this.errorState = newState;
        this.stateChanges.next();
      }
    }

    // tslint:disable-next-line:no-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
