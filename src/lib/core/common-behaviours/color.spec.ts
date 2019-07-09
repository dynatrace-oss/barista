// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { mixinColor } from './color';
import { ElementRef } from '@angular/core';

describe('MixinColor', () => {
  it('should augment an existing class with a color property', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.color).toBeFalsy(
      'Expected the mixed-into class to have a color property'
    );

    instance.color = 'accent';

    expect(instance.color).toBe(
      'accent',
      'Expected the mixed-into class to have an updated color property'
    );
  });

  it('should remove old color classes if new color is set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.testElement.classList.length).toBe(
      0,
      'Expected the element to not have any classes at initialization'
    );

    instance.color = 'main';

    expect(instance.testElement.classList).toContain(
      'dt-color-main',
      'Expected the element to have the "dt-color-main" class set'
    );

    instance.color = 'accent';

    expect(instance.testElement.classList).not.toContain(
      'dt-color-main',
      'Expected the element to no longer have "dt-color-main" set.'
    );
    expect(instance.testElement.classList).toContain(
      'dt-color-accent',
      'Expected the element to have the "dt-color-accent" class set'
    );
  });

  it('should allow having no color set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.testElement.classList.length).toBe(
      0,
      'Expected the element to not have any classes at initialization'
    );

    instance.color = 'main';

    expect(instance.testElement.classList).toContain(
      'dt-color-main',
      'Expected the element to have the "dt-color-main" class set'
    );

    instance.color = undefined;

    expect(instance.testElement.classList.length).toBe(
      0,
      'Expected the element to have no color class set.'
    );
  });

  it('should allow having a default color if specified', () => {
    const classWithColor = mixinColor(TestClass, 'accent');
    const instance = new classWithColor();

    expect(instance.testElement.classList).toContain(
      'dt-color-accent',
      'Expected the element to have the "dt-color-accent" class by default.'
    );

    instance.color = undefined;

    expect(instance.testElement.classList).toContain(
      'dt-color-accent',
      'Expected the default color "dt-color-accent" to be set.'
    );
  });
});

class TestClass {
  // tslint:disable-next-line: ban
  testElement: HTMLElement = document.createElement('div');

  /** Fake instance of an ElementRef. */
  _elementRef = new ElementRef(this.testElement);
}
