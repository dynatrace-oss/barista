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
import {
  DtSunburstChartNode,
  DtSunburstChart,
} from '@dynatrace/barista-components/sunburst-chart';
import { DtSwitchChange } from '@dynatrace/barista-components/switch';
import { sunburstChartDemoData } from './sunburst-chart-demo-data';

@Component({
  selector: 'sunburst-chart-dev-app-demo',
  templateUrl: './sunburst-chart-demo.component.html',
  styleUrls: ['./sunburst-chart-demo.component.scss'],
})
export class SunburstChartDemo {
  selectedInitial: DtSunburstChartNode[] = [{ ...sunburstChartDemoData[4] }];
  selected: string[];
  valueDisplayMode: 'absolute' | 'percent' = 'absolute';

  series = sunburstChartDemoData;

  @ViewChild(DtSunburstChart) chart: DtSunburstChart;

  select(selected: DtSunburstChartNode[] = []): void {
    this.selected = selected.map((node) => node.label);
  }

  toggleDisplayMode(event: DtSwitchChange<boolean>): void {
    this.valueDisplayMode = event.checked ? 'percent' : 'absolute';
  }

  openOverlay(): void {
    this.chart.openOverlay(this.chart._slices[3]);
  }
  closeOverlay(): void {
    this.chart.closeOverlay();
  }
}
