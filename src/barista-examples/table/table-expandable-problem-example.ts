import { Component } from '@angular/core';

export interface TableData {
  name: string;
  cpuUsage: number;
  memoryPerc: number;
  memoryTotal: number;
  traffic: number;
  errors?: string[];
  warnings?: string[];
}

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // tslint:disable
  styles: ['.example-container { overflow: auto; height: 300px; }'],
  template: `
    <dt-table [dataSource]="_dataSource">
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.name }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="cpu" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
        <dt-cell
          [dtIndicator]="metricHasProblem(row, 'cpuUsage')"
          [dtIndicatorColor]="metricIndicatorColor(row, 'cpuUsage')"
          *dtCellDef="let row"
        >
          {{ row.cpuUsage | dtPercent }}
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="memory" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Memory</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <span
            [dtIndicator]="metricHasProblem(row, 'memoryPerc')"
            [dtIndicatorColor]="metricIndicatorColor(row, 'memoryPerc')"
          >
            {{ row.memoryPerc | dtPercent }}
          </span>
          &nbsp;of&nbsp;
          <span
            [dtIndicator]="metricHasProblem(row, 'memoryTotal')"
            [dtIndicatorColor]="metricIndicatorColor(row, 'memoryTotal')"
          >
            {{ row.memoryTotal | dtBytes }}
          </span>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="traffic" dtColumnAlign="control">
        <dt-header-cell *dtHeaderCellDef>Network traffic</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.traffic | dtBits | dtRate: 's' }}
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="empty">
        <dt-cell *dtCellDef="let row">This is empty</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="details" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Details</dt-header-cell>
        <dt-expandable-cell
          *dtCellDef
          ariaLabel="Expand the row to see problem details"
        ></dt-expandable-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic', 'details']"
      ></dt-header-row>
      <dt-expandable-row
        *dtRowDef="
          let row;
          columns: ['host', 'cpu', 'memory', 'traffic', 'details']
        "
      ></dt-expandable-row>
    </dt-table>
    <button dt-button (click)="_toggleProblem()">Toggle problem</button>
  `,
  // tslint:enable
})
export class TableExpandableProblemExample {
  _dataSource: TableData[] = [
    // tslint:disable-next-line: max-line-length
    {
      name: 'et-demo-2-win4',
      cpuUsage: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 987000000,
      warnings: ['memoryPerc'],
      errors: ['cpuUsage'],
    },
    {
      name: 'et-demo-2-win3',
      cpuUsage: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 6250000000,
    },
    {
      name: 'docker-host2',
      cpuUsage: 25.4,
      memoryPerc: 38,
      memoryTotal: 5250000000,
      traffic: 4190000000,
      warnings: ['cpuUsage'],
    },
    {
      name: 'et-demo-2-win1',
      cpuUsage: 23,
      memoryPerc: 7.86,
      memoryTotal: 16000000000,
      traffic: 987000000,
    },
  ];

  metricHasProblem(rowData: TableData, metricName: string): boolean {
    return (
      this._metricHasError(rowData, metricName) ||
      this._metricHasWarning(rowData, metricName)
    );
  }

  metricIndicatorColor(
    rowData: TableData,
    metricName: string
  ): 'error' | 'warning' | null {
    return this._metricHasError(rowData, metricName)
      ? 'error'
      : this._metricHasWarning(rowData, metricName)
      ? 'warning'
      : null;
  }

  private _metricHasError(rowData: TableData, metricName: string): boolean {
    return rowData.errors !== undefined && rowData.errors.includes(metricName);
  }

  private _metricHasWarning(rowData: TableData, metricName: string): boolean {
    return (
      rowData.warnings !== undefined && rowData.warnings.includes(metricName)
    );
  }

  _toggleProblem(): void {
    if (this._dataSource[0].errors) {
      delete this._dataSource[0].errors;
    } else {
      this._dataSource[0].errors = ['cpuUsage'];
    }
  }
}
