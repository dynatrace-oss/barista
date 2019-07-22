// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Platform, PlatformModule } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  Provider,
  Type,
  ViewChild,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtFormFieldModule,
  DtInput,
  DtInputModule,
  ErrorStateMatcher,
  getDtFormFieldDuplicatedHintError,
  getDtFormFieldMissingControlError,
} from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';
import { dispatchFakeEvent } from '../../testing/dispatch-events';
import { wrappedErrorMessage } from '../../testing/wrapped-error-message';

const TEST_IMPORTS = [
  FormsModule,
  ReactiveFormsModule,
  NoopAnimationsModule,
  PlatformModule,
  DtFormFieldModule,
  DtInputModule,
];

describe('DtFormField without forms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...TEST_IMPORTS],
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
      const fixture = createComponent(DtInputDateTestController);
      const el = fixture.debugElement.query(By.css('dt-form-field'))
        .nativeElement;
      expect(el).not.toBeNull();
      expect(el.classList.contains('dt-form-field-empty')).toBe(true);
    }
  }));

  it('should treat text input type as empty at init', fakeAsync(() => {
    const fixture = createComponent(DtInputTextTestController);
    const el = fixture.debugElement.query(By.css('dt-form-field'))
      .nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('dt-form-field-empty')).toBe(true);
  }));

  it('should not be empty after input entered', fakeAsync(() => {
    const fixture = createComponent(DtInputTextTestController);
    const inputEl = fixture.debugElement.query(By.css('input'));
    const el = fixture.debugElement.query(By.css('dt-form-field'))
      .nativeElement;

    inputEl.nativeElement.value = 'hello';
    // Simulate input event.
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();

    expect(el.classList.contains('dt-form-field-empty')).toBe(
      false,
      'should not be empty',
    );
  }));

  it('should not be empty when the value set before view init', fakeAsync(() => {
    const fixture = createComponent(DtInputWithValueBinding);
    const el = fixture.debugElement.query(By.css('dt-form-field'))
      .nativeElement;

    expect(el.classList).not.toContain('dt-form-field-empty');

    fixture.componentInstance.value = '';
    fixture.detectChanges();

    expect(el.classList).toContain('dt-form-field-empty');
  }));

  it('should add id', fakeAsync(() => {
    const fixture = createComponent(DtInputLabelTestController);
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label'),
    ).nativeElement;

    expect(inputElement.id).toBeTruthy();
    expect(inputElement.id).toEqual(labelElement.getAttribute('for')!);
  }));

  it('should add aria-owns to the label for the associated control', fakeAsync(() => {
    const fixture = createComponent(DtInputLabelTestController);
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label'),
    ).nativeElement;

    expect(labelElement.getAttribute('aria-owns')).toBe(inputElement.id);
  }));

  it("validates there's only one hint label per side", fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputInvalidHintTestController);
    expect(() => {
      try {
        fixture.detectChanges();
        flush();
      } catch {
        flush();
      }
    }).toThrowError(
      wrappedErrorMessage(getDtFormFieldDuplicatedHintError('start')),
    );
  }));

  it('validates that dtInput child is present', fakeAsync(() => {
    const fixture = TestBed.createComponent(
      DtInputMissingDtInputTestController,
    );

    expect(() => {
      fixture.detectChanges();
    }).toThrowError(wrappedErrorMessage(getDtFormFieldMissingControlError()));
  }));

  it('validates that dtInput child is present after initialization', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputWithNgIf);

    expect(() => {
      fixture.detectChanges();
    }).not.toThrowError(
      wrappedErrorMessage(getDtFormFieldMissingControlError()),
    );

    fixture.componentInstance.renderInput = false;

    expect(() => {
      fixture.detectChanges();
    }).toThrowError(wrappedErrorMessage(getDtFormFieldMissingControlError()));
  }));

  it('validates the type', fakeAsync(() => {
    const fixture = TestBed.createComponent(DtInputInvalidTypeTestController);

    // Technically this throws during the OnChanges detection phase,
    // so the error is really a ChangeDetectionError and it becomes
    // hard to build a full exception to compare with.
    // We just check for any exception in this case.
    expect(() => {
      fixture.detectChanges();
    })
      .toThrow
      /* new DtInputUnsupportedTypeError('file') */
      ();
  }));

  it('supports hint labels elements', fakeAsync(() => {
    const fixture = createComponent(DtInputHintTestController);

    // In this case, we should have an empty <dt-hint>.
    let el = fixture.debugElement.query(By.css('dt-hint')).nativeElement;
    expect(el.textContent).toBeFalsy();

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('dt-hint')).nativeElement;
    expect(el.textContent).toBe('label');
  }));

  it('sets an id on the hint element', fakeAsync(() => {
    const fixture = createComponent(DtInputHintTestController);

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('dt-hint')).nativeElement;

    expect(hint.getAttribute('id')).toBeTruthy();
  }));

  it('sets the aria-describedby to the id of the dt-hint', fakeAsync(() => {
    const fixture = createComponent(DtInputHintTestController);

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('.dt-hint')).nativeElement;
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.getAttribute('aria-describedby')).toBe(
      hint.getAttribute('id'),
    );
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
    const fixture = createComponent(DtInputWithDisabled);
    const formFieldEl = fixture.debugElement.query(By.css('.dt-form-field'))
      .nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(formFieldEl.classList.contains('dt-form-field-disabled')).toBe(
      false,
      `Expected form field not to start out disabled.`,
    );
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(formFieldEl.classList.contains('dt-form-field-disabled')).toBe(
      true,
      `Expected form field to look disabled after property is set.`,
    );
    expect(inputEl.disabled).toBe(true);
  }));

  it('should not have prefix and suffix elements when none are specified', fakeAsync(() => {
    const fixture = createComponent(DtInputTextTestController);
    const prefixEl = fixture.debugElement.query(
      By.css('.dt-form-field-prefix'),
    );
    const suffixEl = fixture.debugElement.query(
      By.css('.dt-form-field-suffix'),
    );

    expect(prefixEl).toBeNull();
    expect(suffixEl).toBeNull();
  }));

  it('should add prefix and suffix elements when specified', fakeAsync(() => {
    const fixture = createComponent(DtInputWithPrefixAndSuffix);
    const prefixEl = fixture.debugElement.query(
      By.css('.dt-form-field-prefix'),
    );
    const suffixEl = fixture.debugElement.query(
      By.css('.dt-form-field-suffix'),
    );

    expect(prefixEl).not.toBeNull();
    expect(suffixEl).not.toBeNull();
    expect(prefixEl.nativeElement.innerText.trim()).toEqual('Prefix');
    expect(suffixEl.nativeElement.innerText.trim()).toEqual('Suffix');
  }));

  it('should update empty class when value changes programmatically and OnPush', fakeAsync(() => {
    const fixture = createComponent(DtInputOnPush);
    const component = fixture.componentInstance;
    const el = fixture.debugElement.query(By.css('.dt-form-field'))
      .nativeElement;

    expect(el.classList).toContain(
      'dt-form-field-empty',
      'Input initially empty',
    );

    component.formControl.setValue('something');
    fixture.detectChanges();

    expect(el.classList).not.toContain(
      'dt-form-field-empty',
      'Input no longer empty',
    );
  }));

  it('should set the focused class when the input is focused', fakeAsync(() => {
    const fixture = createComponent(DtInputTextTestController);
    const input = fixture.debugElement
      .query(By.directive(DtInput))
      .injector.get<DtInput>(DtInput);
    const container = fixture.debugElement.query(By.css('dt-form-field'))
      .nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(container.classList).toContain('dt-focused');
  }));

  it('should remove the focused class if the input becomes disabled while focused', fakeAsync(() => {
    const fixture = createComponent(DtInputTextTestController);
    const input = fixture.debugElement
      .query(By.directive(DtInput))
      .injector.get(DtInput);
    const container = fixture.debugElement.query(By.css('dt-form-field'))
      .nativeElement;

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
    const fixture = createComponent(DtInputWithReadonlyInput);
    const input = fixture.debugElement
      .query(By.directive(DtInput))
      .injector.get<DtInput>(DtInput);
    const container = fixture.debugElement.query(By.css('dt-form-field'))
      .nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(input.focused).toBe(false);
    expect(container.classList).not.toContain('dt-focused');
  }));
});

