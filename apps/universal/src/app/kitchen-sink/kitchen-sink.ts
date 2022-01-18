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
import { DtQuickFilterDefaultDataSource } from '@dynatrace/barista-components/quick-filter';
import {
  FILTER_FIELD_TEST_DATA,
  ThreadFlatNode,
  ThreadNode,
  TREE_TABLE_TEST_DATA,
} from '@dynatrace/testing/fixtures';

@Component({
  selector: 'dt-kitchen-sink',
  templateUrl: './kitchen-sink.html',
})
export class KitchenSink {
  tableDataSource: object[] = [
    { host: 'et-demo-2-win4' },
    { host: 'et-demo-2-win6' },
    { host: 'et-demo-2-win8' },
  ];

  treeControl: DtTreeControl<ThreadFlatNode>;
  treeFlattener: DtTreeFlattener<ThreadNode, ThreadFlatNode>;
  treeTableDataSource: DtTreeDataSource<ThreadNode, ThreadFlatNode>;

  quickFilterDataSource = new DtQuickFilterDefaultDataSource(
    FILTER_FIELD_TEST_DATA,
    {
      showInSidebar: () => true,
    },
  );

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
    this.treeTableDataSource = new DtTreeDataSource(
      this.treeControl,
      this.treeFlattener,
    );
    this.treeTableDataSource.data = TREE_TABLE_TEST_DATA;
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

  sunburstChartSeries = [
    {
      // value: 4,
      label: 'Locke',
      children: [
        {
          value: 2,
          label: 'John',
        },
        {
          value: 1,
          label: 'Terry',
        },
        {
          value: 1,
          label: "O'Quinn",
        },
      ],
    },
    {
      // value: 8,
      label: 'Reyes',
      children: [
        {
          value: 4,
          label: 'Hugo',
        },
        {
          value: 2,
          label: 'Jorge',
        },
        {
          value: 2,
          label: 'Garcia',
        },
      ],
    },
  ];

  stackedSeriesChartSeries = [
    {
      label: 'Espresso',
      nodes: [
        {
          value: 1,
          label: 'Coffee',
        },
      ],
    },
    {
      label: 'Macchiato',
      nodes: [
        {
          value: 2,
          label: 'Coffee',
        },
        {
          value: 1,
          label: 'Milk',
        },
      ],
    },
    {
      label: 'Americano',
      nodes: [
        {
          value: 2,
          label: 'Coffee',
        },
        {
          value: 3,
          label: 'Water',
        },
      ],
    },
    {
      label: 'Mocha',
      nodes: [
        {
          value: 2,
          label: 'Coffee',
        },
        {
          value: 2,
          label: 'Chocolate',
        },
        {
          value: 1,
          label: 'Milk',
        },
      ],
    },
  ];
}
