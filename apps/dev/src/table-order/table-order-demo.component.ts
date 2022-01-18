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
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  DtOrder,
  DtTableOrderDataSource,
  DtOrderChangeEvent,
} from '@dynatrace/barista-components/table';

interface RuleSet {
  name: string;
}

interface HostUnit {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
}

const data = [
  { name: 'I' },
  { name: 'II' },
  { name: 'III' },
  { name: 'IV' },
  { name: 'V' },
  { name: 'VI' },
  { name: 'VII' },
  { name: 'VIII' },
  { name: 'IX' },
  { name: 'X' },
];

const dataUpdated = [
  { name: 'one' },
  { name: 'two' },
  { name: 'three' },
  { name: 'four' },
  { name: 'five' },
];

const data1: HostUnit[] = [
  {
    host: 'et-demo-2-win4',
    cpu: '30 %',
    memory: '38 % of 5.83 GB',
    traffic: '98.7 Mbit/s',
  },
  {
    host: 'et-demo-2-win3',
    cpu: '26 %',
    memory: '46 % of 6 GB',
    traffic: '625 Mbit/s',
  },
  {
    host: 'docker-host2',
    cpu: '25.4 %',
    memory: '38 % of 5.83 GB',
    traffic: '419 Mbit/s',
  },
  {
    host: 'et-demo-2-win1',
    cpu: '23 %',
    memory: '7.86 % of 5.83 GB',
    traffic: '98.7 Mbit/s',
  },
  {
    host: 'et-demo-2-win8',
    cpu: '78 %',
    memory: '21 % of 10 TB',
    traffic: '918.7 Mbit/s',
  },
  {
    host: 'et-demo-2-macOS',
    cpu: '21 %',
    memory: '34 % of 1.45 GB',
    traffic: '12 Mbit/s',
  },
  {
    host: 'kyber-host6',
    cpu: '12.3 %',
    memory: '12 % of 6.2 GB',
    traffic: '45 Mbit/s',
  },
  {
    host: 'dev-demo-5-macOS',
    cpu: '24 %',
    memory: '8,6 % of 7 GB',
    traffic: '32.7 Mbit/s',
  },
];

@Component({
  selector: 'table-dev-app-demo',
  templateUrl: './table-order-demo.component.html',
  styleUrls: ['./table-order-demo.component.scss'],
})
export class TableOrderDemo implements AfterViewInit {
  disabled = false;

  @ViewChildren(DtOrder) _dtOrder: QueryList<DtOrder<any>>;

  dataSource: DtTableOrderDataSource<RuleSet> = new DtTableOrderDataSource(
    data,
  );
  dataSource1: DtTableOrderDataSource<HostUnit> = new DtTableOrderDataSource(
    data1,
  );
  private _switched = false;

  ngAfterViewInit(): void {
    const dtOrderRefs = this._dtOrder.toArray();
    this.dataSource.order = dtOrderRefs[0];
    this.dataSource1.order = dtOrderRefs[1];
  }

  changeOrder(): void {
    this._dtOrder.toArray()[0].order(0, 1);
  }

  switchData(): void {
    if (!this._switched) {
      this.dataSource.data = dataUpdated;
    } else {
      this.dataSource.data = data;
    }

    this._switched = !this._switched;
  }

  orderChanged($event: DtOrderChangeEvent): void {
    console.log($event);
  }
}
