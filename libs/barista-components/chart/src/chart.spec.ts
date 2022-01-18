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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Component } from '@angular/core';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartModule } from './chart-module';
import { DtChart } from './chart';
import { DtChartOptions, DtChartSeries } from './chart.interface';
import { getDtHeatfieldUnsupportedChartError } from './heatfield';
import {
  DtThemingModule,
  DT_CHART_COLOR_PALETTES,
  DT_CHART_COLOR_PALETTE_ORDERED,
} from '@dynatrace/barista-components/theming';
import {
  createComponent,
  dispatchMouseEvent,
} from '@dynatrace/testing/browser';
import {
  AxisOptions,
  ChartOptions,
  SeriesColumnOptions,
  SeriesLineOptions,
} from 'highcharts';
import { BehaviorSubject } from 'rxjs';

describe('DtChart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [
        SeriesSingle,
        SeriesMulti,
        NoSeries,
        DynamicSeries,
        SeriesColor,
        SeriesTheme,
        SeriesMoreThanTheme,
        SeriesMoreThanOrderedColors,
        PieChartThemeColors,
        PieChartOrderedColors,
        EmptySeries,
        Loading,
        LoadingText,
        HeatfieldError,
        DynamicOptions,
      ],
    });

    TestBed.compileComponents();
  });

  describe('Data', () => {
    it('should display static data', () => {
      const fixture = createComponent(SeriesSingle);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      fixture.detectChanges();
      expect((chartComponent.series as DtChartSeries[]).length).toBe(1);
    });

    it('should display data from observable', () => {
      const fixture = createComponent(DynamicSeries);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const series = chartComponent.highchartsOptions.series;
      expect((series![0] as SeriesColumnOptions).data).toEqual([
        [1523972199774, 0],
        [1523972201622, 10],
      ]);
    });

    it('should update the data if observable fires new data', () => {
      const fixture = createComponent(DynamicSeries);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const firstSeries = chartComponent.highchartsOptions.series;
      fixture.componentInstance.emitTestData();
      fixture.detectChanges();
      const secondSeries = chartComponent.highchartsOptions.series;
      expect((firstSeries![0] as SeriesLineOptions).data).toBeDefined();
      expect((secondSeries![0] as SeriesLineOptions).data).toBeDefined();
      expect((firstSeries![0] as SeriesLineOptions).data).not.toEqual(
        (secondSeries![0] as SeriesLineOptions).data,
      );
    });

    it('provides an array of ids for the series', () => {
      const fixture = createComponent(SeriesMulti);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const ids = chartComponent.seriesIds;
      expect(ids).toEqual(['someMetricId', 'someOtherMetricId']);
    });

    it('seriesIds returns undefined if there is no series data', () => {
      const fixture = createComponent(NoSeries);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance;
      const ids = chartComponent.seriesIds;
      expect(ids).toBeUndefined();
    });

    it('should always return false for the tooltip wrapper fn', () => {
      const fixture = createComponent(SeriesSingle);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.detectChanges();
      const tooltip = chartComponent.highchartsOptions.tooltip;
      expect(tooltip).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tooltip!.formatter).toBeDefined();
      // bind dummy seriespoint to be able to call the formatter function
      expect(
        tooltip!.formatter!.bind({ series: { name: 'somename' } })(),
      ).toEqual(false);
    });

    it('should update the options at runtime', () => {
      const fixture = createComponent(SeriesSingle);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const spy = jest.fn();
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();
      fixture.componentInstance.options = {
        chart: {
          type: 'pie',
        },
      };
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should display options from observable', () => {
      const fixture = createComponent(DynamicOptions);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const options = chartComponent.highchartsOptions;
      expect((options.chart as ChartOptions).type).toEqual('column');
      expect((options.xAxis as AxisOptions).type).toEqual('datetime');
      expect((options.yAxis as AxisOptions).min).toEqual(0);
      expect((options.yAxis as AxisOptions).max).toEqual(20);
    });

    it('should update the data if observable fires new options', () => {
      const fixture = createComponent(DynamicOptions);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const firstOptions = chartComponent.highchartsOptions;
      fixture.componentInstance.emitTestData();
      fixture.detectChanges();
      const secondOptions = chartComponent.highchartsOptions;
      expect(firstOptions).toBeDefined();
      expect(secondOptions).toBeDefined();
      expect(firstOptions).not.toEqual(secondOptions);
    });

    it('should wrap the tooltip after changing the options at runtime', () => {
      const fixture = createComponent(SeriesSingle);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const newOptions = {
        chart: {
          type: 'pie',
        },
      };
      fixture.componentInstance.options = newOptions;
      fixture.detectChanges();
      const tooltip = chartComponent.highchartsOptions.tooltip;
      expect(tooltip).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tooltip!.formatter).toBeDefined();
      // bind dummy seriespoint to be able to call the formatter function
      expect(
        tooltip!.formatter!.bind({ series: { name: 'somename' } })(),
      ).toEqual(false);
    });

    it('should work with empty series array', () => {
      expect(() => createComponent(EmptySeries)).not.toThrowError(
        'Cannot convert undefined or null to object',
      );
      expect(() => createComponent(EmptySeries)).not.toThrow(TypeError);
    });
  });

  describe('update event', () => {
    it('should fire updated after the data observable emits a new value', () => {
      const fixture = createComponent(DynamicSeries);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jest.fn();
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.componentInstance.emitTestData();
      expect(spy).toHaveBeenCalled();
    });

    it('should fire updated after the static data is updated', () => {
      const fixture = createComponent(SeriesSingle);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jest.fn();
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.componentInstance.series = [
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
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('coloring', () => {
    it('should leave the color of series unchanged if provided', () => {
      const fixture = createComponent(SeriesColor);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      expect(
        (chartComponent.highchartsOptions.series![0] as SeriesLineOptions)
          .color,
      ).toBe('#ff0000');
      expect(
        (chartComponent.highchartsOptions.series![1] as SeriesLineOptions)
          .color,
      ).toBe('#00ff00');
    });

    it('should choose the colors from the colorpalette of the theme for up to 3 series', () => {
      const fixture = createComponent(SeriesTheme);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(
        DT_CHART_COLOR_PALETTES.purple,
      );
    });

    it('should choose the colors from the ordered palette for more than 3 series', () => {
      const fixture = createComponent(SeriesMoreThanTheme);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(
        DT_CHART_COLOR_PALETTE_ORDERED,
      );
    });

    it('should update colors when the theme changes', () => {
      const fixture = createComponent(SeriesTheme);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(
        DT_CHART_COLOR_PALETTES.purple,
      );
      fixture.componentInstance.theme = 'royalblue';
      fixture.detectChanges();
      expect(chartComponent.highchartsOptions.colors).toEqual(
        DT_CHART_COLOR_PALETTES.royalblue,
      );
    });

    it('should choose the correct colors for pie charts with less than 4 data slices', () => {
      const fixture = createComponent(PieChartThemeColors);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(
        DT_CHART_COLOR_PALETTES.purple,
      );
    });

    it('should choose the correct colors for pie charts with more than 3 data slices', () => {
      const fixture = createComponent(PieChartOrderedColors);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(
        DT_CHART_COLOR_PALETTE_ORDERED,
      );
    });
  });

  describe('loading', () => {
    it('should display the loading indicator if no series has been provided', () => {
      const fixture = createComponent(Loading);
      const loadingDebugElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      );

      // Loading indicater should be visible
      expect(loadingDebugElement).toBeDefined();
      // Loading indicater should be visible
      expect(loadingDebugElement.nativeElement).toBeDefined();
    });

    it('should display the loading indicator if the series array is empty', () => {
      const fixture = TestBed.createComponent(Loading);
      fixture.componentInstance.series = [];
      fixture.detectChanges();
      const loadingDebugElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      );

      // Loading indicater should be visible
      expect(loadingDebugElement).toBeDefined();

      // Loading indicater should be visible
      expect(loadingDebugElement.nativeElement).toBeDefined();
    });

    it('should not display the loading indicator if a series has been provided', () => {
      const fixture = TestBed.createComponent(Loading);
      fixture.componentInstance.series = [
        {
          name: 'Actions/min',
          id: 'someid',
          data: [
            [1523972199774, 0],
            [1523972201622, 10],
          ],
        },
      ];
      fixture.detectChanges();
      const loadingDebugElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      );

      // Loading indicator should be hidden
      expect(loadingDebugElement).toBeNull();
    });

    it('should hide the loading indicator once a series has been provided', () => {
      const fixture = createComponent(Loading);
      let loadingDebugElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      );
      // Loading indicater should be visible
      expect(loadingDebugElement).toBeDefined();
      // Loading indicater should be visible
      expect(loadingDebugElement.nativeElement).toBeDefined();

      fixture.componentInstance.series = [{}];
      fixture.detectChanges();

      loadingDebugElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      );
      // Loading indicator should be hidden
      expect(loadingDebugElement).toBeNull();
    });

    it('should not have a loading text as default', () => {
      const fixture = createComponent(LoadingText);
      const loadingElement: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      ).nativeElement;
      expect(loadingElement.textContent).toBe('');
    });

    it('should able to set a loading text', () => {
      const fixture = TestBed.createComponent(LoadingText);
      fixture.componentInstance.loadingText = 'Loading';
      fixture.detectChanges();

      const loadingElement: HTMLElement = fixture.debugElement.query(
        By.css('.dt-chart-loading-indicator'),
      ).nativeElement;
      expect(loadingElement.textContent).toBe('Loading');
    });
  });

  describe('Heatfield', () => {
    it('should throw an error when the chart has a category xAxis', fakeAsync(() => {
      const rect = document.createElement('rect');
      rect.setAttribute('width', '100');
      rect.setAttribute('height', '100');
      rect.setAttribute('x', '100');
      rect.setAttribute('y', '100');

      const fixture = createComponent(HeatfieldError);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      chartComponent._plotBackground$ = new BehaviorSubject(
        rect as unknown as SVGRectElement,
      );
      try {
        fixture.detectChanges();
        flush();
      } catch (e) {
        expect(e.message).toBe(getDtHeatfieldUnsupportedChartError().message);
      } finally {
        expect.assertions(1);
        fixture.destroy();
      }
      // This was the only solution to clear the pending timers in the queue.
      // If I would do a tick or flush it would trigger the error again and then it fails with the
      // getDtHeatfieldUnsupportedChartError twice.
      (global as any).Zone.current.get('FakeAsyncTestZoneSpec').pendingTimers =
        [];
    }));
  });

  describe('series visibility', () => {
    it('should retain the visibilty of a series when new data is set via an observable', () => {
      const fixture = createComponent(DynamicSeries);
      const fixtureNative = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      fixture.componentInstance.series.next([
        {
          name: 'Actions/min',
          id: 'someid',
          data: [
            [1523972199774, 0],
            [1523972201622, 10],
          ],
        },
        {
          name: 'Requests/min',
          id: 'another id',
          data: [
            [1523972199774, 0],
            [1523972201622, 10],
          ],
        },
      ]);
      fixture.detectChanges();

      const legendItem = fixtureNative.querySelector('.highcharts-legend-item');

      // Expect both series to be there.
      expect(fixtureNative.querySelectorAll('.highcharts-series')).toHaveLength(
        2,
      );
      dispatchMouseEvent(legendItem, 'click');
      fixture.detectChanges();

      // Expect series 0 to have visibility hidden set
      let series0 = fixtureNative.querySelector('.highcharts-series-0');
      expect(series0.getAttribute('visibility')).toBe('hidden');

      // set the next data
      fixture.componentInstance.series.next([
        {
          name: 'Actions/min',
          id: 'someid',
          data: [
            [1523972199775, 0],
            [1523972201623, 10],
          ],
        },
        {
          name: 'Requests/min',
          id: 'another id',
          data: [
            [1523972199775, 0],
            [1523972201623, 10],
          ],
        },
      ]);
      fixture.detectChanges();

      // Expect series 0 to still be hidden.
      series0 = fixtureNative.querySelector('.highcharts-series-0');
      expect(series0.getAttribute('visibility')).toBe('hidden');
    });

    it('should retain the visibilty of a series when new data is set as array', () => {
      const fixture = createComponent(SeriesMulti);
      const fixtureNative = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      fixture.componentInstance.series = [
        {
          name: 'Actions/min',
          type: 'line',
          id: 'someid',
          data: [
            [1523972199774, 0],
            [1523972201622, 10],
          ],
        },
        {
          name: 'Requests/min',
          type: 'line',
          id: 'another id',
          data: [
            [1523972199774, 0],
            [1523972201622, 10],
          ],
        },
      ];
      fixture.detectChanges();

      const legendItem = fixtureNative.querySelector('.highcharts-legend-item');

      // Expect both series to be there.
      expect(fixtureNative.querySelectorAll('.highcharts-series')).toHaveLength(
        2,
      );
      dispatchMouseEvent(legendItem, 'click');
      fixture.detectChanges();

      // Expect series 0 to have visibility hidden set
      let series0 = fixtureNative.querySelector('.highcharts-series-0');
      expect(series0.getAttribute('visibility')).toBe('hidden');

      // set the next data
      fixture.componentInstance.series = [
        {
          name: 'Actions/min',
          type: 'line',
          id: 'someid',
          data: [
            [1523972199775, 0],
            [1523972201623, 10],
          ],
        },
        {
          name: 'Requests/min',
          type: 'line',
          id: 'another id',
          data: [
            [1523972199775, 0],
            [1523972201623, 10],
          ],
        },
      ];
      fixture.detectChanges();

      // Expect series 0 to still be hidden.
      series0 = fixtureNative.querySelector('.highcharts-series-0');
      expect(series0.getAttribute('visibility')).toBe('hidden');
    });
  });
});

