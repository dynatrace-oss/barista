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

/* eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector, no-useless-escape */

import { Component, DebugElement, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DtCheckboxModule } from './checkbox-module';

import { createComponent } from '@dynatrace/testing/browser';
import { DtCheckbox, DtCheckboxChange } from './checkbox';

describe('DtCheckbox', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DtCheckboxModule, FormsModule, ReactiveFormsModule],
      declarations: [
        SingleCheckbox,
        CheckboxWithFormDirectives,
        MultipleCheckboxes,
        CheckboxWithNgModel,
        CheckboxWithTabIndex,
        CheckboxWithAriaLabel,
        CheckboxWithAriaLabelledby,
        CheckboxWithNameAttribute,
        CheckboxWithChangeEvent,
        CheckboxWithFormControl,
        CheckboxWithoutLabel,
        CheckboxWithTabindexAttr,
        CheckboxUsingViewChild,
        CheckboxDisabledAttribute,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('basic behaviors', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: DtCheckbox<any>;
    let testComponent: SingleCheckbox;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = createComponent(SingleCheckbox);

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      labelElement = checkboxNativeElement.querySelector(
        'label',
      ) as HTMLLabelElement;
    });

    it('should add and remove the checked state', () => {
      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-checked',
      );
      expect(inputElement.checked).toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('dt-checkbox-checked');
      expect(inputElement.checked).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-checked',
      );
      expect(inputElement.checked).toBe(false);
    });

    it('should add and remove indeterminate state', () => {
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-checked',
      );
      expect(inputElement.checked).toBe(false);
      // Expect aria-checked to be false
      expect(inputElement.getAttribute('aria-checked')).toBe('false');

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain(
        'dt-checkbox-indeterminate',
      );
      expect(inputElement.checked).toBe(false);
      // Expect aria checked to be mixed for indeterminate checkbox
      expect(inputElement.getAttribute('aria-checked')).toBe('mixed');

      testComponent.isIndeterminate = false;
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-indeterminate',
      );
      expect(inputElement.checked).toBe(false);
    });

    it('should set indeterminate to false when input clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the forms module updates the model state asynchronously.
      flush();

      // The checked property has been updated from the model and now the view needs
      // to reflect the state change.
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.isIndeterminate).toBe(false);

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBe(true);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);
      // Expect aria checked to be true
      expect(inputElement.getAttribute('aria-checked')).toBe('true');

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the forms module updates the model state asynchronously.
      flush();

      // The checked property has been updated from the model and now the view needs
      // to reflect the state change.
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(inputElement.checked).toBe(false);
      expect(testComponent.isIndeterminate).toBe(false);
    }));

    it('should not set indeterminate to false when checked is set programmatically', () => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(inputElement.checked).toBe(false);
      expect(testComponent.isIndeterminate).toBe(true);
    });

    it('should change native element checked when check programmatically', () => {
      expect(inputElement.checked).toBe(false);

      checkboxInstance.checked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
    });

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });

    it('should change from indeterminate to checked on click', fakeAsync(() => {
      testComponent.isChecked = false;
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxInstance.indeterminate).toBe(true);
      checkboxInstance._onInputClick({ stopPropagation: () => {} } as any);

      // Flush the microtasks because the indeterminate state will be updated in the next tick.
      flush();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.indeterminate).toBe(false);

      checkboxInstance._onInputClick({ stopPropagation: () => {} } as any);
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxInstance.indeterminate).toBe(false);
    }));

    it('should add and remove disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-disabled',
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(checkboxNativeElement.classList).toContain('dt-checkbox-disabled');
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-disabled',
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });

    it('should not toggle `checked` state upon interation while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      checkboxNativeElement.click();
      expect(checkboxInstance.checked).toBe(false);
    });

    it('should overwrite indeterminate state when clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the indeterminate state will be updated in the next tick.
      flush();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.indeterminate).toBe(false);
    }));

    it('should preserve the user-provided id', () => {
      expect(checkboxNativeElement.id).toBe('simple-check');
      expect(inputElement.id).toBe('simple-check-input');
    });

    it('should generate a unique id for the checkbox input if no id is set', () => {
      testComponent.checkboxId = null;
      fixture.detectChanges();

      expect(checkboxInstance._inputId).toMatch(/dt-checkbox-\d+/);
      expect(inputElement.id).toBe(checkboxInstance._inputId);
    });

    it('should project the checkbox content into the label element', () => {
      const label = checkboxNativeElement.querySelector(
        '.dt-checkbox-label',
      ) as HTMLLabelElement;
      expect(label.textContent!.trim()).toBe('Simple checkbox');
    });

    it('should make the host element a tab stop', () => {
      expect(inputElement.tabIndex).toBe(0);
    });

    it('should not trigger the click event multiple times', () => {
      // By default, when clicking on a label element, a generated click will be dispatched
      // on the associated input element.
      // Since we're using a label element and a visual hidden input, this behavior can led
      // to an issue, where the click events on the checkbox are getting executed twice.

      jest.spyOn(testComponent, 'onCheckboxClick').mockImplementation(() => {});

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-checked',
      );

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain('dt-checkbox-checked');
      expect(inputElement.checked).toBe(true);

      expect(testComponent.onCheckboxClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger a change event when the native input does', fakeAsync(() => {
      jest
        .spyOn(testComponent, 'onCheckboxChange')
        .mockImplementation(() => {});

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-checked',
      );

      labelElement.click();
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('dt-checkbox-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onCheckboxChange).toHaveBeenCalledTimes(1);
    }));

    it('should not trigger the change event by changing the native value', fakeAsync(() => {
      jest
        .spyOn(testComponent, 'onCheckboxChange')
        .mockImplementation(() => {});

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-checked',
      );

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('dt-checkbox-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onCheckboxChange).not.toHaveBeenCalled();
    }));

    it('should forward the required attribute', () => {
      testComponent.isRequired = true;
      fixture.detectChanges();

      expect(inputElement.required).toBe(true);

      testComponent.isRequired = false;
      fixture.detectChanges();

      expect(inputElement.required).toBe(false);
    });

    it('should focus on underlying input element when focus() is called', () => {
      expect(document.activeElement).not.toBe(inputElement);

      checkboxInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputElement);
    });

    it('should forward the value to input element', () => {
      testComponent.checkboxValue = 'basic_checkbox';
      fixture.detectChanges();

      expect(inputElement.value).toBe('basic_checkbox');
    });

    it('should remove the SVG checkmark from the tab order', () => {
      expect(
        checkboxNativeElement.querySelector('svg')!.getAttribute('focusable'),
      ).toBe('false');
    });

    describe('state transition css classes', () => {
      it('should transition unchecked -> checked -> unchecked', () => {
        inputElement.click();
        fixture.detectChanges();
        expect(checkboxNativeElement.classList).toContain(
          'dt-checkbox-anim-unchecked-checked',
        );

        inputElement.click();
        fixture.detectChanges();
        expect(checkboxNativeElement.classList).not.toContain(
          'dt-checkbox-anim-unchecked-checked',
        );
        expect(checkboxNativeElement.classList).toContain(
          'dt-checkbox-anim-checked-unchecked',
        );
      });

      it('should transition unchecked -> indeterminate -> unchecked', () => {
        testComponent.isIndeterminate = true;
        fixture.detectChanges();

        expect(checkboxNativeElement.classList).toContain(
          'dt-checkbox-anim-unchecked-indeterminate',
        );

        testComponent.isIndeterminate = false;
        fixture.detectChanges();

        expect(checkboxNativeElement.classList).not.toContain(
          'dt-checkbox-anim-unchecked-indeterminate',
        );
        expect(checkboxNativeElement.classList).toContain(
          'dt-checkbox-anim-indeterminate-unchecked',
        );
      });

      it('should transition indeterminate -> checked', () => {
        testComponent.isIndeterminate = true;
        fixture.detectChanges();

        inputElement.click();
        fixture.detectChanges();

        expect(checkboxNativeElement.classList).not.toContain(
          'dt-checkbox-anim-unchecked-indeterminate',
        );
        expect(checkboxNativeElement.classList).toContain(
          'dt-checkbox-anim-indeterminate-checked',
        );
      });

      it('should not apply transition classes when there is no state change', () => {
        testComponent.isChecked = checkboxInstance.checked;
        fixture.detectChanges();
        expect(checkboxNativeElement.innerHTML).not.toMatch(
          /^dt\-checkbox\-anim/g,
        );

        testComponent.isIndeterminate = checkboxInstance.indeterminate;
        expect(checkboxNativeElement.innerHTML).not.toMatch(
          /^dt\-checkbox\-anim/g,
        );
      });

      it('should not initially have any transition classes', () => {
        expect(checkboxNativeElement.innerHTML).not.toMatch(
          /^dt\-checkbox\-anim/g,
        );
      });
    });
  });

  describe('with change event and no initial value', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: DtCheckbox<any>;
    let testComponent: CheckboxWithChangeEvent;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithChangeEvent);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      labelElement = checkboxNativeElement.querySelector(
        'label',
      ) as HTMLLabelElement;
    });

    it('should emit the event to the change observable', () => {
      const changeSpy = jest.fn();

      checkboxInstance.change.subscribe(changeSpy);

      fixture.detectChanges();
      expect(changeSpy).not.toHaveBeenCalled();

      // When changing the native `checked` property the checkbox will not fire a change event,
      // because the element is not focused and it's not the native behavior of the input element.
      labelElement.click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit a DOM event to the change output', fakeAsync(() => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      // Trigger the click on the inputElement, because the input will probably
      // emit a DOM event to the change output.
      inputElement.click();
      fixture.detectChanges();
      flush();

      // We're checking the arguments type / emitted value to be a boolean, because sometimes the
      // emitted value can be a DOM Event, which is not valid.
      // See angular/angular#4059
      expect(testComponent.lastEvent.checked).toBe(true);
    }));
  });

  describe('aria-label ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-label', () => {
      fixture = TestBed.createComponent(CheckboxWithAriaLabel);
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-label')).toBe('Super effective');
    });

    it('should not set the aria-label attribute if no value is provided', () => {
      fixture = TestBed.createComponent(SingleCheckbox);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('input').hasAttribute('aria-label'),
      ).toBe(false);
    });
  });

  describe('with provided aria-labelledby ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-labelledby', () => {
      fixture = TestBed.createComponent(CheckboxWithAriaLabelledby);
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe('some-id');
    });

    it('should not assign aria-labelledby if none is provided', () => {
      fixture = TestBed.createComponent(SingleCheckbox);
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe(null);
    });
  });

  describe('with provided tabIndex', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxWithTabIndex;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithTabIndex);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;
      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should preserve any given tabIndex', () => {
      expect(inputElement.tabIndex).toBe(7);
    });

    it('should preserve given tabIndex when the checkbox is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(inputElement.tabIndex).toBe(13);
    });
  });

  describe('with native tabindex attribute', () => {
    it('should properly detect native tabindex attribute', fakeAsync(() => {
      fixture = TestBed.createComponent(CheckboxWithTabindexAttr);
      fixture.detectChanges();

      const checkbox = fixture.debugElement.query(By.directive(DtCheckbox))
        .componentInstance as DtCheckbox<any>;

      // Expected tabIndex property to have been set based on the native attribute
      expect(checkbox.tabIndex).toBe(5);
    }));
  });

  describe('using ViewChild', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxUsingViewChild;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxUsingViewChild);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should toggle checkbox disabledness correctly', () => {
      const checkboxInstance = checkboxDebugElement.componentInstance;
      const inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'dt-checkbox-disabled',
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(checkboxNativeElement.classList).toContain('dt-checkbox-disabled');
      expect(inputElement.disabled).toBe(true);

      // testComponent.isDisabled = false;
      // fixture.detectChanges();

      // expect(checkboxInstance.disabled).toBe(false);
      // expect(checkboxNativeElement.classList).not.toContain('dt-checkbox-disabled');
      // expect(inputElement.tabIndex).toBe(0);
      // expect(inputElement.disabled).toBe(false);
    });
  });

  describe('with multiple checkboxes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MultipleCheckboxes);
      fixture.detectChanges();
    });

    it('should assign a unique id to each checkbox', () => {
      const [firstId, secondId] = fixture.debugElement
        .queryAll(By.directive(DtCheckbox))
        .map(
          (debugElement) =>
            debugElement.nativeElement.querySelector('input').id,
        );

      expect(firstId).toMatch(/dt-checkbox-\d+-input/);
      expect(secondId).toMatch(/dt-checkbox-\d+-input/);
      expect(firstId).not.toEqual(secondId);
    });
  });

  describe('with ngModel', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: DtCheckbox<any>;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithFormDirectives);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      flush();

      const checkboxElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      const ngModel = checkboxElement.injector.get<NgModel>(NgModel);

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);

      // TODO(jelbourn): test that `touched` and `pristine` state are modified appropriately.
      // This is currently blocked on issues with waitForAsync() and fakeAsync().
    }));

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });
  });

  describe('with required ngModel', () => {
    let checkboxInstance: DtCheckbox<any>;
    let inputElement: HTMLInputElement;
    let testComponent: CheckboxWithNgModel;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithNgModel);
      fixture.detectChanges();

      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      const checkboxNativeElement = checkboxDebugElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;
      checkboxInstance = checkboxDebugElement.componentInstance;
      inputElement = checkboxNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should validate with RequiredTrue validator', () => {
      const checkboxElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      const ngModel = checkboxElement.injector.get<NgModel>(NgModel);

      testComponent.isRequired = true;
      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(ngModel.valid).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(ngModel.valid).toBe(false);
    });
  });

  describe('with name attribute', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithNameAttribute);
      fixture.detectChanges();
    });

    it('should forward name value to input element', () => {
      const checkboxElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      const inputElement = checkboxElement.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(inputElement.getAttribute('name')).toBe('test-name');
    });
  });

  describe('with form control', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxInstance: DtCheckbox<any>;
    let testComponent: CheckboxWithFormControl;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithFormControl);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(
        By.directive(DtCheckbox),
      );
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = checkboxDebugElement.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should toggle the disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });

  it('should work with just a disabled attribute', () => {
    fixture = TestBed.createComponent(CheckboxDisabledAttribute);
    fixture.detectChanges();

    const checkboxDebugElement = fixture.debugElement.query(
      By.directive(DtCheckbox),
    );
    const checkboxInstance = checkboxDebugElement.componentInstance;
    const checkboxNativeElement = checkboxDebugElement.nativeElement;
    expect(checkboxInstance.disabled).toBe(true);
    expect(checkboxNativeElement.classList).toContain('dt-checkbox-disabled');
  });
});

