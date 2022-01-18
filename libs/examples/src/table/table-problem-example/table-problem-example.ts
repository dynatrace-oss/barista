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

import { Component } from '@angular/core';

export interface TableData {
  name: string;
  cpuUsage: number;
  memoryPerc: number;
  memoryTotal: number;
  traffic: number;
  errors?: string[];
  warnings?: string[];
  recovered?: string[];
  critical?: string[];
}

@Component({
  selector: 'dt-example-table-problem',
  styleUrls: ['./table-problem-example.scss'],
  templateUrl: './table-problem-example.html',
})
export class DtExampleTableProblem {
  _dataSource: TableData[] = [
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
      name: 'docker-host1',
      cpuUsage: 75.2,
      memoryPerc: 77,
      memoryTotal: 17250000000,
      traffic: 6190000000,
      critical: ['cpuUsage', 'memoryTotal'],
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
      recovered: ['cpuUsage'],
    },
  ];

  metricHasProblem(rowData: TableData, metricName: string): boolean {
    return (
      this._metricHasError(rowData, metricName) ||
      this._metricHasWarning(rowData, metricName) ||
      this._metricHasRecovered(rowData, metricName) ||
      this._metricIsCritical(rowData, metricName)
    );
  }

  metricIndicatorColor(
    rowData: TableData,
    metricName: string,
  ): 'error' | 'warning' | 'recovered' | 'critical' | null {
    return this._metricHasError(rowData, metricName)
      ? 'error'
      : this._metricHasWarning(rowData, metricName)
      ? 'warning'
      : this._metricHasRecovered(rowData, metricName)
      ? 'recovered'
      : this._metricIsCritical(rowData, metricName)
      ? 'critical'
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

  private _metricHasRecovered(rowData: TableData, metricName: string): boolean {
    return (
      rowData.recovered !== undefined && rowData.recovered.includes(metricName)
    );
  }

  private _metricIsCritical(rowData: TableData, metricName: string): boolean {
    return (
      rowData.critical !== undefined && rowData.critical.includes(metricName)
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
