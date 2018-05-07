import { Component } from '@angular/core';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlatformModule } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';
import { DtInlineEditorModule, DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from 'rxjs/Observable';

describe('DtInlineEditor', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DtInlineEditorModule,
        NoopAnimationsModule,
        PlatformModule,
        ReactiveFormsModule,
      ],
      declarations: [
        TestApp,
        TestAppWithSuccessSave,
        TestAppWithFailureSave,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should create controls', () => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    const textReference = fixture.debugElement.query(By.css('span'));

    expect(textReference.nativeElement.innerText)
      .toBe('content', 'Expected inner text to reflext ngModel value');

    const buttonReference = fixture.debugElement.query(By.css('button'));

    expect(buttonReference.nativeElement.getAttribute('aria-label'))
      .toBe('edit', 'Expected aria-label to be "edit"');
  });

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
    expect(inputReference.nativeElement.value)
      .toBe('content', 'Expect ngModel value to be mapped to input value');
  });

  it('should save changes', () => {
    const fixture = TestBed.createComponent(TestApp);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const saveButtonReference = fixture.debugElement.query(By.css('button[aria-label=save]'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();
    // TODO: Trigger ngModel data-binding

    saveButtonReference.nativeElement.click();
    fixture.detectChanges();

    const textReference = fixture.debugElement.query(By.css('span'));

    expect(textReference.nativeElement.innerText)
      .toBe('hola', 'Expected inner text to be changed');
  });

  it('should cancel changes', () => {
    const fixture = TestBed.createComponent(TestApp);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const cancelButtonReference = fixture.debugElement.query(By.css('button[aria-label=cancel]'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();
    // TODO: Trigger ngModel data-binding

    cancelButtonReference.nativeElement.click();
    fixture.detectChanges();

    const textReference = fixture.debugElement.query(By.css('span'));

    expect(textReference.nativeElement.innerText)
      .toBe('content', 'Expected inner text not to be changed');
  });

  it('should call save method and apply changes', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestAppWithSuccessSave);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const saveButtonReference = fixture.debugElement.query(By.css('button[aria-label=save]'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();
    // TODO: Trigger ngModel data-binding

    saveButtonReference.nativeElement.click();
    fixture.detectChanges();

    const textReference = fixture.debugElement.query(By.css('span'));

    expect(textReference.nativeElement.innerText)
      .toBe('hola', 'Expected inner text to be changed');
  }));

  it('should call save method and reject changes', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestAppWithSuccessSave);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const saveButtonReference = fixture.debugElement.query(By.css('button[aria-label=save]'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();
    // TODO: Trigger ngModel data-binding

    saveButtonReference.nativeElement.click();
    fixture.detectChanges();

    const textReference = fixture.debugElement.query(By.css('span'));

    expect(textReference.nativeElement.innerText)
      .toBe('content', 'Expected inner text not to be changed');
  }));
});

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model"></h1>`,
})
class TestApp {
  model: 'content';
}

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onSave]="save"></h1>`,
})
class TestAppWithSuccessSave {
  model: 'content';

  save(): Observable<void> {
    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }
}

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onSave]="save"></h1>`,
})
class TestAppWithFailureSave {
  model: 'content';

  save(): Observable<void> {
    return new Observable((observer) => {
      observer.error();
      observer.complete();
    });
  }
}
