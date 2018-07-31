import { mixinMicrotaskEmpty } from './microtask-empty';
import { NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';

describe('MixinMicrotaskEmpty', () => {

  it('should augment an existing class with a _onExit subject', () => {
    const classWithMixin = mixinMicrotaskEmpty(TestClass);
    const instance = new classWithMixin();

    expect(instance._onExit)
        .toBeTruthy('Expected the mixed-into class to have a _onExit subject');
    expect(instance._onExit instanceof Subject)
      .toBeTruthy('Expected the mixed-into class _onExit to be a subject');
  });

  it('should augment an existing class with a _safeExit method', () => {
    const classWithMixin = mixinMicrotaskEmpty(TestClass);
    const instance = new classWithMixin();

    // tslint:disable-next-line:no-unbound-method
    expect(typeof instance._safeExit)
        .toEqual('function');
  });

  it('should emit a new value for the _onExit observable when microtasks are empty when safeExit is called', fakeAsync(() => {
    const classWithMixin = mixinMicrotaskEmpty(TestClass);
    const instance = new classWithMixin();

    const spy = jasmine.createSpy('_onExit spy');
    instance._onExit.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    instance._safeExit();
    instance._ngZone.run(() => {});
    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));
});

class TestClass {
  /** Fake instance of an NgZone. */
  _ngZone = new NgZone({ enableLongStackTrace: false });
}
