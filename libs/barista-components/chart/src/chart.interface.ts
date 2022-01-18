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

import {
  Options,
  SeriesBarOptions,
  SeriesColumnOptions,
  SeriesLineOptions,
  SeriesAreaOptions,
  SeriesArearangeOptions,
  SeriesPieOptions,
  SeriesHeatmapOptions,
} from 'highcharts';

/** DtChartOptions extending the highcharts options with the series */
export type DtChartOptions = Options & {
  series?: undefined;
};

/** Chart series types */
export type DtChartSeries =
  | SeriesBarOptions
  | SeriesColumnOptions
  | SeriesLineOptions
  | SeriesAreaOptions
  | SeriesArearangeOptions
  | SeriesPieOptions
  | SeriesHeatmapOptions;
