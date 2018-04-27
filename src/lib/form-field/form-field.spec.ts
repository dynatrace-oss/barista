import { Component, ChangeDetectionStrategy } from '@angular/core';
import { fakeAsync, TestBed, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtFormFieldModule,
  DtInputModule,
  getDtFormFieldDuplicatedHintError,
  getDtFormFieldMissingControlError,
  DtInput
} from '@dynatrace/angular-components';

/**
 * Gets a RegExp used to detect an angular wrapped error message.
 * See https://github.com/angular/angular/issues/8348
 *
 * Should be removed once Angular CDK ships it.
 */
export function wrappedErrorMessage(e: Error): RegExp {
  const escapedMessage = e.message.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  return new RegExp(escapedMessage);
}

describe('DtFormField without forms', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        PlatformModule,
        DtFormFieldModule,
        DtInputModule,
      ],
      declarations: [
        DtInputDateTestController,
        DtInputTextTestController,
        DtInputWithValueBinding,
        DtInputLabelTestController,
        DtInputInvalidHintTestController,
        DtInputMissingDtInputTestController,
        DtInputWithNgIf,
        DtInputInvalidTypeTestController,
        DtInputHintTestController,
        DtInputWithDisabled,
        DtInputMultipleHintTestController,
        DtInputWithPrefixAndSuffix,
        DtInputOnPush,
        DtInputWithReadonlyInput,
      ],
    }).compileComponents();
  });

  // Safari Desktop and IE don't support type="date" and fallback to type="text".
  it('should be treated as empty if type is date in Safari Desktop or IE', fakeAsync(() => {
    const platform = new Platform();

    if (platform.TRIDENT || (platform.SAFARI && !platform.IOS)) {
      const fixture = TestBed.createComponent(DtInputDateTestController);
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;
      expect(el).not.toBeNull();
      expect(el.classList.contains('dt-form-field-empty')).toBe(true);
    }
  }));

  // Safari Desktop and IE don't support type="date" and fallback to type="text".
  it('should be treated as empty if type is date in Safari Desktop or IE', fakeAsync(() => {
    const platform = new Platform();

    if (platform.TRIDENT || (platform.SAFARI && !platform.IOS)) {
      const fixture = TestBed.createComponent(DtInputDateTestController);
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;
      expect(el).not.toBeNull();
      expect(el.classList.contains('dt-form-field-empty')).toBe(true);
    }
  }));

  it('should treat text input type as empty at init', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputTextTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('dt-form-field-empty')).toBe(true);
  }));

  it('should not be empty after input entered', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputTextTestController);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'));
    const el = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('dt-form-field-empty')).toBe(true, 'should be empty');

    inputEl.nativeElement.value = 'hello';
    // Simulate input event.
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();

    expect(el.classList.contains('dt-form-field-empty')).toBe(false, 'should not be empty');
  }));

  it('should not be empty when the value set before view init', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithValueBinding);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;

    expect(el.classList).not.toContain('dt-form-field-empty');

    fixture.componentInstance.value = '';
    fixture.detectChanges();

    expect(el.classList).toContain('dt-form-field-empty');
  }));

  it('should add id', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputLabelTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.debugElement.query(By.css('input')).nativeElement;
    const labelElement: HTMLInputElement =
      fixture.debugElement.query(By.css('label')).nativeElement;

    expect(inputElement.id).toBeTruthy();
    expect(inputElement.id).toEqual(labelElement.getAttribute('for')!);
  }));

  it('should add aria-owns to the label for the associated control', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputLabelTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement =
      fixture.debugElement.query(By.css('input')).nativeElement;
    const labelElement: HTMLInputElement =
      fixture.debugElement.query(By.css('label')).nativeElement;

    expect(labelElement.getAttribute('aria-owns')).toBe(inputElement.id);
  }));

  it('validates there\'s only one hint label per side', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputInvalidHintTestController);

    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getDtFormFieldDuplicatedHintError('start')));
  }));

  it('validates that dtInput child is present', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputMissingDtInputTestController);

    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getDtFormFieldMissingControlError()));
  }));

  it('validates that dtInput child is present after initialization', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithNgIf);

    expect(() => fixture.detectChanges()).not.toThrowError(
      wrappedErrorMessage(getDtFormFieldMissingControlError()));

    fixture.componentInstance.renderInput = false;

    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getDtFormFieldMissingControlError()));
  }));

  it('validates the type', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputInvalidTypeTestController);

    // Technically this throws during the OnChanges detection phase,
    // so the error is really a ChangeDetectionError and it becomes
    // hard to build a full exception to compare with.
    // We just check for any exception in this case.
    expect(() => fixture.detectChanges()).toThrow(
        /* new DtInputUnsupportedTypeError('file') */);
  }));

  it('supports hint labels elements', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputHintTestController);
    fixture.detectChanges();

    // In this case, we should have an empty <dt-hint>.
    let el = fixture.debugElement.query(By.css('dt-hint')).nativeElement;
    expect(el.textContent).toBeFalsy();

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('dt-hint')).nativeElement;
    expect(el.textContent).toBe('label');
  }));

  it('sets an id on the hint element', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputHintTestController);

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('dt-hint')).nativeElement;

    expect(hint.getAttribute('id')).toBeTruthy();
  }));

  it('sets the aria-describedby to the id of the dt-hint', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputHintTestController);

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('.dt-hint')).nativeElement;
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.getAttribute('aria-describedby')).toBe(hint.getAttribute('id'));
  }));

  it('sets the aria-describedby with multiple dt-hint instances', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputMultipleHintTestController);

    fixture.componentInstance.startId = 'start';
    fixture.componentInstance.endId = 'end';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.getAttribute('aria-describedby')).toBe('start end');
  }));

  it('supports the disabled attribute as binding', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithDisabled);
    fixture.detectChanges();

    const formFieldEl =
      fixture.debugElement.query(By.css('.dt-form-field')).nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(formFieldEl.classList.contains('dt-form-field-disabled'))
      .toBe(false, `Expected form field not to start out disabled.`);
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(formFieldEl.classList.contains('dt-form-field-disabled'))
      .toBe(true, `Expected form field to look disabled after property is set.`);
    expect(inputEl.disabled).toBe(true);
  }));

  it('should not have prefix and suffix elements when none are specified', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputTextTestController);
    fixture.detectChanges();

    const prefixEl = fixture.debugElement.query(By.css('.dt-form-field-prefix'));
    const suffixEl = fixture.debugElement.query(By.css('.dt-form-field-suffix'));

    expect(prefixEl).toBeNull();
    expect(suffixEl).toBeNull();
  }));

  it('should add prefix and suffix elements when specified', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithPrefixAndSuffix);
    fixture.detectChanges();

    const prefixEl = fixture.debugElement.query(By.css('.dt-form-field-prefix'));
    const suffixEl = fixture.debugElement.query(By.css('.dt-form-field-suffix'));

    expect(prefixEl).not.toBeNull();
    expect(suffixEl).not.toBeNull();
    expect(prefixEl.nativeElement.innerText.trim()).toEqual('Prefix');
    expect(suffixEl.nativeElement.innerText.trim()).toEqual('Suffix');
  }));

  it('should update empty class when value changes programmatically and OnPush', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputOnPush);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const el = fixture.debugElement.query(By.css('.dt-form-field')).nativeElement;

    expect(el.classList).toContain('dt-form-field-empty', 'Input initially empty');

    component.formControl.setValue('something');
    fixture.detectChanges();

    expect(el.classList).not.toContain('dt-form-field-empty', 'Input no longer empty');
  }));

  it('should set the focused class when the input is focused', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputTextTestController);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.directive(DtInput))
      .injector.get<DtInput>(DtInput);
    const container = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(container.classList).toContain('dt-focused');
  }));

  it('should remove the focused class if the input becomes disabled while focused', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputTextTestController);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.directive(DtInput)).injector.get(DtInput);
    const container = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(container.classList).toContain('dt-focused');

    input.disabled = true;
    fixture.detectChanges();

    expect(container.classList).not.toContain('dt-focused');
  }));

  it('should not highlight when focusing a readonly input', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithReadonlyInput);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.directive(DtInput)).injector.get<DtInput>(DtInput);
    const container = fixture.debugElement.query(By.css('dt-form-field')).nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(input.focused).toBe(false);
    expect(container.classList).not.toContain('dt-focused');
  }));
});

