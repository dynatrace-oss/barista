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
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Predicate,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { DtPagination } from '@dynatrace/barista-components/pagination';
import {
  DtTableDataSource,
  DtTableSearch,
  DT_TABLE_SELECTION_CONFIG,
} from '@dynatrace/barista-components/table';

interface HostUnit {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
}

@Component({
  selector: 'table-dev-app-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
  providers: [
    {
      provide: DT_TABLE_SELECTION_CONFIG,
      useValue: { selectionLimit: 3 },
    },
  ],
})
export class TableDemo implements OnInit, OnDestroy, AfterViewInit {
  show = true;
  pageSize = 6;
  searchValue = '';
  data = [
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
  dataSource: DtTableDataSource<HostUnit> = new DtTableDataSource();
  tableLoading = true;

  private subscription: Subscription = Subscription.EMPTY;

  @ViewChild(DtTableSearch, { static: true })
  tableSearch: DtTableSearch;
  @ViewChildren(DtPagination)
  paginationList: QueryList<DtPagination>;

  disabledPredicate: Predicate<HostUnit> = (value) => {
    return value.host.includes('docker');
  };

  ngOnInit(): void {
    this.dataSource.search = this.tableSearch;
  }

  ngAfterViewInit(): void {
    this.paginationList.changes.pipe(startWith(null)).subscribe(() => {
      if (this.paginationList.first) {
        this.dataSource.pagination = this.paginationList.first;
        this.dataSource.pageSize = this.pageSize;
      } else {
        this.dataSource.pagination = null;
      }
    });

    setTimeout(() => {
      this.dataSource.data = this.data;
      this.tableLoading = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: undefined,
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
      },
      {
        title: undefined,
        labels: {
          format: '{value}/min',
        },
        opposite: true,
        tickInterval: 50,
      },
    ],
    plotOptions: {
      column: {
        stacking: 'normal',
      },
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  series: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Requests',
      type: 'column',
      data: [
        [1370304000000, 96],
        [1370304900000, 48],
        [1370305800000, 198],
        [1370306700000, 0],
        [1370307600000, 165],
        [1370308500000, 142],
        [1370309400000, 25],
        [1370310300000, 67],
        [1370311200000, 106],
        [1370312100000, 67],
        [1370313000000, 162],
        [1370313900000, 149],
        [1370314800000, 38],
        [1370315700000, 2],
        [1370316600000, 45],
        [1370317500000, 120],
        [1370318400000, 191],
        [1370319300000, 156],
        [1370320200000, 71],
        [1370321100000, 192],
        [1370322000000, 48],
        [1370322900000, 98],
        [1370323800000, 67],
        [1370324700000, 65],
        [1370325600000, 167],
        [1370326500000, 167],
        [1370327400000, 131],
        [1370328300000, 38],
        [1370329200000, 103],
        [1370330100000, 71],
        [1370331000000, 118],
        [1370331900000, 54],
        [1370332800000, 190],
        [1370333700000, 152],
        [1370334600000, 169],
        [1370335500000, 14],
        [1370336400000, 112],
        [1370337300000, 140],
        [1370338200000, 33],
        [1370339100000, 74],
      ],
    },
  ];
}
