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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import {
  waitForAsync,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtKeyValueListModule } from '@dynatrace/barista-components/key-value-list';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import {
  createComponent,
  MockIntersectionObserver,
} from '@dynatrace/testing/browser';
import { Axis, Point, Series, SeriesLineOptions } from 'highcharts';
import { DtChart } from '../chart';
import { DtChartModule } from '../chart-module';
import { DtChartOptions } from '../chart.interface';
import { DtChartTooltipData } from '../highcharts/highcharts-tooltip-types';

describe('DtChartTooltip', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let chartComponent: DtChart;
  let fixture: ComponentFixture<ChartTest>;
  const mockIntersectionObserver = new MockIntersectionObserver();
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtChartModule,
          DtThemingModule,
          DtKeyValueListModule,
          DtOverlayModule,
          NoopAnimationsModule,
        ],
        declarations: [ChartTest],
        providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
      });

      TestBed.compileComponents();

      inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
      })();

      fixture = createComponent(ChartTest);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      chartComponent = chartDebugElement.componentInstance;
    }),
  );

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();

      mockIntersectionObserver.clearMock();
    },
  ));

  it('should dismiss the overlay when the tooltip close event is called', fakeAsync(() => {
    mockIntersectionObserver.mockAllIsIntersecting(true);
    chartComponent._highChartsTooltipOpened$.next({
      data: DUMMY_TOOLTIP_DATA_LINE_SERIES,
    });
    fixture.detectChanges();
    expect(overlayContainerElement.innerHTML).not.toEqual('');
    chartComponent._highChartsTooltipClosed$.next();
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).toEqual('');
  }));

  it('should dismiss the overlay when the tooltip data event is called but has no data for the point', fakeAsync(() => {
    mockIntersectionObserver.mockAllIsIntersecting(true);
    const newData: DtChartTooltipData = { ...DUMMY_TOOLTIP_DATA_LINE_SERIES };
    // we set points to undefined to simulate a tooltip event without point data
    newData.points = undefined;
    chartComponent._highChartsTooltipDataChanged$.next({ data: newData });
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).toEqual('');
  }));

  it('should show the tooltip if the chart is in the viewport', fakeAsync(() => {
    mockIntersectionObserver.mockAllIsIntersecting(true);
    chartComponent._highChartsTooltipOpened$.next({
      data: DUMMY_TOOLTIP_DATA_LINE_SERIES,
    });
    fixture.detectChanges();
    tick();
    flush();
    expect(overlayContainerElement.innerHTML).not.toEqual('');
  }));

  // This behavior has been removed with pull request 410
  // https://github.com/dynatrace-oss/barista/pull/410 as it was causing
  // inconsistent and unexpected behavior with showing the tooltip.
  // it('should not show the tooltip if the chart is not in the viewport', fakeAsync(() => {
  //   mockIntersectionObserver.mockAllIsIntersecting(false);
  //   chartComponent._highChartsTooltipOpened$.next({
  //     data: DUMMY_TOOLTIP_DATA_LINE_SERIES,
  //   });
  //   fixture.detectChanges();
  //   tick();
  //   flush();
  //   expect(overlayContainerElement.innerHTML).toEqual('');
  // }));

  describe('content', () => {
    beforeEach(fakeAsync(() => {
      mockIntersectionObserver.mockAllIsIntersecting(true);
      chartComponent._highChartsTooltipOpened$.next({
        data: DUMMY_TOOLTIP_DATA_LINE_SERIES,
      });
      fixture.detectChanges();
    }));

    it('should be a key value list with the data', () => {
      expect(overlayContainerElement.textContent).toContain('Actions/min');
      expect(overlayContainerElement.textContent).toContain('1000');
      expect(overlayContainerElement.innerHTML).toContain('dt-key-value-list');
    });

    it('should be updated with new data', () => {
      const newData: DtChartTooltipData = { ...DUMMY_TOOLTIP_DATA_LINE_SERIES };
      newData.points![0].point.y = 54321;

      chartComponent._highChartsTooltipDataChanged$.next({ data: newData });
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).not.toContain('1000');
      expect(overlayContainerElement.textContent).toContain('54321');
    });
  });
  describe('propagate attribute to overlay', () => {
    it('should propagate attribute to overlay when `dt-ui-test-id` is provided', fakeAsync(() => {
      mockIntersectionObserver.mockAllIsIntersecting(true);
      chartComponent._highChartsTooltipOpened$.next({
        data: DUMMY_TOOLTIP_DATA_LINE_SERIES,
      });
      fixture.detectChanges();
      tick();
      flush();
      expect(overlayContainerElement.innerHTML).toContain(
        'dt-ui-test-id="tooltip-overlay',
      );
    }));
  });
  describe('heatmap content', () => {
    beforeEach(() => {
      mockIntersectionObserver.mockAllIsIntersecting(true);
      chartComponent._highChartsTooltipOpened$.next({
        data: DUMMY_TOOLTIP_HEATMAP,
      });
      fixture.detectChanges();
    });

    it('should be a key value list with the data', () => {
      expect(overlayContainerElement.textContent).toContain('9');
      expect(overlayContainerElement.textContent).toContain('1632300180000');
      expect(overlayContainerElement.innerHTML).toContain('dt-key-value-list');
    });
  });
});

