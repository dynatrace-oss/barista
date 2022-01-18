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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  waitForAsync,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  DtPagination,
  DtPaginationModule,
} from '@dynatrace/barista-components/pagination';

import {
  createComponent,
  dispatchMouseEvent,
} from '@dynatrace/testing/browser';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtTableModule } from './table-module';
import { DtTableDataSource } from './table-data-source';
import { DtSimpleColumnComparatorFunction } from './simple-columns';
import { DtSort } from './sort/sort';

const PAGE_SIZE = 2;

const DATA_SET: object[] = [
  {
    host: 'et-demo-2-win4',
    cpu: 30,
    memoryPerc: 38,
    memoryTotal: 5830000000,
    traffic: 98700000,
  },
  {
    host: 'et-demo-2-win3',
    cpu: 26,
    memoryPerc: 46,
    memoryTotal: 6000000000,
    traffic: 62500000,
  },
  {
    host: 'docker-host2',
    cpu: 25.4,
    memoryPerc: 35,
    memoryTotal: 5810000000,
    traffic: 41900000,
  },
  {
    host: 'et-demo-2-win1',
    cpu: 23,
    memoryPerc: 7.86,
    memoryTotal: 5820000000,
    traffic: 98700000,
  },
  {
    host: 'et-demo-2-win8',
    cpu: 78,
    memoryPerc: 21,
    memoryTotal: 3520000000,
    traffic: 91870000,
  },
  {
    host: 'et-demo-2-macOS',
    cpu: 21,
    memoryPerc: 34,
    memoryTotal: 3200000000,
    traffic: 1200000,
  },
  {
    host: 'kyber-host6',
    cpu: 12.3,
    memoryPerc: 12,
    memoryTotal: 2120000000,
    traffic: 4500000,
  },
  {
    host: 'dev-demo-5-macOS',
    cpu: 24,
    memoryPerc: 8.6,
    memoryTotal: 4670000000,
    traffic: 3270000,
  },
];

