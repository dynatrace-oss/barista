// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ElementRef, Renderer2, Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { replaceCssClass, hasCssClass, parseCssValue } from './platform-util';

describe('PlatformUtil', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  describe('replaceCssClass', () => {
    it('should replace an old class with a new one using the renderer', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const renderer = testComponent.renderer;
      expect(renderer).toBeTruthy();
      expect(testComponent.testElement.className).toBe('old-class');
      replaceCssClass(
        testComponent.testElement,
        'old-class',
        'new-class',
        renderer,
      );
      expect(testComponent.testElement.className).toBe('new-class');
    });

    it('should replace an old class with a new one without using the renderer', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;

      expect(testComponent.testElement.className).toBe('old-class');
      replaceCssClass(testComponent.testElement, 'old-class', 'new-class');
      expect(testComponent.testElement.className).toBe('new-class');
    });

    it('should remove an old class if no new one has been provided', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const renderer = testComponent.renderer;

      expect(testComponent.testElement.className).toBe('old-class');
      replaceCssClass(testComponent.testElement, 'old-class', null, renderer);
      expect(testComponent.testElement.className).toBe('');
    });

    it('should add a new class if no old one has been provided', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const renderer = testComponent.renderer;

      expect(testComponent.testElement.className).toBe('old-class');
      replaceCssClass(testComponent.testElement, null, 'new-class', renderer);
      expect(testComponent.testElement.className).toBe('old-class new-class');
    });

    it('should also work with ElementRef', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const renderer = testComponent.renderer;

      expect(testComponent.testElement.className).toBe('old-class');
      replaceCssClass(
        testComponent.elementRef,
        'old-class',
        'new-class',
        renderer,
      );
      expect(testComponent.testElement.className).toBe('new-class');
    });
  });

  describe('hasClass', () => {
    it('should return true on html element that has the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(hasCssClass(testComponent.testElement, 'old-class')).toBeTruthy();
    });

    it('should return false on html element that doesnt the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(hasCssClass(testComponent.testElement, 'new-class')).toBeFalsy();
    });

    it('should return true on svg element that has the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(
        hasCssClass(testComponent.testSvgElement, 'old-class'),
      ).toBeTruthy();
    });

    it('should return false on svg element that doesnt the class', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      expect(
        hasCssClass(testComponent.testSvgElement, 'new-class'),
      ).toBeFalsy();
    });
  });

  describe('parseCssValue', () => {
    it('should return null if undefined is passed', () => {
      expect(parseCssValue(undefined)).toBeNull();
    });
    it('should return null if no value is found', () => {
      expect(parseCssValue('px')).toBeNull();
      expect(parseCssValue('')).toBeNull();
      expect(parseCssValue('%23')).toBeNull();
    });
    it('should default to px if no unit is found', () => {
      expect(parseCssValue('23')).toEqual({ value: 23, unit: 'px' });
      expect(parseCssValue(23)).toEqual({ value: 23, unit: 'px' });
    });
    it('should use whatever is passed into that is not a number as the unit', () => {
      expect(parseCssValue('23%')).toEqual({ value: 23, unit: '%' });
      expect(parseCssValue('23vw')).toEqual({ value: 23, unit: 'vw' });
    });
    it('should trim the unit if spaces are passed', () => {
      expect(parseCssValue('23 % ')).toEqual({ value: 23, unit: '%' });
      expect(parseCssValue('23   vw')).toEqual({ value: 23, unit: 'vw' });
      expect(parseCssValue('23vw  ')).toEqual({ value: 23, unit: 'vw' });
    });
    it('should handle integer and floating point numbers', () => {
      expect(parseCssValue('23.5%')).toEqual({ value: 23.5, unit: '%' });
      expect(parseCssValue('23vw')).toEqual({ value: 23, unit: 'vw' });
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: '',
})
class TestApp {
  testElement: HTMLElement = document.createElement('div');
  // tslint:disable-next-line: ban
  testSvgElement: SVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  elementRef = new ElementRef(this.testElement);

  constructor(public renderer: Renderer2) {
    this.testElement.className = 'old-class';
    this.testSvgElement.setAttribute('class', 'old-class');
  }
}
