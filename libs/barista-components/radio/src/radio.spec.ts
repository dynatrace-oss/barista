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
  Component,
  DebugElement,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DtRadioModule } from './radio-module';
import { DtRadioGroup } from './radio-group';
import { DtRadioButton, DtRadioChange } from './radio';
import { createComponent, dispatchFakeEvent } from '@dynatrace/testing/browser';

describe('DtRadio', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtRadioModule, FormsModule, ReactiveFormsModule],
        declarations: [
          DisableableRadioButton,
          FocusableRadioButton,
          RadiosInsideRadioGroup,
          RadioGroupWithNgModel,
          RadioGroupWithFormControl,
          StandaloneRadioButtons,
          DoubleRadioGroups,
          InterleavedRadioGroup,
          TranscludingWrapper,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('inside of a group', () => {
    let fixture: ComponentFixture<RadiosInsideRadioGroup>;
    let groupDebugElement: DebugElement;
    let radioDebugElements: DebugElement[];
    let radioLabelElements: HTMLLabelElement[];
    let radioInputElements: HTMLInputElement[];
    let groupInstance: DtRadioGroup<any>;
    let radioInstances: Array<DtRadioButton<any>>;
    let testComponent: RadiosInsideRadioGroup;

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(RadiosInsideRadioGroup);

        testComponent = fixture.debugElement.componentInstance;

        groupDebugElement = fixture.debugElement.query(
          By.directive(DtRadioGroup),
        );
        groupInstance =
          groupDebugElement.injector.get<DtRadioGroup<any>>(DtRadioGroup);

        radioDebugElements = fixture.debugElement.queryAll(
          By.directive(DtRadioButton),
        );
        radioInstances = radioDebugElements.map(
          (debugEl) => debugEl.componentInstance,
        );

        radioLabelElements = radioDebugElements.map(
          (debugEl) => debugEl.query(By.css('label')).nativeElement,
        );
        radioInputElements = radioDebugElements.map(
          (debugEl) => debugEl.query(By.css('input')).nativeElement,
        );
      }),
    );

    it('should set individual radio names based on the group name', () => {
      expect(groupInstance.name).toBeTruthy();
      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }
    });

    it('should coerce the disabled binding on the radio group', () => {
      (groupInstance as any).disabled = '';
      fixture.detectChanges();

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(radioInstances[0].checked).toBe(false);
      expect(groupInstance.disabled).toBe(true);
    });

    it('should disable click interaction when the group is disabled', () => {
      testComponent.isGroupDisabled = true;
      fixture.detectChanges();

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(radioInstances[0].checked).toBe(false);
    });

    it('should disable each individual radio when the group is disabled', () => {
      testComponent.isGroupDisabled = true;
      fixture.detectChanges();

      for (const radio of radioInstances) {
        expect(radio.disabled).toBe(true);
      }
    });

    it('should set required to each radio button when the group is required', () => {
      testComponent.isGroupRequired = true;
      fixture.detectChanges();

      for (const radio of radioInstances) {
        expect(radio.required).toBe(true);
      }
    });

    it('should update the group value when one of the radios changes', () => {
      expect(groupInstance.value).toBeFalsy();

      radioInstances[0].checked = true;
      fixture.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
    });

    it('should update the group and radios when one of the radios is clicked', () => {
      expect(groupInstance.value).toBeFalsy();

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(radioInstances[0].checked).toBe(true);
      expect(radioInstances[1].checked).toBe(false);

      radioLabelElements[1].click();
      fixture.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(groupInstance.selected).toBe(radioInstances[1]);
      expect(radioInstances[0].checked).toBe(false);
      expect(radioInstances[1].checked).toBe(true);
    });

    it('should check a radio upon interaction with the underlying native radio button', () => {
      radioInputElements[0].click();
      fixture.detectChanges();

      expect(radioInstances[0].checked).toBe(true);
      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
    });

    it('should emit a change event from radio buttons', () => {
      expect(radioInstances[0].checked).toBe(false);

      const spies = radioInstances.map(() => jest.fn());

      spies.forEach((spy, index) =>
        radioInstances[index].change.subscribe(spy),
      );

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(spies[0]).toHaveBeenCalled();

      radioLabelElements[1].click();
      fixture.detectChanges();

      // To match the native radio button behavior, the change event shouldn't
      // be triggered when the radio got unselected.
      expect(spies[0]).toHaveBeenCalledTimes(1);
      expect(spies[1]).toHaveBeenCalledTimes(1);
    });

    it(`should not emit a change event from the radio group when change group value programmatically`, () => {
      expect(groupInstance.value).toBeFalsy();

      const changeSpy = jest.fn();
      groupInstance.change.subscribe(changeSpy);

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);

      groupInstance.value = 'water';
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the group and radios when updating the group value', () => {
      expect(groupInstance.value).toBeFalsy();

      testComponent.groupValue = 'fire';
      fixture.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(radioInstances[0].checked).toBe(true);
      expect(radioInstances[1].checked).toBe(false);

      testComponent.groupValue = 'water';
      fixture.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(groupInstance.selected).toBe(radioInstances[1]);
      expect(radioInstances[0].checked).toBe(false);
      expect(radioInstances[1].checked).toBe(true);
    });

    it('should deselect all of the checkboxes when the group value is cleared', () => {
      radioInstances[0].checked = true;

      expect(groupInstance.value).toBeTruthy();

      groupInstance.value = null;

      expect(radioInstances.every((radio) => !radio.checked)).toBe(true);
    });

    it(`should update the group's selected radio to null when unchecking that radio programmatically`, () => {
      const changeSpy = jest.fn();
      groupInstance.change.subscribe(changeSpy);
      radioInstances[0].checked = true;

      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBeTruthy();

      radioInstances[0].checked = false;

      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBeFalsy();
      expect(radioInstances.every((radio) => !radio.checked)).toBe(true);
      expect(groupInstance.selected).toBeNull();
    });

    it('should not fire a change event from the group when a radio checked state changes', () => {
      const changeSpy = jest.fn();
      groupInstance.change.subscribe(changeSpy);
      radioInstances[0].checked = true;

      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBeTruthy();
      expect(groupInstance.value).toBe('fire');

      radioInstances[1].checked = true;

      fixture.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it(`should update checked status if changed value to radio group's value`, () => {
      const changeSpy = jest.fn();
      groupInstance.change.subscribe(changeSpy);
      groupInstance.value = 'apple';

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBe('apple');
      expect(groupInstance.selected).toBeFalsy();
      expect(radioInstances[0].checked).toBeFalsy();
      expect(radioInstances[1].checked).toBeFalsy();
      expect(radioInstances[2].checked).toBeFalsy();

      radioInstances[0].value = 'apple';

      fixture.detectChanges();

      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(radioInstances[0].checked).toBeTruthy();
      expect(radioInstances[1].checked).toBeFalsy();
      expect(radioInstances[2].checked).toBeFalsy();
    });
  });

  describe('two separate radio groups', () => {
    let fixture: ComponentFixture<DoubleRadioGroups>;
    let testComponent: DoubleRadioGroups;
    let radioDebugElements: DebugElement[];
    let radioLabelElements: HTMLLabelElement[];

    beforeEach(() => {
      fixture = createComponent(DoubleRadioGroups);

      testComponent = fixture.debugElement.componentInstance;

      radioDebugElements = fixture.debugElement.queryAll(
        By.directive(DtRadioButton),
      );

      radioLabelElements = radioDebugElements.map(
        (debugEl) => debugEl.query(By.css('label')).nativeElement,
      );
    });

    it('should not influence the other radio group', () => {
      const groups = testComponent.groups.toArray();
      expect(groups[0].value).toBe('Group1-Option1');
      expect(groups[1].value).toBe('Group2-Option1');

      // Click 'Group1-Option2'
      radioLabelElements[1].click();
      fixture.detectChanges();

      expect(groups[0].value).toBe('Group1-Option2');
      expect(groups[1].value).toBe('Group2-Option1');
    });
  });

  describe('group with ngModel', () => {
    let fixture: ComponentFixture<RadioGroupWithNgModel>;
    let groupDebugElement: DebugElement;
    let radioDebugElements: DebugElement[];
    let innerRadios: DebugElement[];
    let radioLabelElements: HTMLLabelElement[];
    let groupInstance: DtRadioGroup<any>;
    let radioInstances: Array<DtRadioButton<any>>;
    let testComponent: RadioGroupWithNgModel;
    let groupNgModel: NgModel;

    beforeEach(() => {
      fixture = createComponent(RadioGroupWithNgModel);

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(
        By.directive(DtRadioGroup),
      );
      groupInstance =
        groupDebugElement.injector.get<DtRadioGroup<any>>(DtRadioGroup);
      groupNgModel = groupDebugElement.injector.get<NgModel>(NgModel);

      radioDebugElements = fixture.debugElement.queryAll(
        By.directive(DtRadioButton),
      );
      radioInstances = radioDebugElements.map(
        (debugEl) => debugEl.componentInstance,
      );
      innerRadios = fixture.debugElement.queryAll(
        By.css('input[type="radio"]'),
      );

      radioLabelElements = radioDebugElements.map(
        (debugEl) => debugEl.query(By.css('label')).nativeElement,
      );
    });

    it('should set individual radio names based on the group name', () => {
      expect(groupInstance.name).toBeTruthy();
      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }

      groupInstance.name = 'new name';

      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }
    });

    it('should check the corresponding radio button on group value change', () => {
      expect(groupInstance.value).toBeFalsy();
      for (const radio of radioInstances) {
        expect(radio.checked).toBeFalsy();
      }

      groupInstance.value = 'vanilla';
      for (const radio of radioInstances) {
        expect(radio.checked).toBe(groupInstance.value === radio.value);
      }
      expect(groupInstance.selected!.value).toBe(groupInstance.value);
    });

    it('should have the correct control state initially and after interaction', () => {
      // The control should start off valid, pristine, and untouched.
      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(true);
      expect(groupNgModel.touched).toBe(false);

      // After changing the value programmatically, the control should stay pristine
      // but remain untouched.
      radioInstances[1].checked = true;
      fixture.detectChanges();

      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(true);
      expect(groupNgModel.touched).toBe(false);

      // After a user interaction occurs (such as a click), the control should become dirty and
      // now also be touched.
      radioLabelElements[2].click();
      fixture.detectChanges();

      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(false);
      expect(groupNgModel.touched).toBe(true);
    });

    it('should write to the radio button based on ngModel', fakeAsync(() => {
      testComponent.modelValue = 'chocolate';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(innerRadios[1].nativeElement.checked).toBe(true);
      expect(radioInstances[1].checked).toBe(true);
    }));

    it('should update the ngModel value when selecting a radio button', () => {
      dispatchFakeEvent(innerRadios[1].nativeElement, 'change');
      fixture.detectChanges();
      expect(testComponent.modelValue).toBe('chocolate');
    });

    it('should update the model before firing change event', () => {
      expect(testComponent.modelValue).toBeUndefined();
      expect(testComponent.lastEvent).toBeUndefined();

      dispatchFakeEvent(innerRadios[1].nativeElement, 'change');
      fixture.detectChanges();
      expect(testComponent.lastEvent.value).toBe('chocolate');

      dispatchFakeEvent(innerRadios[0].nativeElement, 'change');
      fixture.detectChanges();
      expect(testComponent.lastEvent.value).toBe('vanilla');
    });
  });

  describe('group with FormControl', () => {
    let fixture: ComponentFixture<RadioGroupWithFormControl>;
    let groupDebugElement: DebugElement;
    let groupInstance: DtRadioGroup<any>;
    let testComponent: RadioGroupWithFormControl;

    beforeEach(() => {
      fixture = createComponent(RadioGroupWithFormControl);

      testComponent = fixture.debugElement.componentInstance;
      groupDebugElement = fixture.debugElement.query(
        By.directive(DtRadioGroup),
      );
      groupInstance =
        groupDebugElement.injector.get<DtRadioGroup<any>>(DtRadioGroup);
    });

    it('should toggle the disabled state', () => {
      expect(groupInstance.disabled).toBeFalsy();

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(groupInstance.disabled).toBeTruthy();

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(groupInstance.disabled).toBeFalsy();
    });
  });

  describe('disableable', () => {
    let fixture: ComponentFixture<DisableableRadioButton>;
    let radioInstance: DtRadioButton<any>;
    let radioNativeElement: HTMLInputElement;
    let testComponent: DisableableRadioButton;

    beforeEach(() => {
      fixture = createComponent(DisableableRadioButton);

      testComponent = fixture.debugElement.componentInstance;
      const radioDebugElement = fixture.debugElement.query(
        By.directive(DtRadioButton),
      );
      radioInstance =
        radioDebugElement.injector.get<DtRadioButton<any>>(DtRadioButton);
      radioNativeElement =
        radioDebugElement.nativeElement.querySelector('input');
    });

    it('should toggle the disabled state', () => {
      expect(radioInstance.disabled).toBeFalsy();
      expect(radioNativeElement.disabled).toBeFalsy();

      testComponent.disabled = true;
      fixture.detectChanges();
      expect(radioInstance.disabled).toBeTruthy();
      expect(radioNativeElement.disabled).toBeTruthy();

      testComponent.disabled = false;
      fixture.detectChanges();
      expect(radioInstance.disabled).toBeFalsy();
      expect(radioNativeElement.disabled).toBeFalsy();
    });
  });

  describe('as standalone', () => {
    let fixture: ComponentFixture<StandaloneRadioButtons>;
    let radioDebugElements: DebugElement[];
    let seasonRadioInstances: Array<DtRadioButton<any>>;
    let weatherRadioInstances: Array<DtRadioButton<any>>;
    let fruitRadioInstances: Array<DtRadioButton<any>>;
    let fruitRadioNativeInputs: HTMLElement[];
    let testComponent: StandaloneRadioButtons;

    beforeEach(() => {
      fixture = createComponent(StandaloneRadioButtons);

      testComponent = fixture.debugElement.componentInstance;

      radioDebugElements = fixture.debugElement.queryAll(
        By.directive(DtRadioButton),
      );
      seasonRadioInstances = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'season')
        .map((debugEl) => debugEl.componentInstance);
      weatherRadioInstances = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'weather')
        .map((debugEl) => debugEl.componentInstance);
      fruitRadioInstances = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'fruit')
        .map((debugEl) => debugEl.componentInstance);

      const fruitRadioNativeElements = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'fruit')
        .map((debugEl) => debugEl.nativeElement);

      fruitRadioNativeInputs = [];
      for (const element of fruitRadioNativeElements) {
        fruitRadioNativeInputs.push(
          element.querySelector('input') as HTMLElement,
        );
      }
    });

    it('should uniquely select radios by a name', () => {
      seasonRadioInstances[0].checked = true;
      weatherRadioInstances[1].checked = true;

      fixture.detectChanges();
      expect(seasonRadioInstances[0].checked).toBe(true);
      expect(seasonRadioInstances[1].checked).toBe(false);
      expect(seasonRadioInstances[2].checked).toBe(false);
      expect(weatherRadioInstances[0].checked).toBe(false);
      expect(weatherRadioInstances[1].checked).toBe(true);
      expect(weatherRadioInstances[2].checked).toBe(false);

      seasonRadioInstances[1].checked = true;
      fixture.detectChanges();
      expect(seasonRadioInstances[0].checked).toBe(false);
      expect(seasonRadioInstances[1].checked).toBe(true);
      expect(seasonRadioInstances[2].checked).toBe(false);
      expect(weatherRadioInstances[0].checked).toBe(false);
      expect(weatherRadioInstances[1].checked).toBe(true);
      expect(weatherRadioInstances[2].checked).toBe(false);

      weatherRadioInstances[2].checked = true;
      expect(seasonRadioInstances[0].checked).toBe(false);
      expect(seasonRadioInstances[1].checked).toBe(true);
      expect(seasonRadioInstances[2].checked).toBe(false);
      expect(weatherRadioInstances[0].checked).toBe(false);
      expect(weatherRadioInstances[1].checked).toBe(false);
      expect(weatherRadioInstances[2].checked).toBe(true);
    });

    it('should add required attribute to the underlying input element if defined', () => {
      const radioInstance = seasonRadioInstances[0];
      radioInstance.required = true;
      fixture.detectChanges();

      expect(radioInstance.required).toBe(true);
    });

    it('should add aria-label attribute to the underlying input element if defined', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe(
        'Banana',
      );
    });

    it('should not add aria-label attribute if not defined', () => {
      expect(fruitRadioNativeInputs[1].hasAttribute('aria-label')).toBeFalsy();
    });

    it('should change aria-label attribute if property is changed at runtime', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe(
        'Banana',
      );

      testComponent.ariaLabel = 'Pineapple';
      fixture.detectChanges();

      expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe(
        'Pineapple',
      );
    });

    it('should add aria-labelledby attribute to the underlying input element if defined', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe(
        'xyz',
      );
    });

    it('should not add aria-labelledby attribute if not defined', () => {
      expect(
        fruitRadioNativeInputs[1].hasAttribute('aria-labelledby'),
      ).toBeFalsy();
    });

    it('should change aria-labelledby attribute if property is changed at runtime', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe(
        'xyz',
      );

      testComponent.ariaLabelledby = 'uvw';
      fixture.detectChanges();

      expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe(
        'uvw',
      );
    });

    it('should add aria-describedby attribute to the underlying input element if defined', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-describedby')).toBe(
        'abc',
      );
    });

    it('should not add aria-describedby attribute if not defined', () => {
      expect(
        fruitRadioNativeInputs[1].hasAttribute('aria-describedby'),
      ).toBeFalsy();
    });

    it('should change aria-describedby attribute if property is changed at runtime', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-describedby')).toBe(
        'abc',
      );

      testComponent.ariaDescribedby = 'uvw';
      fixture.detectChanges();

      expect(fruitRadioNativeInputs[0].getAttribute('aria-describedby')).toBe(
        'uvw',
      );
    });

    it('should focus on underlying input element when focus() is called', () => {
      for (let i = 0; i < fruitRadioInstances.length; i++) {
        expect(document.activeElement).not.toBe(fruitRadioNativeInputs[i]);
        fruitRadioInstances[i].focus();
        fixture.detectChanges();

        expect(document.activeElement).toBe(fruitRadioNativeInputs[i]);
      }
    });

    it('should not add the "name" attribute if it is not passed in', () => {
      const radio =
        fixture.debugElement.nativeElement.querySelector('#nameless input');
      expect(radio.hasAttribute('name')).toBe(false);
    });
  });

  describe('with tabindex', () => {
    let fixture: ComponentFixture<FocusableRadioButton>;

    beforeEach(() => {
      fixture = createComponent(FocusableRadioButton);
    });

    it('should forward focus to native input', () => {
      const radioButtonEl = fixture.debugElement.query(
        By.css('.dt-radio-button'),
      ).nativeElement;
      const inputEl = fixture.debugElement.query(
        By.css('.dt-radio-input'),
      ).nativeElement;

      radioButtonEl.focus();
      // Focus events don't always fire in tests, so we need to fake it.
      dispatchFakeEvent(radioButtonEl, 'focus');
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputEl);
    });

    it('should allow specifying an explicit tabindex for a single radio-button', () => {
      const radioButtonInput = fixture.debugElement.query(
        By.css('.dt-radio-button input'),
      ).nativeElement as HTMLInputElement;

      // Expected the tabindex to be set to "0" by default.
      expect(radioButtonInput.tabIndex).toBe(0);

      fixture.componentInstance.tabIndex = 4;
      fixture.detectChanges();

      expect(radioButtonInput.tabIndex).toBe(4);
    });
  });

  describe('group interspersed with other tags', () => {
    let fixture: ComponentFixture<InterleavedRadioGroup>;
    let groupDebugElement: DebugElement;
    let groupInstance: DtRadioGroup<any>;
    let radioDebugElements: DebugElement[];
    let radioInstances: Array<DtRadioButton<any>>;

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(InterleavedRadioGroup);

        groupDebugElement = fixture.debugElement.query(
          By.directive(DtRadioGroup),
        );
        groupInstance =
          groupDebugElement.injector.get<DtRadioGroup<any>>(DtRadioGroup);
        radioDebugElements = fixture.debugElement.queryAll(
          By.directive(DtRadioButton),
        );
        radioInstances = radioDebugElements.map(
          (debugEl) => debugEl.componentInstance,
        );
      }),
    );

    it('should initialize selection of radios based on model value', () => {
      expect(groupInstance.selected).toBe(radioInstances[2]);
    });
  });
});