/** Simple component for testing a single checkbox. */
@Component({
  template: `
    <div
      (click)="parentElementClicked = true"
      (keyup)="parentElementKeyedUp = true"
    >
      <dt-checkbox
        [id]="checkboxId"
        [required]="isRequired"
        [checked]="isChecked"
        [(indeterminate)]="isIndeterminate"
        [disabled]="isDisabled"
        [value]="checkboxValue"
        (click)="onCheckboxClick($event)"
        (change)="onCheckboxChange($event)"
      >
        Simple checkbox
      </dt-checkbox>
    </div>
  `,
})
class SingleCheckbox {
  isChecked = false;
  isRequired = false;
  isIndeterminate = false;
  isDisabled = false;
  parentElementClicked = false;
  parentElementKeyedUp = false;
  checkboxId: string | null = 'simple-check';
  checkboxValue = 'single_checkbox';

  onCheckboxClick: (event?: Event) => void = () => {};
  onCheckboxChange: (event?: DtCheckboxChange<any>) => void = () => {};
}

/** Simple component for testing an DtCheckbox with ngModel in a form. */
@Component({
  template: `
    <form>
      <dt-checkbox name="cb" [(ngModel)]="isGood">Be good</dt-checkbox>
    </form>
  `,
})
class CheckboxWithFormDirectives {
  isGood = false;
}

