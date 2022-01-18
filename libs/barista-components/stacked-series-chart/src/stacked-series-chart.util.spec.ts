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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DtTheme,
  DtThemingModule,
  DT_CHART_COLOR_PALETTES,
  DT_CHART_COLOR_PALETTE_ORDERED,
} from '@dynatrace/barista-components/theming';
import {
  stackedSeriesChartDemoDataCoffee,
  stackedSeriesChartDemoDataShows,
} from './stacked-series-chart.mock';
import {
  fillSeries,
  getLegends,
  getSeriesWithState,
  getTotalMaxValue,
  updateNodesVisibility,
  DtStackedSeriesChartFilledSeries,
} from './stacked-series-chart.util';

describe('StackedSeriesChart util', () => {
  const series = stackedSeriesChartDemoDataCoffee;
  const legends = getLegends(series);
  const filledSeries = fillSeries(series, legends);
  const palette = DT_CHART_COLOR_PALETTE_ORDERED;

  describe('fillSeries', () => {
    it('should fill the series and nodes', () => {
      const expected: DtStackedSeriesChartFilledSeries[] = [
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Espresso is 1 out of 1',
              color: palette[0],
              origin: { label: 'Coffee', value: 1 },
              selected: false,
              seriesOrigin: series[0],
              valueRelative: 1,
              visible: true,
            },
          ],
          origin: series[0],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Macchiato is 2 out of 3',
              color: palette[0],
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.6666666666666666,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Macchiato is 1 out of 3',
              color: palette[1],
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.3333333333333333,
              visible: true,
            },
          ],
          origin: series[1],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Americano is 2 out of 5',
              color: palette[0],
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Water in Americano is 3 out of 5',
              color: palette[2],
              origin: { label: 'Water', value: 3 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.6,
              visible: true,
            },
          ],
          origin: series[2],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Mocha is 2 out of 5',
              color: palette[0],
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Chocolate in Mocha is 2 out of 5',
              color: palette[3],
              origin: { label: 'Chocolate', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Mocha is 1 out of 5',
              color: palette[1],
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.2,
              visible: true,
            },
          ],
          origin: series[3],
          selected: false,
        },
      ];
      const actual = fillSeries(series, legends);

      expect(actual).toEqual(expected);
    });
  });

  describe('getSeriesWithState', () => {
    it('should return the nodes with filled state', () => {
      const expected: DtStackedSeriesChartFilledSeries[] = [
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Espresso is 1 out of 1',
              color: palette[0],
              length: '100%',
              origin: { label: 'Coffee', value: 1 },
              selected: false,
              seriesOrigin: series[0],
              valueRelative: 1,
              visible: true,
            },
          ],
          origin: series[0],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Macchiato is 2 out of 3',
              color: palette[0],
              length: '66.66666666666667%',
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.6666666666666666,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Macchiato is 1 out of 3',
              color: palette[1],
              length: '33.333333333333336%',
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.3333333333333333,
              visible: true,
            },
          ],
          origin: series[1],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Americano is 2 out of 5',
              color: palette[0],
              length: '40%',
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Water in Americano is 3 out of 5',
              color: palette[2],
              length: '60%',
              origin: { label: 'Water', value: 3 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.6,
              visible: true,
            },
          ],
          origin: series[2],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Mocha is 2 out of 5',
              color: palette[0],
              length: '40%',
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Chocolate in Mocha is 2 out of 5',
              color: palette[3],
              length: '40%',
              origin: { label: 'Chocolate', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Mocha is 1 out of 5',
              color: palette[1],
              length: '20%',
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.2,
              visible: true,
            },
          ],
          origin: series[3],
          selected: false,
        },
      ];
      const actual = getSeriesWithState(filledSeries, []);

      expect(actual).toEqual(expected);
    });

    it('should return the nodes with filled state WHEN one is selected', () => {
      const expected: DtStackedSeriesChartFilledSeries[] = [
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Espresso is 1 out of 1',
              color: palette[0],
              length: '100%',
              origin: { label: 'Coffee', value: 1 },
              selected: false,
              seriesOrigin: series[0],
              valueRelative: 1,
              visible: true,
            },
          ],
          origin: series[0],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Macchiato is 2 out of 3',
              color: palette[0],
              length: '66.66666666666667%',
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.6666666666666666,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Macchiato is 1 out of 3',
              color: palette[1],
              length: '33.333333333333336%',
              origin: { label: 'Milk', value: 1 },
              selected: true,
              seriesOrigin: series[1],
              valueRelative: 0.3333333333333333,
              visible: true,
            },
          ],
          origin: series[1],
          selected: true,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Americano is 2 out of 5',
              color: palette[0],
              length: '40%',
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Water in Americano is 3 out of 5',
              color: palette[2],
              length: '60%',
              origin: { label: 'Water', value: 3 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.6,
              visible: true,
            },
          ],
          origin: series[2],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Mocha is 2 out of 5',
              color: palette[0],
              length: '40%',
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Chocolate in Mocha is 2 out of 5',
              color: palette[3],
              length: '40%',
              origin: { label: 'Chocolate', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Mocha is 1 out of 5',
              color: palette[1],
              length: '20%',
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.2,
              visible: true,
            },
          ],
          origin: series[3],
          selected: false,
        },
      ];
      const actual = getSeriesWithState(filledSeries, [
        series[1],
        series[1].nodes[1],
      ]);

      expect(actual).toEqual(expected);
    });
  });

  describe('updateNodesVisibility', () => {
    it('should match legend visibility to nodes visibility', () => {
      const expected: DtStackedSeriesChartFilledSeries[] = [
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Espresso is 1 out of 1',
              color: palette[0],
              origin: { label: 'Coffee', value: 1 },
              selected: false,
              seriesOrigin: series[0],
              valueRelative: 1,
              visible: false,
            },
          ],
          origin: series[0],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Macchiato is 2 out of 3',
              color: palette[0],
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.6666666666666666,
              visible: false,
            },
            {
              ariaLabel: 'Milk in Macchiato is 1 out of 3',
              color: palette[1],
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[1],
              valueRelative: 0.3333333333333333,
              visible: true,
            },
          ],
          origin: series[1],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Americano is 2 out of 5',
              color: palette[0],
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.4,
              visible: false,
            },
            {
              ariaLabel: 'Water in Americano is 3 out of 5',
              color: palette[2],
              origin: { label: 'Water', value: 3 },
              selected: false,
              seriesOrigin: series[2],
              valueRelative: 0.6,
              visible: true,
            },
          ],
          origin: series[2],
          selected: false,
        },
        {
          nodes: [
            {
              ariaLabel: 'Coffee in Mocha is 2 out of 5',
              color: palette[0],
              origin: { label: 'Coffee', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: false,
            },
            {
              ariaLabel: 'Chocolate in Mocha is 2 out of 5',
              color: palette[3],
              origin: { label: 'Chocolate', value: 2 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.4,
              visible: true,
            },
            {
              ariaLabel: 'Milk in Mocha is 1 out of 5',
              color: palette[1],
              origin: { label: 'Milk', value: 1 },
              selected: false,
              seriesOrigin: series[3],
              valueRelative: 0.2,
              visible: true,
            },
          ],
          origin: series[3],
          selected: false,
        },
      ];

      const alteredLegends = legends.slice();
      alteredLegends[0].visible = false;
      const actual = updateNodesVisibility(filledSeries, alteredLegends);

      expect(actual).toEqual(expected);
    });
  });

  describe('getLegends', () => {
    it('should return an array of legends', () => {
      const expected = [
        { color: palette[0], label: 'Coffee', visible: true },
        { color: palette[1], label: 'Milk', visible: true },
        { color: palette[2], label: 'Water', visible: true },
        { color: palette[3], label: 'Chocolate', visible: true },
      ];
      const legendList = getLegends(series);

      expect(legendList).toEqual(expected);
    });

    it('should keep the assigned color', () => {
      const expected = [
        {
          color: stackedSeriesChartDemoDataShows[0].nodes[0].color,
          label: 'Season 1',
          visible: true,
        },
        {
          color: stackedSeriesChartDemoDataShows[0].nodes[1].color,
          label: 'Season 2',
          visible: true,
        },
        {
          color: stackedSeriesChartDemoDataShows[0].nodes[2].color,
          label: 'Season 3',
          visible: true,
        },
        {
          color: stackedSeriesChartDemoDataShows[0].nodes[3].color,
          label: 'Season 4',
          visible: true,
        },
        {
          color: stackedSeriesChartDemoDataShows[0].nodes[4].color,
          label: 'Season 5',
          visible: true,
        },
        {
          color: stackedSeriesChartDemoDataShows[0].nodes[5].color,
          label: 'Season 6',
          visible: true,
        },
      ];
      const legendList = getLegends(stackedSeriesChartDemoDataShows);

      expect(legendList).toEqual(expected);
    });

    it('should get the colors from theme if less than 4 items', () => {
      TestBed.configureTestingModule({
        imports: [DtThemingModule],
        declarations: [TestApp],
      }).compileComponents();
      const fixture: ComponentFixture<TestApp> =
        TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const expected = [
        {
          color: DT_CHART_COLOR_PALETTES.royalblue[0],
          label: 'Coffee',
          visible: true,
        },
        {
          color: DT_CHART_COLOR_PALETTES.royalblue[1],
          label: 'Chocolate',
          visible: true,
        },
        {
          color: DT_CHART_COLOR_PALETTES.royalblue[2],
          label: 'Milk',
          visible: true,
        },
      ];
      const legendList = getLegends(
        [stackedSeriesChartDemoDataCoffee[3]],
        fixture.componentInstance.dtThemeInstance,
      );

      expect(legendList).toEqual(expected);
    });
  });

  describe('getTotalMaxValue', () => {
    it("should return rounded sum of values for node's nodes higher to the max value", () => {
      const legendList = getLegends(stackedSeriesChartDemoDataShows);
      const seriesList = fillSeries(
        stackedSeriesChartDemoDataShows,
        legendList,
      );

      const expected = 200;
      const actual = getTotalMaxValue(seriesList);

      expect(actual).toEqual(expected);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: ` <section [dtTheme]="theme"></section> `,
})
class TestApp {
  theme = 'royalblue';

  @ViewChild(DtTheme, { static: true })
  dtThemeInstance: DtTheme;
}
