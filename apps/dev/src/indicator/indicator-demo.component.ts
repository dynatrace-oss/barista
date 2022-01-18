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
import { ThreadNode, ThreadFlatNode } from './tree-table-example-types';
import {
  DtTreeDataSource,
  DtTreeControl,
  DtTreeFlattener,
} from '@dynatrace/barista-components/core';
import { FlatTreeControl } from '@angular/cdk/tree';

const TESTDATA: ThreadNode[] = [
  {
    name: 'hz.hzInstance_1_cluster.thread',
    icon: 'process',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
        icon: 'process',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 30,
        blocked: 0,
      },
      {
        name: 'hz.hzInstance_1_cluster.thread-2',
        icon: 'process',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'hz.hzInstance_2_cluster.thread',
    icon: 'process',
    threadlevel: 'S0',
    totalTimeConsumption: 250,
    waiting: 157,
    running: 20,
    blocked: 30,
  },
  {
    name: 'jetty',
    icon: 'process',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 10,
    children: [
      {
        name: 'jetty-422',
        icon: 'process',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 10,
      },
      {
        name: 'jetty-423',
        icon: 'process',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
      {
        name: 'jetty-424',
        icon: 'process',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'Downtime timer',
    icon: 'process',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
  },
];

@Component({
  selector: 'demo-component',
  template: `
    <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
      <ng-container dtColumnDef="name">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Name
        </dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          <dt-info-group>
            <dt-info-group-icon>
              <dt-icon [name]="row.icon"></dt-icon>
            </dt-info-group-icon>
            <dt-info-group-title>{{ row.name }}</dt-info-group-title>
            {{ row.threadlevel }}
          </dt-info-group>
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="blocked" dtColumnAlign="right">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Blocked
        </dt-tree-table-header-cell>
        <dt-cell
          *dtCellDef="let row"
          [dtIndicator]="row.blocked > 0"
          [dtIndicatorColor]="indicatorColor(row.blocked)"
        >
          {{ row.blocked }}ms
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="running" dtColumnAlign="center">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Running
        </dt-tree-table-header-cell>
        <dt-cell
          *dtCellDef="let row"
          [dtIndicator]="row.running > 20"
          dtIndicatorColor="recovered"
          >{{ row.running }}ms</dt-cell
        >
      </ng-container>

      <ng-container dtColumnDef="waiting">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Waiting
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.waiting }}ms</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="actions">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Actions
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          <button dt-icon-button variant="nested" aria-label="Filter results">
            <dt-icon name="filter"></dt-icon>
          </button>
          <button
            dt-icon-button
            variant="nested"
            [dtContextDialogTrigger]="dialog"
            aria-label="Show more data"
          >
            <dt-icon name="more"></dt-icon>
          </button>
          <dt-context-dialog
            #dialog
            aria-label="Show more data"
            ariaLabelClose="Close context dialog"
          >
            {{ row.name }} context dialog
          </dt-context-dialog>
        </dt-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['name', 'blocked', 'running', 'waiting', 'actions']"
      ></dt-header-row>
      <dt-tree-table-row
        *dtRowDef="
          let row;
          columns: ['name', 'blocked', 'running', 'waiting', 'actions']
        "
        [data]="row"
      ></dt-tree-table-row>
    </dt-tree-table>
  `,
})
export class IndicatorDemo {
  treeControl: FlatTreeControl<ThreadFlatNode>;
  treeFlattener: DtTreeFlattener<ThreadNode, ThreadFlatNode>;
  dataSource: DtTreeDataSource<ThreadNode, ThreadFlatNode>;

  constructor() {
    this.treeControl = new DtTreeControl<ThreadFlatNode>(
      this._getLevel,
      this._isExpandable,
    );
    this.treeFlattener = new DtTreeFlattener(
      this.transformer,
      this._getLevel,
      this._isExpandable,
      this._getChildren,
    );
    this.dataSource = new DtTreeDataSource(
      this.treeControl,
      this.treeFlattener,
    );
    this.dataSource.data = TESTDATA;
  }

  indicatorColor(blocked: number): 'error' | 'critical' | null {
    return blocked > 20 ? 'critical' : blocked > 0 ? 'error' : null;
  }

  hasChild = (_: number, _nodeData: ThreadFlatNode) => _nodeData.expandable;

  transformer = (node: ThreadNode, level: number): ThreadFlatNode => {
    const flatNode = new ThreadFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.threadlevel = node.threadlevel;
    flatNode.expandable = !!node.children;
    flatNode.blocked = node.blocked;
    flatNode.running = node.running;
    flatNode.waiting = node.waiting;
    flatNode.totalTimeConsumption = node.totalTimeConsumption;
    flatNode.icon = node.icon;
    return flatNode;
  };

  private _getLevel = (node: ThreadFlatNode) => node.level;

  private _isExpandable = (node: ThreadFlatNode) => node.expandable;

  private _getChildren = (node: ThreadNode): ThreadNode[] =>
    node.children || [];
}
