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

import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { createComponent, dispatchFakeEvent } from '@dynatrace/testing/browser';
import { DtDatepickerModule, DtTimepicker } from '..';

describe('DtTimePicker', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtDatepickerModule],
        declarations: [SimpleTimePickerTestApp],
      });

      TestBed.compileComponents();
    }),
  );

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTimePickerTestApp>;
    let component: SimpleTimePickerTestApp;
    let hourEl: HTMLInputElement;
    let minuteEl: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleTimePickerTestApp);
      component = fixture.componentInstance;
      hourEl = component.timePicker._timeInput._hourInput.nativeElement;
      minuteEl = component.timePicker._timeInput._minuteInput.nativeElement;
      fixture.detectChanges();
    });

    /**
     * Add tests for the range mode which will be added in a later version.
     */
    describe('timeChange event', () => {
      it('should emit a timechange event when the hour and minute inputs are changed', fakeAsync(() => {
        const changeSpy = jest.fn();
        component.timePicker.timeChange.subscribe(changeSpy);
        fixture.detectChanges();
        expect(changeSpy).not.toHaveBeenCalled();
        component.timePicker._timeInput.hour = 23;
        component.timePicker._timeInput.minute = 55;
        fixture.detectChanges();
        dispatchFakeEvent(hourEl, 'blur');
        expect(changeSpy).toHaveBeenCalledTimes(1);
      }));

      it('should emit a timechange event when the hour and minute inputs are reset to empty', fakeAsync(() => {
        const changeSpy = jest.fn();
        component.timePicker.timeChange.subscribe(changeSpy);
        fixture.detectChanges();
        expect(changeSpy).not.toHaveBeenCalled();
        component.timePicker._timeInput.hour = null;
        component.timePicker._timeInput.minute = null;
        fixture.detectChanges();
        dispatchFakeEvent(minuteEl, 'blur');
        expect(changeSpy).toHaveBeenCalledTimes(1);
      }));
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-timepicker
      [disabled]="disabled"
      [hour]="hour"
      [minute]="minute"
    ></dt-timepicker>
  `,
})
class SimpleTimePickerTestApp {
  hour: number | null = 11;
  minute: number | null = 53;
  disabled = false;

  @ViewChild(DtTimepicker) timePicker: DtTimepicker;
}
