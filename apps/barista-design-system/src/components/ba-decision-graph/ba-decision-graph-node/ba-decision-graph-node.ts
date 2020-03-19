/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { BaUxdNode, BaUxdEdge } from '@dynatrace/shared/barista-definitions';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'ba-decision-graph-node',
  templateUrl: './ba-decision-graph-node.html',
  styleUrls: ['./ba-decision-graph-node.scss'],
})
export class BaDecisionGraphNode implements AfterViewInit {
  @Input()
  set startnode(startnode: BaUxdNode) {
    this._startnode = startnode;
    this.resetProgress();
    this._decisionGraphSteps.push(cloneDeep(startnode));
  }

  /** Startnode picked from the user */
  _startnode: BaUxdNode | undefined;

  /** Array of all nodes and edges */
  @Input()
  decisionGraphData: BaUxdNode[] = [];

  @Output('startOver')
  startOver = new EventEmitter<void>();

  @ViewChildren('nodes') nodes: QueryList<ElementRef>;

  /** @internal Array of all nodes and edges which should be displayed */
  _decisionGraphSteps: BaUxdNode[] = [];

  /** @internal Whether the Undo button in template is displayed */
  _started: boolean = false;

  constructor(private _sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    (this.nodes.last.nativeElement as HTMLElement).scrollIntoView({
      behavior: 'smooth',
    });
  }

  /**
   * Pushes the next node into the decisionGraphSteps array
   * @param nextNodeId Next node id to be displayed
   */
  setNextNode(selectedEdge: BaUxdEdge): void {
    this._decisionGraphSteps[this._decisionGraphSteps.length - 1].path.map(
      edge => {
        edge.selected = edge.text === selectedEdge.text;
      },
    );
    // Finds next node to display by comparing the id reference to a node, in the edge.
    const nextNode = this.decisionGraphData.find(node => {
      return node.id === selectedEdge.uxd_node;
    });
    if (nextNode) {
      this._decisionGraphSteps.push(cloneDeep(nextNode));
    } else {
      console.error(
        `Next node not found. Id not matching any entries: ${selectedEdge.uxd_node}`,
      );
    }
    this.nodes.last.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this._started = true;
  }

  /** Resets user decisions and decisionsarray */
  resetProgress(): void {
    this._decisionGraphSteps = [];
    this._started = false;
  }

  /** Called when user wants to reset to initial state */
  resetToInitial(): void {
    this.resetProgress();
    this.startOver.emit();
  }

  /** Removes the last step in the decisionGraphSteps array */
  undoLastStep(): void {
    const index = this._decisionGraphSteps.length - 2;
    // Set edge states to undefined because steps array is modified
    if (this._decisionGraphSteps.length > 1) {
      this._decisionGraphSteps[index] = this.setSelectedStateOfEdge(
        this._decisionGraphSteps[index],
        undefined,
      );
    }
    this._decisionGraphSteps.splice(this._decisionGraphSteps.length - 1);
    this.nodes.last.nativeElement.scrollIntoView({ behavior: 'smooth' });
    if (this._decisionGraphSteps.length < 2) {
      this._started = false;
    }
  }

  /** Sets a nodes path.selected state */
  setSelectedStateOfEdge(node: BaUxdNode, state?: boolean): BaUxdNode {
    node.path.map(edge => {
      edge.selected = state;
    });
    return node;
  }

  /**
   * Converts a string to SafeHtml using the DomSanitizer
   * @param nodeText string to be converted to SafeHtml
   */
  getSanitizedNodeText(nodeText: string): SafeHtml | undefined {
    return this._sanitizer.bypassSecurityTrustHtml(nodeText);
  }
}
