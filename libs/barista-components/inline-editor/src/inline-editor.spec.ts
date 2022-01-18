/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { PlatformModule } from '@angular/cdk/platform';
import { HttpXhrBackend } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
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

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInlineEditorModule } from './inline-editor-module';

import {
  createComponent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
} from '@dynatrace/testing/browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DtInlineEditor } from './inline-editor';

describe('DtInlineEditor', () => {
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DtInlineEditorModule,
        NoopAnimationsModule,
        PlatformModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
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

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();
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

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

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

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(inputElement.getAttribute('aria-invalid')).toBe('false');

    // Expected zero error messages to have been rendered.
    expect(overlayContainerElement.querySelectorAll('dt-error').length).toBe(0);

    component.errorState = true;
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-invalid')).toBe('true');

    // Expected one error messages to have been rendered.
    expect(overlayContainerElement.querySelectorAll('dt-error').length).toBe(1);
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

    const inputReferenceElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ENTER);
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(instance.saveAndQuitEditing).toHaveBeenCalled();
  });

  it('should call the cancel method and quit editing when pressing the ESC key', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;
    jest.spyOn(instance, 'cancelAndQuitEditing').mockImplementation(() => {});

    instance.enterEditing();
    fixture.detectChanges();

    const inputReferenceElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ESCAPE);

    // eslint-disable-next-line @typescript-eslint/unbound-method
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

    const inputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    // Expected zero error messages to have been rendered.
    expect(getErrorHtmlElement(overlayContainerElement)).toBe(null);

    inputElement.value = 'bar';
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    // Expected one error messages to have been rendered.
    expect(
      getErrorHtmlElement(overlayContainerElement)!.textContent!.trim(),
    ).toBe("Value must include the string 'barista'");

    inputElement.value = 'barista';
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    // Expected one error messages to have been rendered.
    expect(getErrorHtmlElement(overlayContainerElement)).toBe(null);
  }));
});

function getErrorHtmlElement(
  overlayContainerElement: HTMLElement,
): HTMLElement | null {
  return overlayContainerElement.querySelector('dt-error');
}

@Component({
  template: `
    <em
      dt-inline-editor
      [(ngModel)]="model"
      [ariaLabelSave]="saveLabel"
      [ariaLabelCancel]="cancelLabel"
    ></em>
  `,
})
class TestApp {
  @ViewChild(DtInlineEditor) inlineEditor: DtInlineEditor;
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
  @ViewChild(DtInlineEditor) inlineEditor: DtInlineEditor;
  model = 'content';

  save(): Observable<void> {
    return new Observable((observer) => {
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
  @ViewChild(DtInlineEditor) inlineEditor: DtInlineEditor;
  model = 'content';

  save(): Observable<void> {
    return new Observable((observer) => {
      observer.error('some error');
      observer.complete();
    });
  }
}

@Component({
  template: ` <em dt-inline-editor required [(ngModel)]="model"></em> `,
})
class TestComponentWithRequiredValidation {
  @ViewChild(DtInlineEditor) inlineEditor: DtInlineEditor;
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
  @ViewChild(DtInlineEditor) inlineEditor: DtInlineEditor;
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
  @ViewChild(DtInlineEditor) inlineEditor: DtInlineEditor;
  queryTitleControl = new FormControl('123', [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    baristaValidator(),
  ]);
  queryTitleForm = new FormGroup({
    queryTitleControl: this.queryTitleControl,
  });

  get hasCustomError(): boolean {
    return this.queryTitleControl.hasError('barista');
  }
}
