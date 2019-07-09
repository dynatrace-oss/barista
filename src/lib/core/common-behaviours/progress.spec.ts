// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { mixinHasProgress, HasProgressValues } from './progress';

describe('MixinProgress', () => {
  it('should augment an existing class with a progress property', () => {
    class EmptyClass {}

    const classWithProgress = mixinHasProgress(EmptyClass);
    const instance = new classWithProgress();

    expect(instance.value).toBe(0, 'Expected default value of the property');
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
    class EmptyClassImpl extends classWithProgress
      implements HasProgressValues {}

    const spy = jasmine.createSpy();
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
