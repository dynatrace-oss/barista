import { DtOptionModule, DtOption } from '@dynatrace/angular-components';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

describe('DtOption', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtOptionModule],
      declarations: [OptionWithDisable],
    }).compileComponents();
  }));

  it('should complete the `stateChanges` stream on destroy', () => {
    const fixture = TestBed.createComponent(OptionWithDisable);
    fixture.detectChanges();

    const optionInstance: DtOption<string> =
      fixture.debugElement.query(By.directive(DtOption)).componentInstance;
    const completeSpy = jasmine.createSpy('complete spy');
    const subscription = optionInstance._stateChanges.subscribe(undefined, undefined, completeSpy);

    fixture.destroy();
    expect(completeSpy).toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should not emit to `selectionChange` if selecting an already-selected option', () => {
    const fixture = TestBed.createComponent(OptionWithDisable);
    fixture.detectChanges();

    const optionInstance: DtOption<string> =
      fixture.debugElement.query(By.directive(DtOption)).componentInstance;

    optionInstance.select();
    expect(optionInstance.selected).toBe(true);

    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.selectionChange.subscribe(spy);

    optionInstance.select();
    fixture.detectChanges();

    expect(optionInstance.selected).toBe(true);
    expect(spy).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('should not emit to `selectionChange` if deselecting an unselected option', () => {
    const fixture = TestBed.createComponent(OptionWithDisable);
    fixture.detectChanges();

    const optionInstance: DtOption<string> =
      fixture.debugElement.query(By.directive(DtOption)).componentInstance;

    optionInstance.deselect();
    expect(optionInstance.selected).toBe(false);

    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.selectionChange.subscribe(spy);

    optionInstance.deselect();
    fixture.detectChanges();

    expect(optionInstance.selected).toBe(false);
    expect(spy).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });
});

@Component({
  template: `<dt-option [disabled]="disabled"></dt-option>`,
})
class OptionWithDisable {
  disabled: boolean;
}
