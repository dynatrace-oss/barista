// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { PlatformModule } from '@angular/cdk/platform';
import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import {
  TestBed,
  tick,
  fakeAsync,
  ComponentFixture,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';

import { DtIconModule } from '@dynatrace/angular-components/icon';
import {
  DtInlineEditor,
  DtInlineEditorModule,
} from '@dynatrace/angular-components/inline-editor';

import { createComponent } from '../../testing/create-component';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
} from '../../testing/dispatch-events';

describe('DtInlineEditor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DtInlineEditorModule,
        NoopAnimationsModule,
        PlatformModule,
        ReactiveFormsModule,
        HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [
        TestApp,
        TestAppWithSuccessSave,
        TestAppWithFailureSave,
        TestComponentWithRequiredValidation,
        TestComponentWithWithCustomErrorStateMatcher,
        TestComponentWithWithValidator,
      ],
      providers: [
        {
          provide: HttpXhrBackend,
          useClass: HttpClientTestingModule,
        },
      ],
    });

    TestBed.compileComponents();
  });

  it('should create controls', fakeAsync(() => {
    const fixture = createComponent(TestApp);

    tick();

    const instance = fixture.componentInstance.inlineEditor;

    expect(instance.idle).toBeTruthy();
    fixture.detectChanges();
    const textReference = fixture.debugElement.query(By.css('span'));
    // Expected inner text to reflect ngModel value
    expect(textReference.nativeElement.textContent.trim()).toBe('content');

    const buttonReference = fixture.debugElement.query(By.css('button'));

    // Expected aria-label to be "edit"
    expect(buttonReference.nativeElement.getAttribute('aria-label')).toBe(
      'edit',
    );
  }));

  it('should have edit mode', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));

    expect(inputReference).not.toBeFalsy();
  });

  it('should save changes', fakeAsync(() => {
    const fixture = createComponent(TestApp);

    tick();
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    inputReference.nativeElement.value = 'hola';
    dispatchFakeEvent(inputReference.nativeElement, 'input');

    instance.saveAndQuitEditing();
    fixture.detectChanges();

    expect(fixture.componentInstance.model).toBe('hola');
  }));

  it('should cancel changes', fakeAsync(() => {
    const fixture = createComponent(TestApp);
    tick();
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    inputReference.nativeElement.value = 'hola';
    dispatchFakeEvent(inputReference.nativeElement, 'input');

    instance.cancelAndQuitEditing();
    fixture.detectChanges();

    expect(fixture.componentInstance.model).toBe('content');
  }));

  it('should toggle aria-invalid accordingly if required state is set', fakeAsync(() => {
    const fixture = createComponent(TestComponentWithRequiredValidation);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    expect(inputElement.getAttribute('aria-required')).toBe('true');
    expect(inputElement.getAttribute('aria-invalid')).toBe('false');

    inputElement.value = '';
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-invalid')).toBe('true');
  }));

  it('should displayerror message based on errorStateMatcher', fakeAsync(() => {
    const fixture = createComponent(
      TestComponentWithWithCustomErrorStateMatcher,
    );

    const instance = fixture.componentInstance.inlineEditor;
    const component = fixture.componentInstance;

    instance.enterEditing();
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    expect(inputElement.getAttribute('aria-invalid')).toBe('false');

    // Expected zero error messages to have been rendered.
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('dt-error').length,
    ).toBe(0);

    component.errorState = true;
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-invalid')).toBe('true');

    // Expected one error messages to have been rendered.
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('dt-error').length,
    ).toBe(1);
  }));

  it('should call save method and apply changes', fakeAsync(() => {
    const fixture = createComponent(TestAppWithSuccessSave);
    tick();
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    inputReference.nativeElement.value = 'hola';
    dispatchFakeEvent(inputReference.nativeElement, 'input');
    fixture.detectChanges();

    instance.saveAndQuitEditing();
    fixture.detectChanges();
    expect(fixture.componentInstance.model).toBe('hola');
  }));

  it('should not update the model if save has not been called', () => {
    const fixture = createComponent(TestAppWithSuccessSave);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();

    expect(fixture.componentInstance.model).toBe('content');
  });

  it('should call save method and reject changes and return to editing', () => {
    const fixture = createComponent(TestAppWithFailureSave);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    instance.saveAndQuitEditing();
    fixture.detectChanges();
    expect(instance.editing).toBeTruthy();
  });

  it('should call the save method and quit editing when pressing the Enter key', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;
    jest.spyOn(instance, 'saveAndQuitEditing').mockImplementation(() => {});

    instance.enterEditing();
    fixture.detectChanges();

    const inputReferenceElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ENTER);
    fixture.detectChanges();

    // tslint:disable-next-line:no-unbound-method
    expect(instance.saveAndQuitEditing).toHaveBeenCalled();
  });

  it('should call the cancel method and quit editing when pressing the ESC key', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;
    jest.spyOn(instance, 'cancelAndQuitEditing').mockImplementation(() => {});

    instance.enterEditing();
    fixture.detectChanges();

    const inputReferenceElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ESCAPE);

    // tslint:disable-next-line:no-unbound-method
    expect(instance.cancelAndQuitEditing).toHaveBeenCalled();
  });

  it('should make sure aria labels are set properly', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    fixture.componentInstance.saveLabel = 'save';
    fixture.componentInstance.cancelLabel = 'cancel';

    fixture.detectChanges();
    const saveButtonReference = fixture.debugElement.query(
      By.css('button[aria-label=save]'),
    );
    const cancelButtonReference = fixture.debugElement.query(
      By.css('button[aria-label=cancel]'),
    );

    expect(saveButtonReference).not.toBeFalsy();
    expect(cancelButtonReference).not.toBeFalsy();
  });

  it('should display the error correctly with validator attached', fakeAsync(() => {
    const fixture = createComponent(TestComponentWithWithValidator);

    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    // Expected zero error messages to have been rendered.
    expect(getErrorHtmlElement(fixture)).toBe(null);

    inputElement.value = 'bar';
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    // Expected one error messages to have been rendered.
    expect(getErrorHtmlElement(fixture)!.textContent!.trim()).toBe(
      "Value must include the string 'barista'",
    );

    inputElement.value = 'barista';
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    // Expected one error messages to have been rendered.
    expect(getErrorHtmlElement(fixture)).toBe(null);
  }));
});

