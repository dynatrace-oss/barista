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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { DtEventChartEvent } from '@dynatrace/barista-components/event-chart';

import { EasyTravelDataSource } from './easy-travel-test-data';
import {
  EventChartDemoDataSource,
  EventChartDemoEvent,
  EventChartDemoLane,
  EventChartDemoLegendItem,
  EventChartDemoHeatfield,
} from './event-chart-demo-data';
import { MobileActionDataSource } from './mobile-actions-test-data';
import { SessionReplayDataSource } from './session-replay-test-data';
import { BigTimeDataSource } from './big-time-test-data';

interface DataSet {
  key: string;
  dataSource: EventChartDemoDataSource;
}

const DATA_SETS: DataSet[] = [
  { key: 'easy travel', dataSource: new EasyTravelDataSource() },
  { key: 'session replay', dataSource: new SessionReplayDataSource() },
  { key: 'mobile actions replay', dataSource: new MobileActionDataSource() },
  { key: 'big time', dataSource: new BigTimeDataSource() },
];

@Component({
  selector: 'event-chart-demo',
  templateUrl: 'event-chart-demo.component.html',
  styleUrls: ['event-chart-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventChartDemo {
  _dataSets = DATA_SETS;
  _events: EventChartDemoEvent[] = [];
  _lanes: EventChartDemoLane[] = [];
  _legendItems: EventChartDemoLegendItem[] = [];
  _heatfields: EventChartDemoHeatfield[] = [];

  get _selectedDataSet(): DataSet {
    return this._ds;
  }
  set _selectedDataSet(value: DataSet) {
    this._ds = value;
    this._events = value.dataSource.getEvents();
    this._lanes = value.dataSource.getLanes();
    this._legendItems = value.dataSource.getLegendItems();
    this._heatfields = value.dataSource.getHeatfields();
    this._changeDetectorRef.markForCheck();
  }
  private _ds = DATA_SETS[1];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this._selectedDataSet = this._ds;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logSelected(event: DtEventChartEvent<any>): void {
    console.log(event);
  }
}
