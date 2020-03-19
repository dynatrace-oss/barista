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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaDecisionGraphNode } from './ba-decision-graph-node';
import { nodes } from '../ba-decision-graph-test-data';
import { BaDecisiongraphNodeNavigation } from './ba-decision-graph-node-navigation';

describe('BaDecisionGraphNode', () => {
  let component: BaDecisionGraphNode;
  let fixture: ComponentFixture<BaDecisionGraphNode>;
  // scrollIntoView is not supported by JSDOM yet.
  // This workaround creates a function on HTMLElements.
  // Works even with error
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaDecisionGraphNode, BaDecisiongraphNodeNavigation],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BaDecisionGraphNode);
    component = fixture.componentInstance;
    component.startnode = nodes[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