@Component({
  selector: 'dt-line',
  template: `
    <dt-chart [series]="series" [options]="options">
      <dt-chart-tooltip dt-ui-test-id="tooltip">
        <ng-template let-series>
          <div *ngIf="!!series?.point; else chart">
            <dt-key-value-list *ngIf="series?.point?.point?.options as data">
              <dt-key-value-list-item>
                <dt-key-value-list-key>Y Bucket:</dt-key-value-list-key>
                <dt-key-value-list-value>{{ data.y }}</dt-key-value-list-value>
              </dt-key-value-list-item>
              <dt-key-value-list-item>
                <dt-key-value-list-key>X Bucket:</dt-key-value-list-key>
                <dt-key-value-list-value>{{ data.x }}</dt-key-value-list-value>
              </dt-key-value-list-item>
              <dt-key-value-list-item>
                <dt-key-value-list-key>Value:</dt-key-value-list-key>
                <dt-key-value-list-value>{{
                  data.value
                }}</dt-key-value-list-value>
              </dt-key-value-list-item>
            </dt-key-value-list>
          </div>

          <ng-template #chart>
            <dt-key-value-list style="min-width: 100px">
              <dt-key-value-list-item *ngFor="let data of series.points">
                <dt-key-value-list-key>
                  {{ data.series.name }}
                </dt-key-value-list-key>
                <dt-key-value-list-value>
                  {{ data.point.y }}
                </dt-key-value-list-value>
              </dt-key-value-list-item>
            </dt-key-value-list>
          </ng-template>
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
  series: SeriesLineOptions[] = [
    {
      type: 'line',
      name: 'Actions/min',
      id: 'someMetricId',
      data: [
        [1370304000000, 140],
        [1370390400000, 120],
      ],
    },
  ];
}

const FAKE_AXIS: Axis = {
  toPixels: (x) => x * 2,
} as unknown as Axis;

const FAKE_SERIES: Series = {
  name: 'Actions/min',
  xAxis: FAKE_AXIS,
  yAxis: FAKE_AXIS,
} as Series;

const FAKE_POINT: Point = {
  x: 1,
  y: 1000,
  tooltipPos: [1, 2, 3],
} as unknown as Point;

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
      point: FAKE_POINT,
      series: FAKE_SERIES,
    },
  ],
};

const DUMMY_TOOLTIP_HEATMAP: DtChartTooltipData = {
  x: undefined,
  y: 152.5,
  point: {
    point: {
      plotX: 605.5,
      plotY: 11.5,
      x: 1632300180000,
      y: 9,
      options: {
        x: 1632300180000,
        y: 9,
        value: 1,
      },
    },
  },
} as unknown as DtChartTooltipData;
