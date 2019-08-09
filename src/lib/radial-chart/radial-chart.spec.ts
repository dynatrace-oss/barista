// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, QueryList, ViewChildren } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DT_CHART_COLOR_PALETTE_ORDERED } from '@dynatrace/angular-components/chart';
import {
  DtRadialChartModule,
  DtRadialChartSeries,
} from '@dynatrace/angular-components/radial-chart';
import { createComponent } from '../../testing/create-component';

interface DemoChartData {
  name: string;
  value: number;
  color?: string;
}

describe('DtRadialChart', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtRadialChartModule],
      declarations: [PieChart],
    });

    TestBed.compileComponents();
  }));

  describe('dt-radial-chart', () => {
    let fixture: ComponentFixture<PieChart>;
    let chartSVG: SVGElement;
    let chartSeries: QueryList<DtRadialChartSeries>;
    let chartComponent: PieChart;
    let fixtureNative: HTMLElement;
    const testSeriesData: DemoChartData = {
      name: 'Testseries',
      value: 10,
      color: '#123456',
    };

    beforeEach(() => {
      fixture = createComponent(PieChart);
      chartComponent = fixture.componentInstance;
      fixtureNative = fixture.debugElement.nativeElement;
      chartSVG = fixtureNative.querySelector('svg') as SVGElement;
      chartSeries = chartComponent.series;
      fixture.detectChanges();
    });

    it('should render the correct amount of data series', () => {
      const seriesChildrenLength = chartSeries.length;
      expect(seriesChildrenLength).toBe(4);
    });

    it('should render one newly added series', () => {
      chartComponent._chartSeries.push(testSeriesData);
      fixture.detectChanges();
      const seriesChildrenLength = chartSeries.length;
      expect(seriesChildrenLength).toBe(5);
    });

    it('should remove one series', () => {
      chartComponent._chartSeries = chartComponent._chartSeries.slice(0, -1);
      fixture.detectChanges();
      const seriesChildrenLength = chartSeries.length;
      expect(seriesChildrenLength).toBe(3);
    });

    describe('dt-radial-chart svg data', () => {
      it('should render the correct amount of paths', () => {
        const allSeriesPaths = chartSVG.querySelectorAll('path');
        expect(allSeriesPaths.length).toBe(4);
      });

      it('should render the correct amount of paths after adding a series', () => {
        chartComponent._chartSeries.push(testSeriesData);
        fixture.detectChanges();
        const allSeriesPaths = chartSVG.querySelectorAll('path');
        expect(allSeriesPaths.length).toBe(5);
      });

      it('should render the correct amount of paths after removing a series', () => {
        chartComponent._chartSeries = chartComponent._chartSeries.slice(0, -1);
        fixture.detectChanges();
        const allSeriesPaths = chartSVG.querySelectorAll('path');
        expect(allSeriesPaths.length).toBe(3);
      });
    });

    describe('dt-radial-chart max value', () => {
      const backgroundPathSelector = 'path[fill="#f8f8f8"]';

      it('should not render a background when no maxValue is given for the chart', () => {
        const backgroundPath = chartSVG.querySelector(backgroundPathSelector);
        expect(backgroundPath).toBeNull();
      });

      it('should not render a background when no maxValue === sumSeriesValues', () => {
        const sumSeriesValues = chartComponent._chartSeries.reduce(
          (agg, cur) => agg + cur.value,
          0,
        );
        chartComponent._maxValue = sumSeriesValues;
        fixture.detectChanges();
        const backgroundPath = chartSVG.querySelector(backgroundPathSelector);
        expect(backgroundPath).toBeNull();
      });

      it('should render a background path when maxValue > sumSeriesValues', () => {
        chartComponent._maxValue = 100;
        fixture.detectChanges();
        const backgroundPath = chartSVG.querySelector(backgroundPathSelector);
        expect(backgroundPath).not.toBeNull();
      });

      it('should not render a background path when because of a newly added series maxValue < sumSeriesValues', () => {
        chartComponent._maxValue = 95;
        chartComponent._chartSeries.push(testSeriesData);
        fixture.detectChanges();
        const backgroundPath = chartSVG.querySelector(backgroundPathSelector);
        expect(backgroundPath).toBeNull();
      });

      it('should not render a background path when maxValue < sumSeriesValues', () => {
        chartComponent._maxValue = 50;
        fixture.detectChanges();
        const backgroundPath = chartSVG.querySelector(backgroundPathSelector);
        expect(backgroundPath).toBeNull();
      });
    });

    describe('dt-radial-chart-series colors', () => {
      it('should use the sorted chart colors when no color is given', () => {
        const seriesPaths = chartSVG.querySelectorAll(
          '.dt-radial-chart-series',
        );
        expect(seriesPaths.length).toBe(4);
        expect(seriesPaths[0].getAttribute('fill')).toBe(
          DT_CHART_COLOR_PALETTE_ORDERED[0],
        );
        expect(seriesPaths[1].getAttribute('fill')).toBe(
          DT_CHART_COLOR_PALETTE_ORDERED[1],
        );
        expect(seriesPaths[2].getAttribute('fill')).toBe(
          DT_CHART_COLOR_PALETTE_ORDERED[2],
        );
        expect(seriesPaths[3].getAttribute('fill')).toBe(
          DT_CHART_COLOR_PALETTE_ORDERED[3],
        );
      });

      it('should use the given color instead of the sorted chart color palette', () => {
        chartComponent._chartSeries.push(testSeriesData);
        fixture.detectChanges();
        const seriesPaths = chartSVG.querySelectorAll(
          '.dt-radial-chart-series',
        );
        expect(seriesPaths[4].getAttribute('fill')).not.toBe(
          DT_CHART_COLOR_PALETTE_ORDERED[4],
        );
        expect(seriesPaths[4].getAttribute('fill')).toBe('#123456');
      });
    });

    describe('dt-radial-chart-series aria-label', () => {
      it('should render an aria-label containing the series name, current value and total value', () => {
        const seriesPaths = chartSVG.querySelectorAll(
          '.dt-radial-chart-series',
        );
        expect(seriesPaths[0].getAttribute('aria-label')).toBe(
          'Chrome: 43 of 89',
        );
        expect(seriesPaths[2].getAttribute('aria-label')).toBe(
          'Firefox: 15 of 89',
        );
      });

      it('should update aria-labels when a new series is added', () => {
        chartComponent._chartSeries.push(testSeriesData);
        fixture.detectChanges();
        const seriesPaths = chartSVG.querySelectorAll(
          '.dt-radial-chart-series',
        );
        expect(seriesPaths[0].getAttribute('aria-label')).toBe(
          'Chrome: 43 of 99',
        );
        expect(seriesPaths[2].getAttribute('aria-label')).toBe(
          'Firefox: 15 of 99',
        );
        expect(seriesPaths[4].getAttribute('aria-label')).toBe(
          'Testseries: 10 of 99',
        );
      });

      it('should update aria-labels when a series is removed', () => {
        chartComponent._chartSeries = chartComponent._chartSeries.slice(0, -1);
        fixture.detectChanges();
        const seriesPaths = chartSVG.querySelectorAll(
          '.dt-radial-chart-series',
        );
        expect(seriesPaths[0].getAttribute('aria-label')).toBe(
          'Chrome: 43 of 80',
        );
      });

      it('should update aria-labels when a max value is set', () => {
        chartComponent._maxValue = 100;
        fixture.detectChanges();
        const seriesPaths = chartSVG.querySelectorAll(
          '.dt-radial-chart-series',
        );
        expect(seriesPaths[0].getAttribute('aria-label')).toBe(
          'Chrome: 43 of 100',
        );
      });
    });
  });
});

/** Test component that contains a DtRadialChart. */
@Component({
  selector: 'dt-pie-chart',
  template: `
    <dt-radial-chart [maxValue]="_maxValue">
      <dt-radial-chart-series
        *ngFor="let s of _chartSeries"
        [value]="s.value"
        [name]="s.name"
        [color]="s.color"
      >
      </dt-radial-chart-series>
    </dt-radial-chart>
  `,
})
class PieChart {
  @ViewChildren(DtRadialChartSeries) series: QueryList<DtRadialChartSeries>;

  _chartSeries: DemoChartData[] = [
    {
      name: 'Chrome',
      value: 43,
    },
    {
      name: 'Safari',
      value: 22,
    },
    {
      name: 'Firefox',
      value: 15,
    },
    {
      name: 'Microsoft Edge',
      value: 9,
    },
  ];

  _maxValue: number | null = null;
}
