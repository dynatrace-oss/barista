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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DtDateAdapter } from '@dynatrace/barista-components/core';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { createComponent } from '@dynatrace/testing/browser';
import { DtCalendar, DtDatepickerModule } from '..';

describe('DtCalendar', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtDatepickerModule,
          DtThemingModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({
            svgIconLocation: `{{name}}.svg`,
          }),
        ],
        declarations: [
          SimpleCalendarTestApp,
          SimpleCalendarWithoutStartDateTestApp,
          SimpleCalendarLimitedDateTestApp,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('calendar with min and max dates', () => {
    let fixture: ComponentFixture<SimpleCalendarLimitedDateTestApp>;
    let component: SimpleCalendarLimitedDateTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleCalendarLimitedDateTestApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should start with the min date if a date earlier than the min is provided as startAt date', () => {
      expect(component.calendar.startAt).toEqual(component.calendar.minDate);
    });

    it('should set the min date as active if a date earlier than the min date is selected', () => {
      component.calendar.activeDate = new Date(2000, 1, 1);
      fixture.detectChanges();
      expect(component.calendar.activeDate).toEqual(component.calendar.minDate);
    });

    it('should start with the max date if a date later than the max is provided as startAt date', () => {
      component.startAt = new Date(2030, 1, 1);
      fixture.detectChanges();
      expect(component.calendar.startAt).toEqual(component.calendar.maxDate);
    });

    it('should set the max date as active if a date later than the max date is selected', () => {
      component.calendar.activeDate = new Date(2030, 1, 1);
      fixture.detectChanges();
      expect(component.calendar.activeDate).toEqual(component.calendar.maxDate);
    });
  });

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleCalendarTestApp>;
    let component: SimpleCalendarTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleCalendarTestApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('calendar header', () => {
      it("should go to the previous year when the '<<' icon button is clicked", () => {
        const prevYearBtn = fixture.debugElement.nativeElement.querySelector(
          '.dt-calendar-header-button-prev-year',
        );
        prevYearBtn.click();
        fixture.detectChanges();
        expect(component.calendar.activeDate).toEqual(new Date(2019, 7, 31));
      });

      it("should go to the next year when the '>>' icon button is clicked", () => {
        const nextYearBtn = fixture.debugElement.nativeElement.querySelector(
          '.dt-calendar-header-button-next-year',
        );
        nextYearBtn.click();
        fixture.detectChanges();
        expect(component.calendar.activeDate).toEqual(new Date(2021, 7, 31));
      });

      it("should go to the previous month when the '<' icon button is clicked", () => {
        const prevMonthBtn = fixture.debugElement.nativeElement.querySelector(
          '.dt-calendar-header-button-prev-month',
        );
        prevMonthBtn.click();
        fixture.detectChanges();
        expect(component.calendar.activeDate).toEqual(new Date(2020, 6, 31));
      });

      it("should go to the next month when the '>' icon button is clicked and if the day does not exist, take the closest existing last day of the month", () => {
        const nextMonthBtn = fixture.debugElement.nativeElement.querySelector(
          '.dt-calendar-header-button-next-month',
        );
        nextMonthBtn.click();
        fixture.detectChanges();
        expect(component.calendar.activeDate).toEqual(new Date(2020, 8, 30));
      });
    });

    describe('calendar today button', () => {
      it("should show the today button if 'showTodayButton' is set to false ", () => {
        const todayBtn =
          fixture.debugElement.nativeElement.querySelector('.dt-today-button');
        expect(todayBtn).not.toBeNull();
      });

      it("should not show the today button if 'showTodayButton' is set to false", () => {
        component.showTodayButton = false;
        fixture.detectChanges();
        const todayBtn =
          fixture.debugElement.nativeElement.querySelector('.dt-today-button');
        expect(todayBtn).toBeNull();
      });

      it("should correctly set today's date if the today button is clicked", fakeAsync(() => {
        const todayBtn =
          fixture.debugElement.nativeElement.querySelector('.dt-today-button');
        todayBtn.click();
        fixture.detectChanges();
        tick();

        expect(component.calendar.selected).toEqual(
          component._dateAdapter.today(),
        );

        expect(component.calendar.activeDate).toEqual(
          component._dateAdapter.today(),
        );
      }));
    });

    describe('calendar date selection', () => {
      it('should correctly set the start date and active date if startAt is set', () => {
        expect(component.calendar.activeDate).toEqual(component.startAt);
      });

      it('should emit a selectedChange event if the today button is clicked', () => {
        const todayBtn =
          fixture.debugElement.nativeElement.querySelector('.dt-today-button');
        const changeSpy = jest.fn();
        component.calendar.selectedChange.subscribe(changeSpy);

        todayBtn.click();
        fixture.detectChanges();

        fixture.detectChanges();
        expect(changeSpy).toHaveBeenCalledTimes(1);
      });

      it('should emit a selectedChange event if a date is selected', () => {
        const changeSpy = jest.fn();
        component.calendar.selectedChange.subscribe(changeSpy);
        const selectedCell = {
          displayValue: '19',
          value: 19,
          rawValue: new Date(2020, 7, 19),
          ariaLabel: 'Aug 19, 2020',
        };
        component.calendar._calendarBody._cellClicked(selectedCell);
        fixture.detectChanges();
        expect(changeSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should correctly set the value and value label if a date is selected', fakeAsync(() => {
      const formattedStartDate = component._dateAdapter.format(
        component.startAt,
        {
          year: 'numeric',
          month: 'short',
        },
      );
      expect(component.calendar._label).toEqual(formattedStartDate);

      const selectedCell = {
        displayValue: '15',
        value: 15,
        rawValue: new Date(2020, 6, 15),
        ariaLabel: 'Jul 15, 2020',
      };
      component.calendar._calendarBody._cellClicked(selectedCell);
      fixture.detectChanges();

      expect(component.calendar.activeDate).toEqual(selectedCell.rawValue);

      const formattedValueLabel = component._dateAdapter.format(
        selectedCell.rawValue,
        {
          year: 'numeric',
          month: 'short',
        },
      );

      const formattedActiveDate = component._dateAdapter.format(
        component.calendar.activeDate,
        {
          year: 'numeric',
          month: 'short',
        },
      );
      expect(component.calendar._label).toEqual(formattedValueLabel);
      expect(component.calendar._label).toEqual(formattedActiveDate);
    }));
  });

  describe('basic behavior when no start date is defined', () => {
    let fixture: ComponentFixture<SimpleCalendarWithoutStartDateTestApp>;
    let component: SimpleCalendarWithoutStartDateTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleCalendarWithoutStartDateTestApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('calendar date selection', () => {
      it("should set today's date if startAt is not set", () => {
        expect(component.calendar.activeDate).not.toEqual(
          component.calendar.startAt,
        );
        expect(component.calendar.activeDate.getDate()).toEqual(
          component._dateAdapter.today().getDate(),
        );
        expect(component.calendar.activeDate.getMonth()).toEqual(
          component._dateAdapter.today().getMonth(),
        );
        expect(component.calendar.activeDate.getFullYear()).toEqual(
          component._dateAdapter.today().getFullYear(),
        );
      });
    });
  });
});

