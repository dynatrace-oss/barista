/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
import {
  BaUxdNode,
  BaUxdEdge,
} from '@dynatrace/shared/design-system/interfaces';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'ba-decision-graph-node',
  templateUrl: './ba-decision-graph-node.html',
  styleUrls: ['./ba-decision-graph-node.scss'],
})
export class BaDecisionGraphNode implements AfterViewInit {
  @Input()
  set node(node: BaUxdNode) {
    this._node = node;
    this.resetProgress();
    this._decisionGraphSteps.push(cloneDeep(node));
  }

  /** Startnode picked from the user */
  _node: BaUxdNode | null;

  /** Array of all nodes and edges */
  @Input()
  decisionGraphData: BaUxdNode[] = [];

  /** Emits when user wants to start over */
  @Output()
  startOver = new EventEmitter<void>();

  /** List of elementrefs containing displayed nodes */
  @ViewChildren('nodes') nodes: QueryList<ElementRef<HTMLElement>>;

  /** @internal Array of all nodes and edges which should be displayed */
  _decisionGraphSteps: BaUxdNode[] = [];

  /** @internal Whether the Undo button in template is displayed */
  _started = false;

  constructor(private _sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.nodes.last.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  /**
   * Pushes the next node into the decisionGraphSteps array
   *
   * @param nextNodeId Next node id to be displayed
   */
  setNextNode(selectedEdge: BaUxdEdge): void {
    // Finds next node to display by comparing the id reference to a node, in the edge.
    const nextNode = this.decisionGraphData.find(
      (node) => node.id === selectedEdge.uxd_node,
    );
    if (
      nextNode &&
      this._decisionGraphSteps[this._decisionGraphSteps.length - 1].id !==
        nextNode.id
    ) {
      this._decisionGraphSteps[
        this._decisionGraphSteps.length - 1
      ].path.forEach((edge) => {
        edge.selected = edge.text === selectedEdge.text;
      });
      this._decisionGraphSteps.push(cloneDeep(nextNode));
      this.nodes.last.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this._started = true;
    } else {
      throw new Error(`Next node not found. Node id: ${selectedEdge.uxd_node}`);
    }
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
    // Set edge states to undefined because steps array is modified
    this.setSelectedStateOfEdge(this._decisionGraphSteps.length - 2);
    this._decisionGraphSteps.splice(this._decisionGraphSteps.length - 1);
    this.nodes.last.nativeElement.scrollIntoView({ behavior: 'smooth' });
    if (this._decisionGraphSteps.length < 2) {
      this._started = false;
    }
  }

  /** Sets a nodes path.selected state */
  setSelectedStateOfEdge(index: number): void {
    if (this._decisionGraphSteps.length > 1) {
      this._decisionGraphSteps[index].path.forEach((edge) => {
        edge.selected = undefined;
      });
    }
  }

  /**
   * Converts a string to SafeHtml using the DomSanitizer
   *
   * @param nodeText string to be converted to SafeHtml
   */
  getSanitizedNodeText(nodeText: string): SafeHtml | undefined {
    return this._sanitizer.bypassSecurityTrustHtml(nodeText);
  }

  /** Whether last node is a tasknode */
  isTasknode(): boolean {
    return (
      this._decisionGraphSteps[this._decisionGraphSteps.length - 1].tasknode ===
      true
    );
  }

  /** Checks whether a text contains a type. Moved here to have less logic in the template. */
  checkEdgeType(text: string, type: string): boolean {
    return text.toLowerCase().includes(type);
  }

  sortNodePath(node: BaUxdNode): BaUxdEdge[] {
    return node.path.sort();
  }

  setContentClass(node: BaUxdNode): string {
    return node.tasknode ? 'ba-uxd-tasknode-content' : 'ba-uxd-node-content';
  }
}