/** Simple component for testing an DtCheckbox with required ngModel. */
@Component({
  template: `
    <dt-checkbox [required]="isRequired" [(ngModel)]="isGood">
      Be good
    </dt-checkbox>
  `,
})
class CheckboxWithNgModel {
  isGood = false;
  isRequired = true;
}

/** Simple test component with multiple checkboxes. */
@Component({
  template: `
    <dt-checkbox>Option 1</dt-checkbox>
    <dt-checkbox>Option 2</dt-checkbox>
  `,
})
class MultipleCheckboxes {}

/** Simple test component with tabIndex */
@Component({
  template: `
    <dt-checkbox
      [tabIndex]="customTabIndex"
      [disabled]="isDisabled"
    ></dt-checkbox>
  `,
})
class CheckboxWithTabIndex {
  customTabIndex = 7;
  isDisabled = false;
}

/** Simple test component that accesses DtCheckbox using ViewChild. */
@Component({
  template: ` <dt-checkbox></dt-checkbox> `,
})
class CheckboxUsingViewChild {
  @ViewChild(DtCheckbox) checkbox;

  set isDisabled(value: boolean) {
    this.checkbox.disabled = value;
  }
}

/** Simple test component with an aria-label set. */
@Component({
  template: ` <dt-checkbox aria-label="Super effective"></dt-checkbox> `,
})
class CheckboxWithAriaLabel {}