describe('DtFormField with forms', () => {
  describe('error messages', () => {
    let fixture: ComponentFixture<DtInputWithFormErrorMessages>;
    let testComponent: DtInputWithFormErrorMessages;
    let containerEl: HTMLElement;
    let inputEl: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = createComponentWithCutomProviders(DtInputWithFormErrorMessages);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      containerEl = fixture.debugElement.query(By.css('dt-form-field'))
        .nativeElement;
      inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    }));

    it('should not show any errors if the user has not interacted', fakeAsync(() => {
      expect(testComponent.formControl.untouched).toBe(
        true,
        'Expected untouched form control',
      );
      expect(testComponent.formControl.dirty).toBe(
        false,
        'Expected form control not to be diry',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error message',
      );
      expect(inputEl.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to "false".',
      );
    }));

    it('should display an error message when the input is dirty and invalid', fakeAsync(() => {
      expect(testComponent.formControl.invalid).toBe(
        true,
        'Expected form control to be invalid',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error message',
      );

      testComponent.formControl.markAsDirty();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList).toContain(
        'dt-form-field-invalid',
        'Expected container to have the invalid CSS class.',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        1,
        'Expected one error message to have been rendered.',
      );
      expect(inputEl.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to "true".',
      );
    }));

    it('should display an error message when the parent form is submitted', fakeAsync(() => {
      expect(testComponent.form.submitted).toBe(
        false,
        'Expected form not to have been submitted',
      );
      expect(testComponent.formControl.invalid).toBe(
        true,
        'Expected form control to be invalid',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error message',
      );

      dispatchFakeEvent(
        fixture.debugElement.query(By.css('form')).nativeElement,
        'submit',
      );
      fixture.detectChanges();
      flush();

      expect(testComponent.form.submitted).toBe(
        true,
        'Expected form to have been submitted',
      );
      expect(containerEl.classList).toContain(
        'dt-form-field-invalid',
        'Expected container to have the invalid CSS class.',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        1,
        'Expected one error message to have been rendered.',
      );
      expect(inputEl.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to "true".',
      );
    }));

    it('should display an error message when the parent form group is submitted', fakeAsync(() => {
      fixture.destroy();
      TestBed.resetTestingModule();

      const groupFixture = createComponentWithCutomProviders(
        DtInputWithFormGroupErrorMessages,
      );
      let component: DtInputWithFormGroupErrorMessages;

      groupFixture.detectChanges();
      component = groupFixture.componentInstance;
      containerEl = groupFixture.debugElement.query(By.css('dt-form-field'))
        .nativeElement;
      inputEl = groupFixture.debugElement.query(By.css('input')).nativeElement;

      expect(component.formGroup.invalid).toBe(
        true,
        'Expected form control to be invalid',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error message',
      );
      expect(inputEl.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to "false".',
      );
      expect(component.formGroupDirective.submitted).toBe(
        false,
        'Expected form not to have been submitted',
      );

      dispatchFakeEvent(
        groupFixture.debugElement.query(By.css('form')).nativeElement,
        'submit',
      );
      groupFixture.detectChanges();
      flush();

      expect(component.formGroupDirective.submitted).toBe(
        true,
        'Expected form to have been submitted',
      );
      expect(containerEl.classList).toContain(
        'dt-form-field-invalid',
        'Expected container to have the invalid CSS class.',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        1,
        'Expected one error message to have been rendered.',
      );
      expect(inputEl.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to "true".',
      );
    }));

    it('should hide the errors and show the hints once the input becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsDirty();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList).toContain(
        'dt-form-field-invalid',
        'Expected container to have the invalid CSS class.',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        1,
        'Expected one error message to have been rendered.',
      );

      testComponent.formControl.setValue('something');
      fixture.detectChanges();
      flush();

      expect(containerEl.classList).not.toContain(
        'dt-form-field-invalid',
        'Expected container not to have the invalid class when valid.',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error messages when the input is valid.',
      );
    }));

    it('should set the proper role on the error messages', fakeAsync(() => {
      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(containerEl.querySelector('dt-error')!.getAttribute('role')).toBe(
        'alert',
      );
    }));

    it('sets the aria-describedby to reference errors when in error state', fakeAsync(() => {
      const hintId = fixture.debugElement
        .query(By.css('.dt-hint'))
        .nativeElement.getAttribute('id');
      let describedBy = inputEl.getAttribute('aria-describedby');

      expect(hintId).toBeTruthy('hint should be shown');
      expect(describedBy).toBe(hintId);

      fixture.componentInstance.formControl.markAsDirty();
      fixture.detectChanges();

      const errorIds = fixture.debugElement
        .queryAll(By.css('.dt-error'))
        .map(el => el.nativeElement.getAttribute('id'))
        .join(' ');
      describedBy = inputEl.getAttribute('aria-describedby');

      expect(errorIds).toBeTruthy('errors should be shown');
      expect(describedBy).toBe(errorIds);
    }));
  });

  describe('custom error behavior', () => {
    it('should display an error message when a custom error matcher returns true', fakeAsync(() => {
      const fixture = createComponentWithCutomProviders(
        DtInputWithCustomErrorStateMatcher,
      );
      fixture.detectChanges();

      const component = fixture.componentInstance;
      const containerEl = fixture.debugElement.query(By.css('dt-form-field'))
        .nativeElement;

      // tslint:disable-next-line:no-unnecessary-type-assertion
      const control = component.formGroup.get('name')!;

      expect(control.invalid).toBe(true, 'Expected form control to be invalid');
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error messages',
      );

      control.markAsTouched();
      fixture.detectChanges();

      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        0,
        'Expected no error messages after being touched.',
      );

      component.errorState = true;
      fixture.detectChanges();

      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        1,
        'Expected one error messages to have been rendered.',
      );
    }));

    it('should display an error message when global error matcher returns true', fakeAsync(() => {
      const fixture = createComponentWithCutomProviders(
        DtInputWithFormErrorMessages,
        [
          {
            provide: ErrorStateMatcher,
            useValue: { isErrorState: () => true },
          },
        ],
      );

      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(By.css('dt-form-field'))
        .nativeElement;
      const testComponent = fixture.componentInstance;

      // Expect the control to still be untouched but the error to show due to the global setting
      expect(testComponent.formControl.untouched).toBe(
        true,
        'Expected untouched form control',
      );
      expect(containerEl.querySelectorAll('dt-error').length).toBe(
        1,
        'Expected an error message',
      );
    }));
  });

  it('should update the value when using FormControl.setValue', fakeAsync(() => {
    const fixture = createComponentWithCutomProviders(DtInputWithFormControl);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(DtInput))
      .injector.get<DtInput>(DtInput);

    expect(input.value).toBeFalsy();

    fixture.componentInstance.formControl.setValue('something');

    expect(input.value).toBe('something');
  }));

  it('should display disabled styles when using FormControl.disable()', fakeAsync(() => {
    const fixture = createComponentWithCutomProviders(DtInputWithFormControl);
    fixture.detectChanges();

    const formFieldEl = fixture.debugElement.query(By.css('.dt-form-field'))
      .nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(formFieldEl.classList).not.toContain(
      'dt-form-field-disabled',
      `Expected form field not to start out disabled.`,
    );
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.formControl.disable();
    fixture.detectChanges();

    expect(formFieldEl.classList).toContain(
      'dt-form-field-disabled',
      `Expected form field to look disabled after disable() is called.`,
    );
    expect(inputEl.disabled).toBe(true);
  }));
});

