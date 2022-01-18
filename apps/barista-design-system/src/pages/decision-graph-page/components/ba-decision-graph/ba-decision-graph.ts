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

import { Component, OnInit } from '@angular/core';
import { BaUxdNode } from '@dynatrace/shared/design-system/interfaces';
import { DsPageService } from '@dynatrace/shared/design-system/ui';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'ba-decision-graph',
  templateUrl: './ba-decision-graph.html',
  styleUrls: ['./ba-decision-graph.scss'],
})
export class BaDecisionGraph implements OnInit {
  /** Data from database */
  private _decisionGraphData$ = this._pageService._getPage('uxdg-data');

  /** @internal Array of all nodes and edges */
  _decisionGraphData: BaUxdNode[] = [];

  /** @internal Array of all startnodes  which should be displayed */
  _decisionGraphStartnodes: BaUxdNode[] = [];

  /** @internal Contains the startnode the user has selected */
  _selectedNode: BaUxdNode | undefined;

  constructor(private _pageService: DsPageService<any>) {}

  ngOnInit(): void {
    this._decisionGraphData$.subscribe((data) => {
      this._decisionGraphData = cloneDeep(data);
      this.getStartNodes();
    });
  }

  /** Gets all starting nodes from decisionGraphData */
  getStartNodes(): void {
    this._decisionGraphData.forEach((node) => {
      if (node.start) {
        this._decisionGraphStartnodes.push(cloneDeep(node));
      }
    });
    this._decisionGraphStartnodes.sort((a, b) => a.order - b.order);
  }

  /** Sets the currently selected startnode when emitted from startnode component */
  setSelectedNode(selectedStartnode: BaUxdNode): void {
    let id;
    // skip first edge (not so sure).
    selectedStartnode.path.forEach((edge) => {
      id = edge.uxd_node;
    });
    this._decisionGraphData.forEach((data) => {
      if (data.id === id) {
        this._selectedNode = cloneDeep(data);
      }
    });
  }

  /** Reset to initial state */
  resetToInitial(): void {
    this._selectedNode = undefined;
  }
}
