// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { PlatformModule } from '@angular/cdk/platform';
import { Component } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtInputModule } from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';

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
    const fixture = createComponent(DtInputWithRequired);

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(inputElement.getAttribute('aria-required')).toBe('false');

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-required')).toBe('true');
  }));

  it('supports the required attribute as binding', fakeAsync(() => {
    const fixture = createComponent(DtInputWithRequired);

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.required).toBe(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputEl.required).toBe(true);
  }));

  it('should not overwrite existing id', fakeAsync(() => {
    const fixture = createComponent(DtInputWithId);

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(inputElement.id).toBe('test-id');
  }));

  it('has an empty default placeholder', fakeAsync(() => {
    const fixture = createComponent(DtInputPlaceholderAttr);

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.placeholder).toBe('');
  }));

  it('supports placeholder attribute', fakeAsync(() => {
    const fixture = createComponent(DtInputPlaceholderAttr);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    fixture.componentInstance.placeholder = 'Other placeholder';
    fixture.detectChanges();
    expect(inputEl.placeholder).toBe('Other placeholder');
  }));

  it('has set the default disabled state to false', fakeAsync(() => {
    const fixture = createComponent(DtInputWithDisabled);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.disabled).toBe(false);
  }));

  it('supports the disabled attribute as binding', fakeAsync(() => {
    const fixture = createComponent(DtInputWithDisabled);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(inputEl.disabled).toBe(true);
  }));

  it('has a default type of text', fakeAsync(() => {
    const fixture = createComponent(DtInputWithType);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.type).toBe('text');
  }));

  it('supports the type attribute as binding', fakeAsync(() => {
    const fixture = createComponent(DtInputWithType);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    fixture.componentInstance.type = 'password';
    fixture.detectChanges();

    expect(inputEl.type).toBe('password');
  }));

  it('supports textarea', fakeAsync(() => {
    const fixture = createComponent(DtInputTextareaWithBindings);

    const textarea: HTMLTextAreaElement = fixture.debugElement.nativeElement.querySelector(
      'textarea',
    );
    expect(textarea).not.toBeNull();
  }));
});

@Component({
  template: `
    <input dtInput [required]="required" />
  `,
})
class DtInputWithRequired {
  required: boolean;
}

@Component({
  template: `
    <input dtInput id="test-id" />
  `,
})
class DtInputWithId {}

@Component({
  template: `
    <input dtInput [placeholder]="placeholder" />
  `,
})
class DtInputPlaceholderAttr {
  placeholder = '';
}

@Component({
  template: `
    <input dtInput [disabled]="disabled" />
  `,
})
class DtInputWithDisabled {
  disabled: boolean;
}

@Component({
  template: `
    <input dtInput [type]="type" />
  `,
})
class DtInputWithType {
  type: string;
}

@Component({
  template: `
    <textarea
      ghInput
      [rows]="rows"
      [cols]="cols"
      [wrap]="wrap"
      placeholder="Snacks"
    ></textarea>
  `,
})
class DtInputTextareaWithBindings {
  rows = 4;
  cols = 8;
  wrap = 'hard';
}
