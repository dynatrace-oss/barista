import { mixinDisabled } from './disabled';

describe('MixinDisabled', () => {
  it('should augment an existing class with a disabled property', () => {
    class EmptyClass {}

    const classWithDisabled = mixinDisabled(EmptyClass);
    const instance = new classWithDisabled();

    expect(instance.disabled).toBe(
      false,
      'Expected the mixed-into class to have a disabled property'
    );

    instance.disabled = true;
    expect(instance.disabled).toBe(
      true,
      'Expected the mixed-into class to have an updated disabled property'
    );
  });

  it('should also accept string values', () => {
    class EmptyClass {}

    const classWithDisabled = mixinDisabled(EmptyClass);
    const instance = new classWithDisabled();

    expect(instance.disabled).toBe(
      false,
      'Expected the mixed-into class to have a disabled property'
    );

    // tslint:disable-next-line:no-any
    instance.disabled = 'disabled' as any;
    expect(instance.disabled).toBe(
      true,
      'Expected the mixed-into class to have an updated disabled property'
    );
  });
});
