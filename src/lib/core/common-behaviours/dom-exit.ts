import { Constructor } from './constructor';
import { Subject } from 'rxjs';
import { NgZone } from '@angular/core';
import { take } from 'rxjs/operators';

export interface CanNotifyOnExit {
  readonly _onDomExit: Subject<void>;
  _notifyDomExit(): void;
}

export interface HasNgZone {
  _ngZone: NgZone;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinNotifyDomExit<T extends Constructor<HasNgZone>>(base: T): Constructor<CanNotifyOnExit> & T {
  return class extends base {
    _onDomExit = new Subject<void>();

    _notifyDomExit(): void {
      this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe(() => {
        this._onDomExit.next();
        this._onDomExit.complete();
      });
    }

    // tslint:disable-next-line
    constructor(...args: any[]) { super(...args); }
  };
}
