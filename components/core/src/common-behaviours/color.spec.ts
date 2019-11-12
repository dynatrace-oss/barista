// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

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
  // tslint:disable-next-line: ban
  testElement: HTMLElement = document.createElement('div');

  /** Fake instance of an ElementRef. */
  _elementRef = new ElementRef(this.testElement);
}
