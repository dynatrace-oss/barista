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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { mixinTabIndex } from './tabindex';

describe('mixinTabIndex', () => {
  it('should augment an existing class with a tabIndex property', () => {
    const classWithMixin = mixinTabIndex(TestClass);
    const instance = new classWithMixin();

    expect(instance.tabIndex).toBe(0);

    instance.tabIndex = 4;

    expect(instance.tabIndex).toBe(4);
  });

  it('should set tabIndex to `-1` if the disabled property is set to true', () => {
    const classWithMixin = mixinTabIndex(TestClass);
    const instance = new classWithMixin();

    expect(instance.tabIndex).toBe(0);

    instance.disabled = true;

    expect(instance.tabIndex).toBe(-1);
  });

  it('should allow having a custom default tabIndex value', () => {
    const classWithMixin = mixinTabIndex(TestClass, 20);
    const instance = new classWithMixin();

    expect(instance.tabIndex).toBe(20);

    instance.tabIndex = 0;

    expect(instance.tabIndex).toBe(0);
  });
});

class TestClass {
  disabled = false;
}
/* eslint-enable no-magic-numbers */
