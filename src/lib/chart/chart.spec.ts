import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  CHART_COLOR_PALETTES,
  DtChart,
  DtChartModule,
  DtChartOptions,
  DtChartSeries,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { BehaviorSubject } from 'rxjs';

describe('DtChart', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  describe('Data', () => {
    it('should display static data', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.static'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        fixture.detectChanges();
        expect((chartComponent.series as DtChartSeries).length).toBe(1);
      });
    }));

    it('should display data from observable', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.dynamic'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const series = chartComponent.highchartsOptions.series;
        expect(series![0].data).toEqual([[1523972199774, 0], [1523972201622, 10]]);
      });
    }));

    it('should update the data if observable fires new data', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.dynamic'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const firstSeries = chartComponent.highchartsOptions.series;
        fixture.componentInstance.emitTestData();
        fixture.detectChanges();
        const secondSeries = chartComponent.highchartsOptions.series;
        expect(firstSeries![0].data).toBeDefined();
        expect(secondSeries![0].data).toBeDefined();
        expect(firstSeries![0].data).not.toEqual(secondSeries![0].data);
      });
    }));

    it('provides an array of ids for the series', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.staticMulti'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const ids = chartComponent.seriesIds;
        expect(ids).toEqual(['someMetricId', 'someOtherMetricId']);
      });
    }));

    it('seriesIds returns undefined if there is no series data', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.noseries'));
      const chartComponent = chartDebugElement.componentInstance;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const ids = chartComponent.seriesIds;
        expect(ids).toBeUndefined();
      });
    }));
  });

  describe('update event', () => {

    it('should fire updated after the data observable emits a new value', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.dynamic'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        fixture.componentInstance.emitTestData();
        expect(spy).toHaveBeenCalled();
      });
    }));

    it('should fire updated after the static data is updated', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.static'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      const spy = jasmine.createSpy('chart updated spy');
      chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        fixture.componentInstance.seriesStaticSingle = [{
          name: 'Actions/min',
          id: 'someMetricId',
          data: [[1370304000000, 140], [1370390400000, 120]],
        }];
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
      });
    }));
  });

  describe('coloring', () => {
    it('should leave the color of series unchanged if provided', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.staticWithColor'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        fixture.detectChanges();
        const series0NativeElement = chartDebugElement.nativeElement.querySelector('.highcharts-series-0 .highcharts-graph');
        expect(series0NativeElement.getAttribute('stroke')).toEqual('#ff0000');
        const series1NativeElement = chartDebugElement.nativeElement.querySelector('.highcharts-series-1 .highcharts-graph');
        expect(series1NativeElement.getAttribute('stroke')).toEqual('#00ff00');
      });
    }));

    /** Test not working, because DI for Theme does not work correctly in tests right now, check again with new packagr version */
    it('should choose the single color from the colorpalette of the theme for single series', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.themeSingle'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const series0NativeElement = chartDebugElement.nativeElement.querySelector('.highcharts-series-0 .highcharts-graph');
        expect(series0NativeElement.getAttribute('stroke')).toEqual(CHART_COLOR_PALETTES.purple.single);
      });
    }));

    /** Test not working, because DI for Theme does not work correctly in tests right now, check again with new packagr version */
    it('should choose the multi color from the colorpalette of the theme for multi series', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.themeMulti'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const series0NativeElement = chartDebugElement.nativeElement.querySelector('.highcharts-series-0 .highcharts-graph');
        expect(series0NativeElement.getAttribute('stroke')).toEqual(CHART_COLOR_PALETTES.purple.multi[0]);
        const series1NativeElement = chartDebugElement.nativeElement.querySelector('.highcharts-series-1 .highcharts-graph');
        expect(series1NativeElement.getAttribute('stroke')).toEqual(CHART_COLOR_PALETTES.purple.multi[1]);
      });
    }));
  });
});

/** Test component that contains an DtChart with static data */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-chart class="static" [series]="seriesStaticSingle" [options]="lineOptions"></dt-chart>
    <dt-chart class="staticMulti" [series]="seriesStaticMulti" [options]="lineOptions"></dt-chart>
    <dt-chart class="noseries" [options]="columnOptions"></dt-chart>
    <dt-chart class="dynamic" [series]="seriesDynamic" [options]="columnOptions"></dt-chart>
    <div dtTheme="purple">
      <dt-chart class="staticWithColor" [series]="seriesStaticWithColor" [options]="lineOptions"></dt-chart>
      <dt-chart class="themeSingle" [series]="seriesStaticSingle" [options]="lineOptions"></dt-chart>
      <dt-chart class="themeMulti" [series]="seriesStaticMulti" [options]="lineOptions"></dt-chart>
    </div>
  `,
})
class TestApp {
  lineOptions: DtChartOptions = {
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
  seriesStaticSingle: DtChartSeries = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
  ];
  seriesStaticMulti: DtChartSeries = [
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
  columnOptions: DtChartOptions = {
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

  seriesStaticWithColor: DtChartSeries = [
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

  seriesDynamic = new BehaviorSubject([{
    name: 'Actions/min',
    id: 'someid',
    data: [[1523972199774, 0], [1523972201622, 10]],
  }]);

  emitTestData(): void {
    this.seriesDynamic.next([{
      name: 'Actions/min',
      id: 'someid',
      data: [[1523972199774, 20], [1523972201622, 30]],
    }]);
  }
}
