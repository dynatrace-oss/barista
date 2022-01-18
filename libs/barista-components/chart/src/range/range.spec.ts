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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define,@typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { DELETE } from '@angular/cdk/keycodes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartModule } from '../chart-module';
import { DtChartRange, RangeStateChangedEvent } from './range';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  dispatchFakeEvent,
  createKeyboardEvent,
} from '@dynatrace/testing/browser';
import { DtChartFocusTarget } from '../chart-focus-anchor';
import {
  ARIA_DEFAULT_LEFT_HANDLE_LABEL,
  ARIA_DEFAULT_RIGHT_HANDLE_LABEL,
  ARIA_DEFAULT_SELECTED_AREA_LABEL,
  DT_RANGE_RELEASED_CLASS,
} from './constants';
import { DtChartBase } from '../chart-base';

/* eslint-disable no-magic-numbers, @typescript-eslint/unbound-method, no-use-before-define, @typescript-eslint/no-use-before-define */

export class MockChart {
  _focusTargets = new Set<DtChartFocusTarget>();
}

describe('DtChart Range', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DtChartModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [
        RangeTestComponent,
        RangeTestBindingValuesComponent,
        RangeA11yTestComponent,
      ],
      providers: [{ provide: DtChartBase, useClass: MockChart }],
    });
    TestBed.compileComponents();
  });

  describe('Range set programmatically', () => {
    let fixture: ComponentFixture<RangeTestComponent>;
    let range: DtChartRange;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestComponent>(RangeTestComponent);
      range = fixture.debugElement.query(
        By.css('dt-chart-range'),
      ).componentInstance;
      range._maxWidth = 400;
      fixture.detectChanges();
    });

    it('should initialize a hidden range without any style', () => {
      expect(range).toBeDefined();
      expect(range._hidden).toBe(true);
      expect(range._area).toEqual({ left: 0, width: 0 });
      expect(range.value).toEqual([0, 0]);
    });

    it('should show the range element when hidden is false', () => {
      let container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      );
      expect(container).not.toBeTruthy();

      range._hidden = false;
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      );
      expect(container).toBeTruthy();
    });

    it('should create a range and update it programmatically', () => {
      range._area = { left: 100, width: 20 };
      range._hidden = false;
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;
      expect(container.style.left).toBe('100px');
      expect(container.style.width).toBe('20px');

      range._area = { left: 0, width: 100 };
      fixture.detectChanges();

      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;
      expect(container.style.left).toBe('0px');
      expect(container.style.width).toBe('100px');
    });

    it('should create a range and update it programmatically with chart values', () => {
      // mock a fake value to px function
      range._valueToPixels = (value: number) => value * 2;
      range.value = [100, 200];
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;
      expect(container.style.left).toBe('200px');
      expect(container.style.width).toBe('200px');

      range.value = [0, 100];
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;
      expect(container.style.left).toBe('0px');
      expect(container.style.width).toBe('200px');
    });

    it('should hide the range when falsy values are provided', () => {
      // mock a fake value to px function
      range._valueToPixels = (value: number) => value * 2;
      range.value = [100, 200];
      fixture.detectChanges();

      let container: DebugElement = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      );
      expect(container).not.toBeNull();

      // imitate falsy values
      range.value = [100, undefined] as unknown as [number, number];
      fixture.detectChanges();

      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      );
      expect(container).toBeNull();
      expect(range._hidden).toBe(true);
    });

    it('should have the arrows released class on creating a range', () => {
      // mock a fake value to px function
      range._valueToPixels = (value: number) => value * 2;
      range.value = [100, 200];
      fixture.detectChanges();

      const container: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-range'),
      ).nativeElement;
      expect(container.classList.contains(DT_RANGE_RELEASED_CLASS)).toBe(true);
    });

    it('should be closable programmatically', () => {
      range.value = [100, 200];
      range._hidden = true;
      range.close();
      fixture.detectChanges();

      expect(range.value).toStrictEqual([0, 0]);
      expect(range._hidden).toBe(true);
    });
  });

  describe('Range with binding', () => {
    let fixture: ComponentFixture<RangeTestBindingValuesComponent>;
    let range: DtChartRange;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestBindingValuesComponent>(
        RangeTestBindingValuesComponent,
      );
      range = fixture.componentInstance.range;
      range._maxWidth = 400;
      fixture.detectChanges();
    });

    it('should emit a close event when the range is destroyed by resetting the value', () => {
      expect(fixture.componentInstance._closed).toBe(0);

      fixture.componentInstance.values = [];
      fixture.detectChanges();

      expect(fixture.componentInstance._closed).toBe(1);
    });

    it('should emit a close event when the range is destroyed by calling the handle close function', () => {
      expect(fixture.componentInstance._closed).toBe(0);

      range._handleOverlayClose();
      fixture.detectChanges();

      expect(fixture.componentInstance._closed).toBe(1);
    });

    it('should emit a close event when the range is destroyed by pressing delete key', () => {
      expect(fixture.componentInstance._closed).toBe(0);

      const fakeEvent = createKeyboardEvent('keyupEvent', DELETE);

      range._handleKeyDown(fakeEvent, 'left');
      fixture.detectChanges();

      expect(fixture.componentInstance._closed).toBe(1);
    });

    it('should have initial values from binding and update them', () => {
      expect(range._hidden).toBe(false);
      let container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;
      expect(container.style.left).toBe('10px');
      expect(container.style.width).toBe('90px');

      fixture.componentInstance.values = [100, 200];
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;
      expect(container.style.left).toBe('100px');
      expect(container.style.width).toBe('100px');
    });

    it('should have the arrows released class on a created container with a binding', () => {
      const container: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-range'),
      ).nativeElement;
      expect(container.classList.contains(DT_RANGE_RELEASED_CLASS)).toBe(true);
    });

    it('should trigger dragHandle funciton when the left or right handle gets clicked', () => {
      jest.spyOn(range, '_dragHandle').mockImplementation(() => {});
      expect(range._dragHandle).not.toHaveBeenCalled();

      const leftHandle = fixture.debugElement.query(
        By.css('.dt-chart-left-handle'),
      ).nativeElement;
      const rightHandle = fixture.debugElement.query(
        By.css('.dt-chart-right-handle'),
      ).nativeElement;

      dispatchFakeEvent(leftHandle, 'mousedown');
      expect(range._dragHandle).toHaveBeenCalledTimes(1);

      dispatchFakeEvent(rightHandle, 'mousedown');
      expect(range._dragHandle).toHaveBeenCalledTimes(2);
    });

    it('setting the value with the binding should trigger a _stateChanges event', () => {
      const stateChangesSpy = jest.fn();

      const state1 = new RangeStateChangedEvent(100, 100, false);
      const state2 = new RangeStateChangedEvent(110, 90, false);
      const state3 = new RangeStateChangedEvent(130, 70, false);

      const subscription = range._stateChanges.subscribe(stateChangesSpy);

      fixture.componentInstance.values = [100, 200];
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(1);

      expect(stateChangesSpy.mock.calls[0]).toEqual([state1]);
      fixture.componentInstance.values = [110, 200];
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(2);
      expect(stateChangesSpy.mock.calls[1]).toEqual([state2]);
      fixture.componentInstance.values = [130, 200];
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(3);
      expect(stateChangesSpy.mock.calls[2]).toEqual([state3]);

      subscription.unsubscribe();
    });
  });

  describe('accessibility', () => {
    let fixture: ComponentFixture<RangeTestBindingValuesComponent>;
    let fixtureA11y: ComponentFixture<RangeA11yTestComponent>;
    let range: DtChartRange;
    let spiedDate: any; // jest.SpyInstance;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestBindingValuesComponent>(
        RangeTestBindingValuesComponent,
      );
      fixtureA11y = TestBed.createComponent<RangeA11yTestComponent>(
        RangeA11yTestComponent,
      );
      range = fixture.componentInstance.range;
      fixture.detectChanges();
      fixtureA11y.detectChanges();
      // mock current date for date-range pipe
      spiedDate = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2019/06/01 09:33:21').valueOf(),
        );
    });

    afterEach(() => {
      spiedDate.mockClear();
    });

    it('should have default aria-labels on chart container', () => {
      const container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;

      expect(container.getAttribute('aria-role')).toBe('slider');
      expect(container.getAttribute('aria-orientation')).toBe('horizontal');
      expect(container.getAttribute('aria-label')).toBe(
        ARIA_DEFAULT_SELECTED_AREA_LABEL,
      );
      expect(container.getAttribute('aria-valuenow')).toBe('10-100');
      expect(container.getAttribute('aria-valuetext')).toMatch(/1970 Jan 1/); // Date of 10 since unix
    });

    it('should have aria min and max values provided on container', () => {
      const container = fixtureA11y.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;

      expect(container.getAttribute('aria-valuemin')).toBe('10');
      expect(container.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have aria min and max values provided on left handle', () => {
      const handle = fixtureA11y.debugElement.query(
        By.css('.dt-chart-left-handle'),
      ).nativeElement;

      expect(handle.getAttribute('aria-valuemin')).toBe('10');
      expect(handle.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have aria min and max values provided on right handle', () => {
      const handle = fixtureA11y.debugElement.query(
        By.css('.dt-chart-right-handle'),
      ).nativeElement;

      expect(handle.getAttribute('aria-valuemin')).toBe('10');
      expect(handle.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have updated aria labels on chart when input is provided', () => {
      const container = fixtureA11y.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;

      expect(container.getAttribute('aria-label')).toBe('SELECTED');
    });

    it('should have default aria-labels on left handle', () => {
      const handle = fixture.debugElement.query(
        By.css('.dt-chart-left-handle'),
      ).nativeElement;

      expect(handle.getAttribute('aria-role')).toBe('slider');
      expect(handle.getAttribute('aria-label')).toBe(
        ARIA_DEFAULT_LEFT_HANDLE_LABEL,
      );
    });

    it('should have updated aria-labels on left handle', () => {
      const handle = fixtureA11y.debugElement.query(
        By.css('.dt-chart-left-handle'),
      ).nativeElement;

      expect(handle.getAttribute('aria-label')).toBe('LEFT');
    });

    it('should have default aria-labels on right handle', () => {
      const handle = fixture.debugElement.query(
        By.css('.dt-chart-right-handle'),
      ).nativeElement;

      expect(handle.getAttribute('aria-role')).toBe('slider');
      expect(handle.getAttribute('aria-label')).toBe(
        ARIA_DEFAULT_RIGHT_HANDLE_LABEL,
      );
    });

    it('should have updated aria-labels on right handle', () => {
      const handle = fixtureA11y.debugElement.query(
        By.css('.dt-chart-right-handle'),
      ).nativeElement;

      expect(handle.getAttribute('aria-label')).toBe('RIGHT');
    });

    it('should have updated aria value labels on chart container when values changing', () => {
      const start = new Date('2018/10/11 20:48:11').getTime();
      const end = new Date('2019/01/02 17:30:00').getTime();

      range.value = [start, end];
      fixture.detectChanges();

      const container = fixture.debugElement.query(
        By.css('.dt-chart-range-container'),
      ).nativeElement;

      expect(container.getAttribute('aria-valuenow')).toBe(`${start}-${end}`);
      expect(container.getAttribute('aria-valuetext')).toBe(
        '2018 Oct 11 20:48 — 2019 Jan 2 17:30',
      );
    });
  });
});

