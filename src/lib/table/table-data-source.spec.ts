// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtIconModule, DtPagination, DtTableDataSource } from '@dynatrace/angular-components';
import { DtPaginationModule } from '../pagination';
import { DtTableModule } from './table-module';
import { createComponent } from '../../testing/create-component';

const PAGE_SIZE = 2;

const DATA_SET: object[] = [
  { host: 'et-demo-2-win4', cpu: 30, memoryPerc: 38, memoryTotal: 5830000000, traffic: 98700000 },
  { host: 'et-demo-2-win3', cpu: 26, memoryPerc: 46, memoryTotal: 6000000000, traffic: 62500000 },
  { host: 'docker-host2', cpu: 25.4, memoryPerc: 35, memoryTotal: 5810000000, traffic: 41900000 },
  { host: 'et-demo-2-win1', cpu: 23, memoryPerc: 7.86, memoryTotal: 5820000000, traffic: 98700000 },
  { host: 'et-demo-2-win8', cpu: 78, memoryPerc: 21, memoryTotal: 3520000000, traffic: 91870000 },
  { host: 'et-demo-2-macOS', cpu: 21, memoryPerc: 34, memoryTotal: 3200000000, traffic: 1200000 },
  { host: 'kyber-host6', cpu: 12.3, memoryPerc: 12, memoryTotal: 2120000000, traffic: 4500000 },
  { host: 'dev-demo-5-macOS', cpu: 24, memoryPerc: 8.6, memoryTotal: 4670000000, traffic: 3270000 },
];

describe('DtTableDataSource', () => {
  let fixture: ComponentFixture<PaginationTestApp>;
  let component: PaginationTestApp;
  let pagination: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtTableModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        DtPaginationModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [
        PaginationTestApp,
      ],
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = createComponent(PaginationTestApp);
    component = fixture.componentInstance;
    pagination = fixture.debugElement.query(By.css('.dt-pagination'));
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

    const paginationList = fixture.debugElement.queryAll(By.css('.dt-pagination li'));
    const length = (DATA_SET.length / PAGE_SIZE) + 2; // +2 for arrow left and right

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
});

@Component({
  moduleId: module.id,
  template: `
<dt-table [dataSource]="dataSource">
  <dt-simple-text-column name="host" sortable="false"></dt-simple-text-column>
  <dt-simple-number-column name="cpu" label="Cpu" sortable="false">CPU</dt-simple-number-column>
  <dt-simple-number-column name="memoryPerc" label="Memory" sortable="false"></dt-simple-number-column>
  <dt-simple-number-column name="memoryConsumption" label="Memory combined" sortable="false"></dt-simple-number-column>
  <dt-simple-number-column name="traffic" label="Traffic" sortable="false"></dt-simple-number-column>
  <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memoryPerc', 'memoryConsumption', 'traffic']"></dt-header-row>
  <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memoryPerc', 'memoryConsumption', 'traffic'];"></dt-row>
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