function getErrorHtmlElement<T>(
  fixture: ComponentFixture<T>,
): HTMLElement | null {
  return fixture.debugElement.nativeElement.querySelector('dt-error');
}

@Component({
  template: `
    <em
      dt-inline-editor
      [(ngModel)]="model"
      [aria-label-save]="saveLabel"
      [aria-label-cancel]="cancelLabel"
    ></em>
  `,
})
class TestApp {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';
  saveLabel = 'this is the initial save label';
  cancelLabel = 'this is the initial cancel label';
}

@Component({
  template: `
    <h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>
  `,
})
class TestAppWithSuccessSave {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';

  save(): Observable<void> {
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }
}

@Component({
  template: `
    <h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>
  `,
})
class TestAppWithFailureSave {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';

  save(): Observable<void> {
    return new Observable(observer => {
      observer.error('some error');
      observer.complete();
    });
  }
}

@Component({
  template: `
    <em dt-inline-editor required [(ngModel)]="model"></em>
  `,
})
class TestComponentWithRequiredValidation {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';
}

@Component({
  template: `
    <em
      dt-inline-editor
      [errorStateMatcher]="customErrorStateMatcher"
      [(ngModel)]="model"
    >
      <dt-error>custom error message</dt-error>
    </em>
  `,
})
class TestComponentWithWithCustomErrorStateMatcher {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';
  errorState = false;

  customErrorStateMatcher = {
    isErrorState: () => this.errorState,
  };
}

function baristaValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const required = !control.value.includes('barista');
    return required ? { barista: { value: control.value } } : null;
  };
}

@Component({
  template: `
    <form [formGroup]="queryTitleForm">
      <em dt-inline-editor formControlName="queryTitleControl">
        <dt-error *ngIf="hasCustomError">
          Value must include the string 'barista'
        </dt-error>
      </em>
    </form>
  `,
})
class TestComponentWithWithValidator {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  queryTitleControl = new FormControl('123', [
    // tslint:disable-next-line: no-unbound-method
    baristaValidator(),
  ]);
  queryTitleForm = new FormGroup({
    queryTitleControl: this.queryTitleControl,
  });

  get hasCustomError(): boolean {
    return this.queryTitleControl.hasError('barista');
  }
}
