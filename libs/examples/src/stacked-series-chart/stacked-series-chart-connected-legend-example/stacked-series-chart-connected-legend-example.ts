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
import { stackedSeriesChartDemoDataShows } from '../stacked-series-chart-demo-data';
import { DtTableDataSource } from '@dynatrace/barista-components/table';
import { DtStackedSeriesChartLegend } from '@dynatrace/barista-components/stacked-series-chart';

@Component({
  selector: 'dt-example-stacked-series-chart-connected-legend-barista',
  templateUrl: './stacked-series-chart-connected-legend-example.html',
  styleUrls: ['./stacked-series-chart-connected-legend-example.scss'],
})
export class DtExampleStackedSeriesChartConnectedLegend {
  shows = stackedSeriesChartDemoDataShows;
  dataSource = new DtTableDataSource(stackedSeriesChartDemoDataShows);
  legends = this.shows[0].nodes.map((node) => ({
    label: node.label,
    color: node.color,
    visible: true,
  }));

  _toggleNode(node: DtStackedSeriesChartLegend): void {
    node.visible = !node.visible;
    this.legends = this.legends.slice();
  }
}
