/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { mixinDisabled } from './disabled';

describe('MixinDisabled', () => {
  it('should augment an existing class with a disabled property', () => {
    class EmptyClass {}

    const classWithDisabled = mixinDisabled(EmptyClass);
    const instance = new classWithDisabled();

    // Expected the mixed-into class to have a disabled property
    expect(instance.disabled).toBe(false);

    instance.disabled = true;
    // Expected the mixed-into class to have an updated disabled property
    expect(instance.disabled).toBe(true);
  });

  it('should also accept string values', () => {
    class EmptyClass {}

    const classWithDisabled = mixinDisabled(EmptyClass);
    const instance = new classWithDisabled();

    // Expected the mixed-into class to have a disabled property
    expect(instance.disabled).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance.disabled = 'disabled' as any;
    // Expected the mixed-into class to have an updated disabled property
    expect(instance.disabled).toBe(true);
  });
});
