// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector
// tslint:disable deprecation

import { Component, DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtExpandableSection,
  DtExpandableSectionModule,
  DtIconModule,
} from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';

describe('DtExpandableSection', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtExpandableSectionModule,
      ],
      declarations: [TestApp],
    });
    TestBed.compileComponents();
  }));

  describe('dt-expandable-section', () => {
    let fixture: ComponentFixture<TestApp>;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;
    let expandableSectionInstance: DtExpandableSection;

    beforeEach(async(() => {
      fixture = createComponent(TestApp);
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtExpandableSection),
      );
      instanceElement = instanceDebugElement.nativeElement;
      expandableSectionInstance = instanceDebugElement.injector.get<
        DtExpandableSection
      >(DtExpandableSection);
    }));

    // test initial state
    it('should be closed initially', () => {
      expect(expandableSectionInstance.opened).toBe(false);
      expect(expandableSectionInstance.expanded).toBe(false);
      expandableSectionInstance.close();
      expect(expandableSectionInstance.opened).toBe(false);
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // test expanded input
    it('should be expanded', () => {
      expandableSectionInstance.opened = true;
      expect(expandableSectionInstance.opened).toBe(true);
      expandableSectionInstance.opened = false;
      expandableSectionInstance.expanded = true;
      expect(expandableSectionInstance.expanded).toBe(true);
    });

    // test toggle method when collapsed
    it('should be expanded when collapsed on toggle', () => {
      expandableSectionInstance.expanded = false;
      expect(expandableSectionInstance.toggle()).toBe(true);
      expect(expandableSectionInstance.expanded).toBe(true);
    });

    // test toggle method when expanded
    it('should be collapsed when expanded on toggle', () => {
      expandableSectionInstance.expanded = true;
      expect(expandableSectionInstance.toggle()).toBe(false);
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // test open method
    it('should be expanded after method call', () => {
      expandableSectionInstance.open();
      expect(expandableSectionInstance.opened).toBe(true);
      expect(expandableSectionInstance.expanded).toBe(true);
    });

    // @breaking-change Remove test with v5.0.0 (toggle already tested above)
    it('should be expanded after toggle', () => {
      expect(expandableSectionInstance.toggle()).toBe(true);
      expect(expandableSectionInstance.opened).toBe(true);

      expandableSectionInstance.close();
      expect(expandableSectionInstance.opened).toBe(false);
    });

    // test disabled state
    it('should not expand when disabled', () => {
      expandableSectionInstance.disabled = true;
      expandableSectionInstance.open();
      expect(expandableSectionInstance.expanded).toBe(false);
    });

    // test expanded and disabled state
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
      expect(expandableSectionInstance.toggle()).toBe(true);
      fixture.detectChanges();
      expect(instanceElement.classList).toContain(
        'dt-expandable-section-opened',
      );
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
      const expandedSubscription = instance._sectionExpanded.subscribe(
        expandedSpy,
      );
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
      const collapsedSpy = jest.fn();
      const changedSpy = jest.fn();
      const instance = instanceDebugElement.componentInstance;
      const collapsedSubscription = instance._sectionCollapsed.subscribe(
        collapsedSpy,
      );
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
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-expandable-section>
      <dt-expandable-section-header>Header</dt-expandable-section-header>
      text
    </dt-expandable-section>
  `,
})
class TestApp {}
