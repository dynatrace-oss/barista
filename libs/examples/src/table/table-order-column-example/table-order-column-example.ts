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

interface RuleSet {
  name: string;
}

const data = [
  { name: 'Rule name - One' },
  { name: 'Rule name - Two' },
  { name: 'Rule name - Three' },
  { name: 'Rule name - Four' },
  { name: 'Rule name - Five' },
];

@Component({
  selector: 'dt-example-table-order-column',
  styleUrls: ['./table-order-column-example.scss'],
  templateUrl: './table-order-column-example.html',
})
export class DtExampleTableOrderColumn implements OnInit {
  @ViewChild(DtOrder, { static: true }) _dtOrder: DtOrder<any>;

  disableOrdering = false;
  dataSource: DtTableOrderDataSource<RuleSet> = new DtTableOrderDataSource(
    data,
  );

  ngOnInit(): void {
    this.dataSource.order = this._dtOrder;
  }
}
