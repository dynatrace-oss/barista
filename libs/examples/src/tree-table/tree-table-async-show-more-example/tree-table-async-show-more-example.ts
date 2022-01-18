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

import {
  DtTreeControl,
  DtTreeDataSource,
  DtTreeFlattener,
} from '@dynatrace/barista-components/core';
import { ThreadFlatNode, ThreadNode } from '../tree-table-example-types';

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
        running: 20,
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
    name: 'jetty',
    icon: 'process',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'jetty-422',
        icon: 'process',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: '',
        icon: 'process',
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
    icon: 'process',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
  },
];

@Component({
  selector: 'dt-example-tree-table-async-show-more',
  templateUrl: 'tree-table-async-show-more-example.html',
})
export class DtExampleTreeTableAsyncShowMore {
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
      icon: 'process',
      threadlevel: 'S1',
      totalTimeConsumption: 150,
      waiting: 123,
      running: 20,
      blocked: 0,
    });
    TESTDATA[1].children!.push({
      name: 'jetty-424',
      icon: 'process',
      threadlevel: 'S1',
      totalTimeConsumption: 100,
      waiting: 103,
      running: 20,
      blocked: 20,
    });
    this.dataSource.data = TESTDATA;
  }
}