describe('DtFormField with forms', () => {
  // ... TODO
});

@Component({
  template: `
    <dt-form-field>
      <input dtInput type="date" placeholder="Placeholder">
    </dt-form-field>`,
})
class DtInputDateTestController { }

@Component({
  template: `
    <dt-form-field>
      <input dtInput type="text" placeholder="Placeholder">
    </dt-form-field>`,
})
class DtInputTextTestController { }

@Component({
  template: `
    <dt-form-field>
      <input dtInput placeholder="Label" [value]="value">
    </dt-form-field>`,
})
class DtInputWithValueBinding {
  value = 'Initial';
}

@Component({
  template: `
    <dt-form-field>
      <dt-label>Label</dt-label>
      <input dtInput type="text">
    </dt-form-field>`,
})
class DtInputLabelTestController { }

@Component({
  template: `
    <dt-form-field>
      <input dtInput>
      <dt-hint>Hello</dt-hint>
      <dt-hint>World</dt-hint>
    </dt-form-field>`,
})
class DtInputInvalidHintTestController { }

@Component({
  template: `<dt-form-field><input></dt-form-field>`,
})
class DtInputMissingDtInputTestController { }

@Component({
  template: `
    <dt-form-field>
      <input dtInput *ngIf="renderInput">
    </dt-form-field>
  `,
})
class DtInputWithNgIf {
  renderInput = true;
}

@Component({
  template: `<dt-form-field><input dtInput type="file"></dt-form-field>`,
})
class DtInputInvalidTypeTestController { }

@Component({
  template: `<dt-form-field><input dtInput><dt-hint>{{label}}</dt-hint></dt-form-field>`,
})
class DtInputHintTestController {
  label = '';
}

@Component({
  template: `<dt-form-field><input dtInput [disabled]="disabled"></dt-form-field>`,
})
class DtInputWithDisabled {
  disabled: boolean;
}

@Component({
  template: `
    <dt-form-field>
      <input dtInput>
      <dt-hint align="start" [id]="startId">Hello</dt-hint>
      <dt-hint align="end" [id]="endId">World</dt-hint>
    </dt-form-field>`,
})
class DtInputMultipleHintTestController {
  startId: string;
  endId: string;
}

@Component({
  template: `
    <dt-form-field>
      <div dtPrefix>Prefix</div>
      <input dtInput>
      <div dtSuffix>Suffix</div>
    </dt-form-field>
  `,
})
class DtInputWithPrefixAndSuffix { }

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dt-form-field>
      <input dtInput placeholder="Label" [formControl]="formControl">
    </dt-form-field>
  `,
})
class DtInputOnPush {
  formControl = new FormControl('');
}

@Component({
  template: `
    <dt-form-field>
      <input dtInput readonly value="Only for reading">
    </dt-form-field>
  `,
})
class DtInputWithReadonlyInput { }
