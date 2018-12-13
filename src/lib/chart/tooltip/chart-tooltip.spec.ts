import { Component } from '@angular/core';
import { async, TestBed, inject, fakeAsync, flush, tick } from '@angular/core/testing';
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
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule, DtKeyValueListModule, DtOverlayModule, NoopAnimationsModule],
      declarations: [
        Chart,
      ],
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    fixture = TestBed.createComponent(Chart);
    fixture.detectChanges();
    const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
    chartComponent = chartDebugElement.componentInstance;

    // this fakes a new tooltip being created
    chartComponent.tooltipDataChange.next({ data: DUMMY_TOOLTIP_DATA });
    fixture.detectChanges();
  }));

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  it('should render a key value list with the data inside the tooltip', () => {
    expect(overlayContainerElement.innerText).toContain('Actions/min');
    expect(overlayContainerElement.innerText).toContain('12345');
    expect(overlayContainerElement.innerHTML).toContain('dt-key-value-list');
  });

  it('should update the tooltip with new data', () => {
    const newData = DUMMY_TOOLTIP_DATA;
    newData.points![0].point.y = 54321;

    chartComponent.tooltipDataChange.next({ data: newData });
    fixture.detectChanges();
    expect(overlayContainerElement.innerText).not.toContain('12345');
    expect(overlayContainerElement.innerText).toContain('54321');
  });

  it('should dismiss the overlay when the tooltip close event is called', fakeAsync(() => {
    chartComponent.tooltipOpenChange.next(false);
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).toEqual('');
  }));

  it('should dismiss the overlay when the tooltip data event is called but has no data for the point', fakeAsync(() => {
    const newData = DUMMY_TOOLTIP_DATA;
    newData.points = undefined;
    chartComponent.tooltipDataChange.next({ data: newData });
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).toEqual('');
  }));
});

@Component({
  selector: 'dt-line',
  template: `
    <dt-chart [series]="series" [options]="options">
      <dt-chart-tooltip>
        <ng-template let-series>
          <dt-key-value-list style="min-width: 100px">
            <dt-key-value-list-item *ngFor="let data of series.points" [key]="data.series.name" [value]="data.point.y">
            </dt-key-value-list-item>
          </dt-key-value-list>
        </ng-template>
      </dt-chart-tooltip>
    </dt-chart>
  `,
})
class Chart {
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

const DUMMY_TOOLTIP_DATA: DtChartTooltipData = {
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
        y: 12345,
        graphic: {
          element: {
            getBoundingClientRect: () => ({
              x: 0,
              y: 0,
              height: 0,
              width: 0,
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }),
          },
        },
      },
      series: {
        name: 'Actions/min',
      },
      key: 0,
    },
  ],
};
