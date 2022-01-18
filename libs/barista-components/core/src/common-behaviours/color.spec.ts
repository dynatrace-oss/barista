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

import { ElementRef } from '@angular/core';

import { mixinColor } from './color';

describe('MixinColor', () => {
  it('should augment an existing class with a color property', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    // Expected the mixed-into class to have a color property
    expect(instance.color).toBeFalsy();

    instance.color = 'accent';

    // Expected the mixed-into class to have an updated color property
    expect(instance.color).toBe('accent');
  });

  it('should remove old color classes if new color is set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    // Expected the element to not have any classes at initialization
    expect(instance.testElement.classList.length).toBe(0);

    instance.color = 'main';

    // Expected the element to have the "dt-color-main" class set
    expect(instance.testElement.classList).toContain('dt-color-main');

    instance.color = 'accent';

    // Expected the element to no longer have "dt-color-main" set.
    expect(instance.testElement.classList).not.toContain('dt-color-main');
    // Expected the element to have the "dt-color-accent" class set
    expect(instance.testElement.classList).toContain('dt-color-accent');
  });

  it('should allow having no color set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    // Expected the element to not have any classes at initialization
    expect(instance.testElement.classList.length).toBe(0);

    instance.color = 'main';

    // Expected the element to have the "dt-color-main" class set
    expect(instance.testElement.classList).toContain('dt-color-main');

    instance.color = undefined;

    // Expected the element to have no color class set.
    expect(instance.testElement.classList.length).toBe(0);
  });

  it('should allow having a default color if specified', () => {
    const classWithColor = mixinColor(TestClass, 'accent');
    const instance = new classWithColor();

    // Expected the element to have the "dt-color-accent" class by default.
    expect(instance.testElement.classList).toContain('dt-color-accent');

    instance.color = undefined;

    // Expected the default color "dt-color-accent" to be set.
    expect(instance.testElement.classList).toContain('dt-color-accent');
  });
});

class TestClass {
  // eslint-disable-next-line
  testElement: HTMLElement = document.createElement('div');

  /** Fake instance of an ElementRef. */
  _elementRef = new ElementRef(this.testElement);
}
