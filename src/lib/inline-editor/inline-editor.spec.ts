// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { PlatformModule } from '@angular/cdk/platform';
import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtInlineEditor,
  DtInlineEditorModule,
  DtIconModule,
} from '@dynatrace/angular-components';
import { Observable } from 'rxjs';
import { dispatchFakeEvent, dispatchKeyboardEvent } from '../../testing/dispatch-events';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { createComponent } from '../../testing/create-component';

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
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations: [
        TestApp,
        TestAppWithSuccessSave,
        TestAppWithFailureSave,
        TestComponentWithRequiredValidation,
        TestComponentWithWithCustomErrorStateMatcher,
      ],
      providers: [{
        provide: HttpXhrBackend,
        useClass: HttpClientTestingModule,
      }],
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
    expect(textReference.nativeElement.innerText)
      .toBe('content', 'Expected inner text to reflect ngModel value');

    const buttonReference = fixture.debugElement.query(By.css('button'));

    expect(buttonReference.nativeElement.getAttribute('aria-label'))
      .toBe('edit', 'Expected aria-label to be "edit"');
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

    expect(fixture.componentInstance.model)
      .toBe('hola', 'Expected inner text to be changed');
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

    expect(fixture.componentInstance.model)
    .toBe('content', 'Expected inner text to be changed');
  }));

  it('should toggle aria-invalid accordingly if required state is set', fakeAsync(() => {
    const fixture = createComponent(TestComponentWithRequiredValidation);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputElement.getAttribute('aria-required'))
    .toBe('true', 'Expected aria-required to reflect required state');
    expect(inputElement.getAttribute('aria-invalid'))
    .toBe('false', 'Expected aria-invalid to be false');

    inputElement.value = '';
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-invalid'))
    .toBe('true', 'Expected aria-invalid to be true');
  }));

  it('should displayerror message based on errorStateMatcher', fakeAsync(() => {
    const fixture = createComponent(TestComponentWithWithCustomErrorStateMatcher);

    const instance = fixture.componentInstance.inlineEditor;
    const component = fixture.componentInstance;

    instance.enterEditing();
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputElement.getAttribute('aria-invalid'))
      .toBe('false', 'Expected aria-invalid to be false');

    expect(fixture.debugElement.nativeElement.querySelectorAll('dt-error').length)
      .toBe(0, 'Expected zero error messages to have been rendered.');

    component.errorState = true;
    dispatchFakeEvent(inputElement, 'input');
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-invalid'))
      .toBe('true', 'Expected aria-invalid to be true');

    expect(fixture.debugElement.nativeElement.querySelectorAll('dt-error').length)
      .toBe(1, 'Expected one error messages to have been rendered.');

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
    expect(fixture.componentInstance.model)
      .toBe('hola', 'Make sure model has be applied');
  }));

  it('should not update the model if save has not been called', () => {
    const fixture = createComponent(TestAppWithSuccessSave);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();

    expect(fixture.componentInstance.model)
      .toBe('content', 'Make sure model has not yet be applied');
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
    spyOn(instance, 'saveAndQuitEditing');

    instance.enterEditing();
    fixture.detectChanges();

    const inputReferenceElement = fixture.debugElement.query(By.css('input')).nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ENTER);
    fixture.detectChanges();

    // tslint:disable-next-line:no-unbound-method
    expect(instance.saveAndQuitEditing)
      .toHaveBeenCalled();
  });

  it('should call the cancel method and quit editing when pressing the ESC key', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;
    spyOn(instance, 'cancelAndQuitEditing');

    instance.enterEditing();
    fixture.detectChanges();

    const inputReferenceElement = fixture.debugElement.query(By.css('input')).nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ESCAPE);

    // tslint:disable-next-line:no-unbound-method
    expect(instance.cancelAndQuitEditing)
      .toHaveBeenCalled();
  });

  it('should make sure aria labels are set properly', () => {
    const fixture = createComponent(TestApp);
    const instance = fixture.componentInstance.inlineEditor;

    instance.enterEditing();
    fixture.detectChanges();

    fixture.componentInstance.saveLabel = 'save';
    fixture.componentInstance.cancelLabel = 'cancel';

    fixture.detectChanges();
    const saveButtonReference = fixture.debugElement.query(By.css('button[aria-label=save]'));
    const cancelButtonReference = fixture.debugElement.query(By.css('button[aria-label=cancel]'));

    expect(saveButtonReference).not.toBeFalsy();
    expect(cancelButtonReference).not.toBeFalsy();
  });
});

@Component({
  template: `<em dt-inline-editor
                 [(ngModel)]="model" [aria-label-save]="saveLabel" [aria-label-cancel]="cancelLabel"></em>`,
})
class TestApp {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';
  saveLabel = 'this is the initial save label';
  cancelLabel = 'this is the initial cancel label';
}

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>`,
})
class TestAppWithSuccessSave {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';

  save(): Observable<void> {
    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }
}

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>`,
})
class TestAppWithFailureSave {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';

  save(): Observable<void> {
    return new Observable((observer) => {
      observer.error('some error');
      observer.complete();
    });
  }
}

@Component({
  template: `<em dt-inline-editor required [(ngModel)]="model"></em>`,
})
class TestComponentWithRequiredValidation {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';
}

@Component({
  template: `<em dt-inline-editor [errorStateMatcher]="customErrorStateMatcher" [(ngModel)]="model">
  <dt-error>custom error message</dt-error>
  </em>`,
})
class TestComponentWithWithCustomErrorStateMatcher {
  @ViewChild(DtInlineEditor, { static: false }) inlineEditor: DtInlineEditor;
  model = 'content';
  errorState = false;

  customErrorStateMatcher = {
    isErrorState: () => this.errorState,
  };
}
