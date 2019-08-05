import { Component } from '@angular/core';

import { FlatTreeControl } from '@angular/cdk/tree';
import {
  DtTreeControl,
  DtTreeDataSource,
  DtTreeFlattener,
} from '@dynatrace/angular-components';

const TESTDATA: ThreadNode[] = [
  {
    name: 'hz.hzInstance_1_cluster.thread',
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name:
          'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'hz.hzInstance_1_cluster.thread-2',
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'jetty',
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'jetty-422',
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'jetty-423',
        waiting: 130,
        running: 0,
        blocked: 0,
      },
      {
        name: 'jetty-424',
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'Downtime timer',
    waiting: 123,
    running: 20,
    blocked: 0,
  },
];

export class ThreadNode {
  name: string;
  blocked: number;
  running: number;
  waiting: number;
  children?: ThreadNode[];
}

export class ThreadFlatNode {
  name: string;
  blocked: number;
  running: number;
  waiting: number;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'tree-table-demo',
  template: `
    <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
      <ng-container dtColumnDef="name">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Name
        </dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          {{ row.name }}
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="blocked" dtColumnAlign="right">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Blocked
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.blocked }}ms</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="running" dtColumnAlign="center">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Running
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.running }}ms</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="waiting">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Waiting
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.waiting }}ms</dt-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['name', 'blocked', 'running', 'waiting']"
      ></dt-header-row>
      <dt-tree-table-row
        *dtRowDef="let row; columns: ['name', 'blocked', 'running', 'waiting']"
        [data]="row"
      ></dt-tree-table-row>
    </dt-tree-table>
  `,
})
export class TreeTableSimpleExample {
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

  hasChild = (_: number, _nodeData: ThreadFlatNode) => _nodeData.expandable;

  transformer = (node: ThreadNode, level: number): ThreadFlatNode => {
    const flatNode = new ThreadFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.blocked = node.blocked;
    flatNode.running = node.running;
    flatNode.waiting = node.waiting;
    return flatNode;
  };

  private _getLevel = (node: ThreadFlatNode) => node.level;

  private _isExpandable = (node: ThreadFlatNode) => node.expandable;

  private _getChildren = (node: ThreadNode): ThreadNode[] =>
    node.children || [];
}
