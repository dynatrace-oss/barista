import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  DtSort,
  DtTableDataSource,
  formatPercent,
  formatBytes,
  formatRate,
} from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource" dtSort #sortable>
      <dt-simple-text-column name="host" label="Host"></dt-simple-text-column>
      <dt-simple-number-column
        name="cpu"
        label="CPU"
        [formatter]="percentageFormatter"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryPerc"
        label="Memory"
        [formatter]="percentageFormatter"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryConsumption"
        label="Memory combined"
        [displayAccessor]="combineMemory"
        [sortAccessor]="memorySortAccessor"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="traffic"
        label="Traffic"
        [formatter]="trafficFormatter"
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
  `,
  // tslint:enable
})
export class TableDefaultExample implements AfterViewInit {
  data: object[] = [
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
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;

  // Initialize the table's data source
  dataSource: DtTableDataSource<object>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  percentageFormatter = formatPercent;

  trafficFormatter = (value: number) =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MB',
      factor: 1024,
    });

  // tslint:disable-next-line: no-any
  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }

  // tslint:disable-next-line: no-any
  memorySortAccessor(row: any): number {
    return row.memoryPerc;
  }
}
