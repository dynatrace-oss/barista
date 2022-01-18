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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HasProgressValues, mixinHasProgress } from './progress';

describe('MixinProgress', () => {
  it('should augment an existing class with a progress property', () => {
    class EmptyClass {}

    const classWithProgress = mixinHasProgress(EmptyClass);
    const instance = new classWithProgress();

    expect(instance.value).toBe(0);
  });

  it('should calculate percentage', () => {
    class EmptyClass {}

    const classWithProgress = mixinHasProgress(EmptyClass);
    const instance = new classWithProgress();

    instance.value = 50;

    expect(instance.percent).toBe(50);

    instance.max = 500;

    expect(instance.percent).toBe(10);
  });

  it('should clamp values', () => {
    class EmptyClass {}

    const classWithProgress = mixinHasProgress(EmptyClass);
    const instance = new classWithProgress();

    instance.value = 50;
    instance.value = 200;

    expect(instance.percent).toBe(100);

    expect(instance.value).toBe(100);
  });

  it('should fire event', () => {
    class EmptyClass {}

    const classWithProgress = mixinHasProgress(EmptyClass);
    class EmptyClassImpl
      extends classWithProgress
      implements HasProgressValues {}

    const spy = jest.fn();
    const instance = new EmptyClassImpl();
    const sub = instance.valueChange.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(0);

    instance.value = 50;
    expect(spy).toHaveBeenCalledTimes(1);

    instance.value = 200;
    expect(spy).toHaveBeenCalledTimes(2);

    instance.value = 200;
    expect(spy).toHaveBeenCalledTimes(2);

    sub.unsubscribe();
  });
});
