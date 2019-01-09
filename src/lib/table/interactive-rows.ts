import { Constructor } from '@dynatrace/angular-components/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkTable } from '@angular/cdk/table';

export interface HasInteractiveRows {
  /** Whether the table has interactive rows */
  interactiveRows: boolean;
}

/** Mixin to augment a directive with a `interactiveRows` property. */
export function mixinHasInteractiveRows<T>(base: Constructor<CdkTable<T>>): Constructor<HasInteractiveRows & CdkTable<T>> {
  return class extends base {
    private _interactiveRows: boolean;

    get interactiveRows(): boolean { return this._interactiveRows; }
    set interactiveRows(value: boolean) { this._interactiveRows = coerceBooleanProperty(value); }

    // tslint:disable-next-line
    constructor(...args: any[]) { super(...args); }
  };
}
