import { Constructor } from './constructor';
import { Subject } from 'rxjs';
import { NgZone } from '@angular/core';
import { take } from 'rxjs/operators';

export interface CanNotifyOnExit {
  readonly _onExit: Subject<void>;
  _safeExit(): void;
}

export interface HasNgZone {
  _ngZone: NgZone;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinMicrotaskEmpty<T extends Constructor<HasNgZone>>(base: T): Constructor<CanNotifyOnExit> & T {
  return class extends base {
    _onExit = new Subject<void>();

    _safeExit(): void {
      this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe(() => {
        this._onExit.next();
        this._onExit.complete();
      });
    }

    // tslint:disable-next-line
    constructor(...args: any[]) { super(...args); }
  };
}
