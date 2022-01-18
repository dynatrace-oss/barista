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

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DtOrder,
  DtTableOrderDataSource,
} from '@dynatrace/barista-components/table';

interface HostUnit {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
}

const data: HostUnit[] = [
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
];

@Component({
  selector: 'dt-example-table-order-expandable-column',
  styleUrls: ['./table-order-expandable-example.scss'],
  templateUrl: './table-order-expandable-example.html',
})
export class DtExampleTableOrderExpandable implements OnInit {
  @ViewChild(DtOrder, { static: true }) _dtOrder: DtOrder<any>;

  multiExpand = false;
  dataSource: DtTableOrderDataSource<HostUnit> = new DtTableOrderDataSource(
    data,
  );

  ngOnInit(): void {
    this.dataSource.order = this._dtOrder;
  }
}
