// tslint:disable:no-use-before-declare no-magic-numbers

import { Component } from '@angular/core';
import { async, TestBed, inject, fakeAsync, flush, tick, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtChart,
  DtChartModule,
  DtChartOptions,
  DtChartSeries,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DtKeyValueListModule } from '@dynatrace/angular-components/key-value-list';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtChartTooltipData } from '../highcharts/highcharts-tooltip-types';

describe('DtChartTooltip', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let chartComponent: DtChart;
  let fixture: ComponentFixture<ChartTest>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule, DtKeyValueListModule, DtOverlayModule, NoopAnimationsModule],
      declarations: [
        ChartTest,
      ],
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    fixture = TestBed.createComponent(ChartTest);
    fixture.detectChanges();
    const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
    chartComponent = chartDebugElement.componentInstance;

  }));

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  it('should dismiss the overlay when the tooltip close event is called', fakeAsync(() => {
    chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_DATA_LINE_SERIES });
    fixture.detectChanges();
    chartComponent.tooltipOpenChange.next(false);
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).toEqual('');
  }));

  it('should dismiss the overlay when the tooltip data event is called but has no data for the point', fakeAsync(() => {
    const newData: DtChartTooltipData = {...DUMMY_TOOLTIP_DATA_LINE_SERIES};
    newData.points = undefined;
    chartComponent.tooltipDataChange.next({ data: newData });
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).toEqual('');
  }));

  describe('content', () => {
    beforeEach(fakeAsync(() => {
      chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_DATA_LINE_SERIES });
      fixture.detectChanges();
    }));

    it('should be a key value list with the data', () => {
      expect(overlayContainerElement.innerText).toContain('Actions/min');
      expect(overlayContainerElement.innerText).toContain('1000');
      expect(overlayContainerElement.innerHTML).toContain('dt-key-value-list');
    });

    it('should be updated with new data', () => {
      const newData: DtChartTooltipData = {...DUMMY_TOOLTIP_DATA_LINE_SERIES};
      newData.points![0].point.y = 54321;

      chartComponent.tooltipDataChange.next({ data: newData });
      fixture.detectChanges();
      expect(overlayContainerElement.innerText).not.toContain('1000');
      expect(overlayContainerElement.innerText).toContain('54321');
    });
  });

  describe('positioning', () => {
    let plotBackgroundMarginLeft: number;
    let plotBackgroundVerticalCenter: number;

    beforeEach(() => {
      const plotBackground = fixture.debugElement.nativeElement.querySelector('.highcharts-plot-background');
      plotBackgroundMarginLeft = parseInt(plotBackground.getAttribute('x'), 10);
      plotBackgroundVerticalCenter =
        parseInt(plotBackground.getAttribute('y'), 10) + (parseInt(plotBackground.getAttribute('height'), 10) / 2);
    });

    it('should be correct for category axis', () => {
      chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_DATA_CATEGORY });
      fixture.detectChanges();

      const positionMarker: SVGCircleElement = fixture.debugElement.nativeElement.querySelector('.dt-tooltip-position-marker');
      const expectedPos = {
        x: plotBackgroundMarginLeft + DUMMY_TOOLTIP_DATA_CATEGORY.points![0].point.tooltipPos![0],
        y: plotBackgroundVerticalCenter,
      };
      expect(positionMarker).toBeDefined();
      expect(positionMarker.getAttribute('cx')).toBe(expectedPos.x.toString());
      expect(positionMarker.getAttribute('cy')).toBe(expectedPos.y.toString());
    });

    it('should be correct for area series', () => {
      chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_DATA_AREA_SERIES });
      fixture.detectChanges();

      const positionMarker: SVGCircleElement = fixture.debugElement.nativeElement.querySelector('.dt-tooltip-position-marker');
      const expectedPos = {
        x: 300, // 3 * 100 from the toPixels function that takes the margin into account already
        y: plotBackgroundVerticalCenter,
      };
      expect(positionMarker).toBeDefined();
      expect(positionMarker.getAttribute('cx')).toBe(expectedPos.x.toString());
      expect(positionMarker.getAttribute('cy')).toBe(expectedPos.y.toString());
    });

    it('should be correct for pie charts', () => {
      chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_PIE_DATA });
      fixture.detectChanges();

      const positionMarker: SVGCircleElement = fixture.debugElement.nativeElement.querySelector('.dt-tooltip-position-marker');
      const tooltipPos = DUMMY_TOOLTIP_PIE_DATA.point!.point.tooltipPos!;
      const expectedPos = {
        x: tooltipPos[0],
        y: tooltipPos[1],
      };
      expect(positionMarker).toBeDefined();
      expect(positionMarker.getAttribute('cx')).toBe(expectedPos.x.toString());
      expect(positionMarker.getAttribute('cy')).toBe(expectedPos.y.toString());
    });

    it('should be correct for line/column series', () => {
      chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_DATA_LINE_SERIES });
      fixture.detectChanges();

      const positionMarker: SVGCircleElement = fixture.debugElement.nativeElement.querySelector('.dt-tooltip-position-marker');
      const expectedPos = {
        x: plotBackgroundMarginLeft + DUMMY_TOOLTIP_DATA_LINE_SERIES.points![0].point.tooltipPos![0],
        y: plotBackgroundVerticalCenter,
      };
      expect(positionMarker).toBeDefined();
      expect(positionMarker.getAttribute('cx')).toBe(expectedPos.x.toString());
      expect(positionMarker.getAttribute('cy')).toBe(expectedPos.y.toString());
    });
  });

});

