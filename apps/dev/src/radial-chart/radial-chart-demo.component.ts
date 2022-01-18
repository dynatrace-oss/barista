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

import { Component } from '@angular/core';

interface DemoChartData {
  name: string;
  value: number;
  color?: string | null;
}
@Component({
  selector: 'radial-chart-demo',
  templateUrl: 'radial-chart-demo.component.html',
  styleUrls: ['./radial-chart-demo.component.scss'],
})
export class RadialChartDemo {
  type = 'pie'; // pie | donut
  maxValuePreset = 50;
  maxValue: number | null = this.maxValuePreset;
  randomizeColors = false;
  legendPosition = 'bottom';
  valueAsRelative = true;

  randomColors = [
    '#31339c',
    '#b9c5ff',
    '#debbf3',
    '#ffa86c',
    '#2ab6f4',
    '#c9a000',
    '#612c85',
    '#006bba',
  ];

  series1 = {
    name: 'Chrome',
    value: 10.7,
  };

  series2 = {
    name: 'Firefox',
    value: 21.4,
  };

  series3 = {
    name: 'Safari',
    value: 8.2,
  };

  series4 = {
    name: 'Edge',
    value: 5.9,
  };

  allSeries: DemoChartData[] = [
    this.series1,
    this.series2,
    this.series3,
    this.series4,
  ];
  renderedSeries: DemoChartData[] = [...this.allSeries];
  sumAllSeries = this.allSeries.reduce((agg, cur) => agg + cur.value, 0);
  sorted = false;
  selectable = true;
  selected: { name: string; value: number } | undefined = this.series1;

  _toggleSorting(): void {
    this.sorted = !this.sorted;
    if (this.sorted) {
      this._sortSeries();
    } else {
      this.renderedSeries = [...this.allSeries];
    }
  }

  _sortSeries(): void {
    this.renderedSeries.sort((a, b) => b.value - a.value);
  }

  _addRandomDataToRenderedSeries(): void {
    const value = Math.floor(Math.random() * 50);
    const colorIdx = Math.floor(Math.random() * this.randomColors.length);
    const newSeries = {
      name: 'Series',
      color: this.randomizeColors ? this.randomColors[colorIdx] : null,
      value,
    };
    this.allSeries.push(newSeries);
    this.sumAllSeries = this.sumAllSeries + value;
    this._updateRenderedSeries();
  }

  _removeLastSeries(): void {
    if (this.allSeries.length > 0) {
      this.sumAllSeries =
        this.sumAllSeries - this.allSeries[this.allSeries.length - 1].value;
      this.allSeries = this.allSeries.slice(0, -1);
      this._updateRenderedSeries();
    }
  }

  _updateRenderedSeries(): void {
    this.renderedSeries = [...this.allSeries];
    if (this.sorted) {
      this._sortSeries();
    }
  }

  _toggleLegendPosition(): void {
    this.legendPosition = this.legendPosition === 'bottom' ? 'right' : 'bottom';
  }

  // Distinguish ui and chart selection to help with bug detection
  _uiSelect(
    isSelected: boolean,
    series?: { name: string; value: number },
  ): void {
    if (this.selectable) {
      this._select(isSelected, series);
    }
  }

  _select(isSelected: boolean, series?: { name: string; value: number }): void {
    this.selected = isSelected ? series : undefined;
  }
}