describe('DtTableDataSource', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          DtTableModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
          DtLoadingDistractorModule,
          NoopAnimationsModule,
          DtFormattersModule,
          HttpClientTestingModule,
          DtPaginationModule,
        ],
        declarations: [PaginationTestApp, TableSortingMixedTestApp],
      }).compileComponents();
    }),
  );

  describe('pagination', () => {
    let fixture: ComponentFixture<PaginationTestApp>;
    let component: PaginationTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(PaginationTestApp);
      component = fixture.componentInstance;
    }));

    it('should have a pagination attached to the dataSource', () => {
      const instance = fixture.componentInstance;
      const paginationInstance = instance.dataSource.pagination as DtPagination;

      expect(paginationInstance).not.toBeUndefined();
      expect(paginationInstance).not.toBeNull();
      expect(paginationInstance.constructor).toBe(DtPagination);
      expect(instance.dataSource.pageSize).toBe(PAGE_SIZE);
      expect(instance.dataSource.data.constructor).toBe(Array);
    });

    it('should page the data for the table', fakeAsync(() => {
      flush();
      fixture.detectChanges();

      let rows = fixture.debugElement.queryAll(By.css('dt-row'));
      expect(rows.length).toBe(PAGE_SIZE);

      fixture.componentInstance.dataSource.pageSize = 1;
      flush();
      fixture.detectChanges();

      rows = fixture.debugElement.queryAll(By.css('dt-row'));
      expect(rows.length).toBe(1);

      fixture.componentInstance.dataSource.pageSize = 50;
      flush();
      fixture.detectChanges();

      rows = fixture.debugElement.queryAll(By.css('dt-row'));
      expect(rows.length).toBe(DATA_SET.length);
    }));

    it('should have a pagination attached to the table', fakeAsync(() => {
      flush();
      fixture.detectChanges();

      const paginationList = fixture.debugElement.queryAll(
        By.css('.dt-pagination li'),
      );
      const length = DATA_SET.length / PAGE_SIZE + 2; // +2 for arrow left and right

      expect(paginationList.length).toBe(length);
    }));

    it('should filter the table', fakeAsync(() => {
      flush();
      fixture.detectChanges();

      let rows = fixture.debugElement.queryAll(By.css('dt-row'));
      expect(rows.length).toBe(PAGE_SIZE);

      fixture.componentInstance.dataSource.filter = 'docker';
      flush();
      fixture.detectChanges();
      rows = fixture.debugElement.queryAll(By.css('dt-row'));

      expect(rows.length).toBe(1);

      fixture.componentInstance.dataSource.filter = 'asdf';
      flush();
      fixture.detectChanges();
      rows = fixture.debugElement.queryAll(By.css('dt-row'));

      expect(rows.length).toBe(0);

      fixture.componentInstance.dataSource.filter = '';
      flush();
      fixture.detectChanges();
      rows = fixture.debugElement.queryAll(By.css('dt-row'));

      expect(rows.length).toBe(PAGE_SIZE);
    }));

    it('should adapt the paging when the pagination is set to null', fakeAsync(() => {
      flush();
      fixture.detectChanges();
      let rows = fixture.debugElement.queryAll(By.css('dt-row'));

      expect(rows.length).toBe(PAGE_SIZE);

      component.dataSource.pagination = null;
      flush();
      fixture.detectChanges();

      rows = fixture.debugElement.queryAll(By.css('dt-row'));
      expect(rows.length).toBe(DATA_SET.length);

      component.dataSource.pagination = component.pagination;
      flush();
      fixture.detectChanges();

      rows = fixture.debugElement.queryAll(By.css('dt-row'));
      expect(rows.length).toBe(PAGE_SIZE);
    }));

    it('should enable and show the correct pagination if data is re set after being emptied', fakeAsync(() => {
      flush();
      fixture.detectChanges();

      component.dataSource.data = [];
      flush();
      fixture.detectChanges();

      component.dataSource.data = component.data;

      flush();
      fixture.detectChanges();

      const paginationItems = fixture.debugElement.queryAll(
        By.css('.dt-pagination-item'),
      );
      expect(paginationItems).toHaveLength(4);
    }));
  });

  describe('sorting', () => {
    let fixture: ComponentFixture<TableSortingMixedTestApp>;
    let component: TableSortingMixedTestApp;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(TableSortingMixedTestApp);
      component = fixture.componentInstance;
    }));

    it('should sort the non-simple-column by the provided function (asc.)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-memory'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memory'),
      );
      expect(cells[0].nativeElement.textContent).toContain('7.86 / 5820000000');
      expect(cells[1].nativeElement.textContent).toContain('35 / 5810000000');
      expect(cells[2].nativeElement.textContent).toContain('38 / 5830000000');
      expect(cells[3].nativeElement.textContent).toContain('46 / 6000000000');
    });

    it('should sort the non-simple-column by the provided function (desc.)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-memory'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memory'),
      );
      expect(cells[0].nativeElement.textContent).toContain('46 / 6000000000');
      expect(cells[1].nativeElement.textContent).toContain('38 / 5830000000');
      expect(cells[2].nativeElement.textContent).toContain('35 / 5810000000');
      expect(cells[3].nativeElement.textContent).toContain('7.86 / 5820000000');
    });

    it('should let you update the sorting accessor at runtime', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-memory'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      component.dataSource.addSortAccessorFunction(
        'memory',
        (row) => row.memoryPerc % 30,
      );
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memory'),
      );
      expect(cells[0].nativeElement.textContent).toContain('35 / 5810000000'); // 35 % 30 = 5
      expect(cells[1].nativeElement.textContent).toContain('7.86 / 5820000000'); // 7.86 % 30 = 7.86
      expect(cells[2].nativeElement.textContent).toContain('38 / 5830000000'); // 38 % 30 = 8
      expect(cells[3].nativeElement.textContent).toContain('46 / 6000000000'); // 46 % 30 = 16
    });

    it('should let you update the sorting comparator at runtime', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-memory'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      component.dataSource.addComparatorFunction('memory', (left, right) => {
        const memoryPercStrLenLeft = String(left.memoryPerc).length;
        const memoryPercStrLenRight = String(right.memoryPerc).length;

        if (memoryPercStrLenLeft !== memoryPercStrLenRight) {
          return memoryPercStrLenLeft - memoryPercStrLenRight;
        }

        return left.memoryPerc - right.memoryPerc;
      });
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memory'),
      );

      expect(cells[0].nativeElement.textContent).toContain('35 / 5810000000');
      expect(cells[1].nativeElement.textContent).toContain('38 / 5830000000');
      expect(cells[2].nativeElement.textContent).toContain('46 / 6000000000');
      expect(cells[3].nativeElement.textContent).toContain('7.86 / 5820000000');
    });

    it('should update the sorting based on the comparator specified in the SimpleColumn', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );

      expect(cells[0].nativeElement.textContent).toContain('docker-host2');
      expect(cells[1].nativeElement.textContent).toContain('et-demo-2-win4');
      expect(cells[2].nativeElement.textContent).toContain('et-demo-2-win3');
      expect(cells[3].nativeElement.textContent).toContain('et-demo-2-win1');
    });
  });
});