// ###################################
// Testing components
// ###################################

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-calendar
      [startAt]="startAt"
      [showTodayButton]="showTodayButton"
    ></dt-calendar>
  `,
})
class SimpleCalendarTestApp {
  startAt = new Date(2020, 7, 31);
  showTodayButton = true;

  @ViewChild(DtCalendar) calendar: DtCalendar<any>;

  constructor(public _dateAdapter: DtDateAdapter<any>) {}
}

@Component({
  selector: 'dt-test-today-app',
  template: ` <dt-calendar [startAt]="startAt"></dt-calendar> `,
})
class SimpleCalendarWithoutStartDateTestApp {
  @ViewChild(DtCalendar) calendar: DtCalendar<Date>;

  constructor(public _dateAdapter: DtDateAdapter<Date>) {}
}

@Component({
  selector: 'dt-test-min-max-app',
  template: `
    <dt-calendar
      [startAt]="startAt"
      [minDate]="minDate"
      [maxDate]="maxDate"
    ></dt-calendar>
  `,
})
class SimpleCalendarLimitedDateTestApp {
  @ViewChild(DtCalendar) calendar: DtCalendar<Date>;
  startAt = new Date(2020, 10, 15);
  minDate = new Date(2020, 11, 13);
  maxDate = new Date(2021, 1, 1);

  constructor(public _dateAdapter: DtDateAdapter<Date>) {}
}
