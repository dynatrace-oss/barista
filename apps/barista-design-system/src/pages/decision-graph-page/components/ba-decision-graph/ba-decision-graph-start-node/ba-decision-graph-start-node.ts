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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaUxdNode } from '@dynatrace/shared/design-system/interfaces';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ba-decision-graph-start-node',
  templateUrl: './ba-decision-graph-start-node.html',
  styleUrls: ['./ba-decision-graph-start-node.scss'],
})
export class BaDecisionGraphStartnode {
  /** Array of startnodes */
  @Input('startnodes')
  decisionGraphStartnodes: BaUxdNode[] = [];

  /** Emits the selected startnode for pathing through nodes */
  @Output('selectedNode')
  startnodeSelected = new EventEmitter<BaUxdNode>();

  /** @internal currently selected startnode */
  _selectedStartnode: BaUxdNode;

  constructor(private _sanitizer: DomSanitizer) {}

  /**
   * Converts a string to SafeHtml using the DomSanitizer
   *
   * @param nodeText string to be converted to SafeHtml
   */
  getSanitizedNodeText(nodeText: string): SafeHtml | undefined {
    return this._sanitizer.bypassSecurityTrustHtml(nodeText);
  }

  /** Sets and emits selected startnode */
  selectStartnode(startnode: BaUxdNode): void {
    this._selectedStartnode = startnode;
    this.startnodeSelected.emit(this._selectedStartnode);
  }

  /** Checks which startnode was selected. */
  isSelectedStartnode(index: number): boolean {
    return (
      this.decisionGraphStartnodes.indexOf(this._selectedStartnode) === index
    );
  }
}
