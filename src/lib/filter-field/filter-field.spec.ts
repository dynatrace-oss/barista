import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture, flushMicrotasks, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ENTER } from '@angular/cdk/keycodes';
import { DtFilterFieldModule, DtFilterField, DtIconModule } from '@dynatrace/angular-components';
import { typeInElement } from '../../testing/type-in-element';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';

// tslint:disable:no-use-before-declare
describe('DtFilterField', () => {

  // tslint:disable-next-line:no-any
  function configureDtSelectTestingModule(declarations: any[]): void {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtFilterFieldModule,
      ],
      declarations,
    }).compileComponents();
  }

  describe('core', () => {
    let fixture: ComponentFixture<DtFormFieldBasic>;
    let filterFieldEl: HTMLElement;
    let inputEl: HTMLInputElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldBasic,
      ]);
      fixture = TestBed.createComponent(DtFormFieldBasic);
      fixture.detectChanges();

      filterFieldEl = fixture.debugElement.query(By.css('dt-filter-field')).nativeElement;
      inputEl = fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
    }));

    it('should set the filter-by label', () => {
      const label: HTMLElement = fixture.debugElement.query(By.css('.dt-filter-field-label')).nativeElement;

      expect(label.textContent).toBe('');

      fixture.componentInstance.label = 'Filter by';
      fixture.detectChanges();

      expect(label.textContent).toBe('Filter by');
    });

    it('should update the filter-by label', () => {
      const label: HTMLElement = fixture.debugElement.query(By.css('.dt-filter-field-label')).nativeElement;

      fixture.componentInstance.label = 'Filter by';
      fixture.detectChanges();

      expect(label.textContent).toBe('Filter by');

      fixture.componentInstance.label = 'Filter';
      fixture.detectChanges();

      expect(label.textContent).toBe('Filter');
    });

    it('should focus the input field when focusing the host', () => {
      const input = fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
      fixture.componentInstance.filterField.focus();
      expect(document.activeElement).toBe(input);
    });

    it('should not emit an activeFilterChange when focusing the filter field', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      fixture.componentInstance.filterField.focus();

      expect(spy).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should emit the inputChange event when typing into the input field', () => {
      const spy = jasmine.createSpy('filter input spy');
      const subscription = fixture.componentInstance.filterField.inputChange.subscribe(spy);

      typeInElement('x', inputEl);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeInElement('xy', inputEl);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    });
  });

  describe('with free text', () => {
    let fixture: ComponentFixture<DtFormFieldBasic>;
    let inputEl: HTMLInputElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldBasic,
      ]);
      fixture = TestBed.createComponent(DtFormFieldBasic);
      fixture.detectChanges();
      inputEl = fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
    }));

    it('should emit an activeFilterChange event when hitting enter on a filled input field', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      typeInElement('x', inputEl);
      dispatchKeyboardEvent(inputEl, 'keyup', ENTER);

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });
  });

  describe('with autocomplete', () => {
    let fixture: ComponentFixture<DtFormFieldWithAutocomplete>;
    let inputEl: HTMLInputElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldWithAutocomplete,
      ]);
      fixture = TestBed.createComponent(DtFormFieldWithAutocomplete);
      fixture.detectChanges();
      inputEl = fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
    }));

    it('should open the autocomplete if filter field is focused', () => {
      expect(fixture.componentInstance.filterField._autocomplete.isOpen).toBe(false);
      fixture.componentInstance.filterField.focus();
      expect(fixture.componentInstance.filterField._autocomplete.isOpen).toBe(true);
    });

    it('should emit the inputChange event when typing into the input field with autocomplete', () => {
      const spy = jasmine.createSpy('autocomplete input spy');
      const subscription = fixture.componentInstance.filterField.inputChange.subscribe(spy);

      typeInElement('x', inputEl);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeInElement('xy', inputEl);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    });

    it('should not emit an activeFilterChange when focusing the filter field with active autocomplete', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      fixture.componentInstance.filterField.focus();

      expect(spy).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should emit an activeFilterChange when selection an autocomplete option', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      const firstOption = fixture.debugElement.query(By.css('.dt-option')).nativeElement;
      firstOption.click();

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });
  });

  describe('with changing input types (free text, autocomplete)', () => {
    let fixture: ComponentFixture<DtFormFieldWithAutocomplete>;
    let inputEl: HTMLInputElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldWithAutocomplete,
      ]);
      fixture = TestBed.createComponent(DtFormFieldWithAutocomplete);
      fixture.detectChanges();
      inputEl = fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
    }));

    it('should focus the input again after submitting a free text', () => {
      fixture.componentInstance.showAutocomplete = false;
      fixture.detectChanges();

      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      typeInElement('x', inputEl);
      dispatchKeyboardEvent(inputEl, 'keyup', ENTER);
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputEl, 'input element should be focused again');
    });

    it('should focus and open autocomplete again when selecting an option in autocomplete (autocomplete -> autocomplete)',
       fakeAsync(() => {
      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      const firstOption = fixture.debugElement.query(By.css('.dt-option')).nativeElement;
      firstOption.click();
      fixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement).toBe(inputEl, 'input element should be focused again');
      expect(fixture.componentInstance.filterField._autocomplete.isOpen).toBe(true);
    }));

    it('should focus and open autocomplete after submitting a free text (freetext -> autocomplete)', fakeAsync(() => {
      fixture.componentInstance.showAutocomplete = false;
      fixture.detectChanges();

      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      typeInElement('x', inputEl);
      dispatchKeyboardEvent(inputEl, 'keyup', ENTER);

      // switching to autocomplete
      fixture.componentInstance.showAutocomplete = true;
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputEl, 'input element should be focused again');
      expect(fixture.componentInstance.filterField._autocomplete.isOpen).toBe(true);
    }));

    it('should focus the input element after selecting an option in autocomplete (autocomplete -> freetext)', fakeAsync(() => {
      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      const firstOption = fixture.debugElement.query(By.css('.dt-option')).nativeElement;
      firstOption.click();
      fixture.detectChanges();
      flushMicrotasks();

      // switching to free text
      fixture.componentInstance.showAutocomplete = false;
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputEl, 'input element should be focused again');
    }));
  });
});

// tslint:enable:no-use-before-declare

@Component({
  template: `
    <dt-filter-field [label]="label">
    </dt-filter-field>
  `,
})
class DtFormFieldBasic {
  label = '';
  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
}

@Component({
  template: `
    <dt-filter-field>
      <dt-autocomplete *ngIf="showAutocomplete">
        <dt-option *ngFor="let option of options" [value]="option">{{option.name}}</dt-option>
      </dt-autocomplete>
    </dt-filter-field>
  `,
})
class DtFormFieldWithAutocomplete {
  @ViewChild(DtFilterField) filterField: DtFilterField<any>;

  showAutocomplete = true;

  // tslint:disable-next-line:no-magic-numbers
  options = [
    { name: 'Option 1', value: 1 },
    { name: 'Option 2', value: 2 },
    { name: 'Option 3', value: 3 },
    { name: 'Option 4', value: 4 },
    { name: 'Option 5', value: 5 },
  ];
}
