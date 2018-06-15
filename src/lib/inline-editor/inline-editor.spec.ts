import { PlatformModule } from '@angular/cdk/platform';
import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtInlineEditor, DtInlineEditorModule } from './index';
import { DtIconModule } from '../icon/index';
import { Observable } from 'rxjs';
import { dispatchFakeEvent } from '../../testing/dispatch-events';

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
