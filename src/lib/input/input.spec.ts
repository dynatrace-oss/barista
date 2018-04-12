import { Component, ViewChild } from '@angular/core';
import { TestBed, fakeAsync, inject, ComponentFixture, flush } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormsModule,
  ReactiveFormsModule,
  NgForm,
  FormControl,
  Validators,
  FormGroup
} from '@angular/forms';
import { PlatformModule, Platform } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';
import { DtInputModule, DtInput } from '@dynatrace/angular-components/input';
import { ErrorStateMatcher } from '@dynatrace/angular-components/core';

describe('DtInput without forms', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DtInputModule,
        NoopAnimationsModule,
        PlatformModule,
        ReactiveFormsModule,
      ],
      declarations: [
        DtInputWithRequired,
        DtInputWithId,
        DtInputPlaceholderAttr,
        DtInputWithDisabled,
        DtInputWithType,
        DtInputTextareaWithBindings,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should add aria-required reflecting the required state', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithRequired);
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputElement.getAttribute('aria-required'))
      .toBe('false', 'Expected aria-required to reflect required state of false');

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-required'))
      .toBe('true', 'Expected aria-required to reflect required state of true');
  }));

  it('supports the required attribute as binding', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithRequired);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.required).toBe(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputEl.required).toBe(true);
  }));

  it('should not overwrite existing id', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithId);
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputElement.id).toBe('test-id');
  }));

  it('supports placeholder attribute', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputPlaceholderAttr);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.placeholder).toBe('');

    fixture.componentInstance.placeholder = 'Other placeholder';
    fixture.detectChanges();
    expect(inputEl.placeholder).toBe('Other placeholder');
  }));

  it('supports the disabled attribute as binding', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithDisabled);
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(inputEl.disabled).toBe(true);
  }));

  it('supports the type attribute as binding', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithType);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.type).toBe('text');

    fixture.componentInstance.type = 'password';
    fixture.detectChanges();

    expect(inputEl.type).toBe('password');
  }));

  it('supports textarea', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputTextareaWithBindings);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea).not.toBeNull();
  }));
});

@Component({
  template: `<input dtInput [required]="required">`,
})
class DtInputWithRequired {
  required: boolean;
}

@Component({
  template: `<input dtInput id="test-id">`,
})
class DtInputWithId { }

@Component({
  template: `<input dtInput [placeholder]="placeholder">`,
})
class DtInputPlaceholderAttr {
  placeholder = '';
}

@Component({
  template: `<input dtInput [disabled]="disabled">`,
})
class DtInputWithDisabled {
  disabled: boolean;
}

@Component({
  template: `<input dtInput [type]="type">`,
})
class DtInputWithType {
  type: string;
}

@Component({
  template: `<textarea ghInput [rows]="rows" [cols]="cols" [wrap]="wrap" placeholder="Snacks"></textarea>`,
})
class DtInputTextareaWithBindings {
  rows = 4;
  cols = 8;
  wrap = 'hard';
}
