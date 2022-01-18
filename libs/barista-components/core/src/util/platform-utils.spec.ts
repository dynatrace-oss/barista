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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Component, ElementRef } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import {
  _hasCssClass,
  _parseCssValue,
  _replaceCssClass,
} from './platform-util';

describe('PlatformUtil', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestApp],
      });

      TestBed.compileComponents();
    }),
  );

  describe('replaceCssClass', () => {
    it('should replace an old class with a new one', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;

      expect(testComponent.testElement.className).toBe('old-class');
      _replaceCssClass(testComponent.testElement, 'old-class', 'new-class');
      expect(testComponent.testElement.className).toBe('new-class');
    });

    it('should remove an old class if no new one has been provided', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;

      expect(testComponent.testElement.className).toBe('old-class');
      _replaceCssClass(testComponent.testElement, 'old-class', null);
      expect(testComponent.testElement.className).toBe('');
    });

    it('should add a new class if no old one has been provided', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;

      expect(testComponent.testElement.className).toBe('old-class');
      _replaceCssClass(testComponent.testElement, null, 'new-class');
      expect(testComponent.testElement.className).toBe('old-class new-class');
    });

    it('should also work with ElementRef', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;

      expect(testComponent.testElement.className).toBe('old-class');
      _replaceCssClass(testComponent.elementRef, 'old-class', 'new-class');
      expect(testComponent.testElement.className).toBe('new-class');
    });
  });

  describe('hasClass', () => {
    it('should return true on html element that has the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(_hasCssClass(testComponent.testElement, 'old-class')).toBeTruthy();
    });

    it('should return false on html element that doesnt the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(_hasCssClass(testComponent.testElement, 'new-class')).toBeFalsy();
    });

    it('should return true on svg element that has the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(
        _hasCssClass(testComponent.testSvgElement, 'old-class'),
      ).toBeTruthy();
    });

    it('should return false on svg element that doesnt the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(
        _hasCssClass(testComponent.testSvgElement, 'new-class'),
      ).toBeFalsy();
    });
  });

  describe('parseCssValue', () => {
    it('should return null if undefined is passed', () => {
      expect(_parseCssValue(undefined)).toBeNull();
    });
    it('should return null if no value is found', () => {
      expect(_parseCssValue('px')).toBeNull();
      expect(_parseCssValue('')).toBeNull();
      expect(_parseCssValue('%23')).toBeNull();
    });
    it('should default to px if no unit is found', () => {
      expect(_parseCssValue('23')).toEqual({ value: 23, unit: 'px' });
      expect(_parseCssValue(23)).toEqual({ value: 23, unit: 'px' });
    });
    it('should use whatever is passed into that is not a number as the unit', () => {
      expect(_parseCssValue('23%')).toEqual({ value: 23, unit: '%' });
      expect(_parseCssValue('23vw')).toEqual({ value: 23, unit: 'vw' });
    });
    it('should trim the unit if spaces are passed', () => {
      expect(_parseCssValue('23 % ')).toEqual({ value: 23, unit: '%' });
      expect(_parseCssValue('23   vw')).toEqual({ value: 23, unit: 'vw' });
      expect(_parseCssValue('23vw  ')).toEqual({ value: 23, unit: 'vw' });
    });
    it('should handle integer and floating point numbers', () => {
      expect(_parseCssValue('23.5%')).toEqual({ value: 23.5, unit: '%' });
      expect(_parseCssValue('23vw')).toEqual({ value: 23, unit: 'vw' });
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: '',
})
class TestApp {
  testElement: HTMLElement = document.createElement('div');
  // eslint-disable-next-line
  testSvgElement: SVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  elementRef = new ElementRef(this.testElement);

  constructor() {
    this.testElement.className = 'old-class';
    this.testSvgElement.setAttribute('class', 'old-class');
  }
}
