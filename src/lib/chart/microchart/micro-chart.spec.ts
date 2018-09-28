import { Component, Type} from '@angular/core';
import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtChartOptions, DtChartSeries} from '../chart';
import { DtMicroChart } from './micro-chart';
import { Colors, DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtChartModule } from '../chart-module';
import objectContaining = jasmine.objectContaining;
import { AxisOptions, DataPoint } from 'highcharts';
import { BehaviorSubject } from 'rxjs';

// tslint:disable:no-magic-numbers

describe('DtMicroChart', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [
        Series, DefinedAxis, DefinedAxisArray, ThemeDynamic, ThemeFixed, NoOptions, NoSeries, Nothing, DynamicSeries,
      ],
    }).compileComponents();
  }));

  const setupTestCase = <T>(componentType: Type<T>):
    { fixture: ComponentFixture<T>; microChartComponent: DtMicroChart } => {
    const fixture = TestBed.createComponent(componentType);
    const microChartDebugElement = fixture.debugElement.query(By.directive(DtMicroChart));
    const microChartComponent = microChartDebugElement.componentInstance as DtMicroChart;

    return {
      fixture,
      microChartComponent,
    };
  };

  describe('axis are not visible', () => {
    it('if not defined', () => {
      const {fixture, microChartComponent} = setupTestCase(Series);
      fixture.detectChanges();

      const options = microChartComponent.highchartsOptions;

      expect(options.xAxis).toBeDefined();
      expect(options.yAxis).toBeDefined();
      expect((options.xAxis as AxisOptions).visible).toBe(false);
      expect((options.yAxis as AxisOptions).visible).toBe(false);
    });

    it('if defined', () => {
      const {fixture, microChartComponent} = setupTestCase(DefinedAxis);
      fixture.detectChanges();

      const options = microChartComponent.highchartsOptions;

      expect(options.xAxis).toBeDefined();
      expect(options.yAxis).toBeDefined();
      expect((options.xAxis as AxisOptions).visible).toBe(false);
      expect((options.yAxis as AxisOptions).visible).toBe(false);
    });

    it('if defined as array', () => {
      const {fixture, microChartComponent} = setupTestCase(DefinedAxisArray);
      fixture.detectChanges();

      const options = microChartComponent.highchartsOptions;

      expect(options.xAxis).toBeDefined();
      expect(options.yAxis).toBeDefined();
      expect((options.xAxis as AxisOptions[])[0].visible).toBe(false);
      expect((options.yAxis as AxisOptions[])[0].visible).toBe(false);
    });

    it('if defined as empty array', () => {
      const {fixture, microChartComponent} = setupTestCase(DefinedAxisArray);
      fixture.detectChanges();

      const options = microChartComponent.highchartsOptions;

      expect(options.xAxis).toBeDefined();
      expect(options.yAxis).toBeDefined();
      expect((options.xAxis as AxisOptions[])[0].visible).toBe(false);
      expect((options.yAxis as AxisOptions[])[0].visible).toBe(false);
    });

  });

  describe('chart is colored', () => {
    it('sets default colors if no theme on parent is given', () => {
      const {fixture, microChartComponent} = setupTestCase(Series);
      fixture.detectChanges();

      expect(microChartComponent.highchartsOptions.colors).toBeDefined();
    });

    it('sets colors based on the current theme', () => {
      const {fixture, microChartComponent} = setupTestCase(ThemeFixed);
      fixture.detectChanges();

      const colors = microChartComponent.highchartsOptions.colors;

      expect(colors).toBeDefined();
      expect(colors).toEqual([Colors.ROYALBLUE_400]);
    });

    it('sets colors after theme update', () => {
      const {fixture, microChartComponent} = setupTestCase(ThemeDynamic);
      fixture.detectChanges();

      fixture.componentInstance.theme = 'purple';
      fixture.detectChanges();
      const colors = microChartComponent.highchartsOptions.colors;
      expect(colors).toBeDefined();
      expect(colors).toEqual([Colors.PURPLE_400]);
    });
  });

  describe('data', () => {
    it('renders without options given', () => {
      const {fixture} = setupTestCase(NoOptions);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('does not crash without series', () => {
      const {fixture} = setupTestCase(NoSeries);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('does not crash with nothing', () => {
      const {fixture} = setupTestCase(Nothing);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should convert static data', () => {
      const {fixture, microChartComponent} = setupTestCase(Series);
      fixture.detectChanges();

      const series = microChartComponent.highchartsOptions.series as DtChartSeries[];

      expect(series.length).toEqual(1);
      expect(series[0].data).toBeDefined();
      expect(series[0].data!.length).toBe(2);
      expect(series[0].data![0]).toEqual(objectContaining({x: 1, y: 140}));
      expect(series[0].data![1]).toEqual(objectContaining({x: 2, y: 120}));
    });

    it('does mark highest and lowest point', () => {
      const {fixture, microChartComponent} = setupTestCase(Series);
      fixture.detectChanges();

      const data = microChartComponent.highchartsOptions.series![0]!.data as DataPoint[];

      expect(data[0].dataLabels).toEqual(objectContaining({verticalAlign: 'bottom', enabled: true}));
      expect(data[1].dataLabels).toEqual(objectContaining({verticalAlign: 'top', enabled: true}));
    });

    it('fetches metric ids', () => {
      const {fixture, microChartComponent} = setupTestCase(Series);
      fixture.detectChanges();

      expect(microChartComponent.seriesIds).toEqual(['someMetricId']);
    });

    it('converts dynamic data', () => {
      const {fixture, microChartComponent} = setupTestCase(DynamicSeries);
      let data;

      fixture.detectChanges();
      expect(microChartComponent.seriesIds).toEqual(['someId']);
      data = microChartComponent.highchartsOptions.series![0].data as DataPoint[];
      expect(data[0]).toEqual(objectContaining({x: 1, y: 0}));
      expect(data[1]).toEqual(objectContaining({x: 2, y: 10}));

      fixture.componentInstance.emitTestData();
      expect(microChartComponent.seriesIds).toEqual(['someOtherId']);
      data = microChartComponent.highchartsOptions.series![0].data as DataPoint[];
      expect(data[0]).toEqual(objectContaining({x: 1, y: 20}));
      expect(data[1]).toEqual(objectContaining({x: 2, y: 30}));
    });
  });

  describe('validation', () => {
    it('rejects not allowed types', () => {
      const {fixture} = setupTestCase(Series);
      const options = fixture.componentInstance.options;
      options.chart = {};
      const cases = [ 'pie', 'funnel', 'bar', 'arearange' ];

      cases.forEach((type) => {
        options.chart!.type = type;
        expect(() => {
          fixture.detectChanges();
        }).toThrowError();
      });
    });

    it('allowed types do not throw an error', () => {
      const {fixture} = setupTestCase(Series);
      const options = fixture.componentInstance.options;
      options.chart = {};
      const cases = ['line', 'column', undefined];

      cases.forEach((type) => {
        options.chart!.type = type;
        expect(() => {
          fixture.detectChanges();
        }).not.toThrowError();
      });
    });
  });
});

@Component({
  selector: 'dt-series-single',
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
})
class Series {
  options: DtChartOptions = {};
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-defined-axis',
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
})
class DefinedAxis {
  options: DtChartOptions = {xAxis: {}, yAxis: {}};
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-defined-axis-array',
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
})
class DefinedAxisArray {
  options: DtChartOptions = {xAxis: [{}], yAxis: [{}]};
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-defined-axis-array',
  template: '<dt-micro-chart [series]="series" [options]="options"></dt-micro-chart>',
})
class DefinedAxisEmptyArray {
  options: DtChartOptions = {xAxis: [], yAxis: []};
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-theme-dynamic',
  template: '<div [dtTheme]="theme"><dt-micro-chart [series]="series" [options]="options"></dt-micro-chart></div>',
})
class ThemeDynamic {
  theme = 'blue';
  options: DtChartOptions = {};
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-theme-fixed',
  template: '<div dtTheme="blue"><dt-micro-chart [series]="series" [options]="options"></dt-micro-chart></div>',
})
class ThemeFixed {
  options: DtChartOptions = {};
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-no-options',
  template: '<dt-micro-chart [series]="series"></dt-micro-chart>',
})
class NoOptions {
  series: DtChartSeries = {
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1, 140], [2, 120]],
  };
}

@Component({
  selector: 'dt-no-series',
  template: '<dt-micro-chart [options]="options"></dt-micro-chart>',
})
class NoSeries {
  options = {};
}

@Component({
  selector: 'dt-nothing',
  template: '<dt-micro-chart></dt-micro-chart>',
})
class Nothing {}

@Component({
  selector: 'dt-dynamic-series',
  template: '<dt-micro-chart [series]="series"></dt-micro-chart>',
})
class DynamicSeries {
  series = new BehaviorSubject({
    name: 'Actions/min',
    id: 'someId',
    data: [[1, 0], [2, 10]],
  });

  emitTestData(): void {
    this.series.next({
      name: 'Actions/min',
      id: 'someOtherId',
      data: [[1, 20], [2, 30]],
    });
  }
}
