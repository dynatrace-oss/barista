import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtChartModule, DtChart, DtChartSeries, DtChartOptions } from '@dynatrace/angular-components/chart';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const OBSERVABLE_TIMER = 500;

describe('DtChart', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule],
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
        expect(chartComponent.getSeries().length).toBe(2);
      });
    }));
    it('should display data from observable', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.dynamic'));
      const chartComponent = chartDebugElement.componentInstance;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const series = chartComponent.getSeries();
        expect(series[0].data).toEqual([[1523972199774, 0], [1523972201622, 10]]);
      });
    }));
    it('should update the data if observable fires new data', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.dynamic'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const firstSeries = chartComponent.getSeries();
        fixture.componentInstance.emitTestData();
        fixture.detectChanges();
        const secondSeries = chartComponent.getSeries();
        expect(firstSeries[0].data).toBeDefined();
        expect(secondSeries[0].data).toBeDefined();
        expect(firstSeries[0].data).not.toEqual(secondSeries[0].data);
      });
    }));
    it('provides an array of ids for the series', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.static'));
      const chartComponent = chartDebugElement.componentInstance as DtChart;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const ids = chartComponent.getAllIds();
        expect(ids).toEqual(['someMetricId', 'someOtherMetricId']);
      });
    }));
    it('getAllIds returns undefined if there is no series data', async(() => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      const chartDebugElement = fixture.debugElement.query(By.css('dt-chart.noseries'));
      const chartComponent = chartDebugElement.componentInstance;
      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        const ids = chartComponent.getAllIds();
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
      const subscription = chartComponent.updated.subscribe(spy);
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
      const subscription = chartComponent.updated.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();

      fixture.whenStable().then(() => {
        chartComponent.ngAfterViewInit();
        fixture.componentInstance.seriesStatic = [{
          name: 'Actions/min',
          id: 'someMetricId',
          data: [[1370304000000, 140],[1370390400000, 120]],
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
        expect(spy).toHaveBeenCalled();
      });
    }));
  });
});

/** Test component that contains an DtChart with static data */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-chart class="static" [series]="seriesStatic" [options]="lineOptions"></dt-chart>
    <dt-chart class="dynamic" [series]="seriesDynamic" [options]="columnOptions"></dt-chart>
    <dt-chart class="noseries" [options]="columnOptions"></dt-chart>
    <dt-chart class="staticWithColor" [series]="seriesStaticWithColor" [options]="lineOptions"></dt-chart>
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
  seriesStatic: DtChartSeries = [{
    name: 'Actions/min',
    id: 'someMetricId',
    data: [[1370304000000, 140],[1370390400000, 120]],
  },
  {
    name: 'Requests/min',
    id: 'someOtherMetricId',
    data: [[1370304000000, 130],[1370390400000, 110]],
  }];
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

  seriesStaticWithColor: DtChartSeries = [{
    name: 'Actions/min',
    id: 'someMetricId',
    color: '#ff0000',
    data: [[1370304000000, 140],[1370390400000, 120]],
  },
  {
    name: 'Requests/min',
    id: 'someOtherMetricId',
    color:'#00ff00',
    data: [[1370304000000, 130],[1370390400000, 110]],
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
