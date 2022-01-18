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
import { By } from '@angular/platform-browser';

import { BaDecisionGraphNode } from './ba-decision-graph-node';
import { nodes, wrongIdNode } from '../ba-decision-graph-test-data';
import { BaDecisiongraphNodeNavigation } from './';
import { dispatchFakeEvent } from '@dynatrace/testing/browser';

describe('BaDecisionGraphNode', () => {
  let component: BaDecisionGraphNode;
  let fixture: ComponentFixture<BaDecisionGraphNode>;
  // scrollIntoView is not supported by jest yet.
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BaDecisionGraphNode, BaDecisiongraphNodeNavigation],
      }).compileComponents();
    }),
  );

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(BaDecisionGraphNode);
      component = fixture.componentInstance;
      component.node = nodes[1];
      component.decisionGraphData = nodes;
      fixture.detectChanges();
    }),
  );

  it('should set next node to decisiongraph steps', () => {
    expect(component._decisionGraphSteps.length).toBe(1);
    const buttonElement = fixture.debugElement.query(
      By.css('.ba-uxd-yes-edge'),
    ).nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    fixture.detectChanges();
    expect(component._decisionGraphSteps.length).toBe(2);
  });

  it('should undo last step', () => {
    expect(component._decisionGraphSteps.length).toBe(1);
    const buttonElement = fixture.debugElement.query(
      By.css('.ba-uxd-yes-edge'),
    ).nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    fixture.detectChanges();
    expect(component._decisionGraphSteps.length).toBe(2);
    const backButtonElement = fixture.debugElement.query(
      By.css('#backButtonTestId'),
    ).nativeElement;
    dispatchFakeEvent(backButtonElement, 'click');
    expect(component._decisionGraphSteps.length).toBe(1);
  });

  it('should set edge state to undefined', () => {
    expect(component._decisionGraphSteps[0].path[0].selected).not.toBeDefined();
    const buttonElement = fixture.debugElement.query(
      By.css('.ba-uxd-yes-edge'),
    ).nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    fixture.detectChanges();
    expect(component._decisionGraphSteps[0].path[0].selected).toBe(true);
    component.setSelectedStateOfEdge(0);
    fixture.detectChanges();
    expect(component._decisionGraphSteps[0].path[0].selected).toBe(undefined);
  });

  it('should reset progress when start over button is clicked', () => {
    const buttonElement = fixture.debugElement.query(
      By.css('.ba-uxd-yes-edge'),
    ).nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    expect(component._decisionGraphSteps.length).toBe(2);
    const startOverElement = fixture.debugElement.query(
      By.css('#startOverButtonTestId'),
    ).nativeElement;
    dispatchFakeEvent(startOverElement, 'click');
    expect(component._decisionGraphSteps.length).toBe(0);
  });

  it('should remove tasknode on undostep', () => {
    component.node = nodes[2];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('.ba-uxd-edge-button'),
    ).nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    fixture.detectChanges();
    expect(
      component._decisionGraphSteps[component._decisionGraphSteps.length - 1]
        .tasknode,
    ).toBe(true);
    const backButtonElement = fixture.debugElement.query(
      By.css('#backTaskButtonTestId'),
    ).nativeElement;
    dispatchFakeEvent(backButtonElement, 'click');
    expect(
      component._decisionGraphSteps[component._decisionGraphSteps.length - 1]
        .tasknode,
    ).not.toBe(true);
  });

  it('should return console error when node id is wrong', () => {
    component.node = wrongIdNode;
    fixture.detectChanges();
    expect(component._decisionGraphSteps.length).toBe(1);
    expect(() => component.setNextNode(component.node.path[0])).toThrowError();
  });

  it('should set started to false when steps array is lower than 2', () => {
    expect(component._started).toBe(false);
    component._decisionGraphSteps.push(nodes[0]);
    fixture.detectChanges();
    dispatchFakeEvent(
      fixture.debugElement.query(By.css('.ba-uxd-yes-edge')).nativeElement,
      'click',
    );
    fixture.detectChanges();
    expect(component._started).toBe(true);
    component.undoLastStep();
    component.undoLastStep();
    expect(component._started).toBe(false);
  });

  it('should set if next node is tasknode', () => {
    component.resetToInitial();
    component.node = nodes[2];
    fixture.detectChanges();
    dispatchFakeEvent(
      fixture.debugElement.query(By.css('.ba-uxd-edge-button')).nativeElement,
      'click',
    );
    fixture.detectChanges();
    expect(
      component._decisionGraphSteps[component._decisionGraphSteps.length - 1]
        .tasknode,
    ).toBe(true);
  });
});