@Component({
  template: `
    <dt-table [dataSource]="dataSource">
      <dt-simple-text-column
        name="host"
        sortable="false"
      ></dt-simple-text-column>
      <dt-simple-number-column name="cpu" label="Cpu" sortable="false">
        CPU
      </dt-simple-number-column>
      <dt-simple-number-column
        name="memoryPerc"
        label="Memory"
        sortable="false"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryConsumption"
        label="Memory combined"
        sortable="false"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="traffic"
        label="Traffic"
        sortable="false"
      ></dt-simple-number-column>
      <dt-header-row
        *dtHeaderRowDef="[
          'host',
          'cpu',
          'memoryPerc',
          'memoryConsumption',
          'traffic'
        ]"
      ></dt-header-row>
      <dt-row
        *dtRowDef="
          let row;
          columns: ['host', 'cpu', 'memoryPerc', 'memoryConsumption', 'traffic']
        "
      ></dt-row>
    </dt-table>
    <dt-pagination></dt-pagination>
  `,
})
export class PaginationTestApp implements OnInit {
  data = DATA_SET;
  @ViewChild(DtPagination, { static: true }) pagination: DtPagination;
  dataSource: DtTableDataSource<object>;

  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngOnInit(): void {
    // Set the dtPagination reference on the dataSource, so it can page the data.
    this.dataSource.pagination = this.pagination;
    // Set the pageSize to override the default page size.
    this.dataSource.pageSize = 2;
  }
}

@Component({
  selector: 'demo-component',
  /* eslint-disable */
  template: `
    <dt-table [dataSource]="dataSource" dtSort #sortable>
      <dt-simple-text-column
        name="host"
        label="Host"
        [comparator]="hostComparator"
      ></dt-simple-text-column>

      <ng-container dtColumnDef="memory" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef dt-sort-header>Memory</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.memoryPerc }} / {{ row.memoryTotal }}
        </dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['host', 'memory']"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: ['host', 'memory']"></dt-row>
    </dt-table>
  `,
  /* eslint-enable */
})
export class TableSortingMixedTestApp implements OnInit {
  data: Array<{ host: string; memoryPerc: number; memoryTotal: number }> = [
    {
      host: 'et-demo-2-win4',
      memoryPerc: 38,
      memoryTotal: 5830000000,
    },
    {
      host: 'et-demo-2-win3',
      memoryPerc: 46,
      memoryTotal: 6000000000,
    },
    {
      host: 'docker-host2',
      memoryPerc: 35,
      memoryTotal: 5810000000,
    },
    {
      host: 'et-demo-2-win1',
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;

  // Initialize the table's data source
  dataSource: DtTableDataSource<{
    host: string;
    memoryPerc: number;
    memoryTotal: number;
  }>;

  readonly hostComparator: DtSimpleColumnComparatorFunction<{
    host: string;
    memoryPerc: number;
    memoryTotal: number;
  }> = (left, right) => left.host.length - right.host.length;

  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
    this.dataSource.addSortAccessorFunction(
      'memory',
      (row) =>
        // Any accessor computation that returns a comparable value.
        (row.memoryPerc / 100) * row.memoryTotal,
    );
  }

  ngOnInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }
}
