import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import {
  DtTreeControl,
  DtTreeDataSource,
  DtTreeFlattener,
} from '@dynatrace/angular-components';
import { DtIconType } from '@dynatrace/dt-iconpack';

const TESTDATA: ThreadNode[] = [
  {
    name: 'hz.hzInstance_1_cluster.thread',
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name:
          'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'hz.hzInstance_1_cluster.thread-2',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'jetty',
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'jetty-422',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'jetty-423',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
      {
        name: 'jetty-424',
        icon: 'apache-tomcat',
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
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
  },
];

export class ThreadNode {
  name: string;
  threadlevel: string;
  totalTimeConsumption: number;
  blocked: number;
  running: number;
  waiting: number;
  icon: DtIconType;
  children?: ThreadNode[];
}

export class ThreadFlatNode {
  name: string;
  threadlevel: string;
  totalTimeConsumption: number;
  blocked: number;
  running: number;
  waiting: number;
  icon: DtIconType;
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
          <dt-info-group>
            <dt-info-group-icon>
              <dt-icon [name]="row.icon"></dt-icon>
            </dt-info-group-icon>
            <dt-info-group-title>{{ row.name }}</dt-info-group-title>
            {{ row.threadlevel }}
          </dt-info-group>
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="total">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Total time consumption
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          <dt-progress-bar
            class="thread-progress"
            [value]="row.blocked"
            [max]="row.totalTimeConsumption"
          ></dt-progress-bar>
          <dt-progress-bar
            class="thread-progress"
            [value]="row.waiting"
            [max]="row.totalTimeConsumption"
          ></dt-progress-bar>
          <dt-progress-bar
            class="thread-progress"
            [value]="row.running"
            [max]="row.totalTimeConsumption"
          ></dt-progress-bar>
        </dt-cell>
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
            aria-label-close-button="Close context dialog"
          >
            {{ row.name }} context dialog
          </dt-context-dialog>
        </dt-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="[
          'name',
          'total',
          'blocked',
          'running',
          'waiting',
          'actions'
        ]"
      ></dt-header-row>
      <dt-tree-table-row
        *dtRowDef="
          let row;
          columns: ['name', 'total', 'blocked', 'running', 'waiting', 'actions']
        "
        [data]="row"
      ></dt-tree-table-row>
    </dt-tree-table>
    <button dt-button (click)="treeControl.expandAll()">Expand all</button>
    <button dt-button (click)="treeControl.collapseAll()">Collapse all</button>
  `,
  styles: [
    `
      .thread-progress {
        margin-top: 1px;
      }
    `,
    `
      .dt-table-column-name {
        max-width: 400px;
        width: 400px;
      }
    `,
    '.dt-button + .dt-button { margin-right: 4px }',
  ],
})
export class TreeTableDefaultExample {
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