/** Test component that contains an DtChart with static data */
@Component({
  selector: 'dt-series-single',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class SeriesSingle {
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

@Component({
  selector: 'dt-series-multi',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class SeriesMulti {
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
    {
      type: 'line',
      name: 'Requests/min',
      id: 'someOtherMetricId',
      data: [
        [1370304000000, 130],
        [1370390400000, 110],
      ],
    },
  ];
}

@Component({
  selector: 'dt-no-series',
  template: ` <dt-chart [options]="options"></dt-chart> `,
})
class NoSeries {
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
}

@Component({
  selector: 'dt-dynamic-series',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class DynamicSeries {
  options: DtChartOptions = {
    chart: {
      type: 'column',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 0,
      max: 20,
    },
  };

  series = new BehaviorSubject([
    {
      name: 'Actions/min',
      id: 'someid',
      data: [
        [1523972199774, 0],
        [1523972201622, 10],
      ],
    },
  ]);

  emitTestData(): void {
    this.series.next([
      {
        name: 'Actions/min',
        id: 'someid',
        data: [
          [1523972199774, 20],
          [1523972201622, 30],
        ],
      },
    ]);
  }
}

@Component({
  selector: 'dt-series-color',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class SeriesColor {
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
      color: '#ff0000',
      data: [
        [1370304000000, 140],
        [1370390400000, 120],
      ],
    },
    {
      type: 'line',
      name: 'Requests/min',
      id: 'someOtherMetricId',
      color: '#00ff00',
      data: [
        [1370304000000, 130],
        [1370390400000, 110],
      ],
    },
  ];
}

@Component({
  selector: 'dt-series-color',
  template: `
    <div [dtTheme]="theme">
      <dt-chart [series]="series" [options]="options"></dt-chart>
    </div>
  `,
})
class SeriesTheme {
  theme = 'purple';
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
    {
      type: 'line',
      name: 'Requests/min',
      id: 'someOtherMetricId',
      data: [
        [1370304000000, 130],
        [1370390400000, 110],
      ],
    },
  ];
}

@Component({
  selector: 'dt-series-color',
  template: `
    <div dtTheme="purple">
      <dt-chart [series]="series" [options]="options"></dt-chart>
    </div>
  `,
})
class SeriesMoreThanTheme {
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
    {
      type: 'line',
      name: 'Requests/min',
      id: 'someOtherMetricId',
      data: [
        [1370304000000, 130],
        [1370390400000, 110],
      ],
    },
    {
      type: 'line',
      name: 'Failed requests',
      id: 'testmetricId',
      data: [
        [1370304000000, 140],
        [1370390400000, 120],
      ],
    },
    {
      type: 'line',
      name: 'Successful requests',
      id: 'someOtherTestMetricId',
      data: [
        [1370304000000, 140],
        [1370390400000, 120],
      ],
    },
  ];
}

@Component({
  selector: 'dt-series-color',
  template: `
    <div dtTheme="purple">
      <dt-chart [series]="series" [options]="options"></dt-chart>
    </div>
  `,
})
class SeriesMoreThanOrderedColors {
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
  series: SeriesLineOptions[] = Array.from(
    Array(DT_CHART_COLOR_PALETTE_ORDERED.length + 1).keys(),
  ).map(
    (): SeriesLineOptions => ({
      type: 'line',
      name: 'Actions/min',
      id: 'someMetricId',
      data: [
        [1370304000000, 140],
        [1370390400000, 120],
      ],
    }),
  );
}

@Component({
  selector: 'dt-pie-color-theme',
  template: `
    <div dtTheme="purple">
      <dt-chart [series]="series" [options]="options"></dt-chart>
    </div>
  `,
})
class PieChartThemeColors {
  options: DtChartOptions = {
    chart: {
      type: 'pie',
    },
  };
  series = [
    {
      name: 'Browsers',
      data: [
        {
          name: 'Chrome',
          y: 60,
        },
        {
          name: 'Firefox',
          y: 25,
        },
        {
          name: 'Edge',
          y: 15,
        },
      ],
    },
  ];
}

@Component({
  selector: 'dt-pie-color-theme',
  template: `
    <div dtTheme="purple">
      <dt-chart [series]="series" [options]="options"></dt-chart>
    </div>
  `,
})
class PieChartOrderedColors {
  options: DtChartOptions = {
    chart: {
      type: 'pie',
    },
  };
  series = [
    {
      name: 'Browsers',
      data: [
        {
          name: 'Chrome',
          y: 55,
        },
        {
          name: 'Firefox',
          y: 25,
        },
        {
          name: 'Edge',
          y: 15,
        },
        {
          name: 'Others',
          y: 5,
        },
      ],
    },
  ];
}

@Component({
  selector: 'dt-empty-series',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class EmptySeries {
  options: DtChartOptions = {
    title: {
      text: 'some String',
    },
  };
  series = [];
}

@Component({
  selector: 'dt-empty-series',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class Loading {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series?: any[];
  options: DtChartOptions = {};
}

@Component({
  selector: 'dt-empty-series',
  template: `
    <dt-chart [loading-text]="loadingText" [series]="[]"></dt-chart>
  `,
})
class LoadingText {
  loadingText: string;
}

@Component({
  selector: 'dt-heatfield-error',
  template: `
    <dt-chart [series]="series" [options]="options">
      <dt-chart-heatfield [start]="1564546530000" [end]="1564546620000">
        Problem 1:
        <br />
        <a class="dt-link">View problem details</a>
      </dt-chart-heatfield>
    </dt-chart>
  `,
})
class HeatfieldError {
  options = {
    xAxis: [
      {
        categories: ['some category'],
      },
    ],
  };
  series = [
    {
      name: 'Code execution',
      type: 'area',
      data: [
        {
          x: 1564546440000,
          y: 0,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
        {
          x: 1564546450000,
          y: 0,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
      ],
    },
  ];
}

@Component({
  selector: 'dt-dynamic-series',
  template: ` <dt-chart [series]="series" [options]="options"></dt-chart> `,
})
class DynamicOptions {
  options = new BehaviorSubject({
    chart: {
      type: 'column',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 0,
      max: 20,
    },
  });

  series: SeriesColumnOptions[] = [
    {
      type: 'column',
      name: 'Actions/min',
      id: 'someid',
      data: [
        [1523972199774, 0],
        [1523972201622, 10],
      ],
    },
  ];

  emitTestData(): void {
    this.options.next({
      chart: {
        type: 'area',
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        min: 0,
        max: 20,
      },
    });
  }
}
