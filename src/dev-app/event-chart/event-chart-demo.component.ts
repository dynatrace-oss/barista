import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { EasyTravelDataSource } from './easy-travel-test-data';
import {
  EventChartDemoDataSource,
  EventChartDemoEvent,
  EventChartDemoLane,
  EventChartDemoLegendItem,
} from './event-chart-demo-data';
import { SessionReplayDataSource } from './session-replay-test-data';

interface DataSet {
  key: string;
  dataSource: EventChartDemoDataSource;
}

const DATA_SETS: DataSet[] = [
  { key: 'easy travel', dataSource: new EasyTravelDataSource() },
  { key: 'session replay', dataSource: new SessionReplayDataSource() },
];

@Component({
  moduleId: module.id,
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

  get _selectedDataSet(): DataSet {
    return this._ds;
  }
  set _selectedDataSet(value: DataSet) {
    this._ds = value;
    this._events = value.dataSource.getEvents();
    this._lanes = value.dataSource.getLanes();
    this._legendItems = value.dataSource.getLegendItems();
    this._changeDetectorRef.markForCheck();
  }
  private _ds = DATA_SETS[0];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this._selectedDataSet = this._ds;
  }
}
