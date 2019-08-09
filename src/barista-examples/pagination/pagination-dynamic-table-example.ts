import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { DtPagination } from '@dynatrace/angular-components/pagination';
import { startWith } from 'rxjs/operators';
import { DtTableDataSource } from '@dynatrace/angular-components/table';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <ng-container *ngIf="show">
      <dt-table [dataSource]="dataSource">
        <dt-simple-text-column
          name="host"
          sortable="false"
        ></dt-simple-text-column>
        <dt-simple-number-column
          name="cpu"
          label="Cpu"
          sortable="false"
        ></dt-simple-number-column>
        <dt-simple-number-column
          name="memory"
          label="Memory"
          sortable="false"
        ></dt-simple-number-column>
        <dt-simple-number-column
          name="traffic"
          label="Traffic"
          sortable="false"
        ></dt-simple-number-column>

        <dt-header-row
          *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"
        ></dt-header-row>
        <dt-row
          *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']"
        ></dt-row>
      </dt-table>

      <dt-pagination></dt-pagination>
    </ng-container>

    <button dt-button (click)="show = !show">show/hide</button>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
      }

      dt-pagination {
        align-self: center;
        margin: 1em 0;
      }
    `,
  ],
})
export class PaginationDynamicTableExample implements AfterViewInit {
  show = true;
  private data: Array<{
    host: string;
    cpu: number;
    memory: number;
    traffic: number;
  }> = [
    { host: 'et-demo-2-win4', cpu: 30, memory: 38, traffic: 98700000 },
    { host: 'et-demo-2-win3', cpu: 26, memory: 46, traffic: 62500000 },
    { host: 'docker-host2', cpu: 25.4, memory: 35, traffic: 41900000 },
    { host: 'et-demo-2-win1', cpu: 23, memory: 7.86, traffic: 98700000 },
    { host: 'et-demo-2-win8', cpu: 78, memory: 21, traffic: 91870000 },
    { host: 'et-demo-2-macOS', cpu: 21, memory: 34, traffic: 1200000 },
    { host: 'kyber-host6', cpu: 12.3, memory: 12, traffic: 4500000 },
    { host: 'dev-demo-5-macOS', cpu: 24, memory: 8.6, traffic: 3270000 },
  ];

  @ViewChildren(DtPagination) paginationList: QueryList<DtPagination>;

  dataSource: DtTableDataSource<{
    host: string;
    cpu: number;
    memory: number;
    traffic: number;
  }> = new DtTableDataSource(this.data);

  ngAfterViewInit(): void {
    this.paginationList.changes.pipe(startWith(null)).subscribe(() => {
      if (this.paginationList.first) {
        this.dataSource.pagination = this.paginationList.first;
        this.dataSource.pageSize = 2;
      } else {
        this.dataSource.pagination = null;
      }
    });
  }
}
