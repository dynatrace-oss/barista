import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture, flushMicrotasks, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtFilterFieldModule, DtIconModule } from '@dynatrace/angular-components';
import { DtFilterField } from '@dynatrace/angular-components/filter-field/filter-field';
import { typeInElement } from '../../testing/type-in-element';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';
import { ENTER } from '@angular/cdk/keycodes';
import { DtAutocomplete } from '@dynatrace/angular-components/autocomplete';

// tslint:disable:no-use-before-declare
fdescribe('DtFilterField', () => {

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

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldBasic,
      ]);
      fixture = TestBed.createComponent(DtFormFieldBasic);
      filterFieldEl = fixture.debugElement.query(By.css('dt-filter-field')).nativeElement;
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
  });

  describe('with free text', () => {
    let fixture: ComponentFixture<DtFormFieldBasic>;
    let filterFieldEl: HTMLElement;
    let freeTextInputField: HTMLInputElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldBasic,
      ]);
      fixture = TestBed.createComponent(DtFormFieldBasic);
      fixture.detectChanges();
      filterFieldEl = fixture.debugElement.query(By.css('dt-filter-field')).nativeElement;
      freeTextInputField = fixture.debugElement.query(By.css('.dt-filter-field-free-text')).nativeElement;
    }));

    it('should focus the text input field when no other input type has been provided', () => {
      fixture.componentInstance.filterField.focus();
      expect(document.activeElement).toBe(freeTextInputField);
    });

    it('should emit the inputChange event when typing into free text input field', () => {
      const spy = jasmine.createSpy('filter input spy');
      const subscription = fixture.componentInstance.filterField.inputChange.subscribe(spy);

      typeInElement('x', freeTextInputField);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeInElement('xy', freeTextInputField);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    });

    it('should not emit an activeFilterChange when focusing the filter field with active free text', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      fixture.componentInstance.filterField.focus();

      expect(spy).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should not emit an activeFilterChange event when hitting enter on an empty input field', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      dispatchKeyboardEvent(freeTextInputField, 'keyup', ENTER);

      expect(spy).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should emit an activeFilterChange event when hitting enter on an non empty input field', () => {
      const spy = jasmine.createSpy('active filter spy');
      const subscription = fixture.componentInstance.filterField.activeFilterChange.subscribe(spy);

      typeInElement('x', freeTextInputField);
      dispatchKeyboardEvent(freeTextInputField, 'keyup', ENTER);

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });
  });

  describe('with autocomplete', () => {
    let fixture: ComponentFixture<DtFormFieldWithAutocomplete>;
    let filterFieldEl: HTMLElement;
    let autocomplete: DtAutocomplete<number>;
    let autocompleteTextInputField: HTMLInputElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldWithAutocomplete,
      ]);
      fixture = TestBed.createComponent(DtFormFieldWithAutocomplete);
      fixture.detectChanges();
      autocomplete = fixture.componentInstance.autocomplete;
      filterFieldEl = fixture.debugElement.query(By.css('dt-filter-field')).nativeElement;
      autocompleteTextInputField = fixture.debugElement.query(By.css('.dt-filter-field-autocomplete')).nativeElement;
    }));

    it('should focus the text input of the autocomplete if an autocomplete has been provided', () => {
      fixture.componentInstance.filterField.focus();
      expect(document.activeElement).toBe(autocompleteTextInputField);
    });

    it('should open the autocomplete if filter field is focused', () => {
      expect(autocomplete.isOpen).toBe(false);
      fixture.componentInstance.filterField.focus();
      expect(autocomplete.isOpen).toBe(true);
    });

    it('should emit the inputChange event when typing into the autocomplete input field', () => {
      const spy = jasmine.createSpy('autocomplete input spy');
      const subscription = fixture.componentInstance.filterField.inputChange.subscribe(spy);

      typeInElement('x', autocompleteTextInputField);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeInElement('xy', autocompleteTextInputField);
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

  describe('with changing input types', () => {
    let fixture: ComponentFixture<DtFormFieldWithAutocomplete>;
    let autocomplete: DtAutocomplete<number>;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldWithAutocomplete,
      ]);
      fixture = TestBed.createComponent(DtFormFieldWithAutocomplete);
      fixture.detectChanges();
      autocomplete = fixture.componentInstance.autocomplete;
    }));

    it('should focus and free text input again after submitting a free text (freetext -> freetext)', () => {
      fixture.componentInstance.showAutocomplete = false;
      fixture.detectChanges();

      let freeTextInput = fixture.debugElement.query(By.css('.dt-filter-field-free-text'));

      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      typeInElement('x', freeTextInput.nativeElement);
      dispatchKeyboardEvent(freeTextInput.nativeElement, 'keyup', ENTER);
      fixture.detectChanges();

      freeTextInput = fixture.debugElement.query(By.css('.dt-filter-field-free-text'));

      expect(freeTextInput).toBeDefined('free text input should be visible again');
      expect(freeTextInput.nativeElement).toBe(document.activeElement, 'free text input element should be focused again');
    });

    it('should focus and open autocomplete again when selecting an option in autocomplete (autocomplete -> autocomplete)',
       fakeAsync(() => {
      fixture.componentInstance.filterField.focus();
      fixture.detectChanges();

      const firstOption = fixture.debugElement.query(By.css('.dt-option')).nativeElement;
      firstOption.click();
      fixture.detectChanges();
      flushMicrotasks();

      const autocompleteInput = fixture.debugElement.query(By.css('.dt-filter-field-autocomplete'));
      expect(autocompleteInput).toBeDefined('autocomplete input should be visible again');
      expect(autocompleteInput.nativeNode).toBe(document.activeElement, 'autocomplete input element should be focused again');
      expect(autocomplete.isOpen).toBe(true);
    }));

    // it('should focus and open autocomplete after submitting a free text (freetext -> autocomplete)', fakeAsync(() => {
    //   fixture.componentInstance.showAutocomplete = false;
    //   fixture.detectChanges();

    //   let freeTextInput = fixture.debugElement.query(By.css('.dt-filter-field-free-text'));

    //   fixture.componentInstance.filterField.focus();
    //   fixture.detectChanges();

    //   typeInElement('x', freeTextInput.nativeElement);
    //   dispatchKeyboardEvent(freeTextInput.nativeElement, 'keyup', ENTER);

    //   fixture.componentInstance.showAutocomplete = true; // switching to autocomplete
    //   fixture.detectChanges();
    //   flushMicrotasks();

    //   const autocompleteInput = fixture.debugElement.query(By.css('.dt-filter-field-autocomplete'));
    //   freeTextInput = fixture.debugElement.query(By.css('.dt-filter-field-free-text'));

    //   expect(freeTextInput).toBeNull('free text input should not be visible');
    //   expect(autocompleteInput).toBeDefined('autocomplete input should be visible now');
    //   expect(autocompleteInput.nativeNode).toBe(document.activeElement, 'autocomplete input element should be focused now');
    //   expect(autocomplete.isOpen).toBe(true);
    // }));

    // it('should focus the free text input after selection an option in autocomplete (autocomplete -> freetext)', fakeAsync(() => {
    //   fixture.componentInstance.filterField.focus();
    //   fixture.detectChanges();

    //   const firstOption = fixture.debugElement.query(By.css('.dt-option')).nativeElement;
    //   firstOption.click();
    //   fixture.detectChanges();
    //   flushMicrotasks();

    //   const freeTextInput = fixture.debugElement.query(By.css('.dt-filter-field-free-text'));
    //   const autocompleteInput = fixture.debugElement.query(By.css('.dt-filter-field-autocomplete'));

    //   expect(autocompleteInput).toBeNull('autocomplete input should not be visible');
    //   expect(freeTextInput).toBeDefined('free text input should be visible now');
    //   expect(freeTextInput.nativeElement).toBe(document.activeElement, 'free text input element should be focused now');
    // }));
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
  @ViewChild(DtFilterField) filterField: DtFilterField;
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
  @ViewChild(DtFilterField) filterField: DtFilterField;
  @ViewChild(DtAutocomplete) autocomplete: DtAutocomplete<number>;

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
