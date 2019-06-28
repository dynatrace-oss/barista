// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { async, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtExpandablePanelModule, DtExpandablePanel } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createComponent } from '../../testing/create-component';

// TODO @thomas.pink @fabian.friedl: ***REMOVED***
// Rework tests!!!

describe('DtExpandablePanel', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtExpandablePanelModule, NoopAnimationsModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  describe('dt-expandable-panel', () => {

    let fixture;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;
    let instance: DtExpandablePanel;

    beforeEach(async(() => {
      fixture = createComponent(TestApp);
      instanceDebugElement = fixture.debugElement.query(By.directive(DtExpandablePanel));
      instanceElement = instanceDebugElement.nativeElement;
      instance = instanceDebugElement.injector.get<DtExpandablePanel>(DtExpandablePanel);
    }));

    it('should be closed', () => {
      expect(instance.expanded).toBe(false);
      instance.close();
      expect(instance.expanded).toBe(false);
    });

    it('should be expanded', () => {
      instance.expanded = true;
      expect(instance.expanded).toBe(true);
    });

    it('should be expanded after method call', () => {
      instance.open();
      expect(instance.expanded).toBe(true);
      instance.open();
      expect(instance.expanded).toBe(true);
    });

    it('should be expanded after toggle', () => {
      expect(instance.toggle()).toBe(true);
      expect(instance.expanded).toBe(true);

      instance.close();
      expect(instance.expanded).toBe(false);
    });

    it('should have correct styles applied', () => {
      expect(instanceElement.classList).not.toContain(
        'dt-expandable-panel-opened');

      expect(instance.toggle()).toBe(true);
      fixture.detectChanges();

      expect(instanceElement.classList).toContain(
        'dt-expandable-panel-opened');
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `<dt-expandable-panel>text</dt-expandable-panel>`,
})
class TestApp {
}
