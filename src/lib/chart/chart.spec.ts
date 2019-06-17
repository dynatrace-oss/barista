// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtChart,
  DtChartModule,
  DtChartOptions,
  DtChartSeries,
  DtThemingModule,
  DT_CHART_COLOR_PALETTES,
  DT_CHART_COLOR_PALETTE_ORDERED,
} from '@dynatrace/angular-components';
import { BehaviorSubject } from 'rxjs';
import { IndividualSeriesOptions } from 'highcharts';
import { createComponent } from '../../testing/create-component';

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
        Loading,
        LoadingText,
      ],
    });

    TestBed.compileComponents();
  }));

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
      expect(series![0].data).toEqual([[1523972199774, 0], [1523972201622, 10]]);
    });

    it('should update the data if observable fires new data', () => {
      const fixture = createComponent(DynamicSeries);
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
      // tslint:disable-next-line: no-unbound-method
      expect(tooltip!.formatter).toBeDefined();
      // bind dummy seriespoint to be able to call the formatter function
      expect(tooltip!.formatter!.bind({series: { name: 'somename'}})()).toEqual(false);
    });

    it('should update the options at runtime', () => {
      const fixture = createComponent(SeriesSingle);
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
      // tslint:disable-next-line: no-unbound-method
      expect(tooltip!.formatter).toBeDefined();
      // bind dummy seriespoint to be able to call the formatter function
      expect(tooltip!.formatter!.bind({series: { name: 'somename'}})()).toEqual(false);
    });

    it('should work with empty series array', () => {
      expect(() => createComponent(EmptySeries)).not.toThrowError('Cannot convert undefined or null to object');
      expect(() => createComponent(EmptySeries)).not.toThrow(TypeError);
    });
  });

  describe('update event', () => {

    it('should fire updated after the data observable emits a new value', () => {
      const fixture = createComponent(DynamicSeries);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.componentInstance.emitTestData();
      expect(spy).toHaveBeenCalled();
    });

    it('should fire updated after the static data is updated', () => {
      const fixture = createComponent(SeriesSingle);
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
      const fixture = createComponent(SeriesColor);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      expect(chartComponent.highchartsOptions.series![0].color).toBe('#ff0000');
      expect(chartComponent.highchartsOptions.series![1].color).toBe('#00ff00');
    });

    it('should choose the colors from the colorpalette of the theme for up to 3 series', () => {
      const fixture = createComponent(SeriesTheme);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(DT_CHART_COLOR_PALETTES.purple);
    });

    it('should choose the colors from the ordered palette for more than 3 series', () => {
      const fixture = createComponent(SeriesMoreThanTheme);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(DT_CHART_COLOR_PALETTE_ORDERED);
    });

    it('should update colors when the theme changes', () => {
      const fixture = createComponent(SeriesTheme);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(DT_CHART_COLOR_PALETTES.purple);
      fixture.componentInstance.theme = 'royalblue';
      fixture.detectChanges();
      expect(chartComponent.highchartsOptions.colors).toEqual(DT_CHART_COLOR_PALETTES.royalblue);
    });

    it('should choose the correct colors for pie charts with less than 4 data slices', () => {
      const fixture = createComponent(PieChartThemeColors);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(DT_CHART_COLOR_PALETTES.purple);
    });

    it('should choose the correct colors for pie charts with more than 3 data slices', () => {
      const fixture = createComponent(PieChartOrderedColors);
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      expect(chartComponent.highchartsOptions.colors).toEqual(DT_CHART_COLOR_PALETTE_ORDERED);
    });
  });

  describe('loading', () => {
    it('should display the loading indicator if no series has been provided', () => {
      const fixture = createComponent(Loading);
      const loadingDebugElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator'));

      expect(loadingDebugElement).toBeDefined('Loading indicater should be visible');
      expect(loadingDebugElement.nativeElement).toBeDefined('Loading indicater should be visible');
    });

    it('should display the loading indicator if the series array is empty', () => {
      const fixture = TestBed.createComponent(Loading);
      fixture.componentInstance.series = [];
      fixture.detectChanges();
      const loadingDebugElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator'));

      expect(loadingDebugElement).toBeDefined('Loading indicater should be visible');
      expect(loadingDebugElement.nativeElement).toBeDefined('Loading indicater should be visible');
    });

    it('should not display the loading indicator if a series has been provided', () => {
      const fixture = TestBed.createComponent(Loading);
      fixture.componentInstance.series = [{
        name: 'Actions/min',
        id: 'someid',
        data: [[1523972199774, 0], [1523972201622, 10]],
      }];
      fixture.detectChanges();
      const loadingDebugElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator'));

      expect(loadingDebugElement).toBeNull('Loading indicator should be hidden');
    });

    it('should hide the loading indicator once a series has been provided', () => {
      const fixture = createComponent(Loading);
      let loadingDebugElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator'));
      expect(loadingDebugElement).toBeDefined('Loading indicater should be visible');
      expect(loadingDebugElement.nativeElement).toBeDefined('Loading indicater should be visible');

      fixture.componentInstance.series = [{}];
      fixture.detectChanges();

      loadingDebugElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator'));
      expect(loadingDebugElement).toBeNull('Loading indicator should be hidden');
    });

    it('should not have a loading text as default', () => {
      const fixture = createComponent(LoadingText);
      const loadingElement: HTMLElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator')).nativeElement;
      expect(loadingElement.textContent).toBe('');
    });

    it('should able to set a loading text', () => {
      const fixture = TestBed.createComponent(LoadingText);
      fixture.componentInstance.loadingText = 'Loading';
      fixture.detectChanges();

      const loadingElement: HTMLElement = fixture.debugElement.query(By.css('.dt-chart-loading-indicator')).nativeElement;
      expect(loadingElement.textContent).toBe('Loading');
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
  series: DtChartSeries[] = [
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
  series: DtChartSeries[] = [
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
  series: DtChartSeries[] = [
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
  series: DtChartSeries[] = [
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
  series: DtChartSeries[] = [
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
  series: DtChartSeries[] = Array.from(Array(DT_CHART_COLOR_PALETTE_ORDERED.length + 1).keys())
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

@Component({
  selector: 'dt-empty-series',
  template: `<dt-chart [series]="series" [options]="options"></dt-chart>`,
})
class Loading {
  // tslint:disable-next-line:no-any
  series: any[] | undefined;

  options: DtChartOptions = {};
}

@Component({
  selector: 'dt-empty-series',
  template: `<dt-chart [loading-text]="loadingText" [series]="[]"></dt-chart>`,
})
class LoadingText {
  loadingText: string;
}