function createComponentWithCutomProviders<T>(
  component: Type<T>,
  providers: Provider[] = [],
  // tslint:disable-next-line:no-any
  imports: any[] = [],
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    imports: [
      FormsModule,
      DtFormFieldModule,
      DtInputModule,
      NoopAnimationsModule,
      PlatformModule,
      ReactiveFormsModule,
      ...imports,
    ],
    declarations: [component],
    providers,
  }).compileComponents();

  return TestBed.createComponent<T>(component);
}

@Component({
  template: `
    <dt-form-field>
      <input dtInput type="date" placeholder="Placeholder" />
    </dt-form-field>
  `,
})
class DtInputDateTestController {}

@Component({
  template: `
    <dt-form-field>
      <input dtInput type="text" placeholder="Placeholder" />
    </dt-form-field>
  `,
})
class DtInputTextTestController {}

@Component({
  template: `
    <dt-form-field>
      <input dtInput placeholder="Label" [value]="value" />
    </dt-form-field>
  `,
})
class DtInputWithValueBinding {
  value = 'Initial';
}

@Component({
  template: `
    <dt-form-field>
      <dt-label>Label</dt-label>
      <input dtInput type="text" />
    </dt-form-field>
  `,
})
class DtInputLabelTestController {}

@Component({
  template: `
    <dt-form-field>
      <input dtInput />
      <dt-hint>Hello</dt-hint>
      <dt-hint>World</dt-hint>
    </dt-form-field>
  `,
})
class DtInputInvalidHintTestController {}

