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
import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtDateAdapter,
  DT_DEFAULT_DARK_THEMING_CONFIG,
  DT_DEFAULT_UI_TEST_CONFIG,
  DT_OVERLAY_THEMING_CONFIG,
  DT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import {
  createComponent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
} from '@dynatrace/testing/browser';
import { DtCalendar, DtDatePicker, DtDatepickerModule } from '..';

describe('DtDatePicker', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtDatepickerModule,
          DtThemingModule,
          HttpClientTestingModule,
          NoopAnimationsModule,
          DtIconModule.forRoot({
            svgIconLocation: `{{name}}.svg`,
          }),
        ],
        declarations: [
          SimpleDatepickerTestApp,
          SimpleDatepickerDarkTestApp,
          SimpleDatepickerWithValueTestApp,
        ],
        providers: [
          { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
          {
            provide: DT_OVERLAY_THEMING_CONFIG,
            useValue: DT_DEFAULT_DARK_THEMING_CONFIG,
          },
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleDatepickerTestApp>;
    let component: SimpleDatepickerTestApp;
    let buttonTrigger: HTMLButtonElement;
    let overlayContainer: OverlayContainer;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleDatepickerTestApp);
      component = fixture.componentInstance;
      buttonTrigger =
        fixture.debugElement.nativeElement.querySelector('button[dt-button]');

      inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainer = oc;
      })();

      fixture.detectChanges();
    }));

    afterEach(() => {
      overlayContainer.ngOnDestroy();
    });

    describe('datepicker properties', () => {
      it('should correctly set an id if it is passed to the datepicker', fakeAsync(() => {
        buttonTrigger.click();
        tick();
        fixture.detectChanges();
        expect(component.datePicker.id).toBe('datepickerSimple');
      }));

      it('should correctly set a start date if it is passed to the datepicker', fakeAsync(() => {
        buttonTrigger.click();
        tick();
        fixture.detectChanges();
        expect(component.datePicker.startAt).toEqual(new Date(2020, 7, 31));
      }));

      it("should show the today button 'showTodayButton' is set to true", fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        const todayBtn = fixture.debugElement
          .query(By.directive(DtCalendar))
          .nativeElement.querySelector('.dt-today-button');
        expect(todayBtn).not.toBeNull();
      }));

      it("should not show the today button if 'showTodayButton' is set to false", fakeAsync(() => {
        component.datePicker.showTodayButton = false;
        fixture.detectChanges();

        component.datePicker.open();
        fixture.detectChanges();
        tick();

        const todayBtn = fixture.debugElement
          .query(By.directive(DtCalendar))
          .nativeElement.querySelector('.dt-today-button');
        expect(todayBtn).toBeNull();
      }));

      it('should set the panel class on the datepicker panel if a string is set as input and the datepicker was already opened', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        component.datePicker.panelClass = 'panel';
        tick();
        fixture.detectChanges();
        expect(component.datePicker._panel.nativeElement.classList).toContain(
          'panel',
        );
      }));

      it('should set the panel classes on the datepicker panel if an array of strings is set as input and the datepicker was already opened', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        component.datePicker.panelClass = ['panel', 'custom'];
        tick();
        fixture.detectChanges();
        const panelClasses =
          component.datePicker._panel.nativeElement.classList;
        expect(panelClasses).toContain('panel');
        expect(panelClasses).toContain('custom');
      }));

      it('should not show the timepicker if isTimeEnabled is set to false', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        expect(component.datePicker._timePicker).toBeDefined();
        component.datePicker.isTimeEnabled = false;
        tick();
        fixture.detectChanges();
        expect(component.datePicker._timePicker).toBeUndefined();
      }));

      it('should correctly set the panelOpen value if the datepicker is opened or closed', fakeAsync(() => {
        expect(component.datePicker.panelOpen).toBeFalsy();
        component.datePicker.open();
        fixture.detectChanges();
        expect(component.datePicker.panelOpen).toBeTruthy();
      }));

      it('should not be usable when disabled', fakeAsync(() => {
        component.disabled = true;
        fixture.detectChanges();
        buttonTrigger.click();
        tick();
        fixture.detectChanges();
        expect(buttonTrigger.disabled).toBeTruthy();
        expect(buttonTrigger.getAttribute('aria-disabled')).toBeTruthy();
        expect(component.datePicker._panel).toBeUndefined();
        expect(component.datePicker.panelOpen).toBeFalsy();
      }));

      it('should correctly set the value and value label if a date is selected', fakeAsync(() => {
        expect(component.datePicker.value).toBeNull();
        expect(component.datePicker.valueLabel).toEqual('Select date');

        buttonTrigger.click();
        fixture.detectChanges();

        const selectedCell = {
          displayValue: '23',
          value: 23,
          rawValue: new Date(2020, 7, 23),
          ariaLabel: 'Aug 23, 2020',
        };
        component.datePicker._calendar._calendarBody._cellClicked(selectedCell);
        fixture.detectChanges();

        expect(component.datePicker.value).toEqual(selectedCell.rawValue);
        expect(component.datePicker._calendar.selected).toEqual(
          selectedCell.rawValue,
        );

        const formattedValueLabel = component._dateAdapter.format(
          selectedCell.rawValue,
          {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          },
        );
        expect(component.datePicker.valueLabel).toEqual(formattedValueLabel);
      }));
    });

    describe('datepicker events', () => {
      it('should correctly subscribe to the timechange event of the timepicker component when the hour and minute inputs are changed', fakeAsync(() => {
        buttonTrigger.click();
        fixture.detectChanges();
        tick();

        const hourEl =
          component.datePicker._timePicker._timeInput._hourInput.nativeElement;
        const changeSpy = jest.fn();
        component.datePicker._timePicker.timeChange.subscribe(changeSpy);
        fixture.detectChanges();
        expect(changeSpy).not.toHaveBeenCalled();
        component.datePicker._timePicker._timeInput.hour = 23;
        component.datePicker._timePicker._timeInput.minute = 55;
        fixture.detectChanges();
        dispatchFakeEvent(hourEl, 'blur');
        fixture.detectChanges();
        expect(changeSpy).toHaveBeenCalledTimes(1);
      }));
    });

    describe('opening/closing of the datepicker', () => {
      it('should open the datepicker on clicking the button if not already opened', () => {
        buttonTrigger.click();
        fixture.detectChanges();
        expect(component.datePicker._panel).toBeDefined();
        expect(component.datePicker.panelOpen).toBeTruthy();
      });

      it('should close the datepicker on clicking the button if already opened', () => {
        buttonTrigger.click();
        fixture.detectChanges();
        buttonTrigger.click();
        fixture.detectChanges();
        expect(component.datePicker._panel).toBeUndefined();
        expect(component.datePicker.panelOpen).toBeFalsy();
      });

      it('should set the panel classes on the datepicker panel on open if the panelClass is set', fakeAsync(() => {
        component.datePicker.panelClass = ['panel', 'custom'];
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        const panelClasses =
          component.datePicker._panel.nativeElement.classList;
        expect(panelClasses).toContain('panel');
        expect(panelClasses).toContain('custom');
      }));

      it('should close the datepicker on backdrop click', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        const backdrop = overlayContainer
          .getContainerElement()
          .querySelector('.cdk-overlay-backdrop');
        expect(backdrop).not.toBeNull();
        (backdrop! as HTMLElement).click();
        fixture.detectChanges();
        flush();
        expect(component.datePicker._panel).toBeUndefined();
        expect(component.datePicker.panelOpen).toBeFalsy();
      }));

      it('should close the context dialog on ESC and open it again on click', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();

        const backdrop = overlayContainer
          .getContainerElement()
          .querySelector('.cdk-overlay-backdrop');
        expect(backdrop).not.toBeNull();

        dispatchKeyboardEvent(backdrop!, 'keydown', ESCAPE);
        fixture.detectChanges();
        flush();
        expect(component.datePicker._panel).toBeUndefined();
        expect(component.datePicker.panelOpen).toBeFalsy();

        component.datePicker.open();
        fixture.detectChanges();
        expect(component.datePicker._panel).toBeDefined();
        expect(component.datePicker.panelOpen).toBeTruthy();
      }));

      it('should dispose of the panel overlay when the datepicker is destroyed', () => {
        component.datePicker.open();
        let panel = overlayContainer
          .getContainerElement()
          .querySelector('.dt-datepicker-dialog-panel');
        expect(panel).toBeDefined();
        fixture.destroy();
        panel = overlayContainer
          .getContainerElement()
          .querySelector('.dt-datepicker-dialog-panel');
        expect(panel).toBeNull();
      });
    });

    describe('datepicker accessibility', () => {
      it('should set the role of the overlay panel to dialog', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        expect(
          component.datePicker._panel.nativeElement.getAttribute('role'),
        ).toEqual('dialog');
      }));

      it('should set the tabindex of the button trigger and calendar body to 0 by default', fakeAsync(() => {
        expect(buttonTrigger.getAttribute('tabindex')).toEqual('0');

        component.datePicker.open();
        fixture.detectChanges();
        tick();
        const calendarBodyElement = fixture.debugElement
          .query(By.directive(DtCalendar))
          .nativeElement.querySelector('.dt-calendar-body');
        expect(calendarBodyElement.getAttribute('tabindex')).toEqual('0');
      }));

      it('should set the tabindex of the datepicker button to -1 if disabled', fakeAsync(() => {
        component.disabled = true;
        fixture.detectChanges();
        expect(buttonTrigger.getAttribute('tabindex')).toEqual('-1');
        component.disabled = false;
        fixture.detectChanges();
        expect(buttonTrigger.getAttribute('tabindex')).toEqual('0');
      }));

      it('should focus the calendar when the datepicker opens if the time mode is disabled', fakeAsync(() => {
        component.isTimeEnabled = false;
        fixture.detectChanges();
        component.datePicker.open();
        fixture.detectChanges();
        tick();

        const calendarBodyElement = fixture.debugElement
          .query(By.directive(DtCalendar))
          .nativeElement.querySelector('.dt-calendar-body');

        expect(document.activeElement).toEqual(calendarBodyElement);
      }));

      it('should focus the hour input when the datepicker opens and the time mode is enabled', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        expect(document.activeElement).toBe(
          component.datePicker._timePicker._timeInput._hourInput.nativeElement,
        );
      }));
    });

    describe('datepicker date selection', () => {
      it('should correctly set the start date and active date if startAt is set', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        expect(component.datePicker._calendar.activeDate).toEqual(
          component.datePicker.startAt,
        );
      }));

      it("should set today's date if startAt is not set", fakeAsync(() => {
        component.datePicker.startAt = null;
        fixture.detectChanges();
        tick();
        component.datePicker.open();
        fixture.detectChanges();
        tick();
        expect(component.datePicker._calendar.activeDate).not.toEqual(
          component.datePicker.startAt,
        );
        expect(component.datePicker._calendar.activeDate).toEqual(
          component._dateAdapter.today(),
        );
      }));
    });

    describe('datepicker time selection', () => {
      it('should correctly display the time label and set the hour/minute if time mode is enabled and a valid time is set', fakeAsync(() => {
        const label =
          fixture.debugElement.nativeElement.querySelector('.dt-button-label');
        expect(label.textContent).toContain('Select date');

        component.datePicker.open();
        fixture.detectChanges();
        tick();

        component.datePicker._setSelectedValue(component.startAt);
        component.datePicker._timePicker._timeInput.hour = 23;
        component.datePicker._timePicker._timeInput.minute = 12;
        fixture.detectChanges();
        tick();

        const hourEl =
          component.datePicker._timePicker._timeInput._hourInput.nativeElement;
        dispatchFakeEvent(hourEl, 'blur');
        fixture.detectChanges();

        component.datePicker.close();
        fixture.detectChanges();
        tick();
        flush();

        expect(component.datePicker._isTimeLabelAvailable()).toBeTruthy();
        expect(label.textContent.trim()).toContain('8/31/2020');

        const timeLabelElement =
          fixture.debugElement.nativeElement.querySelector('.dt-time-label');
        expect(timeLabelElement.textContent.replace(/\s+/g, '')).toContain(
          '23:12',
        );
        expect(component.datePicker._timeLabel.replace(/\s+/g, '')).toContain(
          '23:12',
        );
        expect(component.datePicker.hour).toBe(23);
        expect(component.datePicker.minute).toBe(12);
      }));

      it('should hide the time label if the hour and minute are filled in, but then reset to empty by the user (e.g. the user deletes the hour and minute values)', fakeAsync(() => {
        component.datePicker.open();
        fixture.detectChanges();
        tick();

        component.datePicker._timePicker._timeInput.hour = 15;
        component.datePicker._timePicker._timeInput.minute = 50;
        fixture.detectChanges();
        tick();

        const hourEl =
          component.datePicker._timePicker._timeInput._hourInput.nativeElement;
        dispatchFakeEvent(hourEl, 'blur');
        fixture.detectChanges();

        expect(component.datePicker._isTimeLabelAvailable).toBeTruthy();

        let timeLabelElement =
          fixture.debugElement.nativeElement.querySelector('.dt-time-label');
        expect(timeLabelElement.textContent.replace(/\s+/g, '')).toContain(
          '15:50',
        );
        expect(component.datePicker._timeLabel.replace(/\s+/g, '')).toContain(
          '15:50',
        );
        expect(component.datePicker.hour).toBe(15);
        expect(component.datePicker.minute).toBe(50);

        component.datePicker._timePicker._timeInput.hour = null;
        component.datePicker._timePicker._timeInput.minute = null;
        fixture.detectChanges();
        tick();

        dispatchFakeEvent(hourEl, 'blur');
        fixture.detectChanges();
        tick();

        expect(component.datePicker._isTimeLabelAvailable()).toBeFalsy();

        timeLabelElement =
          fixture.debugElement.nativeElement.querySelector('.dt-time-label');
        expect(timeLabelElement).toBeNull();
        expect(
          component.datePicker._timeLabel.replace(/\s+/g, ''),
        ).not.toContain('15:50');
        expect(component.datePicker.hour).toBe(null);
        expect(component.datePicker.minute).toBe(null);
      }));
    });
  });

  describe('datepicker value', () => {
    let fixture: ComponentFixture<SimpleDatepickerWithValueTestApp>;
    let component: SimpleDatepickerWithValueTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleDatepickerWithValueTestApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should correctly initialize the value label if a value is set', fakeAsync(() => {
      expect(component.datePicker.value).toEqual(new Date(2020, 2, 25));
      const label =
        fixture.debugElement.nativeElement.querySelector('.dt-button-label');
      expect(label.textContent).toContain('3/25/2020');
    }));

    it('should correctly set a value if it is passed to the datepicker', fakeAsync(() => {
      component.datePicker.open();
      tick();
      fixture.detectChanges();
      expect(component.datePicker.value).toEqual(new Date(2020, 2, 25));
    }));
  });

  describe('datepicker dark mode', () => {
    let fixture: ComponentFixture<SimpleDatepickerDarkTestApp>;
    let component: SimpleDatepickerDarkTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleDatepickerDarkTestApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should set the dark mode class on the overlay panel when the dark theme is used', fakeAsync(() => {
      component.datePicker.open();
      fixture.detectChanges();
      tick();
      expect(component.datePicker._panel.nativeElement.classList).toContain(
        'dt-theme-dark',
      );
    }));
  });
});

