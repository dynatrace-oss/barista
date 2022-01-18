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

import { FlatTreeControl } from '@angular/cdk/tree';
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
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
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

@Component({
  selector: 'dt-example-tree-table-simple',
  templateUrl: 'tree-table-simple-example.html',
})
export class DtExampleTreeTableSimple {
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
