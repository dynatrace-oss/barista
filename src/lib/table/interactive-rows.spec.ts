import {mixinHasInteractiveRows} from './interactive-rows';
import { CdkTable } from '@angular/cdk/table';
import { Constructor } from '@dynatrace/angular-components/core';

describe('mixinHasInteractiveRows', () => {
  it('should augment an existing class with a interactiveRows property', () => {
    class EmptyClass {}
    // tslint:disable-next-line:no-any
    const classWithInteractiveRows = mixinHasInteractiveRows<any>(EmptyClass as unknown as Constructor<CdkTable<any>>);
    const instance = new classWithInteractiveRows();

    expect(instance.interactiveRows)
        .toBe(false, 'Expected the mixed-into class to have a interactiveRows property');

    instance.interactiveRows = true;
    expect(instance.interactiveRows)
        .toBe(true, 'Expected the mixed-into class to have an updated interactiveRows property');
  });

  it('should also accept string values', () => {
    class EmptyClass {}
    // tslint:disable-next-line:no-any
    const classWithInteractiveRows = mixinHasInteractiveRows<any>(EmptyClass as unknown as Constructor<CdkTable<any>>);
    const instance = new classWithInteractiveRows();

    expect(instance.interactiveRows)
        .toBe(false, 'Expected the mixed-into class to have a interactiveRows property');

    // tslint:disable-next-line:no-any
    instance.interactiveRows = 'interactiveRows' as any;
    expect(instance.interactiveRows)
        .toBe(true, 'Expected the mixed-into class to have an updated interactiveRows property');
  });
});
