import { Component, ViewChild, DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import {
  DtChartModule,
  DtChartRange,
  DtChartTimestamp,
  DtSelectChange,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { By } from '@angular/platform-browser';
// tslint:disable:no-magic-numbers

fdescribe('DtChart Range', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule],
      declarations: [
        RangeTestComponent,
        RangeTestBindingValuesComponent,
      ],
    });
    TestBed.compileComponents();

  });

  describe('Range set programmatically', () => {
    let fixture: ComponentFixture<RangeTestComponent>;
    let range: DtChartRange;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestComponent>(RangeTestComponent);
      range = fixture.componentInstance.range;
      fixture.detectChanges();
    });

    it('should initialize a hidden range without any style.', () => {
      expect(range).toBeDefined();
      expect(range.hidden).toBe(true);
      expect(range.area).toEqual({left: 0, width: 0});
      expect(range.value).toEqual([0, 0]);
    });

    it('should show the range element when hidden is false', () => {
      let container = fixture.debugElement.query(By.css('.dt-chart-range-container'));
      expect(container).not.toBeTruthy();

      range.hidden = false;
      fixture.detectChanges();
      container = fixture.debugElement.query(By.css('.dt-chart-range-container'));
      expect(container).toBeTruthy();
    });

    it('should create a range and update it programmatically', () => {
      range.area = { left: 100, width: 20 };
      range.hidden = false;
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(By.css('.dt-chart-range-container')).nativeElement;
      expect(container.style.left).toBe('100px');
      expect(container.style.width).toBe('20px');

      range.area = { left: 0, width: 100 };
      fixture.detectChanges();

      container = fixture.debugElement.query(By.css('.dt-chart-range-container')).nativeElement;
      expect(container.style.left).toBe('0px');
      expect(container.style.width).toBe('100px');
    });

    it('should create a range and update it programmatically with chart values', () => {
      // mock a fake value to px function
      range._valueToPixels = (value: number) => value * 2;
      range.value = [100, 200];
      fixture.detectChanges();

      let container: HTMLElement = fixture.debugElement.query(By.css('.dt-chart-range-container')).nativeElement;
      expect(container.style.left).toBe('200px');
      expect(container.style.width).toBe('200px');

      range.value = [0, 100];
      fixture.detectChanges();
      container = fixture.debugElement.query(By.css('.dt-chart-range-container')).nativeElement;
      expect(container.style.left).toBe('0px');
      expect(container.style.width).toBe('200px');
    });

    it('should hide the range when falsy values are provided', () => {
      // mock a fake value to px function
      range._valueToPixels = (value: number) => value * 2;
      range.value = [100, 200];
      fixture.detectChanges();

      let container: DebugElement = fixture.debugElement.query(By.css('.dt-chart-range-container'));
      expect(container).not.toBeNull();

      // imitate falsy values
      range.value = [100, undefined] as unknown as [number, number];
      fixture.detectChanges();

      container = fixture.debugElement.query(By.css('.dt-chart-range-container'));
      expect(container).toBeNull();
      expect(range.hidden).toBe(true);
    });
  });

  describe('Range with binding', () => {
    let fixture: ComponentFixture<RangeTestBindingValuesComponent>;
    let range: DtChartRange;

    beforeEach(() => {
      fixture = TestBed.createComponent<RangeTestBindingValuesComponent>(RangeTestBindingValuesComponent);
      range = fixture.componentInstance.range;
      fixture.detectChanges();
    });

    it('should have inital values from binding', () => {
      expect(range.hidden).toBe(false);
      let container = fixture.debugElement.query(By.css('.dt-chart-range-container')).nativeElement;
      expect(container.style.left).toBe('10px');
      expect(container.style.width).toBe('90px');

      fixture.componentInstance.values = [100, 200];
      fixture.detectChanges();
      container = fixture.debugElement.query(By.css('.dt-chart-range-container')).nativeElement;
      expect(container.style.left).toBe('100px');
      expect(container.style.width).toBe('100px');

    });
  });
});

@Component({
  selector: 'range-test-component',
  template: '<dt-chart-range></dt-chart-range>',
})
export class RangeTestComponent {
  @ViewChild(DtChartRange) range: DtChartRange;
}

@Component({
  selector: 'range-test-bind-value-component',
  template: '<dt-chart-range [value]="values"></dt-chart-range>',
})
export class RangeTestBindingValuesComponent {
  @ViewChild(DtChartRange) range: DtChartRange;

  values = [10, 100];

  ngOnInit(): void {
    this.range._valueToPixels = (value: number) => value;
  }
}
