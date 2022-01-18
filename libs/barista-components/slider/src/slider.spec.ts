/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  createComponent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '@dynatrace/testing/browser';
import { DtSlider } from './slider';
import { DtSliderModule } from './slider-module';

const getElements = (fixture: ComponentFixture<TestApp>): any => {
  return {
    childDebugElement: fixture.debugElement.query(By.directive(DtSlider))
      .nativeElement,
    inputField: fixture.debugElement.query(By.css('input')).nativeElement,
    sliderThumb: fixture.debugElement.query(By.css('.dt-slider-thumb-wrapper'))
      .nativeElement,
    sliderFill: fixture.debugElement.query(By.css('.dt-slider-fill'))
      .nativeElement,
    sliderBackground: fixture.debugElement.query(
      By.css('.dt-slider-background'),
    ).nativeElement,
    sliderWrapper: fixture.debugElement.query(By.css('.dt-slider-wrapper'))
      .nativeElement,
  };
};

describe('DtSlider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtSliderModule],
      declarations: [
        TestApp,
        TestBindingApp,
        TestBigApp,
        TestDefaultSliderApp,
        TestListenerSliderApp,
      ],
      providers: [],
    });

    TestBed.compileComponents();
  });

  describe('smaller, basic slider', () => {
    let fixture;
    let testComponent: TestApp;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestApp);
      testComponent = fixture.componentInstance;

      const el: HTMLElement = fixture.debugElement.query(
        By.css('.dt-slider-wrapper'),
      ).nativeElement;

      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        bottom: 100,
        height: 100,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => '',
      });

      fixture.detectChanges();
    });

    it('should be present', () => {
      expect(testComponent).toBeTruthy();
    });

    it('should have a value of 1', () => {
      const {
        childDebugElement,
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
      } = getElements(fixture);

      expect(testComponent.slider.value).toBe(1);
      expect(inputField.value).toBe('1');
      expect(sliderThumb.style.transform).toBe('translateX(-90%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.9, 1, 1)');
      expect(childDebugElement.textContent).toBe('labelunits');
    });

    it('should set the value of 2', () => {
      testComponent.slider.value = 2;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(2);
      expect(inputField.value).toBe('2');
      expect(sliderThumb.style.transform).toBe('translateX(-80%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.2, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.8, 1, 1)');
    });

    it('should snap to rounded value', () => {
      testComponent.slider.value = 1.5;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(2);
      expect(inputField.value).toBe('2');
      expect(sliderThumb.style.transform).toBe('translateX(-80%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.2, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.8, 1, 1)');
    });

    it('should snap to max value if given value is bigger than max', () => {
      testComponent.slider.value = 15;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(10);
      expect(inputField.value).toBe('10');
      expect(sliderThumb.style.transform).toBe('translateX(-0%)');
      expect(sliderFill.style.transform).toBe('scale3d(1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0, 1, 1)');
    });

    it('should snap to min value if given value is smaller than min', () => {
      testComponent.slider.value = -1;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(0);
      expect(inputField.value).toBe('0');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should update slider position in case the min is changed', () => {
      testComponent.slider.min = 1;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(1);
      expect(inputField.value).toBe('1');
      //value is still 1, but slider pos is at the beginning of the slider
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should update slider position in case the value and max is changed', () => {
      testComponent.slider.value = 5;
      testComponent.slider.max = 5;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(5);
      expect(inputField.value).toBe('5');
      //value is still 5, but slider pos is at the end of the slider
      expect(sliderThumb.style.transform).toBe('translateX(-0%)');
      expect(sliderFill.style.transform).toBe('scale3d(1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0, 1, 1)');
    });

    it('should update the value from input field value change', () => {
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(1);
      expect(inputField.value).toBe('1');
      expect(sliderThumb.style.transform).toBe('translateX(-90%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.9, 1, 1)');

      inputField.value = 5;
      inputField.dispatchEvent(new Event('change'));

      expect(testComponent.slider.value).toBe(5);
      expect(inputField.value).toBe('5');
      expect(sliderThumb.style.transform).toBe('translateX(-50%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.5, 1, 1)');
    });

    it('should change its value depending on the keyboard events (right arrow)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', RIGHT_ARROW);

      expect(testComponent.slider.value).toBe(2);
      expect(inputField.value).toBe('2');
      expect(sliderThumb.style.transform).toBe('translateX(-80%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.2, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.8, 1, 1)');
    });

    it('should change its value depending on the keyboard events (up arrow)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', UP_ARROW);

      expect(testComponent.slider.value).toBe(2);
      expect(inputField.value).toBe('2');
      expect(sliderThumb.style.transform).toBe('translateX(-80%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.2, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.8, 1, 1)');
    });

    it('should change its value depending on the keyboard events (left arrow)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', LEFT_ARROW);

      expect(testComponent.slider.value).toBe(0);
      expect(inputField.value).toBe('0');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should change its value depending on the keyboard events (down arrow)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', DOWN_ARROW);

      expect(testComponent.slider.value).toBe(0);
      expect(inputField.value).toBe('0');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should change its value based on mouse events (click to 0)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchMouseEvent(sliderWrapper, 'click', 0);

      expect(testComponent.slider.value).toBe(0);
      expect(inputField.value).toBe('0');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should change its value based on mouse events (click middle)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchMouseEvent(sliderWrapper, 'click', 50);

      expect(testComponent.slider.value).toBe(5);
      expect(inputField.value).toBe('5');
      expect(sliderThumb.style.transform).toBe('translateX(-50%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.5, 1, 1)');
    });

    it('should change its value based on mouse events (click over max)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchMouseEvent(sliderWrapper, 'click', 150);

      expect(testComponent.slider.value).toBe(10);
      expect(inputField.value).toBe('10');
      expect(sliderThumb.style.transform).toBe('translateX(-0%)');
      expect(sliderFill.style.transform).toBe('scale3d(1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0, 1, 1)');
    });

    it('should update value if new min is set that is bigger than value', () => {
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      testComponent.slider.min = 5;

      // value is 5 slider is at min position
      expect(testComponent.slider.value).toBe(5);
      expect(inputField.value).toBe('5');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should update value if new max is set that is smaller than value', () => {
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      testComponent.slider.value = 9;
      testComponent.slider.max = 5;

      // value is 5 slider is at max position
      expect(testComponent.slider.value).toBe(5);
      expect(inputField.value).toBe('5');
      expect(sliderThumb.style.transform).toBe('translateX(-0%)');
      expect(sliderFill.style.transform).toBe('scale3d(1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0, 1, 1)');
    });

    it('should update slider position if new max or min is given', () => {
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      testComponent.slider.value = 6;
      testComponent.slider.min = 2;

      expect(testComponent.slider.value).toBe(6);
      expect(inputField.value).toBe('6');
      expect(sliderThumb.style.transform).toBe('translateX(-50%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.5, 1, 1)');

      testComponent.slider.max = 9;

      expect(testComponent.slider.value).toBe(6);
      expect(inputField.value).toBe('6');
      expect(sliderThumb.style.transform).toBe(
        'translateX(-42.85714285714286%)',
      );
      expect(sliderFill.style.transform).toBe(
        'scale3d(0.5714285714285714, 1, 1)',
      );
      expect(sliderBackground.style.transform).toBe(
        'scale3d(0.4285714285714286, 1, 1)',
      );
    });

    it('should change its value based on mouse events (drag)', fakeAsync(() => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchMouseEvent(sliderWrapper, 'mousedown', 150);
      dispatchMouseEvent(sliderWrapper, 'mousemove', 10);

      expect(testComponent.slider.value).toBe(1);
      expect(inputField.value).toBe('1');
      expect(sliderThumb.style.transform).toBe('translateX(-90%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.9, 1, 1)');

      dispatchMouseEvent(window, 'mousemove', 80);
      tick(10000);

      expect(testComponent.slider.value).toBe(8);
      expect(inputField.value).toBe('8');
      expect(sliderThumb.style.transform).toBe('translateX(-20%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.8, 1, 1)');
      expect(sliderBackground.style.transform).toBe(
        'scale3d(0.19999999999999996, 1, 1)',
      );

      dispatchMouseEvent(window, 'mouseup', 10);
      tick(10000);
      dispatchMouseEvent(window, 'mousemove', 10);
      tick(10000);
      //there was a mouseup, so mousemove should not trigger any value change
      expect(testComponent.slider.value).toBe(8);
      expect(inputField.value).toBe('8');
      expect(sliderThumb.style.transform).toBe('translateX(-20%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.8, 1, 1)');
      expect(sliderBackground.style.transform).toBe(
        'scale3d(0.19999999999999996, 1, 1)',
      );
    }));

    it('should NOT call update if slider is disabled', fakeAsync(() => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);
      const { slider } = testComponent;

      // "as any" is needed because _updateSlider is private
      const update = jest.spyOn(slider as any, '_updateSlider');
      slider.disabled = true;

      dispatchMouseEvent(sliderWrapper, 'click', 150);
      dispatchMouseEvent(sliderWrapper, 'click', 50);
      dispatchMouseEvent(sliderWrapper, 'mousedown', 50);
      dispatchMouseEvent(sliderWrapper, 'mousemove', 51);
      dispatchMouseEvent(sliderWrapper, 'mousedown', 51);
      dispatchKeyboardEvent(sliderWrapper, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      tick(10000);

      expect(sliderWrapper.classList.contains('dt-disabled')).toBe(true);
      expect(sliderWrapper.getAttribute('aria-disabled')).toBe('true');
      expect(sliderWrapper.getAttribute('tabindex')).toBe('');
      expect(update).not.toHaveBeenCalled();
      expect(testComponent.slider.value).toBe(1);
      expect(inputField.value).toBe('1');
      expect(inputField.getAttribute('disabled')).not.toBeNull();
      expect(sliderThumb.style.transform).toBe('translateX(-90%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.9, 1, 1)');
    }));
  });

  describe('bigger, with fraction step slider', () => {
    let fixture;
    let testComponent: TestBigApp;

    beforeEach(() => {
      fixture = createComponent(TestBigApp);
      testComponent = fixture.componentInstance;
    });

    it('should be present', () => {
      expect(testComponent).toBeTruthy();
    });

    it('should have a value of 50.5', () => {
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(50.5);
      expect(inputField.value).toBe('50.5');
      expect(sliderThumb.style.transform).toBe('translateX(-49.5%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.505, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.495, 1, 1)');
    });

    it('should set the value of 40.5', () => {
      testComponent.slider.value = 40.3;
      const { inputField, sliderThumb, sliderFill, sliderBackground } =
        getElements(fixture);

      expect(testComponent.slider.value).toBe(40.5);
      expect(inputField.value).toBe('40.5');
      expect(sliderThumb.style.transform).toBe('translateX(-59.5%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.405, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.595, 1, 1)');
    });

    it('should change its value depending on the keyboard events (page up)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', PAGE_UP);

      expect(testComponent.slider.value).toBe(55.5);
      expect(inputField.value).toBe('55.5');
      expect(sliderThumb.style.transform).toBe(
        'translateX(-44.49999999999999%)',
      );
      expect(sliderFill.style.transform).toBe('scale3d(0.555, 1, 1)');
      expect(sliderBackground.style.transform).toBe(
        'scale3d(0.44499999999999995, 1, 1)',
      );
    });

    it('should change its value depending on the keyboard events (page down)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', PAGE_DOWN);

      expect(testComponent.slider.value).toBe(45.5);
      expect(inputField.value).toBe('45.5');
      expect(sliderThumb.style.transform).toBe('translateX(-54.5%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.455, 1, 1)');
      expect(sliderBackground.style.transform).toBe(
        'scale3d(0.5449999999999999, 1, 1)',
      );
    });

    it('should change its value depending on the keyboard events (home)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', HOME);

      expect(testComponent.slider.value).toBe(0);
      expect(inputField.value).toBe('0');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });

    it('should change its value depending on the keyboard events (end)', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', END);

      expect(testComponent.slider.value).toBe(100);
      expect(inputField.value).toBe('100');
      expect(sliderThumb.style.transform).toBe('translateX(-0%)');
      expect(sliderFill.style.transform).toBe('scale3d(1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0, 1, 1)');
    });
  });

  describe('Slider with default values', () => {
    let fixture;
    let testComponent: TestDefaultSliderApp;

    beforeEach(() => {
      fixture = createComponent(TestDefaultSliderApp);
      testComponent = fixture.componentInstance;
    });

    it('should be present, and have the default values', () => {
      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      expect(testComponent).toBeTruthy();
      expect(testComponent.slider.value).toBe(0);
      expect(testComponent.slider.min).toBe(0);
      expect(testComponent.slider.max).toBe(10);
      expect(testComponent.slider.step).toBe(1);
      expect(testComponent.slider.disabled).toBe(false);
      expect(sliderWrapper.classList).not.toContain('dt-disabled');
      expect(sliderWrapper.getAttribute('aria-disabled')).toBe('false');
      expect(sliderWrapper.getAttribute('tabindex')).toBe('0');
      expect(inputField.getAttribute('disabled')).toBe(null);
      expect(inputField.value).toBe('0');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');
    });
  });

  describe('slider with bindings', () => {
    let fixture;
    let testComponent: TestBindingApp;

    beforeEach(() => {
      fixture = createComponent(TestBindingApp);
      testComponent = fixture.componentInstance;
    });

    it('should update the value when the binding updates', () => {
      testComponent.value = 5;
      fixture.detectChanges();

      const {
        inputField,
        sliderThumb,
        sliderFill,
        sliderBackground,
        sliderWrapper,
      } = getElements(fixture);

      expect(inputField.value).toBe('5');
      expect(sliderThumb.style.transform).toBe('translateX(-50%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.5, 1, 1)');

      testComponent.min = 5;
      fixture.detectChanges();

      expect(inputField.value).toBe('5');
      expect(sliderThumb.style.transform).toBe('translateX(-100%)');
      expect(sliderFill.style.transform).toBe('scale3d(0, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(1, 1, 1)');

      testComponent.value = 6;
      testComponent.max = 6;
      fixture.detectChanges();

      expect(inputField.value).toBe('6');
      expect(sliderThumb.style.transform).toBe('translateX(-0%)');
      expect(sliderFill.style.transform).toBe('scale3d(1, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0, 1, 1)');

      testComponent.step = 0.5;
      fixture.detectChanges();
      testComponent.value = 5.5;
      fixture.detectChanges();

      expect(inputField.value).toBe('5.5');
      expect(sliderThumb.style.transform).toBe('translateX(-50%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.5, 1, 1)');

      testComponent.disabled = true;
      fixture.detectChanges();

      expect(inputField.value).toBe('5.5');
      expect(sliderThumb.style.transform).toBe('translateX(-50%)');
      expect(sliderFill.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderBackground.style.transform).toBe('scale3d(0.5, 1, 1)');
      expect(sliderWrapper.classList.contains('dt-disabled')).toBe(true);
      expect(sliderWrapper.getAttribute('aria-disabled')).toBe('true');
      expect(sliderWrapper.getAttribute('tabindex')).toBe('');
      expect(inputField.getAttribute('disabled')).not.toBeNull();
    });
  });

  describe('Slider with listener', () => {
    let fixture;
    let testComponent: TestListenerSliderApp;
    let spy;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestListenerSliderApp);
      testComponent = fixture.componentInstance;
      spy = jest.spyOn(testComponent, 'handleChange');

      const el: HTMLElement = fixture.debugElement.query(
        By.css('.dt-slider-wrapper'),
      ).nativeElement;

      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        bottom: 100,
        height: 100,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => '',
      });

      fixture.detectChanges();
    });

    it('should trigger change event if value changed (slider value)', () => {
      expect(spy).toHaveBeenCalledTimes(1); //initial value setting

      testComponent.slider.value = 2;
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should trigger change event if value changed (value binding)', () => {
      expect(spy).toHaveBeenCalledTimes(1); //initial value setting

      testComponent.value = 2;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should trigger change event if value changed (input field)', () => {
      expect(spy).toHaveBeenCalledTimes(1); //initial value setting

      const { inputField } = getElements(fixture);

      inputField.value = 2;
      inputField.dispatchEvent(new Event('change'));

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should trigger change event if value changed (mouse event)', () => {
      expect(spy).toHaveBeenCalledTimes(1); //initial value setting

      const { sliderWrapper } = getElements(fixture);

      dispatchMouseEvent(sliderWrapper, 'click', 50);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should trigger change event if value changed (keyboard event)', () => {
      expect(spy).toHaveBeenCalledTimes(1); //initial value setting

      const { sliderWrapper } = getElements(fixture);

      dispatchKeyboardEvent(sliderWrapper, 'keydown', RIGHT_ARROW);

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-slider [value]="1" [min]="0" [max]="10" [step]="1">
      <dt-slider-label>label</dt-slider-label>
      <dt-slider-unit>units</dt-slider-unit>
    </dt-slider>
  `,
})
class TestApp {
  @ViewChild(DtSlider, { static: true })
  slider: DtSlider;
}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-slider
      [value]="value"
      [min]="min"
      [max]="max"
      [step]="step"
      [disabled]="disabled"
    >
      <dt-slider-label>label</dt-slider-label>
      <dt-slider-unit>units</dt-slider-unit>
    </dt-slider>
  `,
})
class TestBindingApp {
  disabled = false;
  value = 0;
  step = 1;
  min = 0;
  max = 10;
}

@Component({
  selector: 'dt-big-test-app',
  template: `
    <dt-slider [value]="50.5" [min]="0" [max]="100" [step]="0.5">
      <dt-slider-label>label</dt-slider-label>
      <dt-slider-unit>units</dt-slider-unit>
    </dt-slider>
  `,
})
class TestBigApp {
  @ViewChild(DtSlider, { static: true })
  slider: DtSlider;
}

@Component({
  selector: 'dt-default-test-app',
  template: ` <dt-slider></dt-slider> `,
})
class TestDefaultSliderApp {
  @ViewChild(DtSlider, { static: true })
  slider: DtSlider;
}

@Component({
  selector: 'dt-listener-test-app',
  template: `
    <dt-slider [value]="value" (change)="handleChange($event)"></dt-slider>
  `,
})
class TestListenerSliderApp {
  value = 0;
  @ViewChild(DtSlider, { static: true })
  slider: DtSlider;

  handleChange = function (): void {};
}
