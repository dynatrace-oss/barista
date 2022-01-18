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
import { BaDecisionGraphStartnode } from './ba-decision-graph-start-node';
import { nodes } from '../ba-decision-graph-test-data';

describe('BaDecisionGraphStartnode', () => {
  let component: BaDecisionGraphStartnode;
  let fixture: ComponentFixture<BaDecisionGraphStartnode>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BaDecisionGraphStartnode],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BaDecisionGraphStartnode);
    component = fixture.componentInstance;
    component.decisionGraphStartnodes = [nodes[0]];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true', () => {
    expect(component.decisionGraphStartnodes);
  });

  it('should select startnode', () => {
    component.selectStartnode(nodes[0]);
    expect(component._selectedStartnode).toStrictEqual(nodes[0]);
  });
});
