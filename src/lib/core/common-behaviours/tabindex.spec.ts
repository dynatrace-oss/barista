// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

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
// tslint:enable:no-magic-numbers
