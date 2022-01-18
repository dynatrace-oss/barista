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

import { DtSwitchModule } from './switch-module';
import { DtSwitch, DtSwitchChange } from './switch';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtSwitch', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DtSwitchModule, FormsModule, ReactiveFormsModule],
      declarations: [
        SingleSwitch,
        SwitchWithChangeEvent,
        SwitchWithAriaLabel,
        SwitchWithAriaLabelledby,
        SwitchWithFormDirectives,
        MultipleSwitches,
        SwitchWithNgModel,
        SwitchWithTabIndex,
        SwitchWithNameAttribute,
        SwitchWithFormControl,
        SwitchWithoutLabel,
        SwitchWithTabindexAttr,
        SwitchUsingViewChild,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('basic behaviors', () => {
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let switchInstance: DtSwitch<any>;
    let testComponent: SingleSwitch;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = createComponent(SingleSwitch);

      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      switchInstance = switchDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      labelElement = switchNativeElement.querySelector(
        'label',
      ) as HTMLLabelElement;
    });

    it('should add and remove the checked state', () => {
      expect(switchInstance.checked).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-checked');
      expect(inputElement.checked).toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(true);
      expect(switchNativeElement.classList).toContain('dt-switch-checked');
      expect(inputElement.checked).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-checked');
      expect(inputElement.checked).toBe(false);
    });

    it('should change native element checked when check programmatically', () => {
      expect(inputElement.checked).toBe(false);

      switchInstance.checked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
    });

    it('should toggle checked state on click', () => {
      expect(switchInstance.checked).toBe(false);

      labelElement.click();
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(true);

      labelElement.click();
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(false);
    });

    it('should add and remove disabled state', () => {
      expect(switchInstance.disabled).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(switchInstance.disabled).toBe(true);
      expect(switchNativeElement.classList).toContain('dt-switch-disabled');
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(switchInstance.disabled).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });

    it('should not toggle `checked` state upon interaction while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      switchNativeElement.click();
      expect(switchInstance.checked).toBe(false);
    });

    it('should preserve the user-provided id', () => {
      expect(switchNativeElement.id).toBe('simple-switch');
      expect(inputElement.id).toBe('simple-switch-input');
    });

    it('should generate a unique id for the switch input if no id is set', () => {
      testComponent.switchId = null;
      fixture.detectChanges();

      expect(switchInstance.inputId).toMatch(/dt-switch-\d+/);
      expect(inputElement.id).toBe(switchInstance.inputId);
    });

    it('should project the switch content into the label element', () => {
      const label = switchNativeElement.querySelector(
        '.dt-switch-label',
      ) as HTMLLabelElement;
      expect(label.textContent!.trim()).toBe('Simple switch');
    });

    it('should make the host element a tab stop', () => {
      expect(inputElement.tabIndex).toBe(0);
    });

    it('should not trigger the click event multiple times', () => {
      // By default, when clicking on a label element, a generated click will be dispatched
      // on the associated input element.
      // Since we're using a label element and a visual hidden input, this behavior can led
      // to an issue, where the click events on the checkbox are getting executed twice.

      jest.spyOn(testComponent, 'onSwitchClick');

      expect(inputElement.checked).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-checked');

      labelElement.click();
      fixture.detectChanges();

      expect(switchNativeElement.classList).toContain('dt-switch-checked');
      expect(inputElement.checked).toBe(true);

      expect(testComponent.onSwitchClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger a change event when the native input does', fakeAsync(() => {
      jest.spyOn(testComponent, 'onSwitchChange');

      expect(inputElement.checked).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-checked');

      labelElement.click();
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(switchNativeElement.classList).toContain('dt-switch-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onSwitchChange).toHaveBeenCalledTimes(1);
    }));

    it('should not trigger the change event by changing the native value', fakeAsync(() => {
      jest.spyOn(testComponent, 'onSwitchChange');

      expect(inputElement.checked).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-checked');

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(switchNativeElement.classList).toContain('dt-switch-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onSwitchChange).not.toHaveBeenCalled();
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

      switchInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputElement);
    });

    it('should forward the value to input element', () => {
      testComponent.switchValue = 'basic_switch';
      fixture.detectChanges();

      expect(inputElement.value).toBe('basic_switch');
    });
  });

  describe('with change event and no initial value', () => {
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let switchInstance: DtSwitch<any>;
    let testComponent: SwitchWithChangeEvent;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = createComponent(SwitchWithChangeEvent);

      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      switchInstance = switchDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      labelElement = switchNativeElement.querySelector(
        'label',
      ) as HTMLLabelElement;
    });

    it('should emit the event to the change observable', () => {
      const changeSpy = jest.fn();

      switchInstance.change.subscribe(changeSpy);

      fixture.detectChanges();
      expect(changeSpy).not.toHaveBeenCalled();

      // When changing the native `checked` property the switch will not fire a change event,
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
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-label', () => {
      fixture = createComponent(SwitchWithAriaLabel);
      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(inputElement.getAttribute('aria-label')).toBe('Super effective');
    });

    it('should not set the aria-label attribute if no value is provided', () => {
      fixture = createComponent(SingleSwitch);

      expect(
        fixture.nativeElement.querySelector('input').hasAttribute('aria-label'),
      ).toBe(false);
    });
  });

  describe('with provided aria-labelledby ', () => {
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-labelledby', () => {
      fixture = createComponent(SwitchWithAriaLabelledby);
      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(inputElement.getAttribute('aria-labelledby')).toBe('some-id');
    });

    it('should not assign aria-labelledby if none is provided', () => {
      fixture = createComponent(SingleSwitch);
      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(inputElement.getAttribute('aria-labelledby')).toBe(null);
    });
  });

  describe('with provided tabIndex', () => {
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let testComponent: SwitchWithTabIndex;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SwitchWithTabIndex);

      testComponent = fixture.debugElement.componentInstance;
      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should preserve any given tabIndex', () => {
      expect(inputElement.tabIndex).toBe(7);
    });

    it('should preserve given tabIndex when the switch is disabled then enabled', () => {
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
      fixture = createComponent(SwitchWithTabindexAttr);

      const switchConst = fixture.debugElement.query(By.directive(DtSwitch))
        .componentInstance as DtSwitch<any>;

      expect(switchConst.tabIndex).toBe(5);
    }));
  });

  describe('using ViewChild', () => {
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let testComponent: SwitchUsingViewChild;

    beforeEach(() => {
      fixture = createComponent(SwitchUsingViewChild);

      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should toggle switch disabledness correctly', () => {
      const switchInstance = switchDebugElement.componentInstance;
      const inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(switchInstance.disabled).toBe(false);
      expect(switchNativeElement.classList).not.toContain('dt-switch-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(switchInstance.disabled).toBe(true);
      expect(switchNativeElement.classList).toContain('dt-switch-disabled');
      expect(inputElement.disabled).toBe(true);
    });
  });

  describe('with multiple switches', () => {
    beforeEach(() => {
      fixture = createComponent(MultipleSwitches);
    });

    it('should assign a unique id to each switch', () => {
      const [firstId, secondId] = fixture.debugElement
        .queryAll(By.directive(DtSwitch))
        .map(
          (debugElement) =>
            debugElement.nativeElement.querySelector('input').id,
        );

      expect(firstId).toMatch(/dt-switch-\d+-input/);
      expect(secondId).toMatch(/dt-switch-\d+-input/);
      expect(firstId).not.toEqual(secondId);
    });
  });

  describe('with ngModel', () => {
    let switchDebugElement: DebugElement;
    let switchNativeElement: HTMLElement;
    let switchInstance: DtSwitch<any>;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SwitchWithFormDirectives);

      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchNativeElement = switchDebugElement.nativeElement;
      switchInstance = switchDebugElement.componentInstance;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      flush();

      const switchElement = fixture.debugElement.query(By.directive(DtSwitch));
      const ngModel = switchElement.injector.get<NgModel>(NgModel);

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);

      // TODO(alex frass): test that `touched` and `pristine` state are modified appropriately.
      // This is currently blocked on issues with waitForAsync() and fakeAsync().
    }));

    it('should toggle checked state on click', () => {
      expect(switchInstance.checked).toBe(false);

      inputElement.click();
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(false);
    });
  });

  describe('with required ngModel', () => {
    let switchInstance: DtSwitch<any>;
    let inputElement: HTMLInputElement;
    let testComponent: SwitchWithNgModel;

    beforeEach(() => {
      fixture = createComponent(SwitchWithNgModel);

      const switchDebugElement = fixture.debugElement.query(
        By.directive(DtSwitch),
      );
      const switchNativeElement = switchDebugElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;
      switchInstance = switchDebugElement.componentInstance;
      inputElement = switchNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should validate with RequiredTrue validator', () => {
      const switchElement = fixture.debugElement.query(By.directive(DtSwitch));
      const ngModel = switchElement.injector.get<NgModel>(NgModel);

      testComponent.isRequired = true;
      inputElement.click();
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(true);
      expect(ngModel.valid).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(switchInstance.checked).toBe(false);
      expect(ngModel.valid).toBe(false);
    });
  });

  describe('with name attribute', () => {
    beforeEach(() => {
      fixture = createComponent(SwitchWithNameAttribute);
    });

    it('should forward name value to input element', () => {
      const switchElement = fixture.debugElement.query(By.directive(DtSwitch));
      const inputElement = switchElement.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(inputElement.getAttribute('name')).toBe('test-name');
    });
  });

  describe('with form control', () => {
    let switchDebugElement: DebugElement;
    let switchInstance: DtSwitch<any>;
    let testComponent: SwitchWithFormControl;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SwitchWithFormControl);

      switchDebugElement = fixture.debugElement.query(By.directive(DtSwitch));
      switchInstance = switchDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = switchDebugElement.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
    });

    it('should toggle the disabled state', () => {
      expect(switchInstance.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(switchInstance.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(switchInstance.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });
});

@Component({
  template: `
    <div
      (click)="parentElementClicked = true"
      (keyup)="parentElementKeyedUp = true"
    >
      <dt-switch
        [id]="switchId"
        [required]="isRequired"
        [checked]="isChecked"
        [disabled]="isDisabled"
        [value]="switchValue"
        (click)="onSwitchClick($event)"
        (change)="onSwitchChange($event)"
      >
        Simple switch
      </dt-switch>
    </div>
  `,
})
class SingleSwitch {
  isChecked = false;
  isRequired = false;
  isDisabled = false;
  parentElementClicked = false;
  parentElementKeyedUp = false;
  switchId: string | null = 'simple-switch';
  switchValue = 'single_switch';

  onSwitchClick: (event?: Event) => void = () => {};
  onSwitchChange: (event?: DtSwitchChange<any>) => void = () => {};
}

@Component({
  template: `
    <form>
      <dt-switch name="cb" [(ngModel)]="isGood">Be good</dt-switch>
    </form>
  `,
})
class SwitchWithFormDirectives {
  isGood = false;
}

@Component({
  template: `
    <dt-switch [required]="isRequired" [(ngModel)]="isGood">Be good</dt-switch>
  `,
})
class SwitchWithNgModel {
  isGood = false;
  isRequired = true;
}

@Component({
  template: `
    <dt-switch>Option 1</dt-switch>
    <dt-switch>Option 2</dt-switch>
  `,
})
class MultipleSwitches {}

@Component({
  template: `
    <dt-switch [tabIndex]="customTabIndex" [disabled]="isDisabled"></dt-switch>
  `,
})
class SwitchWithTabIndex {
  customTabIndex = 7;
  isDisabled = false;
}

@Component({
  template: ` <dt-switch></dt-switch> `,
})
class SwitchUsingViewChild {
  @ViewChild(DtSwitch, { static: true }) switch;

  set isDisabled(value: boolean) {
    this.switch.disabled = value;
  }
}

@Component({
  template: ` <dt-switch aria-label="Super effective"></dt-switch> `,
})
class SwitchWithAriaLabel {}

@Component({
  template: ` <dt-switch aria-labelledby="some-id"></dt-switch> `,
})
class SwitchWithAriaLabelledby {}

@Component({
  template: ` <dt-switch name="test-name"></dt-switch> `,
})
class SwitchWithNameAttribute {}

@Component({
  template: ` <dt-switch (change)="lastEvent = $event"></dt-switch> `,
})
class SwitchWithChangeEvent {
  lastEvent: DtSwitchChange<any>;
}

@Component({
  template: ` <dt-switch [formControl]="formControl"></dt-switch> `,
})
class SwitchWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: ` <dt-switch>{{ label }}</dt-switch> `,
})
class SwitchWithoutLabel {
  label: string;
}

@Component({
  template: ` <dt-switch tabindex="5"></dt-switch> `,
})
class SwitchWithTabindexAttr {}
