import { Component } from '@angular/core';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { PlatformModule } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';
import { DtInlineEditorModule, DtInlineEditor, DtIconModule } from '@dynatrace/angular-components';
import { Observable } from 'rxjs/Observable';
import { HttpClientModule } from '@angular/common/http';

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
      ],
    });

    TestBed.compileComponents();
  });

  it('should create the components', () => {
    // tslint:disable-next-line:no-any
    let fixture: any = TestBed.createComponent(TestApp);
    let component = fixture.componentInstance;
    expect(component).toBeDefined();

    fixture = TestBed.createComponent(TestAppWithSuccessSave);
    component = fixture.componentInstance;
    expect(component).toBeDefined();

    fixture = TestBed.createComponent(TestAppWithFailureSave);
    component = fixture.componentInstance;
    expect(component).toBeDefined();

  });

  it('should create controls', () => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    const textReference = fixture.debugElement.query(By.css('span'));

    fixture.whenStable().then(() => {
      expect(textReference.nativeElement.innerText)
      .toBe('content', 'Expected inner text to reflect ngModel value');
    });

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
    fixture.whenStable().then(() => {
      expect(inputReference.nativeElement.value)
      .toBe('content', 'Expect ngModel value to be mapped to input value');
    });
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

    fixture.whenStable().then(() => {
      expect(textReference.nativeElement.innerText)
      .toBe('hola', 'Expected inner text to be changed');
    });
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

    fixture.whenStable().then(() => {
      expect(textReference.nativeElement.innerText)
      .toBe('hola', 'Expected inner text to be changed');
    });
  });

  it('should call save method and apply changes', () => {
    const fixture = TestBed.createComponent(TestAppWithSuccessSave);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const saveButtonReference = fixture.debugElement.query(By.css('button[aria-label=save]'));
    const textReference = fixture.debugElement.query(By.css('span'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();
    // TODO: Trigger ngModel data-binding

    saveButtonReference.nativeElement.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(textReference.nativeElement.innerText)
      .toBe('hola', 'Expected inner text to be changed');
    });
  });

  it('should not update the model if save has not been called', () => {
    const fixture = TestBed.createComponent(TestAppWithSuccessSave);
    const instanceDebugElement = fixture.debugElement.query(By.directive(DtInlineEditor));
    const instance = instanceDebugElement.injector.get<DtInlineEditor>(DtInlineEditor);

    instance.enterEditing();
    fixture.detectChanges();

    const inputReference = fixture.debugElement.query(By.css('input'));
    const textReference = fixture.debugElement.query(By.css('span'));

    inputReference.nativeElement.value = 'hola';
    fixture.detectChanges();
    // TODO: Trigger ngModel data-binding

    expect(textReference.nativeElement.innerText)
      .toBe('', 'Make sure model has not yet be applied');
  });

  it('should call save method and reject changes', () => {
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

    fixture.whenStable().then(() => {
      expect(textReference.nativeElement.innerText)
      .toBe('content', 'Expected inner text to be changed');
    });
  });
});

@Component({
  template: `<em dt-inline-editor
  [(ngModel)]="initialValue"></em>`,
})
class TestApp {
  initialValue: 'content';
}

@Component({
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>`,
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
  template: `<h1 dt-inline-editor [(ngModel)]="model" [onRemoteSave]="save"></h1>`,
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
