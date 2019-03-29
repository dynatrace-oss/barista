// tslint:disable:no-use-before-declare i18n newline-per-chained-call no-floating-promises no-magic-numbers

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DtFilterFieldTag, DtFilterFieldModule, DtIconModule } from '@dynatrace/angular-components';

describe('DtFilterFieldTag', () => {
  let fixture: ComponentFixture<TestApp>;
  let filterFieldTag: DtFilterFieldTag;
  let filterFieldTagHost: HTMLElement;
  let editButton: HTMLButtonElement;
  let removeButton: HTMLButtonElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DtFilterFieldModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [TestApp],
    }).compileComponents();

    fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    filterFieldTag = fixture.debugElement.query(By.directive(DtFilterFieldTag)).componentInstance;
    filterFieldTagHost = fixture.debugElement.query(By.css('.dt-filter-field-tag')).nativeElement;
    editButton = fixture.debugElement.query(By.css('.dt-filter-field-tag-label')).nativeElement;
    removeButton = fixture.debugElement.query(By.css('.dt-filter-field-tag-button')).nativeElement;
  }));

  it('should handle disabled', () => {
    expect(filterFieldTag.disabled).toBe(false);
    expect(filterFieldTagHost.classList).not.toContain('dt-filter-field-tag-disabled');
    expect(editButton.getAttribute('disabled')).toBe(null);
    expect(removeButton.getAttribute('disabled')).toBe(null);

    filterFieldTag.disabled = true;
    fixture.detectChanges();

    expect(filterFieldTag.disabled).toBe(true);
    expect(filterFieldTagHost.classList).toContain('dt-filter-field-tag-disabled');
    expect(editButton.getAttribute('disabled')).toBeDefined();
    expect(removeButton.getAttribute('disabled')).toBeDefined();
  });

  it('should also accept string values to handle disabled', () => {
    expect(filterFieldTag.disabled).toBe(false);

    // tslint:disable-next-line:no-any
    filterFieldTag.disabled = 'disabled' as any;

    expect(filterFieldTag.disabled).toBe(true);
  });

  it('should emit the edit event when clicking the label', fakeAsync(() => {
    const editSpy = jasmine.createSpy('filter field tag edit spy');
    const editSubscription = filterFieldTag.edit.subscribe(editSpy);

    editButton.click();
    tick();

    expect(editSpy).toHaveBeenCalledTimes(1);

    editSubscription.unsubscribe();
  }));

  it('should emit the remove event when clicking the button', fakeAsync(() => {
    const removeSpy = jasmine.createSpy('filter field tag remove spy');
    const removeSubscription = filterFieldTag.remove.subscribe(removeSpy);

    removeButton.click();
    tick();

    expect(removeSpy).toHaveBeenCalledTimes(1);

    removeSubscription.unsubscribe();
  }));

  it('should not emit remove and edit events when disabled', fakeAsync(() => {
    const editSpy = jasmine.createSpy('filter field tag edit spy');
    const removeSpy = jasmine.createSpy('filter field tag remove spy');
    const editSubscription = filterFieldTag.edit.subscribe(editSpy);
    const removeSubscription = filterFieldTag.remove.subscribe(removeSpy);

    filterFieldTag.disabled = true;
    fixture.detectChanges();

    editButton.click();
    removeButton.click();

    tick();

    expect(editSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();

    editSubscription.unsubscribe();
    removeSubscription.unsubscribe();
  }));
});

@Component({
  selector: 'test-app',
  template: `
  <dt-filter-field-tag></dt-filter-field-tag>
`,
})
export class TestApp { }
