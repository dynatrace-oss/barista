import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtChart,
  DtChartModule,
  DtChartOptions,
  DtChartSeries,
  DtThemingModule,
  CHART_COLOR_PALETTES,
} from '@dynatrace/angular-components';
import { BehaviorSubject } from 'rxjs';
import { CHART_COLOR_PALETTE_ORDERED } from '@dynatrace/angular-components/theming';
import { IndividualSeriesOptions } from 'highcharts';

describe('DtChart', () => {

  beforeEach(async(() => {
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
      ],
    });

    TestBed.compileComponents();
  }));

  describe('Data', () => {
    it('should display static data', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      fixture.detectChanges();
      expect((chartComponent.series as DtChartSeries).length).toBe(1);
    });

    it('should display data from observable', () => {
      const fixture = TestBed.createComponent(DynamicSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const series = chartComponent.highchartsOptions.series;
      expect(series![0].data).toEqual([[1523972199774, 0], [1523972201622, 10]]);
    });

    it('should update the data if observable fires new data', () => {
      const fixture = TestBed.createComponent(DynamicSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const firstSeries = chartComponent.highchartsOptions.series;
      fixture.componentInstance.emitTestData();
      fixture.detectChanges();
      const secondSeries = chartComponent.highchartsOptions.series;
      expect(firstSeries![0].data).toBeDefined();
      expect(secondSeries![0].data).toBeDefined();
      expect(firstSeries![0].data).not.toEqual(secondSeries![0].data);
    });

    it('provides an array of ids for the series', () => {
      const fixture = TestBed.createComponent(SeriesMulti);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const ids = chartComponent.seriesIds;
      expect(ids).toEqual(['someMetricId', 'someOtherMetricId']);
    });

    it('seriesIds returns undefined if there is no series data', () => {
      const fixture = TestBed.createComponent(NoSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance;
      const ids = chartComponent.seriesIds;
      expect(ids).toBeUndefined();
    });

    it('should wrap the tooltip', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.detectChanges();
      const tooltip = chartComponent.highchartsOptions.tooltip;
      expect(tooltip).toBeDefined();
      // tslint:disable-next-line: no-unbound-method
      expect(tooltip!.formatter).toBeDefined();
      // bind dummy seriespoint to be able to call the formatter function
      expect(tooltip!.formatter!.bind({series: { name: 'somename'}})()).toEqual('<div class="dt-chart-tooltip">somename</div>');
    });

    it('should update the options at runtime', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const spy = jasmine.createSpy('chart updated spy');
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

    it('should wrap the tooltip after changing the options at runtime', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      const newOptions = {
        chart: {
          type: 'pie',
        },
        tooltip: {
          formatter(): string | boolean {
            return this.series.name;
          },
        },
      };
      fixture.componentInstance.options = newOptions;
      fixture.detectChanges();
      const tooltip = chartComponent.highchartsOptions.tooltip;
      expect(tooltip).toBeDefined();
      // tslint:disable-next-line: no-unbound-method
      expect(tooltip!.formatter).toBeDefined();
      // bind dummy seriespoint to be able to call the formatter function
      expect(tooltip!.formatter!.bind({series: { name: 'somename'}})()).toEqual('<div class="dt-chart-tooltip">somename</div>');
    });

    it('should work with empty series array', () => {
      expect(() => {
        const fixture = TestBed.createComponent(EmptySeries);
        fixture.detectChanges();
      }).not.toThrowError('Cannot convert undefined or null to object');
      expect(() => {
        const fixture = TestBed.createComponent(EmptySeries);
        fixture.detectChanges();
      }).not.toThrow(TypeError);
    });
  });

  describe('update event', () => {

    it('should fire updated after the data observable emits a new value', () => {
      const fixture = TestBed.createComponent(DynamicSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.componentInstance.emitTestData();
      expect(spy).toHaveBeenCalled();
    });

    it('should fire updated after the static data is updated', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.componentInstance.series = [{
        name: 'Actions/min',
        id: 'someMetricId',
        data: [[1370304000000, 140], [1370390400000, 120]],
      }];
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('coloring', () => {
    it('should leave the color of series unchanged if provided', () => {
      const fixture = TestBed.createComponent(SeriesColor);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      expect(chartComponent.highchartsOptions.series![0].color).toBe('#ff0000');
      expect(chartComponent.highchartsOptions.series![1].color).toBe('#00ff00');
    });

    it('should choose the colors from the colorpalette of the theme for up to 3 series', () => {
      const fixture = TestBed.createComponent(SeriesTheme);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(CHART_COLOR_PALETTES.purple);
    });

    it('should choose the colors from the ordered palette for more than 3 series', () => {
      const fixture = TestBed.createComponent(SeriesMoreThanTheme);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(CHART_COLOR_PALETTE_ORDERED);
    });

    it('should update colors when the theme changes', () => {
      const fixture = TestBed.createComponent(SeriesTheme);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(CHART_COLOR_PALETTES.purple);
      fixture.componentInstance.theme = 'royalblue';
      fixture.detectChanges();
      expect(chartComponent.highchartsOptions.colors).toEqual(CHART_COLOR_PALETTES.royalblue);
    });

    it('should choose the correct colors for pie charts with less than 4 data slices', () => {
      const fixture = TestBed.createComponent(PieChartThemeColors);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(CHART_COLOR_PALETTES.purple);
    });

    it('should choose the correct colors for pie charts with more than 3 data slices', () => {
      const fixture = TestBed.createComponent(PieChartOrderedColors);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(CHART_COLOR_PALETTE_ORDERED);
    });
  });
});

/** Test component that contains an DtChart with static data */
@Component({
  selector: 'dt-series-single',
  template: `
    <dt-chart [series]="series" [options]="options"></dt-chart>
  `,
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
  series: DtChartSeries = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
  ];
}

@Component({
  selector: 'dt-series-multi',
  template: `
  <dt-chart [series]="series" [options]="options"></dt-chart>
  `,
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
  series: DtChartSeries = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
    {
      name: 'Requests/min',
      id: 'someOtherMetricId',
      data: [[1370304000000, 130], [1370390400000, 110]],
    },
  ];
}

@Component({
  selector: 'dt-no-series',
  template: `
  <dt-chart [options]="options"></dt-chart>
  `,
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
  template: `
  <dt-chart [series]="series" [options]="options"></dt-chart>
  `,
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

  series = new BehaviorSubject([{
    name: 'Actions/min',
    id: 'someid',
    data: [[1523972199774, 0], [1523972201622, 10]],
  }]);

  emitTestData(): void {
    this.series.next([{
      name: 'Actions/min',
      id: 'someid',
      data: [[1523972199774, 20], [1523972201622, 30]],
    }]);
  }
}

@Component({
  selector: 'dt-series-color',
  template: `
  <dt-chart [series]="series" [options]="options"></dt-chart>
  `,
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
  series: DtChartSeries = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      color: '#ff0000',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
    {
      name: 'Requests/min',
      id: 'someOtherMetricId',
      color: '#00ff00',
      data: [[1370304000000, 130], [1370390400000, 110]],
    }];
}

@Component({
  selector: 'dt-series-color',
  template: `<div [dtTheme]="theme"><dt-chart [series]="series" [options]="options"></dt-chart></div>`,
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
  series: DtChartSeries = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
    {
      name: 'Requests/min',
      id: 'someOtherMetricId',
      data: [[1370304000000, 130], [1370390400000, 110]],
    }];
}

@Component({
  selector: 'dt-series-color',
  template: `<div dtTheme="purple"><dt-chart [series]="series" [options]="options"></dt-chart></div>`,
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
  series: DtChartSeries = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
    {
      name: 'Requests/min',
      id: 'someOtherMetricId',
      data: [[1370304000000, 130], [1370390400000, 110]],
    },
    {
      name: 'Failed requests',
      id: 'testmetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
    {
      name: 'Successful requests',
      id: 'someOtherTestMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
  ];
}

@Component({
  selector: 'dt-series-color',
  template: `<div dtTheme="purple"><dt-chart [series]="series" [options]="options"></dt-chart></div>`,
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
  series: DtChartSeries = Array.from(Array(CHART_COLOR_PALETTE_ORDERED.length + 1).keys())
    .map((): IndividualSeriesOptions => ({
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    }));
}

@Component({
  selector: 'dt-pie-color-theme',
  template: `<div dtTheme="purple"><dt-chart [series]="series" [options]="options"></dt-chart></div>`,
})
class PieChartThemeColors {
  options: DtChartOptions = {
    chart: {
      type: 'pie',
    },
  };
  series = [{
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
      }],
    }];
}

@Component({
  selector: 'dt-pie-color-theme',
  template: `<div dtTheme="purple"><dt-chart [series]="series" [options]="options"></dt-chart></div>`,
})
class PieChartOrderedColors {
  options: DtChartOptions = {
    chart: {
      type: 'pie',
    },
  };
  series = [{
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
      }],
    }];
}

@Component({
  selector: 'dt-empty-series',
  template: `<dt-chart [series]="series" [options]="options"></dt-chart>`,
})
class EmptySeries {
  options: DtChartOptions = {
    title: {
      text: 'some String',
    },
  };
  series = [];
}
