import { Component } from '@angular/core';
import { DtIconType } from '@dynatrace/dt-iconpack';

import {
  DtTreeControl,
  DtTreeDataSource,
  DtTreeFlattener,
} from '@dynatrace/angular-components/core';

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
        name: '',
        threadlevel: '',
        totalTimeConsumption: 0,
        waiting: 0,
        running: 0,
        blocked: 0,
        isShowMore: true,
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
  icon?: DtIconType;
  isShowMore?: boolean;
  children?: ThreadNode[];
}

export class ThreadFlatNode {
  name: string;
  threadlevel: string;
  totalTimeConsumption: number;
  blocked: number;
  running: number;
  waiting: number;
  icon?: DtIconType;
  isShowMore: boolean;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'async-tree-table-demo',
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
          <ng-container *ngIf="!row.isShowMore">
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
          </ng-container>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="blocked" dtColumnAlign="right">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Blocked
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          <ng-container *ngIf="!row.isShowMore">
            {{ row.blocked }}ms
          </ng-container>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="running" dtColumnAlign="center">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Running
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          <ng-container *ngIf="!row.isShowMore">
            {{ row.running }}ms
          </ng-container>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="waiting">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Waiting
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          <ng-container *ngIf="!row.isShowMore">
            {{ row.waiting }}ms
          </ng-container>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="showMore">
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          <button dt-button variant="secondary" (click)="showMore()">
            Show more
          </button>
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="actions">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Actions
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          <ng-container *ngIf="!row.isShowMore">
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
          </ng-container>
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
      <dt-tree-table-row
        *dtRowDef="
          let row;
          columns: [
            'showMore',
            'total',
            'blocked',
            'running',
            'waiting',
            'actions'
          ];
          when: isShowMore
        "
        [data]="row"
      ></dt-tree-table-row>
    </dt-tree-table>
  `,
})
export class TreeTableAsyncShowMoreExample {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ThreadFlatNode, ThreadNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ThreadNode, ThreadFlatNode>();

  treeControl: DtTreeControl<ThreadFlatNode>;
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

  transformer = (row: ThreadNode, level: number): ThreadFlatNode => {
    const existingNode = this.nestedNodeMap.get(row);
    const flatNode =
      existingNode && existingNode.name === row.name
        ? existingNode
        : new ThreadFlatNode();
    flatNode.name = row.name;
    flatNode.level = level;
    flatNode.threadlevel = row.threadlevel;
    flatNode.expandable = !!row.children;
    flatNode.blocked = row.blocked;
    flatNode.running = row.running;
    flatNode.waiting = row.waiting;
    flatNode.totalTimeConsumption = row.totalTimeConsumption;
    flatNode.icon = row.icon;
    flatNode.isShowMore = row.isShowMore !== undefined ? row.isShowMore : false;
    this.flatNodeMap.set(flatNode, row);
    this.nestedNodeMap.set(row, flatNode);
    return flatNode;
  };

  private _getLevel = (node: ThreadFlatNode) => node.level;

  private _isExpandable = (node: ThreadFlatNode) => node.expandable;

  private _getChildren = (node: ThreadNode): ThreadNode[] =>
    node.children || [];

  isShowMore = (_: number, node: ThreadFlatNode) => node.isShowMore;

  showMore(): void {
    // removing show more row
    TESTDATA[1].children!.pop();
    // adding data
    TESTDATA[1].children!.push({
      name: 'jetty-423',
      icon: 'apache-tomcat',
      threadlevel: 'S1',
      totalTimeConsumption: 150,
      waiting: 123,
      running: 20,
      blocked: 0,
    });
    TESTDATA[1].children!.push({
      name: 'jetty-424',
      icon: 'apache-tomcat',
      threadlevel: 'S1',
      totalTimeConsumption: 100,
      waiting: 103,
      running: 20,
      blocked: 20,
    });
    this.dataSource.data = TESTDATA;
  }
}
