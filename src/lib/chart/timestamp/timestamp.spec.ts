// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartModule, DtChartTimestamp } from '@dynatrace/angular-components';
import { TimestampStateChangedEvent } from './timestamp';

const TIMESTAMP_SELECTOR = '.dt-chart-timestamp-selector';

describe('DtChart Timestamp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule],
      declarations: [
        TimestampTestComponent,
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
        TimestampTestComponent
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
        By.css(TIMESTAMP_SELECTOR)
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(20px)');

      timestamp._position = 100;
      fixture.detectChanges();

      container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR))
        .nativeElement;
      expect(container.style.transform).toBe('translateX(100px)');
    });

    it('should create a timestamp and update it programmatically with chart values', () => {
      // mock a fake value to px function
      timestamp._valueToPixels = (value: number) => value * 2;
      timestamp.value = 10;
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR)
      ).nativeElement;
      expect(container.style.transform).toBe('translateX(20px)');

      timestamp.value = 100;
      fixture.detectChanges();
      container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR))
        .nativeElement;
      expect(container.style.transform).toBe('translateX(200px)');
    });

    it('should hide the timestamp when falsy values are provided', () => {
      // mock a fake value to px function
      timestamp._valueToPixels = (value: number) => value * 2;
      timestamp.value = 200;
      fixture.detectChanges();

      let container: DebugElement = fixture.debugElement.query(
        By.css(TIMESTAMP_SELECTOR)
      );
      expect(container).not.toBeNull();

      // imitate falsy values
      timestamp.value = (undefined as unknown) as number;
      fixture.detectChanges();

      container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR));
      expect(container).toBeNull();
      expect(timestamp._hidden).toBe(true);
    });
  });

  describe('Timestamp with binding', () => {
    let fixture: ComponentFixture<TimestampTestBindingValuesComponent>;
    let timestamp: DtChartTimestamp;

    beforeEach(() => {
      fixture = TestBed.createComponent<TimestampTestBindingValuesComponent>(
        TimestampTestBindingValuesComponent
      );
      timestamp = fixture.componentInstance.timestamp;
      fixture.detectChanges();
    });

    it('should have initial values from binding and update them', () => {
      expect(timestamp._hidden).toBe(false);
      let container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR))
        .nativeElement;
      expect(container.style.transform).toBe('translateX(10px)');

      fixture.componentInstance.value = 100;
      fixture.detectChanges();
      container = fixture.debugElement.query(By.css(TIMESTAMP_SELECTOR))
        .nativeElement;
      expect(container.style.transform).toBe('translateX(100px)');
    });

    it('setting the value with the binding should trigger a _stateChanges event', () => {
      const stateChangesSpy = jasmine.createSpy('stateChanges spy');

      const state1 = new TimestampStateChangedEvent(100, false);
      const state2 = new TimestampStateChangedEvent(110, false);
      const state3 = new TimestampStateChangedEvent(130, false);

      const subscription = timestamp._stateChanges.subscribe(stateChangesSpy);

      fixture.componentInstance.value = 100;
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(1);
      expect(stateChangesSpy.calls.mostRecent().args).toEqual([state1]);
      fixture.componentInstance.value = 110;
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(2);
      expect(stateChangesSpy.calls.mostRecent().args).toEqual([state2]);
      fixture.componentInstance.value = 130;
      fixture.detectChanges();
      expect(stateChangesSpy).toHaveBeenCalledTimes(3);
      expect(stateChangesSpy.calls.mostRecent().args).toEqual([state3]);

      subscription.unsubscribe();
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
  selector: 'timestamp-test-bind-value-component',
  template: '<dt-chart-timestamp [value]="value"></dt-chart-timestamp>',
})
export class TimestampTestBindingValuesComponent implements OnInit {
  @ViewChild(DtChartTimestamp, { static: true }) timestamp: DtChartTimestamp;

  value = 10;

  ngOnInit(): void {
    this.timestamp._valueToPixels = (value: number) => value;
  }
}