@Component({
  template: `
    <dt-radio-group
      [disabled]="isGroupDisabled"
      [required]="isGroupRequired"
      [value]="groupValue"
      name="test-name"
    >
      <dt-radio-button value="fire" [disabled]="isFirstDisabled">
        Charmander
      </dt-radio-button>
      <dt-radio-button value="water"> Squirtle </dt-radio-button>
      <dt-radio-button value="leaf"> Bulbasaur </dt-radio-button>
    </dt-radio-group>
  `,
})
class RadiosInsideRadioGroup {
  isFirstDisabled = false;
  isGroupDisabled = false;
  isGroupRequired = false;
  groupValue: string | null = null;
}

@Component({
  template: `
    <dt-radio-button name="season" value="spring">Spring</dt-radio-button>
    <dt-radio-button name="season" value="summer">Summer</dt-radio-button>
    <dt-radio-button name="season" value="autum">Autumn</dt-radio-button>

    <dt-radio-button name="weather" value="warm">Spring</dt-radio-button>
    <dt-radio-button name="weather" value="hot">Summer</dt-radio-button>
    <dt-radio-button name="weather" value="cool">Autumn</dt-radio-button>

    <span id="xyz">Baby Banana</span>
    <span id="abc">A smaller banana</span>
    <dt-radio-button
      name="fruit"
      value="banana"
      [aria-label]="ariaLabel"
      [aria-labelledby]="ariaLabelledby"
      [aria-describedby]="ariaDescribedby"
    ></dt-radio-button>
    <dt-radio-button name="fruit" value="raspberry">Raspberry</dt-radio-button>
    <dt-radio-button id="nameless" value="no-name">No name</dt-radio-button>
  `,
})
class StandaloneRadioButtons {
  ariaLabel = 'Banana';
  ariaLabelledby = 'xyz';
  ariaDescribedby = 'abc';
}

