import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { Constructor } from './constructor';

export interface CanDisable {
  /** Whether the component is disabled. */
  disabled: boolean;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinDisabled<T extends Constructor<{}>>(
  base: T,
): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled = false;

    get disabled(): boolean {
      return this._disabled;
    }
    set disabled(value: boolean) {
      this._disabled = coerceBooleanProperty(value);
    }

    // tslint:disable-next-line
    constructor(...args: any[]) {
      super(...args); // tslint:disable-line:no-inferred-empty-object-type
    }
  };
}
