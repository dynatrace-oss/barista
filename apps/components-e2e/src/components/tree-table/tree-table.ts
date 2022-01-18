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

import { Component, OnDestroy } from '@angular/core';
import { DtIconType } from '@dynatrace/barista-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  DtTreeFlattener,
  DtTreeDataSource,
  DtTreeControl,
} from '@dynatrace/barista-components/core';
import { BehaviorSubject, Subscription } from 'rxjs';

const TESTDATA: ThreadNode[] = [
  {
    name: 'hz.hzInstance_1_cluster.thread',
    icon: 'airplane',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
        icon: 'airplane',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'hz.hzInstance_1_cluster.thread-2',
        icon: 'airplane',
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
    icon: 'airplane',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'jetty-422',
        icon: 'airplane',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'jetty-423',
        icon: 'airplane',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
      {
        name: 'jetty-424',
        icon: 'airplane',
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
    icon: 'airplane',
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
  selector: 'dt-e2e-tree-table',
  templateUrl: 'tree-table.html',
})
export class DtE2ETreeTable implements OnDestroy {
  expandChangedCount = 0;
  expandChangedCountWithExpandTrue = 0;
  expandChangedCountWithExpandFalse = 0;
  expandedCount = 0;
  collapsedCount = 0;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ThreadFlatNode, ThreadNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ThreadNode, ThreadFlatNode>();

  treeControl: FlatTreeControl<ThreadFlatNode>;
  treeFlattener: DtTreeFlattener<ThreadNode, ThreadFlatNode>;
  dataSource: DtTreeDataSource<ThreadNode, ThreadFlatNode>;

  get data(): ThreadNode[] {
    return this.dataChange.value;
  }

  dataChange = new BehaviorSubject<ThreadNode[]>([]);

  _dataChangeSub: Subscription;

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
    this.dataChange.next(TESTDATA);

    this._dataChangeSub = this.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  expandStateChanged(state: boolean): void {
    this.expandChangedCount++;
    if (state) {
      this.expandChangedCountWithExpandTrue++;
    } else {
      this.expandChangedCountWithExpandFalse++;
    }
  }
  collapsed(): void {
    this.collapsedCount++;
  }
  expanded(): void {
    this.expandedCount++;
  }

  hasChild = (_: number, _nodeData: ThreadFlatNode) => _nodeData.expandable;

  transformer = (node: ThreadNode, level: number): ThreadFlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : new ThreadFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.threadlevel = node.threadlevel;
    flatNode.expandable = !!node.children;
    flatNode.blocked = node.blocked;
    flatNode.running = node.running;
    flatNode.waiting = node.waiting;
    flatNode.totalTimeConsumption = node.totalTimeConsumption;
    flatNode.icon = node.icon;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  private _getLevel = (node: ThreadFlatNode) => node.level;

  private _isExpandable = (node: ThreadFlatNode) => node.expandable;

  private _getChildren = (node: ThreadNode): ThreadNode[] =>
    node.children || [];

  ngOnDestroy(): void {
    this._dataChangeSub.unsubscribe();
  }
}
