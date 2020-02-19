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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector
// tslint:disable deprecation

import { Component, DebugElement } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  DtExpandablePanel,
  DtExpandablePanelModule,
} from '@dynatrace/barista-components/expandable-panel';

import { createComponent } from '@dynatrace/barista-components/testing/browser';

describe('DtExpandablePanel', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtExpandablePanelModule, NoopAnimationsModule],
      declarations: [
        ExpandablePanelComponent,
        ExpandablePanelWithTriggerComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('dt-expandable-panel', () => {
    let fixture;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;
    let expandablePanelInstance: DtExpandablePanel;

    beforeEach(async(() => {
      fixture = createComponent(ExpandablePanelComponent);
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtExpandablePanel),
      );
      instanceElement = instanceDebugElement.nativeElement;
      expandablePanelInstance = instanceDebugElement.injector.get<
        DtExpandablePanel
      >(DtExpandablePanel);
    }));

    // test initial state
    it('should be closed initially', () => {
      expect(expandablePanelInstance.expanded).toBe(false);
      expandablePanelInstance.close();
      expect(expandablePanelInstance.expanded).toBe(false);
    });

    // test expanded input
    it('should be expanded', () => {
      expandablePanelInstance.expanded = true;
      expect(expandablePanelInstance.expanded).toBe(true);
    });

    // test toggle method when collapsed
    it('should be expanded when collapsed on toggle', () => {
      expandablePanelInstance.expanded = false;
      expandablePanelInstance.toggle();
      fixture.detectChanges();
      expect(expandablePanelInstance.expanded).toBe(true);
    });

    // test toggle method when expanded
    it('should be collapsed when expanded on toggle', () => {
      expandablePanelInstance.expanded = true;
      expandablePanelInstance.toggle();
      fixture.detectChanges();
      expect(expandablePanelInstance.expanded).toBe(false);
    });

    // test open method
    it('should be expanded after method call', () => {
      expandablePanelInstance.open();
      expect(expandablePanelInstance.expanded).toBe(true);
    });

    // test disabled state
    it('should not expand when disabled', () => {
      expandablePanelInstance.disabled = true;
      expandablePanelInstance.open();
      expect(expandablePanelInstance.expanded).toBe(false);
    });

    // test expanded and disabled state
    it('should close when open and disabled', () => {
      expandablePanelInstance.open();
      expect(expandablePanelInstance.expanded).toBe(true);
      expandablePanelInstance.disabled = true;
      expect(expandablePanelInstance.expanded).toBe(false);
    });

    // check CSS class of panel
    it('should have correct styles applied when expanded', () => {
      expect(instanceElement.classList).not.toContain(
        'dt-expandable-panel-opened',
      );
      expandablePanelInstance.toggle();
      expect(expandablePanelInstance.expanded).toBe(true);
      fixture.detectChanges();
      expect(instanceElement.classList).toContain('dt-expandable-panel-opened');
    });

    // check CSS class of trigger when expanded
    it('should have correctly styled trigger button when expanded', () => {
      const panelFixture = createComponent(ExpandablePanelWithTriggerComponent);
      const panelDebugElement = panelFixture.debugElement.query(
        By.directive(DtExpandablePanel),
      );
      const triggerInstanceElement = panelFixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;
      const panelInstance = panelDebugElement.injector.get<DtExpandablePanel>(
        DtExpandablePanel,
      );

      expect(triggerInstanceElement.classList).toContain(
        'dt-expandable-panel-trigger',
      );
      expect(triggerInstanceElement.classList).not.toContain(
        'dt-expandable-panel-trigger-open',
      );
      panelInstance.expanded = true;
      panelFixture.detectChanges();
      expect(triggerInstanceElement.classList).toContain(
        'dt-expandable-panel-trigger-open',
      );
    });

    // check attributes of panel and trigger when disabled
    it('should have correct attributes when disabled', () => {
      const panelFixture = createComponent(ExpandablePanelWithTriggerComponent);
      const panelDebugElement = panelFixture.debugElement.query(
        By.directive(DtExpandablePanel),
      );
      const triggerInstanceElement = panelFixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;
      const panelInstanceElement = panelDebugElement.nativeElement;
      const panelInstance = panelDebugElement.injector.get<DtExpandablePanel>(
        DtExpandablePanel,
      );

      expect(panelInstanceElement.getAttribute('aria-disabled')).toBe('false');
      expect(triggerInstanceElement.getAttribute('tabindex')).toBe('0');
      expect(triggerInstanceElement.getAttribute('disabled')).toBe(null);

      panelInstance.disabled = true;
      panelFixture.detectChanges();
      expect(panelInstanceElement.getAttribute('aria-disabled')).toBe('true');
      expect(triggerInstanceElement.getAttribute('tabindex')).toBe('-1');
      expect(triggerInstanceElement.getAttribute('disabled')).toBe('true');
    });

    // check expanded and expandChange outputs
    it('should fire expanded and expandChange events on open', () => {
      const expandedSpy = jest.fn();
      const changedSpy = jest.fn();
      const instance = instanceDebugElement.componentInstance;
      const expandedSubscription = instance._panelExpanded.subscribe(
        expandedSpy,
      );
      const changedSubscription = instance.expandChange.subscribe(changedSpy);

      expandablePanelInstance.open();
      fixture.detectChanges();
      expect(expandedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalled();

      expandedSubscription.unsubscribe();
      changedSubscription.unsubscribe();
    });

    // check collapsed and expandChange outputs
    it('should fire collapsed and expandChange events on close', () => {
      expandablePanelInstance.expanded = true;
      const collapsedSpy = jest.fn();
      const changedSpy = jest.fn();
      const instance = instanceDebugElement.componentInstance;
      const collapsedSubscription = instance._panelCollapsed.subscribe(
        collapsedSpy,
      );
      const changedSubscription = instance.expandChange.subscribe(changedSpy);

      expandablePanelInstance.close();
      fixture.detectChanges();
      expect(collapsedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalled();

      collapsedSubscription.unsubscribe();
      changedSubscription.unsubscribe();
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-expandable-panel>text</dt-expandable-panel>
  `,
})
class ExpandablePanelComponent {}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-expandable-panel #panel>text</dt-expandable-panel>
    <button [dtExpandablePanel]="panel">trigger</button>
  `,
})
class ExpandablePanelWithTriggerComponent {}
