/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { compareStrings } from '@dynatrace/barista-components/core';
import { DtSort, DtTableDataSource } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-table-comparators',
  templateUrl: './table-comparators-example.html',
})
export class DtExampleTableComparators implements AfterViewInit, OnDestroy {
  data = [
    {
      host: 'et-demo-2-win4',
      namespace: 'playground-10',
    },
    {
      host: 'et-demo-2-win3',
      namespace: 'playground-11',
    },
    {
      host: 'docker-host2',
      namespace: 'example',
    },
    {
      host: 'et-demo-2-win1',
      namespace: 'another-namespace',
    },
  ];

  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;

  dataSource: DtTableDataSource<{ host: string; namespace: string }>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sortable;
    this.dataSource.addComparatorFunction('namespace', (left, right) =>
      this.compareStringLengths(left, right, 'namespace'),
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  readonly compareStringLengths = (
    left: any,
    right: any,
    name: string,
  ): number => {
    const nameLengthLeft = left[name].length;
    const nameLengthRight = right[name].length;

    if (nameLengthLeft !== nameLengthRight) {
      return nameLengthLeft - nameLengthRight;
    }

    return compareStrings(left[name], right[name], 'asc');
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  ngOnDestroy(): void {
    // Not necessary but possible
    this.dataSource.removeComparatorFunction('namespace');
  }
}
