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
  BACKSPACE,
  DELETE,
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartModule } from '../chart-module';
import {
  dispatchEvent,
  dispatchKeyboardEvent,
  createKeyboardEvent,
  createComponent,
} from '@dynatrace/testing/browser';
import {
  ARIA_DEFAULT_SELECTED_LABEL,
  DtChartTimestamp,
  TimestampStateChangedEvent,
} from './timestamp';

const TIMESTAMP_SELECTOR = '.dt-chart-timestamp-selector';

describe('DtChart Timestamp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule],
      declarations: [
        TimestampTestComponent,
        TimestampTestA11yComponent,
        TimestampTestBindingValuesComponent,
      ],
    });
    TestBed.compileComponents();
  });

  describe('Timestamp set programmatically', () => {
    let fixture: ComponentFixture<TimestampTestComponent>;
    let timestamp: DtChartTimestamp;

    beforeEach(() => {
      fixture = TestBed.createComponent<TimestampTestComponent>(
        TimestampTestComponent,
      );
      timestamp = fixture.componentInstance.timestamp;
      fixture.detectChanges();
    });

    it('should initialize a hidden timestamp without any style.', () => {
      expect(timestamp).toBeDefined();
      expect(timestamp._hidden).toBe(true);
      expect(timestamp._position).toBe(0);
      expect(timestamp.value).toEqual(0);
    });

    it('should show the timestamp element when hidden is false', () => {
      let container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR));
      expect(container).not.toBeTruthy();

      timestamp._hidden = false;
      fixture.detectChanges();
      container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR));
      expect(container).toBeTruthy();
    });

    it('should create a timestamp and update it programmatically', () => {
      timestamp._position = 20;
      timestamp._hidden = false;
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(20px)');

      timestamp._position = 100;
      fixture.detectChanges();

      container = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(100px)');
    });

    it('should create a timestamp and update it programmatically with chart values', () => {
      // mock a fake value to px function
      timestamp._valueToPixels = (value: number) => value * 2;
      timestamp.value = 10;
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(20px)');

      timestamp.value = 100;
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(200px)');
    });

    it('should hide the timestamp when falsy values are provided', () => {
      // mock a fake value to px function
      timestamp._valueToPixels = (value: number) => value * 2;
      timestamp.value = 200;
      fixture.detectChanges();

      let container: DebugElement = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      );
      expect(container).not.toBeNull();

      // imitate falsy values
      timestamp.value = undefined as unknown as number;
      fixture.detectChanges();

      container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR));
      expect(container).toBeNull();
      expect(timestamp._hidden).toBe(true);
    });

    it('should be closable programmatically', () => {
      timestamp.value = 100;
      timestamp._hidden = false;
      timestamp.close();
      fixture.detectChanges();

      expect(timestamp.value).toBe(0);
      expect(timestamp._hidden).toBe(true);
    });
  });

  describe('Timestamp with binding', () => {
    let fixture: ComponentFixture<TimestampTestBindingValuesComponent>;
    let timestamp: DtChartTimestamp;

    beforeEach(() => {
      fixture = createComponent(TimestampTestBindingValuesComponent);
      timestamp = fixture.componentInstance.timestamp;
    });

    it('should emit a close event when the timestamp is destroyed by calling the handle close function', () => {
      expect(fixture.componentInstance._closed).toBe(0);

      timestamp._handleOverlayClose();
      fixture.detectChanges();

      expect(fixture.componentInstance._closed).toBe(1);
    });

    it('should emit a close event when the timestamp is destroyed by pressing delete key', () => {
      expect(fixture.componentInstance._closed).toBe(0);

      const fakeEvent = createKeyboardEvent('keyupEvent', DELETE);

      timestamp._handleKeyUp(fakeEvent);
      fixture.detectChanges();

      expect(fixture.componentInstance._closed).toBe(1);
    });

    it('should have initial values from binding and update them', () => {
      expect(timestamp._hidden).toBe(false);
      let container = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(10px)');

      fixture.componentInstance.value = 100;
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR),
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(100px)');
    });

    it('setting the value with the binding should trigger a _stateChanges event', () => {
      const stateChangesSpy = jest.fn();

      const state1 = new TimestampStateChangedEvent(100, false);
      const state2 = new TimestampStateChangedEvent(110, false);
      const state3 = new TimestampStateChangedEvent(130, false);

      const subscription = timestamp._stateChanges.subscribe(stateChangesSpy);

      fixture.componentInstance.value = 100;
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(1);
      expect(stateChangesSpy.mock.calls[0]).toEqual([state1]);
      fixture.componentInstance.value = 110;
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(2);
      expect(stateChangesSpy.mock.calls[1]).toEqual([state2]);
      fixture.componentInstance.value = 130;
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(3);
      expect(stateChangesSpy.mock.calls[2]).toEqual([state3]);

      subscription.unsubscribe();
    });
  });

  describe('accessibility', () => {
    let fixture: ComponentFixture<TimestampTestBindingValuesComponent>;
    let fixtureA11y: ComponentFixture<TimestampTestA11yComponent>;
    let timestamp: DtChartTimestamp;
    let spiedDate: any; // jest.SpyInstance;

    beforeEach(() => {
      fixture = TestBed.createComponent<TimestampTestBindingValuesComponent>(
        TimestampTestBindingValuesComponent,
      );
      fixtureA11y = TestBed.createComponent<TimestampTestA11yComponent>(
        TimestampTestA11yComponent,
      );
      timestamp = fixtureA11y.componentInstance.timestamp;
      fixture.detectChanges();
      fixtureA11y.detectChanges();

      spiedDate = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2019/06/01 09:33:21').valueOf(),
        );
    });

    afterEach(() => {
      spiedDate.mockClear();
    });

    it('should have default aria-labels on timestamp', () => {
      const container = fixture.debugElement.query(
        By.css('.dt-chart-timestamp-selector'),
      ).nativeElement;

      expect(container.getAttribute('aria-role')).toBe('slider');
      expect(container.getAttribute('aria-orientation')).toBe('horizontal');
      expect(container.getAttribute('aria-label')).toBe(
        ARIA_DEFAULT_SELECTED_LABEL,
      );
      expect(container.getAttribute('aria-valuenow')).toBe('10');
      expect(container.getAttribute('aria-valuetext')).toMatch(/Jan 1/);
    });

    it('should have aria min and max values provided on container', () => {
      const container = fixture.debugElement.query(
        By.css('.dt-chart-timestamp-selector'),
      ).nativeElement;

      expect(container.getAttribute('aria-valuemin')).toBe(
        `${new Date('2019/01/01 00:00:00').getTime()}`,
      );
      expect(container.getAttribute('aria-valuemax')).toBe(
        `${new Date('2019/12/31 00:00:00').getTime()}`,
      );
    });

    it('should have updated aria labels on timestamp when input is provided', () => {
      const container = fixtureA11y.debugElement.query(
        By.css('.dt-chart-timestamp-selector'),
      ).nativeElement;

      expect(container.getAttribute('aria-label')).toBe('SELECTED');
    });

    it('should have updated aria value labels on timestamp when values changing', () => {
      const newDate = new Date('2018/10/11 20:48:11').getTime();

      timestamp.value = newDate;
      fixtureA11y.detectChanges();

      const container = fixtureA11y.debugElement.query(
        By.css('.dt-chart-timestamp-selector'),
      ).nativeElement;

      expect(container.getAttribute('aria-valuenow')).toBe(`${newDate}`);
      expect(container.getAttribute('aria-valuetext')).toBe('Oct 11, 20:48');
    });
  });

  describe('keyboard support', () => {
    let fixture: ComponentFixture<TimestampTestBindingValuesComponent>;
    let timestamp: DtChartTimestamp;
    let selector: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(TimestampTestBindingValuesComponent);
      timestamp = fixture.componentInstance.timestamp;

      const el: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-timestamp'),
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

      selector = fixture.debugElement.query(
        By.css('.dt-chart-timestamp-selector'),
      ).nativeElement;
    });

    it('should trigger a switch to Range event when the shift key was pressed', () => {
      const spy = jest.fn();
      const subscription = timestamp._switchToRange.subscribe(spy);

      const event = createKeyboardEvent('keydown', UP_ARROW);
      jest.spyOn(event, 'shiftKey', 'get').mockImplementation(() => true);
      dispatchEvent(selector, event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(10); // value of the timestamp
      subscription.unsubscribe();
    });

    it('should increase the value on right arrow press', () => {
      dispatchKeyboardEvent(selector, 'keydown', RIGHT_ARROW);
      expect(timestamp.value).toBe(11);
      expect(timestamp._position).toBe(11);
    });

    it('should increase the value on up arrow press', () => {
      dispatchKeyboardEvent(selector, 'keydown', UP_ARROW);
      expect(timestamp.value).toBe(11);
      expect(timestamp._position).toBe(11);
    });

    it('should decrease the value on left arrow press', () => {
      dispatchKeyboardEvent(selector, 'keydown', LEFT_ARROW);
      expect(timestamp.value).toBe(9);
      expect(timestamp._position).toBe(9);
    });

    it('should decrease the value on down arrow press', () => {
      dispatchKeyboardEvent(selector, 'keydown', DOWN_ARROW);
      expect(timestamp.value).toBe(9);
      expect(timestamp._position).toBe(9);
    });

    it('should increase the value in large steps on page up press', () => {
      dispatchKeyboardEvent(selector, 'keydown', PAGE_UP);
      expect(timestamp.value).toBe(20);
      expect(timestamp._position).toBe(20);
    });

    it('should decrease the value in large steps on page down press', () => {
      fixture.debugElement.componentInstance.value = 44;
      fixture.detectChanges();
      dispatchKeyboardEvent(selector, 'keydown', PAGE_DOWN);
      expect(timestamp.value).toBe(34);
      expect(timestamp._position).toBe(34);
    });

    it('should set the value to the min on home press', () => {
      fixture.debugElement.componentInstance.value = 44;
      fixture.detectChanges();
      dispatchKeyboardEvent(selector, 'keydown', HOME);
      expect(timestamp.value).toBe(0);
      expect(timestamp._position).toBe(0);
    });

    it('should set the value to the max on end press', () => {
      fixture.debugElement.componentInstance.value = 44;
      fixture.detectChanges();
      dispatchKeyboardEvent(selector, 'keydown', END);
      expect(timestamp.value).toBe(100);
      expect(timestamp._position).toBe(100);
    });

    it('should destroy the timestamp on backspace press', () => {
      expect(timestamp._hidden).toBe(false);
      dispatchKeyboardEvent(selector, 'keydown', BACKSPACE);
      expect(timestamp.value).toBe(0);
      expect(timestamp._hidden).toBe(true);
    });

    it('should destroy the timestamp on delete press', () => {
      expect(timestamp._hidden).toBe(false);
      dispatchKeyboardEvent(selector, 'keydown', DELETE);
      expect(timestamp.value).toBe(0);
      expect(timestamp._hidden).toBe(true);
    });
  });
});

