// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtChartModule,
  DtChartRange,
  DtIconModule,
} from '@dynatrace/angular-components';
import { dispatchFakeEvent } from '../../../testing/dispatch-events';
import { DT_RANGE_RELEASED_CLASS, RangeStateChangedEvent } from './range';

// tslint:disable:no-magic-numbers no-unbound-method no-use-before-declare

describe('DtChart Range', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DtChartModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [RangeTestComponent, RangeTestBindingValuesComponent],
    });
    TestBed.compileComponents();
  });

  describe('Range set programmatically', () => {
    let fixture: ComponentFixture<RangeTestComponent>;
    let range: DtChartRange;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestComponent>(RangeTestComponent);
      range = fixture.debugElement.query(By.css('dt-chart-range'))
        .componentInstance;
      fixture.detectChanges();
    });

    it('should initialize a hidden range without any style.', () => {
      expect(range).toBeDefined();
      expect(range._hidden).toBe(true);
      expect(range._area).toEqual({ left: 0, width: 0 });
      expect(range.value).toEqual([0, 0]);
    });

    it('should show the range element when hidden is false', () => {
      let container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
      );
      expect(container).not.toBeTruthy();

      range._hidden = false;
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
      );
      expect(container).toBeTruthy();
    });

    it('should create a range and update it programmatically', () => {
      range._area = { left: 100, width: 20 };
      range._hidden = false;
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
      ).nativeElement;
      expect(container.style.left).toBe('100px');
      expect(container.style.width).toBe('20px');

      range._area = { left: 0, width: 100 };
      fixture.detectChanges();

      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
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
        By.css('.dt-chart-range-container')
      ).nativeElement;
      expect(container.style.left).toBe('200px');
      expect(container.style.width).toBe('200px');

      range.value = [0, 100];
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
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
        By.css('.dt-chart-range-container')
      );
      expect(container).not.toBeNull();

      // imitate falsy values
      range.value = ([100, undefined] as unknown) as [number, number];
      fixture.detectChanges();

      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
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
        By.css('.dt-chart-range')
      ).nativeElement;
      expect(container.classList.contains(DT_RANGE_RELEASED_CLASS)).toBe(true);
    });
  });

  describe('Range with binding', () => {
    let fixture: ComponentFixture<RangeTestBindingValuesComponent>;
    let range: DtChartRange;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestBindingValuesComponent>(
        RangeTestBindingValuesComponent
      );
      range = fixture.componentInstance.range;
      fixture.detectChanges();
    });

    it('should have initial values from binding and update them', () => {
      expect(range._hidden).toBe(false);
      let container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
      ).nativeElement;
      expect(container.style.left).toBe('10px');
      expect(container.style.width).toBe('90px');

      fixture.componentInstance.values = [100, 200];
      fixture.detectChanges();
      container = fixture.debugElement.query(
        By.css('.dt-chart-range-container')
      ).nativeElement;
      expect(container.style.left).toBe('100px');
      expect(container.style.width).toBe('100px');
    });

    it('should have the arrows released class on a created container with a binding', () => {
      const container: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-range')
      ).nativeElement;
      expect(container.classList.contains(DT_RANGE_RELEASED_CLASS)).toBe(true);
    });

    it('should trigger dragHandle funciton when the left or right handle gets clicked', () => {
      spyOn(range, '_dragHandle');
      expect(range._dragHandle).not.toHaveBeenCalled();

      const leftHandle = fixture.debugElement.query(
        By.css('.dt-chart-left-handle')
      ).nativeElement;
      const rightHandle = fixture.debugElement.query(
        By.css('.dt-chart-right-handle')
      ).nativeElement;

      dispatchFakeEvent(leftHandle, 'mousedown');
      expect(range._dragHandle).toHaveBeenCalledTimes(1);

      dispatchFakeEvent(rightHandle, 'mousedown');
      expect(range._dragHandle).toHaveBeenCalledTimes(2);
    });

    it('setting the value with the binding should trigger a _stateChanges event', () => {
      const stateChangesSpy = jasmine.createSpy('stateChanges spy');

      const state1 = new RangeStateChangedEvent(100, 100, false);
      const state2 = new RangeStateChangedEvent(110, 90, false);
      const state3 = new RangeStateChangedEvent(130, 70, false);

      const subscription = range._stateChanges.subscribe(stateChangesSpy);

      fixture.componentInstance.values = [100, 200];
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(1);
      expect(stateChangesSpy.calls.mostRecent().args).toEqual([state1]);
      fixture.componentInstance.values = [110, 200];
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(2);
      expect(stateChangesSpy.calls.mostRecent().args).toEqual([state2]);
      fixture.componentInstance.values = [130, 200];
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(3);
      expect(stateChangesSpy.calls.mostRecent().args).toEqual([state3]);

      subscription.unsubscribe();
    });
  });
});

@Component({
  selector: 'range-test-component',
  template: '<dt-chart-range></dt-chart-range>',
})
export class RangeTestComponent {}

@Component({
  selector: 'range-test-bind-value-component',
  template: '<dt-chart-range [value]="values"></dt-chart-range>',
})
export class RangeTestBindingValuesComponent implements OnInit {
  @ViewChild(DtChartRange, { static: true }) range: DtChartRange;

  values = [10, 100];

  ngOnInit(): void {
    this.range._valueToPixels = (value: number) => value;
  }
}
