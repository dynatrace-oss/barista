// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartModule, DtThemingModule } from '@dynatrace/angular-components';
import { Subject } from 'rxjs';
import { dispatchMouseEvent } from '../../../testing/dispatch-events';
import { DtChartSelectionArea } from './selection-area';

const MOCK_BOUNDING_CLIENT_RECT: ClientRect = {
  top: 50,
  left: 50,
  height: 200,
  width: 400,
  bottom: 0,
  right: 0,
};

describe('DtChart Selection Area', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [TestChart, TestChartComponent],
    });
    TestBed.compileComponents();
  });

  describe('Range and Timestamp available', () => {
    let fixture: ComponentFixture<TestChart>;

    beforeEach(() => {
      fixture = TestBed.createComponent<TestChart>(TestChart);
    });

    it('should not have a selection area if there is no timestamp or range inside the chart', () => {
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area')
      );

      expect(selectionArea).toBeNull();
    });

    it('should have a timestamp inside the chart selection area', () => {
      fixture.componentInstance.hasTimestamp = true;
      fixture.detectChanges();
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area')
      );
      const timestamp = fixture.debugElement.query(
        By.css('.dt-chart-timestamp')
      );

      expect(selectionArea).not.toBeNull();
      expect(timestamp).not.toBeNull();
    });

    it('should have a a range inside the chart selection area', () => {
      fixture.componentInstance.hasRange = true;
      fixture.detectChanges();
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area')
      );
      const range = fixture.debugElement.query(By.css('.dt-chart-range'));

      expect(selectionArea).not.toBeNull();
      expect(range).not.toBeNull();
    });
  });

  describe('Initialization and destroying', () => {
    it('should create the selection area after highcharts render.', async () => {
      // const fixture = TestBed.createComponent<TestChartComponent>(
      //   TestChartComponent
      // );
      //     await fixture.whenRenderingDone();
      //     await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
      // const chart = fixture.debugElement.query(By.css('.dt-chart'));
      // spyOn(chart['_afterRender'], 'next');
      // expect(chart['_afterRender'].next).toHaveBeenCalledTimes(0);
      // fixture.detectChanges();
      // expect(chart['_afterRender'].next).toHaveBeenCalledTimes(1);
      //     await chart.
      //       // .componentInstance;
      //     console.log(chart['_range']._elementRef.nativeElement);
      //     const sel = fixture.debugElement.query(
      //       By.css('.dt-chart-selection-area')
      //     );
      //     console.log(sel);
      //     expect(chart['_afterRender'].next).toHaveBeenCalledTimes(0);
      //     fixture.detectChanges();
      //     expect(chart['_afterRender'].next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hairline', () => {
    let fixture: ComponentFixture<TestChartComponent>;
    let selectionAreaDebugEl: DebugElement;
    let hairline: DebugElement;
    let selectionArea: DtChartSelectionArea;
    let plotBackground: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent<TestChartComponent>(TestChartComponent);
      fixture.detectChanges();
      selectionAreaDebugEl = fixture.debugElement.query(
        By.css('.dt-chart-selection-area')
      );
      selectionArea = selectionAreaDebugEl.componentInstance;
      hairline = fixture.debugElement.query(By.css('.dt-chart-hairline'));
      plotBackground = fixture.debugElement.nativeElement.querySelector(
        '.highcharts-plot-background'
      );

      // mock the bounding client rect when it should be requested and
      // of the selection area for comparison.
      spyOn(
        selectionAreaDebugEl.nativeElement,
        'getBoundingClientRect'
      ).and.returnValue(MOCK_BOUNDING_CLIENT_RECT);
      spyOn<any>(selectionArea, '_selectionAreaBcr').and.returnValue(
        MOCK_BOUNDING_CLIENT_RECT
      );
    });

    it('should have a hairline that should be visible on mousemove', () => {
      expect(hairline.nativeElement).toBeDefined();
      // initial display none is from styles
      expect(getComputedStyle(hairline.nativeElement).display).toBe('none');

      // dispatch mousemove on plotBackground
      dispatchMouseEvent(plotBackground, 'mousemove', 100, 100);

      expect(hairline.styles.display).toBe('inherit');
      expect(hairline.styles.transform).toMatch(/translateX\(.+px\)/);
    });

    it('should hide the hairline on mouseout', () => {
      dispatchMouseEvent(plotBackground, 'mousemove', 50, 50);
      // mouse move over the bounding client rect.
      expect(hairline.styles.display).toBe('inherit');

      dispatchMouseEvent(plotBackground, 'mouseout', 55, 55);
      // still in the mocked bounding client rect of the selection area
      expect(hairline.styles.display).toBe('inherit');

      dispatchMouseEvent(plotBackground, 'mouseout', 100, 100);
      // now outside the mocked area of the bounding client rect.
      expect(hairline.styles.display).toBe('none');
    });
  });

  describe('Event streams', () => {
    const destroy$ = new Subject<void>();
    let fixture: ComponentFixture<TestChartComponent>;
    // let selectionAreaDebugEl: DebugElement;
    // let selectionArea: DtChartSelectionArea;
    // let plotBackground: Element;

    beforeEach(async () => {
      fixture = TestBed.createComponent<TestChartComponent>(TestChartComponent);
      fixture.detectChanges();
      // selectionAreaDebugEl = fixture.debugElement.query(
      //   By.css('.dt-chart-selection-area')
      // );
      // selectionArea = selectionAreaDebugEl.componentInstance;
      // plotBackground = fixture.debugElement.nativeElement.querySelector(
      //   '.highcharts-plot-background'
      // );
    });

    afterEach(() => {
      destroy$.next();
      destroy$.complete();
    });

    // it('should have invoked highcharts render once and initialize the selection area', () => {
    //   expect(selectionArea['_plotBackground']).toBeDefined();
    //   expect(selectionArea['_range']).toBeDefined();
    //   expect(selectionArea['_timestamp']).toBeDefined();
    //   expect(selectionArea['_initializeHairline']).toBeDefined();
    // });

    // it('should have invoked the mousedown event and trigger the side effect that removes the point events class', (done) => {
    //   spyOn(
    //     selectionAreaDebugEl.nativeElement.classList,
    //     'remove'
    //   ).and.callThrough();
    //   selectionArea['_mousedown$']
    //     .pipe(takeUntil(destroy$))
    //     .subscribe((event) => {
    //       expect(
    //         selectionAreaDebugEl.nativeElement.classList.remove
    //       ).toHaveBeenCalledWith('dt-no-pointer-events');
    //       expect(
    //         selectionAreaDebugEl.nativeElement.classList.remove
    //       ).toHaveBeenCalledTimes(1);
    //       expect(event).toBeDefined();
    //       done();
    //     }, fail);

    //   dispatchMouseEvent(plotBackground, 'mousedown', 100, 100);
    // });

    // it('should have invoked the mousedown event and trigger the side effect that removes the point events class', (done) => {
    //   spyOn(
    //     selectionAreaDebugEl.nativeElement.classList,
    //     'remove'
    //   ).and.callThrough();
    //   selectionArea['_mousedown$']
    //     .pipe(takeUntil(destroy$))
    //     .subscribe((event) => {
    //       expect(
    //         selectionAreaDebugEl.nativeElement.classList.remove
    //       ).toHaveBeenCalledWith('dt-no-pointer-events');
    //       expect(
    //         selectionAreaDebugEl.nativeElement.classList.remove
    //       ).toHaveBeenCalledTimes(1);
    //       expect(event).toBeDefined();
    //       done();
    //     }, fail);

    //   dispatchMouseEvent(plotBackground, 'mousedown', 100, 100);
    // });

    // fit('should have invoked the click event', () => {

    // //   selectionArea['_drag$']
    // //     .pipe(takeUntil(destroy$))
    // //     .subscribe(
    // //       (event) => {
    // //         expect(event).toBeDefined();
    // //         done();
    // //       },
    // //       fail);
    //   // spyOn(selectionAreaDebugEl.nativeElement.classList, 'remove').and.callThrough();

    //   dispatchMouseEvent(plotBackground, 'mousedown', 100, 100);

    //   expect(selectionAreaDebugEl.nativeElement.classList.remove).toHaveBeenCalledTimes(1);

    //   dispatchMouseEvent(selectionAreaDebugEl.nativeElement, 'mousemove', 101, 100);

    //   dispatchMouseEvent(selectionAreaDebugEl.nativeElement, 'mousemove', 102, 100);

    //   dispatchMouseEvent(window, 'mouseup', 102, 100);
    // });
  });
});