@Component({
  selector: 'timestamp-test-component',
  template: '<dt-chart-timestamp></dt-chart-timestamp>',
})
export class TimestampTestComponent {
  @ViewChild(DtChartTimestamp, { static: true }) timestamp: DtChartTimestamp;
}

@Component({
  selector: 'timestamp-test-a11y-component',
  template: `
    <dt-chart-timestamp
      [value]="value"
      ariaLabelClose="CLOSE"
      ariaLabelSelected="SELECTED"
    ></dt-chart-timestamp>
  `,
})
export class TimestampTestA11yComponent implements OnInit {
  @ViewChild(DtChartTimestamp, { static: true }) timestamp: DtChartTimestamp;
  value = new Date('2019/06/01 20:38:14').getTime();

  ngOnInit(): void {
    this.timestamp._valueToPixels = (value: number) => value;
  }
}

@Component({
  selector: 'timestamp-test-bind-value-component',
  template:
    '<dt-chart-timestamp [value]="value" (closed)="closed()"></dt-chart-timestamp>',
})
export class TimestampTestBindingValuesComponent implements OnInit {
  @ViewChild(DtChartTimestamp, { static: true }) timestamp: DtChartTimestamp;
  value = 10;

  _closed = 0;

  ngOnInit(): void {
    this.timestamp._minValue = new Date('2019/01/01 00:00:00').getTime();
    this.timestamp._maxValue = new Date('2019/12/31 00:00:00').getTime();
    this.timestamp._valueToPixels = (value: number) => value;
    this.timestamp._pixelsToValue = (value: number) => value;
  }

  closed(): void {
    this._closed++;
  }
}
