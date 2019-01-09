import { PlatformModule } from '@angular/cdk/platform';
import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
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
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    tick();

    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

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
    const fixture = TestBed.createComponent(TestApp);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const saveButtonReference = fixture.debugElement.query(By.css('button[aria-label=save]'));
    const cancelButtonReference = fixture.debugElement.query(By.css('button[aria-label=cancel]'));

    expect(saveButtonReference).not.toBeFalsy();
    expect(cancelButtonReference).not.toBeFalsy();

    expect(inputReference).not.toBeFalsy();
  });

  it('should save changes', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    tick();
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

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
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    tick();
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

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
    const fixture = TestBed.createComponent(TestComponentWithRequiredValidation);
    fixture.detectChanges();

    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

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
    const fixture = TestBed.createComponent(TestComponentWithWithCustomErrorStateMatcher);
    fixture.detectChanges();

    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);
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
    const fixture = TestBed.createComponent(TestAppWithSuccessSave);
    fixture.detectChanges();
    tick();
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

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
    const fixture = TestBed.createComponent(TestAppWithSuccessSave);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();

    expect(fixture.componentInstance.model)
      .toBe('content', 'Make sure model has not yet be applied');
  });

  it('should call save method and reject changes and return to editing', () => {
    const fixture = TestBed.createComponent(TestAppWithFailureSave);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    instance.saveAndQuitEditing();
    fixture.detectChanges();
    expect(instance.editing).toBeTruthy();
  });

  it('should call the save method and quit editing when pressing the Enter key', () => {
    const fixture = TestBed.createComponent(TestApp);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);
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
    const fixture = TestBed.createComponent(TestApp);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);
    spyOn(instance, 'cancelAndQuitEditing');

    instance.enterEditing();
    fixture.detectChanges();

    const inputReferenceElement = fixture.debugElement.query(By.css('input')).nativeElement;

    dispatchKeyboardEvent(inputReferenceElement, 'keydown', ESCAPE);

    // tslint:disable-next-line:no-unbound-method
    expect(instance.cancelAndQuitEditing)
      .toHaveBeenCalled();
  });
});

@Component({
  template: `<em dt-inline-editor
                 [(ngModel)]="model"></em>`,
})
class TestApp {
  model = 'content';
}

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>`,
})
class TestAppWithSuccessSave {
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
  model = 'content';
}

@Component({
  template: `<em dt-inline-editor [errorStateMatcher]="customErrorStateMatcher" [(ngModel)]="model">
                <dt-error>custom error message</dt-error>
            </em>`,
})
class TestComponentWithWithCustomErrorStateMatcher {
  model = 'content';
  errorState = false;

  customErrorStateMatcher = {
    isErrorState: () => this.errorState,
  };
}
