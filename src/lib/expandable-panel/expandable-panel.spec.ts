import { async, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtExpandablePanelModule, DtExpandablePanel } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
      fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      instanceDebugElement = fixture.debugElement.query(By.directive(DtExpandablePanel));
      instanceElement = instanceDebugElement.nativeElement;
      instance = instanceDebugElement.injector.get<DtExpandablePanel>(DtExpandablePanel);
    }));

    it('should be closed', () => {
      expect(instance.opened).toBe(false);
      instance.close();
      expect(instance.opened).toBe(false);
    });

    it('should be opened', () => {
      instance.opened = true;
      expect(instance.opened).toBe(true);
    });

    it('should be opened after method call', () => {
      instance.open();
      expect(instance.opened).toBe(true);
      instance.open();
      expect(instance.opened).toBe(true);
    });

    it('should be opened after toggle', () => {
      expect(instance.toggle()).toBe(true);
      expect(instance.opened).toBe(true);

      instance.close();
      expect(instance.opened).toBe(false);
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
