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

    // tslint:disable-next-line:no-any
    instance.disabled = 'disabled' as any;
    // Expected the mixed-into class to have an updated disabled property
    expect(instance.disabled).toBe(true);
  });
});