@Component({
  template: `
    <dt-radio-group [(ngModel)]="modelValue" (change)="lastEvent = $event">
      <dt-radio-button *ngFor="let option of options" [value]="option.value">
        {{ option.label }}
      </dt-radio-button>
    </dt-radio-group>
  `,
})
class RadioGroupWithNgModel {
  modelValue: string;
  options = [
    { label: 'Vanilla', value: 'vanilla' },
    { label: 'Chocolate', value: 'chocolate' },
    { label: 'Strawberry', value: 'strawberry' },
  ];
  lastEvent: DtRadioChange<string>;
}

@Component({
  template: ` <dt-radio-button>One</dt-radio-button> `,
})
class DisableableRadioButton {
  @ViewChild(DtRadioButton, { static: true }) radioButton;

  set disabled(value: boolean) {
    this.radioButton.disabled = value;
  }
}

@Component({
  template: `
    <dt-radio-group [formControl]="formControl">
      <dt-radio-button value="1">One</dt-radio-button>
    </dt-radio-group>
  `,
})
class RadioGroupWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `
    <dt-radio-group>
      <dt-radio-button value="Group1-Option1" checked>One</dt-radio-button>
      <dt-radio-button value="Group1-Option2">Two</dt-radio-button>
      <dt-radio-button value="Group1-Option3">Three</dt-radio-button>
    </dt-radio-group>
    <dt-radio-group>
      <dt-radio-button value="Group2-Option1" checked>One</dt-radio-button>
      <dt-radio-button value="Group2-Option2">Two</dt-radio-button>
      <dt-radio-button value="Group2-Option3">Three</dt-radio-button>
    </dt-radio-group>
  `,
})
class DoubleRadioGroups {
  @ViewChildren(DtRadioGroup) groups: QueryList<DtRadioGroup<any>>;
}

@Component({
  template: ` <dt-radio-button [tabIndex]="tabIndex"></dt-radio-button> `,
})
class FocusableRadioButton {
  tabIndex: number;
}

@Component({
  template: `
    <dt-radio-group name="group" [(ngModel)]="modelValue">
      <dt-transcluding-wrapper *ngFor="let option of options">
        <dt-radio-button [value]="option.value">
          {{ option.label }}
        </dt-radio-button>
      </dt-transcluding-wrapper>
    </dt-radio-group>
  `,
})
class InterleavedRadioGroup {
  modelValue = 'strawberry';
  options = [
    { label: 'Vanilla', value: 'vanilla' },
    { label: 'Chocolate', value: 'chocolate' },
    { label: 'Strawberry', value: 'strawberry' },
  ];
}

@Component({
  selector: 'dt-transcluding-wrapper',
  template: ` <div><ng-content></ng-content></div> `,
})
class TranscludingWrapper {}

/* eslint-enable @typescript-eslint/no-explicit-any, no-magic-numbers */
