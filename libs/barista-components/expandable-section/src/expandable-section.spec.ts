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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector
// eslint-disable  import/no-deprecated

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtExpandableSectionModule } from './expandable-section-module';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { createComponent } from '@dynatrace/testing/browser';
import { DtExpandableSection } from './expandable-section';

describe('DtExpandableSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtExpandableSectionModule,
      ],
      declarations: [
        TestApp,
        StaticExpandedAttrTestApp,
        StaticDisabledAttrTestApp,
      ],
    });
    TestBed.compileComponents();
  });

  describe('dt-expandable-section', () => {
    let fixture: ComponentFixture<TestApp>;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;
    let expandableSectionInstance: DtExpandableSection;

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(TestApp);
        instanceDebugElement = fixture.debugElement.query(
          By.directive(DtExpandableSection),
        );
        instanceElement = instanceDebugElement.nativeElement;
        expandableSectionInstance =
          instanceDebugElement.injector.get<DtExpandableSection>(
            DtExpandableSection,
          );
      }),
    );

    // test initial state
    it('should be closed initially', () => {
      expect(expandableSectionInstance.expanded).toBe(false);
      expandableSectionInstance.close();
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // test expanded input
    it('should be expanded', () => {
      expandableSectionInstance.expanded = true;
      expect(expandableSectionInstance.expanded).toBe(true);
    });

    // test toggle method when collapsed
    it('should be expanded when collapsed on toggle', () => {
      expandableSectionInstance.expanded = false;
      expandableSectionInstance.toggle();
      expect(expandableSectionInstance.expanded).toBe(true);
    });

    // test toggle method when expanded
    it('should be collapsed when expanded on toggle', () => {
      expandableSectionInstance.expanded = true;
      expandableSectionInstance.toggle();
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // test open method
    it('should be expanded after method call', () => {
      expandableSectionInstance.open();
      expect(expandableSectionInstance.expanded).toBe(true);
    });

    // test disabled state
    it('should not expand when disabled', () => {
      expandableSectionInstance.disabled = true;
      expandableSectionInstance.open();
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // test opened and disabled state
    it('should close when open and disabled', () => {
      expandableSectionInstance.open();
      expect(expandableSectionInstance.expanded).toBe(true);
      expandableSectionInstance.disabled = true;
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // check CSS class when expanded
    it('should have correct styles applied when expanded', () => {
      expect(instanceElement.classList).not.toContain(
        'dt-expandable-section-opened',
      );
      expandableSectionInstance.toggle();
      expect(expandableSectionInstance.expanded).toBe(true);
      fixture.detectChanges();
      expect(instanceElement.classList).toContain(
        'dt-expandable-section-opened',
      );
    });

    // check aria-controls attribute
    it('should have the correct aria-controls attribute', () => {
      const triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;

      expect(triggerInstanceElement.getAttribute('aria-controls')).toMatch(
        /dt-expandable-section-\d/,
      );
    });

    it('should have the correct aria-controls attribute when using ID input', () => {
      fixture.componentInstance.id = 'my-section';
      fixture.detectChanges();

      const triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;
      const panelInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel'),
      ).nativeElement;

      expect(panelInstanceElement.getAttribute('id')).toBe('my-section');
      expect(triggerInstanceElement.getAttribute('aria-controls')).toBe(
        'my-section',
      );
    });

    it('should fall back to the default id when ID is unset', () => {
      fixture.componentInstance.id = 'my-panel';
      fixture.detectChanges();

      fixture.componentInstance.id = null;
      fixture.detectChanges();

      const triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;

      expect(triggerInstanceElement.getAttribute('aria-controls')).toMatch(
        /dt-expandable-section-\d/,
      );
    });

    // check if it has the correct aria-expanded attribute
    it('should have the correct aria-expanded attribute', () => {
      const triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;

      expect(triggerInstanceElement.getAttribute('aria-expanded')).toBe(
        'false',
      );
    });

    // check if it has the correct aria-expanded attribute is set after expanding
    it('should have the correct aria-expanded attribute after opening the expandable', () => {
      const triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;

      expandableSectionInstance.toggle();
      fixture.detectChanges();

      expect(triggerInstanceElement.getAttribute('aria-expanded')).toBe('true');
    });

    // check attributes of section and trigger when disabled
    it('should have correct attributes when disabled', () => {
      const triggerInstanceElement = fixture.debugElement.query(
        By.css('.dt-expandable-panel-trigger'),
      ).nativeElement;

      expect(instanceElement.getAttribute('aria-disabled')).toBe('false');
      expect(triggerInstanceElement.getAttribute('tabindex')).toBe('0');
      expect(triggerInstanceElement.getAttribute('disabled')).toBe(null);

      expandableSectionInstance.disabled = true;
      fixture.detectChanges();
      expect(instanceElement.getAttribute('aria-disabled')).toBe('true');
      expect(triggerInstanceElement.getAttribute('tabindex')).toBe('-1');
      expect(triggerInstanceElement.getAttribute('disabled')).toBe('true');
    });

    // check expanded and expandChange outputs
    it('should fire expanded and expandChange events on open', () => {
      const expandedSpy = jest.fn();
      const changedSpy = jest.fn();
      const instance = instanceDebugElement.componentInstance;
      const expandedSubscription =
        instance._sectionExpanded.subscribe(expandedSpy);
      const changedSubscription = instance.expandChange.subscribe(changedSpy);

      expandableSectionInstance.open();
      fixture.detectChanges();
      expect(expandedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalledWith(true);

      expandedSubscription.unsubscribe();
      changedSubscription.unsubscribe();
    });

    // check collapsed and expandChange outputs
    it('should fire collapsed and expandChange events on close', () => {
      expandableSectionInstance.expanded = true;
      fixture.detectChanges();
      const collapsedSpy = jest.fn();
      const changedSpy = jest.fn();
      const instance = instanceDebugElement.componentInstance;
      const collapsedSubscription =
        instance._sectionCollapsed.subscribe(collapsedSpy);
      const changedSubscription = instance.expandChange.subscribe(changedSpy);

      expandableSectionInstance.close();
      fixture.detectChanges();
      expect(collapsedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalled();
      expect(changedSpy).toHaveBeenCalledWith(false);

      collapsedSubscription.unsubscribe();
      changedSubscription.unsubscribe();
    });
  });

  describe('dt-expandable-section static attributes', () => {
    it('should reflect the expandable attribute to the property', () => {
      const fixture = createComponent(StaticExpandedAttrTestApp);
      const instanceDebugElement = fixture.debugElement.query(
        By.directive(DtExpandableSection),
      );
      const expandableSectionInstance =
        instanceDebugElement.injector.get<DtExpandableSection>(
          DtExpandableSection,
        );
      fixture.detectChanges();

      expect(expandableSectionInstance.expanded).toBe(true);
    });

    it('should reflect the disabled attribute to the property', () => {
      const fixture = createComponent(StaticDisabledAttrTestApp);
      const instanceDebugElement = fixture.debugElement.query(
        By.directive(DtExpandableSection),
      );
      const expandableSectionInstance =
        instanceDebugElement.injector.get<DtExpandableSection>(
          DtExpandableSection,
        );
      fixture.detectChanges();

      expect(expandableSectionInstance.disabled).toBe(true);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-expandable-section [id]="id">
      <dt-expandable-section-header>Header</dt-expandable-section-header>
      text
    </dt-expandable-section>
  `,
})
class TestApp {
  id: string | null;
}

@Component({
  selector: 'dt-static-attr-test-app',
  template: `
    <dt-expandable-section expanded>
      <dt-expandable-section-header>Header</dt-expandable-section-header>
      text
    </dt-expandable-section>
  `,
})
class StaticExpandedAttrTestApp {}

@Component({
  selector: 'dt-static-attr-test-app',
  template: `
    <dt-expandable-section disabled>
      <dt-expandable-section-header>Header</dt-expandable-section-header>
      text
    </dt-expandable-section>
  `,
})
class StaticDisabledAttrTestApp {}