@Component({
  template: `
    <dt-form-field><input /></dt-form-field>
  `,
})
class DtInputMissingDtInputTestController {}

@Component({
  template: `
    <dt-form-field>
      <input dtInput *ngIf="renderInput" />
    </dt-form-field>
  `,
})
class DtInputWithNgIf {
  renderInput = true;
}

@Component({
  template: `
    <dt-form-field><input dtInput type="file" /></dt-form-field>
  `,
})
class DtInputInvalidTypeTestController {}

@Component({
  template: `
    <dt-form-field>
      <input dtInput />
      <dt-hint>{{ label }}</dt-hint>
    </dt-form-field>
  `,
})
class DtInputHintTestController {
  label = '';
}

@Component({
  template: `
    <dt-form-field><input dtInput [disabled]="disabled" /></dt-form-field>
  `,
})
class DtInputWithDisabled {
  disabled: boolean;
}

@Component({
  template: `
    <dt-form-field>
      <input dtInput />
      <dt-hint align="start" [id]="startId">Hello</dt-hint>
      <dt-hint align="end" [id]="endId">World</dt-hint>
    </dt-form-field>
  `,
})
class DtInputMultipleHintTestController {
  startId: string;
  endId: string;
}

@Component({
  template: `
    <dt-form-field>
      <div dtPrefix>Prefix</div>
      <input dtInput />
      <div dtSuffix>Suffix</div>
    </dt-form-field>
  `,
})
class DtInputWithPrefixAndSuffix {}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dt-form-field>
      <input dtInput placeholder="Label" [formControl]="formControl" />
    </dt-form-field>
  `,
})
class DtInputOnPush {
  formControl = new FormControl('');
}

@Component({
  template: `
    <dt-form-field>
      <input dtInput readonly value="Only for reading" />
    </dt-form-field>
  `,
})
class DtInputWithReadonlyInput {}

@Component({
  template: `
    <form #form="ngForm" novalidate>
      <dt-form-field>
        <input dtInput [formControl]="formControl" />
        <dt-hint>Please type something</dt-hint>
        <dt-error *ngIf="renderError">This field is required</dt-error>
      </dt-form-field>
    </form>
  `,
})
class DtInputWithFormErrorMessages {
  @ViewChild('form', { static: false }) form: NgForm;
  formControl = new FormControl('', (control: AbstractControl) =>
    Validators.required(control),
  );
  renderError = true;
}

@Component({
  template: `
    <form [formGroup]="formGroup" novalidate>
      <dt-form-field>
        <input dtInput formControlName="name" />
        <dt-hint>Please type something</dt-hint>
        <dt-error>This field is required</dt-error>
      </dt-form-field>
    </form>
  `,
})
class DtInputWithFormGroupErrorMessages {
  @ViewChild(FormGroupDirective, { static: false })
  formGroupDirective: FormGroupDirective;
  formGroup = new FormGroup({
    name: new FormControl('', (control: AbstractControl) =>
      Validators.required(control),
    ),
  });
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <dt-form-field>
        <input
          dtInput
          formControlName="name"
          [errorStateMatcher]="customErrorStateMatcher"
        />
        <dt-hint>Please type something</dt-hint>
        <dt-error>This field is required</dt-error>
      </dt-form-field>
    </form>
  `,
})
class DtInputWithCustomErrorStateMatcher {
  formGroup = new FormGroup({
    name: new FormControl('', (control: AbstractControl) =>
      Validators.required(control),
    ),
  });

  errorState = false;

  customErrorStateMatcher = {
    isErrorState: () => this.errorState,
  };
}

@Component({
  template: `
    <dt-form-field>
      <input dtInput [formControl]="formControl" />
    </dt-form-field>
  `,
})
class DtInputWithFormControl {
  formControl = new FormControl();
}