@Component({
  selector: 'test-chart-without-selection-area',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-range *ngIf="hasRange"></dt-chart-range>
      <dt-chart-timestamp *ngIf="hasTimestamp"></dt-chart-timestamp>
    </dt-chart>
  `,
})
export class TestChart {
  options = OPTIONS;
  series = SERIES;

  hasRange = false;
  hasTimestamp = false;
}

@Component({
  selector: 'test-chart',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-timestamp></dt-chart-timestamp>
      <dt-chart-range value="[1370304002000, 1370304005000]"></dt-chart-range>
    </dt-chart>
  `,
})
export class TestChartComponent {
  options = OPTIONS;
  series = SERIES;

  // timeValues: number[] = this.series[0].data!.map((data) => data[0]);
  // startRange: number;
  // endRange: number;

  // @ViewChild(DtChartTimestamp) timestamp: DtChartTimestamp;
  // @ViewChild(DtChartRange) range: DtChartRange;

  // changeRange(event: DtSelectChange<number>): void {
  //   this.range.value = [this.startRange, this.endRange];
  // }

  // changeTimestamp(event: DtSelectChange<number>): void {
  //   this.timestamp.value = event.value;
  // }
}

const OPTIONS: Highcharts.Options = {
  xAxis: {
    type: 'datetime',
  },
  yAxis: [
    {
      title: null,
      labels: {
        format: '{value}',
      },
      tickInterval: 10,
    },
    {
      title: null,
      labels: {
        format: '{value}/min',
      },
      opposite: true,
      tickInterval: 50,
    },
  ],
  plotOptions: {
    column: {
      stacking: 'normal',
    },
    series: {
      marker: {
        enabled: false,
      },
    },
  },
};

const SERIES: Highcharts.IndividualSeriesOptions[] = [
  {
    name: 'Requests',
    type: 'column',
    yAxis: 1,
    data: generateData(40, 0, 250, 1370304000000, 900000),
  },
];

function randomize(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number
): Array<[number, number]> {
  return Array.from(Array(amount).keys()).map(
    (v) =>
      [timestampStart + timestampTick * v, randomize(min, max)] as [
        number,
        number
      ]
  );
}
