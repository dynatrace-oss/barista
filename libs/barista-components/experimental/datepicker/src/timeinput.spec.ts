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

import {
  NUMPAD_MINUS,
  NUMPAD_ONE,
  NUMPAD_PERIOD,
  NUMPAD_PLUS,
} from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DtDatepickerModule } from './datepicker-module';
import { DtTimeInput } from './timeinput';
import {
  createComponent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  typeInElement,
} from '@dynatrace/testing/browser';

describe('DtTimeInput', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtDatepickerModule],
        declarations: [SimpleTimeInputTestApp],
      });

      TestBed.compileComponents();
    }),
  );

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTimeInputTestApp>;
    let component: SimpleTimeInputTestApp;
    let hourEl: HTMLInputElement;
    let minuteEl: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleTimeInputTestApp);
      component = fixture.componentInstance;
      hourEl = component.timeInput._hourInput.nativeElement;
      minuteEl = component.timeInput._minuteInput.nativeElement;
      fixture.detectChanges();
    });

    describe('disabled input property', () => {
      it('should not be usable when disabled', fakeAsync(() => {
        component.disabled = true;
        fixture.detectChanges();
        tick();
        expect(hourEl.disabled).toBeTruthy();
        expect(hourEl.getAttribute('aria-disabled')).toBeTruthy();
        expect(minuteEl.disabled).toBeTruthy();
        expect(minuteEl.getAttribute('aria-disabled')).toBeTruthy();
      }));
    });

    describe('timeChange event', () => {
      it('should emit a timechange event when the hour and minute inputs are changed', fakeAsync(() => {
        const changeSpy = jest.fn();
        component.timeInput.timeChange.subscribe(changeSpy);
        fixture.detectChanges();
        expect(changeSpy).not.toHaveBeenCalled();
        component.timeInput.hour = 23;
        component.timeInput.minute = 55;
        fixture.detectChanges();
        dispatchFakeEvent(hourEl, 'blur');
        expect(changeSpy).toHaveBeenCalledTimes(1);
      }));

      it('should emit a timechange event when the hour and minute inputs are reset to empty', fakeAsync(() => {
        const changeSpy = jest.fn();
        component.timeInput.timeChange.subscribe(changeSpy);
        fixture.detectChanges();
        expect(changeSpy).not.toHaveBeenCalled();
        component.timeInput.hour = null;
        component.timeInput.minute = null;
        fixture.detectChanges();
        dispatchFakeEvent(minuteEl, 'blur');
        expect(changeSpy).toHaveBeenCalledTimes(1);
      }));
    });

    describe('Focus switch', () => {
      it('should switch focus from the hour to the minute input when typing in 2 digits in the hour input', fakeAsync(() => {
        component.timeInput.minute = null;
        component.timeInput.hour = 14;
        component.timeInput._hourInput.nativeElement.value = '14';
        component.timeInput._minuteInput.nativeElement.value = '';
        fixture.detectChanges();

        dispatchKeyboardEvent(hourEl, 'keyup', NUMPAD_ONE);
        fixture.detectChanges();
        tick();

        expect(document.activeElement).toBe(minuteEl);
      }));

      it('should switch focus from the hour to the minute input when typing in 2 digits in the hour input, but the minute input only had a valid 1 digit value', fakeAsync(() => {
        component.timeInput.hour = 15;
        component.timeInput.minute = 3;
        component.timeInput._hourInput.nativeElement.value = '15';
        component.timeInput._minuteInput.nativeElement.value = '3';
        fixture.detectChanges();

        dispatchKeyboardEvent(hourEl, 'keyup', NUMPAD_ONE);
        fixture.detectChanges();
        tick();

        expect(document.activeElement).toBe(minuteEl);
      }));

      it('should not switch focus from the hour to the minute input when typing in only one digit in the hour input', fakeAsync(() => {
        component.timeInput.minute = null;
        component.timeInput.hour = 1;
        component.timeInput._hourInput.nativeElement.value = '1';
        fixture.detectChanges();

        dispatchKeyboardEvent(hourEl, 'keyup', NUMPAD_ONE);
        fixture.detectChanges();
        tick();

        expect(document.activeElement).not.toBe(minuteEl);
      }));

      it('should not switch focus from the hour to the minute input when typing in 2 digits in the hour input, but the minute input already had a valid 2 digit value', fakeAsync(() => {
        component.timeInput.hour = 15;
        component.timeInput._hourInput.nativeElement.value = '15';
        component.timeInput._minuteInput.nativeElement.value = '53';
        fixture.detectChanges();

        dispatchKeyboardEvent(hourEl, 'keyup', NUMPAD_ONE);
        fixture.detectChanges();
        tick();

        expect(document.activeElement).not.toBe(minuteEl);
      }));
    });

    describe('Unwanted characters', () => {
      it("should not allow typing in the '+' character", fakeAsync(() => {
        dispatchKeyboardEvent(hourEl, 'keydown', NUMPAD_PLUS);
        dispatchKeyboardEvent(minuteEl, 'keydown', NUMPAD_PLUS);
        flush();
        fixture.detectChanges();
        tick();
        expect(hourEl.value).not.toBe('+');
        expect(minuteEl.value).not.toBe('+');
      }));

      it("should not allow typing in the '-' character", fakeAsync(() => {
        dispatchKeyboardEvent(hourEl, 'keydown', NUMPAD_MINUS);
        dispatchKeyboardEvent(minuteEl, 'keydown', NUMPAD_MINUS);
        flush();
        fixture.detectChanges();
        tick();
        expect(hourEl.value).not.toBe('-');
        expect(minuteEl.value).not.toBe('-');
      }));

      it("should not allow typing in the '.' character", fakeAsync(() => {
        dispatchKeyboardEvent(hourEl, 'keydown', NUMPAD_PERIOD);
        dispatchKeyboardEvent(minuteEl, 'keydown', NUMPAD_PERIOD);
        flush();
        fixture.detectChanges();
        tick();
        expect(hourEl.value).not.toBe('.');
        expect(minuteEl.value).not.toBe('.');
      }));

      it('should allow typing numbers/number-like strings', fakeAsync(() => {
        typeInElement('4', hourEl);
        typeInElement('5', minuteEl);
        fixture.detectChanges();
        tick();
        expect(hourEl.value).toBe('4');
        expect(component.timeInput.hour).toBe(4);
        expect(minuteEl.value).toBe('5');
        expect(component.timeInput.minute).toBe(5);
      }));
    });

    describe('Time validity', () => {
      it('should fall back to the previously set value if the newly typed hour is greater than 23', fakeAsync(() => {
        typeInElement('112', hourEl);
        fixture.detectChanges();
        tick();
        expect(hourEl.value).toBe('11');
        expect(component.timeInput.hour).toBe(11);
      }));

      it('should be empty if there is no previously entered value and the newly entered one is an invalid hour', fakeAsync(() => {
        component.timeInput.hour = null;
        fixture.detectChanges();
        typeInElement('a', hourEl);
        fixture.detectChanges();
        tick();
        expect(hourEl.value).toBe('');
        expect(component.timeInput.hour).toBe(null);
      }));

      it('should set the new value if it is a valid hour (between 0 and 23)', fakeAsync(() => {
        typeInElement('20', hourEl);
        fixture.detectChanges();
        expect(hourEl.value).toBe('20');
        expect(component.timeInput.hour).toBe(20);
      }));

      it('should be null or empty if the new value is set to null or empty (e.g.: user types in a digit, then deletes it)', fakeAsync(() => {
        typeInElement('', hourEl);
        fixture.detectChanges();
        tick();
        expect(hourEl.value).toBe('');
        expect(component.timeInput.hour).toBe(null);
        typeInElement('', minuteEl);
        fixture.detectChanges();
        tick();
        expect(minuteEl.value).toBe('');
        expect(component.timeInput.minute).toBe(null);
      }));

      it('should fall back to the previously set value if the newly typed minute is greater than 59', fakeAsync(() => {
        typeInElement('533', minuteEl);
        fixture.detectChanges();
        expect(minuteEl.value).toBe('53');
        expect(component.timeInput.minute).toBe(53);
      }));

      it('should be empty if there is no previously entered value and the newly entered one is an invalid minute', fakeAsync(() => {
        component.timeInput.minute = null;
        fixture.detectChanges();
        typeInElement('a', minuteEl);
        fixture.detectChanges();
        tick();
        expect(minuteEl.value).toBe('');
        expect(component.timeInput.minute).toBe(null);
      }));

      it('should set the new value if it is a valid minute (between 0 and 59)', fakeAsync(() => {
        typeInElement('45', minuteEl);
        component.timeInput.minute = 45;
        fixture.detectChanges();
        tick();
        expect(minuteEl.value).toBe('45');
        expect(component.timeInput.minute).toBe(45);
      }));
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-timeinput
      [disabled]="disabled"
      [hour]="hour"
      [minute]="minute"
    ></dt-timeinput>
  `,
})
class SimpleTimeInputTestApp {
  hour: number | null = 11;
  minute: number | null = 53;
  disabled = false;

  @ViewChild(DtTimeInput) timeInput: DtTimeInput;

  @ViewChild('hours', { read: ElementRef })
  _hourInput: ElementRef<HTMLInputElement>;

  @ViewChild('minutes', { read: ElementRef })
  _minuteInput: ElementRef<HTMLInputElement>;
}