@Component({
  selector: 'dt-line',
  template: `
    <dt-chart [series]="series" [options]="options">
      <dt-chart-tooltip>
        <ng-template let-series>
          <dt-key-value-list style="min-width: 100px">
            <dt-key-value-list-item *ngFor="let data of series.points">
              <dt-key-value-list-key>{{data.series.name}}</dt-key-value-list-key>
              <dt-key-value-list-value>{{data.point.y}}</dt-key-value-list-value>
            </dt-key-value-list-item>
          </dt-key-value-list>
        </ng-template>
      </dt-chart-tooltip>
    </dt-chart>
  `,
})
class ChartTest {
  options: DtChartOptions = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };
  series: DtChartSeries[] = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
  ];
}

const DUMMY_TOOLTIP_DATA_LINE_SERIES: DtChartTooltipData = {
  x: 0,
  y: 0,
  points: [
    {
      x: 0,
      y: 0,
      total: 1,
      color: '#ffffff',
      colorIndex: 0,
      percentage: 0,
      point: {
        x: 1,
        y: 1000,
        tooltipPos: [1, 2, 3],
      },
      series: {
        name: 'Actions/min',
        xAxis: {
          toPixels: (x) => x * 2,
        },
        yAxis: {
          toPixels: (y) => y * 2,
        },
      },
      key: 0,
    },
  ],
};

const DUMMY_TOOLTIP_DATA_AREA_SERIES: DtChartTooltipData = {
  x: 0,
  y: 0,
  points: [
    {
      x: 0,
      y: 0,
      total: 1,
      color: '#ffffff',
      colorIndex: 0,
      percentage: 0,
      point: {
        x: 3,
        y: 1000,
      },
      series: {
        name: 'Actions/min',
        xAxis: {
          toPixels: (x) => x * 100,
        },
        yAxis: {
          toPixels: (y) => y * 2,
        },
      },
      key: 0,
    },
  ],
};

const DUMMY_TOOLTIP_DATA_CATEGORY: DtChartTooltipData = {
  x: 0,
  y: 0,
  points: [
    {
      x: 0,
      y: 0,
      total: 1,
      color: '#ffffff',
      colorIndex: 0,
      percentage: 0,
      point: {
        x: 'Apr',
        y: 1000,
        tooltipPos: [1, 2, 3],
      },
      series: {
        name: 'Actions/min',
        xAxis: {
          toPixels: (x) => NaN,
        },
        yAxis: {
          toPixels: (y) => y * 2,
        },
      },
      key: 0,
    },
  ],
};

const DUMMY_TOOLTIP_PIE_DATA: DtChartTooltipData = {
  x: 0,
  y: 0,
  point: {
    x: 0,
    y: 0,
    total: 1,
    color: '#ffffff',
    colorIndex: 0,
    percentage: 0,
    point: {
      x: 0,
      y: 1000,
      tooltipPos: [123, 234],
    },
    series: {},
    key: 0,
  },
};
