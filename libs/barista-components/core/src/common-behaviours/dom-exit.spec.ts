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

import { NgZone } from '@angular/core';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { mixinNotifyDomExit } from './dom-exit';

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

    // eslint-disable-next-line @typescript-eslint/unbound-method
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