/** Simple test component with an aria-label set. */
@Component({
  template: ` <dt-checkbox aria-labelledby="some-id"></dt-checkbox> `,
})
class CheckboxWithAriaLabelledby {}

/** Simple test component with name attribute */
@Component({
  template: ` <dt-checkbox name="test-name"></dt-checkbox> `,
})
class CheckboxWithNameAttribute {}

/** Simple test component with change event */
@Component({
  template: ` <dt-checkbox (change)="lastEvent = $event"></dt-checkbox> `,
})
class CheckboxWithChangeEvent {
  lastEvent: DtCheckboxChange<any>;
}

/** Test component with reactive forms */
@Component({
  template: ` <dt-checkbox [formControl]="formControl"></dt-checkbox> `,
})
class CheckboxWithFormControl {
  formControl = new FormControl();
}

/** Test component without label */
@Component({
  template: ` <dt-checkbox>{{ label }}</dt-checkbox> `,
})
class CheckboxWithoutLabel {
  label: string;
}

/** Test component with the native tabindex attribute. */
@Component({
  template: ` <dt-checkbox tabindex="5"></dt-checkbox> `,
})
class CheckboxWithTabindexAttr {}

/** Test component with the native tabindex attribute. */
@Component({
  template: ` <dt-checkbox disabled></dt-checkbox> `,
})
class CheckboxDisabledAttribute {}
