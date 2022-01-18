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

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaDecisionGraph } from './ba-decision-graph';
import { DsPageService } from '@dynatrace/shared/design-system/ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { nodes } from './ba-decision-graph-test-data';
import {
  BaDecisionGraphNode,
  BaDecisiongraphNodeNavigation,
} from './ba-decision-graph-node';
import { BaDecisionGraphStartnode } from './ba-decision-graph-start-node';

describe('BaDecisionGraph', () => {
  let component: BaDecisionGraph;
  let fixture: ComponentFixture<BaDecisionGraph>;
  // scrollIntoView is not supported by jest yet.
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        declarations: [
          BaDecisionGraph,
          BaDecisionGraphNode,
          BaDecisionGraphStartnode,
          BaDecisiongraphNodeNavigation,
        ],
        providers: [DsPageService],
      }).compileComponents();
    }),
  );

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(BaDecisionGraph);
      component = fixture.componentInstance;
      component._decisionGraphData = nodes;
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get startnodes from data', () => {
    component.getStartNodes();
    expect(component._decisionGraphStartnodes).toStrictEqual([nodes[0]]);
  });

  it('should set node upon selection of a startnode', () => {
    component.getStartNodes();
    component.setSelectedNode(component._decisionGraphStartnodes[0]);
    fixture.detectChanges();
    expect(component._selectedNode).toStrictEqual(nodes[1]);
  });

  it('should reset selectedNode', () => {
    component.resetToInitial();
    expect(component._selectedNode).not.toBeDefined();
  });
});
