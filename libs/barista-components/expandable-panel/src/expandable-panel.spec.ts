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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector
// eslint-disable  import/no-deprecated

import { Component, DebugElement } from '@angular/core';
import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtExpandablePanelModule } from './expandable-panel-module';
import { DtExpandablePanel } from './expandable-panel';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtExpandablePanel', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtExpandablePanelModule, NoopAnimationsModule],
        declarations: [
          ExpandablePanelComponent,
          ExpandablePanelWithTriggerComponent,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('dt-expandable-panel', () => {
    let fixture;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;
    let expandablePanelInstance: DtExpandablePanel;

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(ExpandablePanelComponent);
        instanceDebugElement = fixture.debugElement.query(
          By.directive(DtExpandablePanel),
        );
        instanceElement = instanceDebugElement.nativeElement;
        expandablePanelInstance =
          instanceDebugElement.injector.get<DtExpandablePanel>(
            DtExpandablePanel,
          );
      }),
    );

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

    // check expanded and expandChange outputs
    it('should fire expanded and expandChange events on open', () => {
      const expandedSpy = jest.fn();
      const changedSpy = jest.fn();
      const instance = instanceDebugElement.componentInstance;
      const expandedSubscription =
        instance._panelExpanded.subscribe(expandedSpy);
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
      const collapsedSubscription =
        instance._panelCollapsed.subscribe(collapsedSpy);
      const changedSubscription = instance.expandChange.subscribe(changedSpy);

      expandablePanelInstance.close();
      fixture.detectChanges();
      expect(collapsedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalled();

      collapsedSubscription.unsubscribe();
      changedSubscription.unsubscribe();
    });
  });

  describe('dt-expandable-panel with trigger', () => {
    let fixture: ComponentFixture<ExpandablePanelWithTriggerComponent>;
    let triggerInstanceElement: HTMLElement;
    let panelDebugElement: DebugElement;
    let panelInstance: DtExpandablePanel;
    let panelInstanceElement: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(ExpandablePanelWithTriggerComponent);
      triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;
      panelInstance = fixture.debugElement.query(
        By.directive(DtExpandablePanel),
      ).componentInstance;
      panelDebugElement = fixture.debugElement.query(
        By.directive(DtExpandablePanel),
      );
      panelInstanceElement = panelDebugElement.nativeElement;
    });

    // check CSS class of trigger when expanded
    it('should have correctly styled trigger button when expanded', () => {
      expect(triggerInstanceElement.classList).toContain(
        'dt-expandable-panel-trigger',
      );
      expect(triggerInstanceElement.classList).not.toContain(
        'dt-expandable-panel-trigger-open',
      );
      panelInstance.expanded = true;
      fixture.detectChanges();
      expect(triggerInstanceElement.classList).toContain(
        'dt-expandable-panel-trigger-open',
      );
    });

    // check attributes of panel and trigger when disabled
    it('should have correct attributes when disabled', () => {
      expect(panelInstanceElement.getAttribute('aria-disabled')).toBe('false');
      expect(triggerInstanceElement.getAttribute('tabindex')).toBe('0');
      expect(triggerInstanceElement.getAttribute('disabled')).toBe(null);

      panelInstance.disabled = true;
      fixture.detectChanges();
      expect(panelInstanceElement.getAttribute('aria-disabled')).toBe('true');
      expect(triggerInstanceElement.getAttribute('tabindex')).toBe('-1');
      expect(triggerInstanceElement.getAttribute('disabled')).toBe('true');
    });

    // check aria-controls attribute
    it('should have the correct aria-controls attribute', () => {
      expect(triggerInstanceElement.getAttribute('aria-controls')).toMatch(
        /dt-expandable-panel-\d/,
      );
    });

    // check aria-controls attribute
    it('should have the correct aria-controls attribute when using ID input', () => {
      fixture.componentInstance.id = 'my-panel';
      fixture.detectChanges();

      triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;
      panelInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel'),
      ).nativeElement;

      expect(panelInstanceElement.getAttribute('id')).toBe('my-panel');
      expect(triggerInstanceElement.getAttribute('aria-controls')).toBe(
        'my-panel',
      );
    });

    // check aria-controls attribute
    it('should fall back to the default id when ID is unset', () => {
      fixture.componentInstance.id = 'my-panel';
      fixture.detectChanges();

      fixture.componentInstance.id = null;
      fixture.detectChanges();

      triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;

      expect(triggerInstanceElement.getAttribute('aria-controls')).toMatch(
        /dt-expandable-panel-\d/,
      );
    });

    // check if it has the correct aria-expanded attribute
    it('should have the correct aria-expanded attribute', () => {
      expect(triggerInstanceElement.getAttribute('aria-expanded')).toBe(
        'false',
      );
    });

    // check if it has the correct aria-expanded attribute is set after expanding
    it('should have the correct aria-expanded attribute after opening the expandable', () => {
      panelInstance.expanded = true;
      fixture.detectChanges();

      expect(triggerInstanceElement.getAttribute('aria-expanded')).toBe('true');
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: ` <dt-expandable-panel>text</dt-expandable-panel> `,
})
class ExpandablePanelComponent {}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-expandable-panel #panel [id]="id">text</dt-expandable-panel>
    <button [dtExpandablePanel]="panel">trigger</button>
  `,
})
class ExpandablePanelWithTriggerComponent {
  id: string | null;
}
