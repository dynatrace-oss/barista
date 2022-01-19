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

import * as highcharts from 'highcharts';

/**
 * Sets the Legend Symbols to our custom legend symbols
 * this function needs to be self executing because uglify
 * drops the execution call when building an app with the --prod flag
 */
// eslint-disable-next-line no-void
export const configureLegendSymbols = ((): void => {
  // ng-packagr starting with v13 is outputting mjs files. We needed to replace
  // the require with an import. To override these read only functions properly,
  // we needed to cast highcharts as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(highcharts as any).seriesTypes) {
    return;
  }

  // ng-packagr starting with v13 is outputting mjs files. We needed to replace
  // the require with an import. To override these read only functions properly,
  // we needed to cast highcharts as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (highcharts as any).seriesTypes.area.prototype.drawLegendSymbol = function (
    _legend: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    item: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ): void {
    item.legendSymbol = this.chart.renderer
      .path(['M10.5 5.5l3.5 4.8v3.2H2v-11L6.5 8z'])
      .addClass('highcharts-point')
      .add(item.legendGroup);
  };
  // ng-packagr starting with v13 is outputting mjs files. We needed to replace
  // the require with an import. To override these read only functions properly,
  // we needed to cast highcharts as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (highcharts as any).seriesTypes.line.prototype.drawLegendSymbol = function (
    _legend: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    item: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ): void {
    item.legendSymbol = this.chart.renderer
      .path(['M14 2.6l-3.8 4.8-3.4-2.3L2 9.8v2.8l5-5 3.6 2.5L14 5.8z'])
      .addClass('highcharts-point')
      .add(item.legendGroup);
  };

  // ng-packagr starting with v13 is outputting mjs files. We needed to replace
  // the require with an import. To override these read only functions properly,
  // we needed to cast highcharts as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (highcharts as any).seriesTypes.column.prototype.drawLegendSymbol = function (
    _legend: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    item: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ): void {
    item.legendSymbol = this.chart.renderer
      .path(['M2 7.3h2.5v5.8H2z M6.8 3h2.5v10H6.8z M11.5 5.1H14V13h-2.5z'])
      .addClass('highcharts-point')
      .add(item.legendGroup);
  };
})();
