import { mixinNotifyDomExit } from './dom-exit';
import { NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';

describe('mixinNotifyDomExit', () => {
  it('should augment an existing class with a _onDomExit subject', () => {
    const classWithMixin = mixinNotifyDomExit(TestClass);
    const instance = new classWithMixin();

    // Expected the mixed-into class to have a _onDomExit subject
    expect(instance._onDomExit).toBeTruthy();
    // Expected the mixed-into class _onDomExit to be a subject
    expect(instance._onDomExit instanceof Subject).toBeTruthy();
  });

  it('should augment an existing class with a _safeExit method', () => {
    const classWithMixin = mixinNotifyDomExit(TestClass);
    const instance = new classWithMixin();

    // tslint:disable-next-line:no-unbound-method
    expect(typeof instance._notifyDomExit).toEqual('function');
  });

  it('should emit a new value for the _onDomExit observable when microtasks are empty when safeExit is called', fakeAsync(() => {
    const classWithMixin = mixinNotifyDomExit(TestClass);
    const instance = new classWithMixin();

    const spy = jest.fn();
    instance._onDomExit.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    instance._notifyDomExit();
    instance._ngZone.run(() => {});
    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));
});

class TestClass {
  /** Fake instance of an NgZone. */
  _ngZone = new NgZone({ enableLongStackTrace: false });
}
