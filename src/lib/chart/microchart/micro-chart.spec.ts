import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartOptions, DtChartSeries } from '../chart';
import { BehaviorSubject } from 'rxjs';
import { DtMicroChart } from './micro-chart';
import { MICROCHART_PALETTES } from './micro-chart-colorizer';
import { DtThemingModule} from '@dynatrace/angular-components/theming';
import { DtChartModule } from '../chart-module';

// tslint:disable:no-magic-numbers

describe('DtMicroChart', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [
        SeriesSingle,
        SeriesMulti,
        NoSeries,
        DynamicSeries,
        SeriesColor,
        SeriesTheme],
    });

    TestBed.compileComponents();
  }));

  describe('Data', () => {
    it('should display static data', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;

      fixture.detectChanges();
      expect((chartComponent.series as DtChartSeries).length).toBe(1);
    });

    it('should display data from observable', () => {
      const fixture = TestBed.createComponent(DynamicSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
      const series = chartComponent.highchartsOptions.series;

      expect(series![0].data![0]).toEqual(jasmine.objectContaining({x: 1523972199774, y: 0}));
      expect(series![0].data![1]).toEqual(jasmine.objectContaining({x: 1523972201622, y: 10}));
    });

    it('should update the data if observable fires new data', () => {
      const fixture = TestBed.createComponent(DynamicSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
      const firstSeries = chartComponent.highchartsOptions.series;
      fixture.componentInstance.emitTestData();
      fixture.detectChanges();
      const secondSeries = chartComponent.highchartsOptions.series;
      expect(firstSeries![0].data).toBeDefined();
      expect(secondSeries![0].data).toBeDefined();
      expect(firstSeries![0].data).not.toEqual(secondSeries![0].data);
    });

    it('should throw an error with multiple series', () => {
      expect(() => {
        const fixture = TestBed.createComponent(SeriesMulti);
        fixture.detectChanges();
      }).toThrow(new Error('You are using 2 series. Supported number of series: 1'));
    });

    it('should throw an error with unsupported series', () => {
      expect(() => {
        const fixture = TestBed.createComponent(SeriesSingle);
        fixture.detectChanges();
        fixture.componentInstance.options = { chart: { type: 'pie' }};
        fixture.detectChanges();
      }).toThrow(new Error('Series type unsupported: pie'));
    });

    it('provides an array of ids for the series', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
      const ids = chartComponent.seriesIds;
      expect(ids).toEqual(['someMetricId']);
    });

    it('seriesIds returns undefined if there is no series data', () => {
      const fixture = TestBed.createComponent(NoSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance;
      const ids = chartComponent.seriesIds;
      expect(ids).toBeUndefined();
    });

    it('should wrap the tooltip', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
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
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();
      fixture.componentInstance.options = {
        chart: {
          type: 'column',
        },
      };
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should wrap the tooltip after changing the options at runtime', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
      const newOptions = {
        chart: {
          type: 'column',
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
  });

  describe('update event', () => {

    it('should fire updated after the data observable emits a new value', () => {
      const fixture = TestBed.createComponent(DynamicSeries);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;

      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.componentInstance.emitTestData();
      expect(spy).toHaveBeenCalled();
    });

    it('should fire updated after the static data is updated', () => {
      const fixture = TestBed.createComponent(SeriesSingle);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;

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
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;

      expect(chartComponent.highchartsOptions.series![0].color).toBe('#ff0000');
    });

    it('should update colors when the theme changes', () => {
      const fixture = TestBed.createComponent(SeriesTheme);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-micro-chart'));
      const chartComponent = chartDebugElement.componentInstance as DtMicroChart;
      expect(chartComponent.highchartsOptions.colors).toEqual([MICROCHART_PALETTES.purple.primary]);
      fixture.componentInstance.theme = 'royalblue';
      fixture.detectChanges();
      expect(chartComponent.highchartsOptions.colors).toEqual([MICROCHART_PALETTES.royalblue.primary]);
    });
  });
});

/** Test component that contains an DtChart with static data */
@Component({
  selector: 'dt-series-single',
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
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
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
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
  template: '<dt-micro-chart [options]="options"></dt-micro-chart>',
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
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
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
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
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
    }];
}

@Component({
  selector: 'dt-series-color',
  template: '<div [dtTheme]="theme"><dt-micro-chart [series]="series" [options]="options"></dt-micro-chart></div>',
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
    }];
}
