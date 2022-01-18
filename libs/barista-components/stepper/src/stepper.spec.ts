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

import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtStepperModule } from './stepper-module';
import { DtStepper } from './stepper';

import { dispatchKeyboardEvent } from '@dynatrace/testing/browser';

describe('DtStepper', () => {
  describe('linear stepper with a pre-defined selectedIndex', () => {
    let preselectedFixture: ComponentFixture<SimplePreselectedDtStepperApp>;
    let stepper: DtStepper;

    beforeEach(() => {
      preselectedFixture = createComponent(SimplePreselectedDtStepperApp);
      preselectedFixture.detectChanges();
      stepper = preselectedFixture.debugElement.query(
        By.directive(DtStepper),
      ).componentInstance;
    });

    it('should not throw', () => {
      expect(() => {
        preselectedFixture.detectChanges();
      }).not.toThrow();
    });

    it('selectedIndex should be typeof number', () => {
      expect(typeof stepper.selectedIndex).toBe('number');
    });

    it('value of selectedIndex should be the pre-defined value', () => {
      expect(stepper.selectedIndex).toBe(0);
    });
  });

  describe('linear stepper with no `stepControl`', () => {
    let noStepControlFixture: ComponentFixture<SimpleStepperWithoutStepControl>;
    beforeEach(() => {
      noStepControlFixture = createComponent(SimpleStepperWithoutStepControl);
      noStepControlFixture.detectChanges();
    });
    it('should not move to the next step if the current one is not completed ', () => {
      const stepper: DtStepper = noStepControlFixture.debugElement.query(
        By.directive(DtStepper),
      ).componentInstance;

      const headers = noStepControlFixture.debugElement.queryAll(
        By.css('.dt-step-header'),
      );

      expect(stepper.selectedIndex).toBe(0);

      headers[1].nativeElement.click();
      noStepControlFixture.detectChanges();

      expect(stepper.selectedIndex).toBe(0);
    });
  });

  describe('linear stepper with `stepControl`', () => {
    let controlAndBindingFixture: ComponentFixture<SimpleStepperWithStepControlAndCompletedBinding>;
    beforeEach(() => {
      controlAndBindingFixture = createComponent(
        SimpleStepperWithStepControlAndCompletedBinding,
      );
      controlAndBindingFixture.detectChanges();
    });

    it('should have the `stepControl` take precedence when `completed` is set', () => {
      expect(
        controlAndBindingFixture.componentInstance.steps[0].control.valid,
      ).toBe(true);
      expect(
        controlAndBindingFixture.componentInstance.steps[0].completed,
      ).toBe(false);

      const stepper: DtStepper = controlAndBindingFixture.debugElement.query(
        By.directive(DtStepper),
      ).componentInstance;

      const headers = controlAndBindingFixture.debugElement.queryAll(
        By.css('.dt-step-header'),
      );

      expect(stepper.selectedIndex).toBe(0);

      headers[1].nativeElement.click();
      controlAndBindingFixture.detectChanges();

      expect(stepper.selectedIndex).toBe(1);
    });
  });

  describe('horizontal stepper', () => {
    it('should set the aria-orientation to "horizontal"', () => {
      const fixture = createComponent(SimpleDtStepperApp);
      fixture.detectChanges();

      const stepperEl = fixture.debugElement.query(
        By.css('dt-stepper'),
      ).nativeElement;
      expect(stepperEl.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should support using the left/right arrows to move focus', () => {
      const fixture = createComponent(SimpleDtStepperApp);
      fixture.detectChanges();

      const stepHeaders = fixture.debugElement.queryAll(
        By.css('.dt-step-header'),
      );
      assertCorrectKeyboardInteraction(fixture, stepHeaders, 'horizontal');
    });
  });

  describe('linear stepper with valid step', () => {
    let fixture: ComponentFixture<LinearStepperWithValidOptionalStep>;
    let testComponent: LinearStepperWithValidOptionalStep;
    let stepper: DtStepper;

    beforeEach(() => {
      fixture = createComponent(LinearStepperWithValidOptionalStep);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
      stepper = fixture.debugElement.query(
        By.css('dt-stepper'),
      ).componentInstance;
    });

    it('must be visited if not optional', () => {
      stepper.selectedIndex = 2;
      fixture.detectChanges();
      expect(stepper.selectedIndex).toBe(0);

      stepper.selectedIndex = 1;
      fixture.detectChanges();
      expect(stepper.selectedIndex).toBe(1);

      stepper.selectedIndex = 2;
      fixture.detectChanges();
      expect(stepper.selectedIndex).toBe(2);
    });

    it('can be skipped entirely if optional', () => {
      testComponent.step2Optional = true;
      fixture.detectChanges();
      stepper.selectedIndex = 2;
      fixture.detectChanges();
      expect(stepper.selectedIndex).toBe(2);
    });
  });

  describe('aria labelling', () => {
    let fixture: ComponentFixture<StepperWithAriaInputs>;
    let stepHeader: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(StepperWithAriaInputs);
      fixture.detectChanges();
      stepHeader = fixture.nativeElement.querySelector('.dt-step-header');
    });

    it('should not set aria-label or aria-labelledby attributes if they are not passed in', () => {
      expect(stepHeader.hasAttribute('aria-label')).toBe(false);
      expect(stepHeader.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('should set the aria-label attribute', () => {
      fixture.componentInstance.ariaLabel = 'First step';
      fixture.detectChanges();

      expect(stepHeader.getAttribute('aria-label')).toBe('First step');
    });

    it('should set the aria-labelledby attribute', () => {
      fixture.componentInstance.ariaLabelledby = 'first-step-label';
      fixture.detectChanges();

      expect(stepHeader.getAttribute('aria-labelledby')).toBe(
        'first-step-label',
      );
    });

    it('should not be able to set both an aria-label and aria-labelledby', () => {
      fixture.componentInstance.ariaLabel = 'First step';
      fixture.componentInstance.ariaLabelledby = 'first-step-label';
      fixture.detectChanges();

      expect(stepHeader.getAttribute('aria-label')).toBe('First step');
      expect(stepHeader.hasAttribute('aria-labelledby')).toBe(false);
    });
  });
});

/** Asserts that keyboard interaction works correctly. */
function assertCorrectKeyboardInteraction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fixture: ComponentFixture<any>,
  stepHeaders: DebugElement[],
  orientation: StepperOrientation,
): void {
  const stepperComponent = fixture.debugElement.query(
    By.directive(DtStepper),
  ).componentInstance;
  const nextKey = orientation === 'vertical' ? DOWN_ARROW : RIGHT_ARROW;
  const prevKey = orientation === 'vertical' ? UP_ARROW : LEFT_ARROW;

  expect(stepperComponent._getFocusIndex()).toBe(0);
  expect(stepperComponent.selectedIndex).toBe(0);

  let stepHeaderEl = stepHeaders[0].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', nextKey);
  fixture.detectChanges();

  expect(stepperComponent._getFocusIndex()).toBe(1);
  expect(stepperComponent.selectedIndex).toBe(0);

  stepHeaderEl = stepHeaders[1].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', ENTER);
  fixture.detectChanges();

  expect(stepperComponent._getFocusIndex()).toBe(1);
  expect(stepperComponent.selectedIndex).toBe(1);

  stepHeaderEl = stepHeaders[1].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', prevKey);
  fixture.detectChanges();

  expect(stepperComponent._getFocusIndex()).toBe(0);
  expect(stepperComponent.selectedIndex).toBe(1);

  // When the focus is on the last step and right arrow key is pressed, the focus should cycle
  // through to the first step.
  stepperComponent._keyManager.updateActiveItem(2);
  stepHeaderEl = stepHeaders[2].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', nextKey);
  fixture.detectChanges();

  expect(stepperComponent._getFocusIndex()).toBe(0);
  expect(stepperComponent.selectedIndex).toBe(1);

  stepHeaderEl = stepHeaders[0].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', SPACE);
  fixture.detectChanges();

  expect(stepperComponent._getFocusIndex()).toBe(0);
  expect(stepperComponent.selectedIndex).toBe(0);

  const endEvent = dispatchKeyboardEvent(stepHeaderEl, 'keydown', END);
  expect(stepperComponent._getFocusIndex()).toBe(stepHeaders.length - 1);
  expect(endEvent.defaultPrevented).toBe(true);

  const homeEvent = dispatchKeyboardEvent(stepHeaderEl, 'keydown', HOME);
  expect(stepperComponent._getFocusIndex()).toBe(0);
  expect(homeEvent.defaultPrevented).toBe(true);
}

function createComponent<T>(component: Type<T>): ComponentFixture<T> {
  TestBed.configureTestingModule({
    imports: [DtStepperModule, NoopAnimationsModule, ReactiveFormsModule],
    declarations: [component],
  }).compileComponents();

  return TestBed.createComponent<T>(component);
}

@Component({
  selector: 'simple-stepper',
  template: `
    <dt-stepper>
      <dt-step>
        <ng-template dtStepLabel>Step 1</ng-template>
        Content 1
        <div>
          <button dt-button dtStepperPrevious>Back</button>
          <button dt-button dtStepperNext>Next</button>
        </div>
      </dt-step>
      <dt-step>
        <ng-template dtStepLabel>Step 2</ng-template>
        Content 2
        <div>
          <button dt-button dtStepperPrevious>Back</button>
          <button dt-button dtStepperNext>Next</button>
        </div>
      </dt-step>
      <dt-step [label]="inputLabel" optional>
        Content 3
        <div>
          <button dt-button dtStepperPrevious>Back</button>
          <button dt-button dtStepperNext>Next</button>
        </div>
      </dt-step>
    </dt-stepper>
  `,
})
class SimpleDtStepperApp {
  inputLabel = 'Step 3';
}

@Component({
  selector: 'simple-preselected-stepper',
  template: `
    <dt-stepper [linear]="true" [selectedIndex]="index">
      <dt-step label="One"></dt-step>
      <dt-step label="Two"></dt-step>
      <dt-step label="Three"></dt-step>
    </dt-stepper>
  `,
})
class SimplePreselectedDtStepperApp {
  index = 0;
}

@Component({
  selector: 'simple-no-stepcontrol-stepper',
  template: `
    <dt-stepper linear>
      <dt-step
        *ngFor="let step of steps"
        [label]="step.label"
        [completed]="step.completed"
      ></dt-step>
    </dt-stepper>
  `,
})
class SimpleStepperWithoutStepControl {
  steps = [
    { label: 'One', completed: false },
    { label: 'Two', completed: false },
    { label: 'Three', completed: false },
  ];
}

@Component({
  selector: 'completed-stepper',
  template: `
    <dt-stepper linear>
      <dt-step
        *ngFor="let step of steps"
        [label]="step.label"
        [stepControl]="step.control"
        [completed]="step.completed"
      ></dt-step>
    </dt-stepper>
  `,
})
class SimpleStepperWithStepControlAndCompletedBinding {
  steps = [
    { label: 'One', completed: false, control: new FormControl() },
    { label: 'Two', completed: false, control: new FormControl() },
    { label: 'Three', completed: false, control: new FormControl() },
  ];
}

@Component({
  selector: 'linear-valid-optional-stepper',
  template: `
    <dt-stepper linear>
      <dt-step label="Step 1" [stepControl]="controls[0]"></dt-step>
      <dt-step
        label="Step 2"
        [stepControl]="controls[1]"
        [optional]="step2Optional"
      ></dt-step>
      <dt-step label="Step 3" [stepControl]="controls[2]"></dt-step>
    </dt-stepper>
  `,
})
class LinearStepperWithValidOptionalStep {
  controls = [0, 0, 0].map(() => new FormControl());
  step2Optional = false;
}

@Component({
  selector: 'stepper-aria',
  template: `
    <dt-stepper>
      <dt-step
        [aria-label]="ariaLabel"
        [aria-labelledby]="ariaLabelledby"
        label="One"
      ></dt-step>
    </dt-stepper>
  `,
})
class StepperWithAriaInputs {
  ariaLabel: string;
  ariaLabelledby: string;
}