@Component({
  selector: 'range-test-component',
  template: '<dt-chart-range></dt-chart-range>',
})
export class RangeTestComponent {}

@Component({
  selector: 'range-test-a11y-component',
  template: `
    <dt-chart-range
      [value]="values"
      ariaLabelClose="CLOSE"
      ariaLabelLeftHandle="LEFT"
      ariaLabelRightHandle="RIGHT"
      ariaLabelSelectedArea="SELECTED"
    ></dt-chart-range>
  `,
})
export class RangeA11yTestComponent implements OnInit {
  @ViewChild(DtChartRange, { static: true }) range: DtChartRange;
  values = [10, 100];

  ngOnInit(): void {
    this.range._minValue = 10;
    this.range._maxValue = 100;
    this.range._valueToPixels = (value: number) => value;
  }
}

@Component({
  selector: 'range-test-bind-value-component',
  template:
    '<dt-chart-range [value]="values" (closed)="closed()"></dt-chart-range>',
})
export class RangeTestBindingValuesComponent implements OnInit {
  @ViewChild(DtChartRange, { static: true }) range: DtChartRange;

  values = [10, 100];

  _closed = 0;

  ngOnInit(): void {
    this.range._valueToPixels = (value: number) => value;
  }

  closed(): void {
    this._closed++;
  }
}