// ###################################
// Testing components
// ###################################

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-datepicker
      [id]="'datepickerSimple'"
      [startAt]="startAt"
      [disabled]="disabled"
      [isTimeEnabled]="isTimeEnabled"
      [showTodayButton]="showTodayButton"
    ></dt-datepicker>
  `,
})
class SimpleDatepickerTestApp {
  disabled = false;
  startAt = new Date(2020, 7, 31);
  isTimeEnabled = true;
  showTodayButton = true;

  @ViewChild(DtDatePicker) datePicker: DtDatePicker<any>;

  constructor(public _dateAdapter: DtDateAdapter<any>) {}
}

@Component({
  selector: 'dt-test-app-dark',
  template: `
    <div dtTheme=":dark">
      <dt-datepicker
        [startAt]="startAt"
        [disabled]="disabled"
        [isTimeEnabled]="isTimeEnabled"
      ></dt-datepicker>
    </div>
  `,
})
class SimpleDatepickerDarkTestApp {
  disabled = false;
  startAt = new Date(2020, 7, 31);
  isTimeEnabled = true;

  @ViewChild(DtDatePicker) datePicker: DtDatePicker<any>;
}

@Component({
  selector: 'dt-test-app-value',
  template: `
    <div dtTheme=":dark">
      <dt-datepicker
        [startAt]="startAt"
        [disabled]="disabled"
        [isTimeEnabled]="isTimeEnabled"
        [value]="value"
      ></dt-datepicker>
    </div>
  `,
})
class SimpleDatepickerWithValueTestApp {
  disabled = false;
  startAt = new Date(2020, 1, 25);
  value = new Date(2020, 2, 25);
  isTimeEnabled = true;

  @ViewChild(DtDatePicker) datePicker: DtDatePicker<any>;
}
