import { Component, DebugElement } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtExpandableSection, DtExpandableSectionModule } from '@dynatrace/angular-components';

describe('DtExpandableSection', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtExpandableSectionModule, NoopAnimationsModule],
      declarations: [TestApp],
    });
    TestBed.compileComponents();
  }));

  describe('dt-expandable-section', () => {

    let fixture;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;
    let instance: DtExpandableSection;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      instanceDebugElement = fixture.debugElement.query(By.directive(DtExpandableSection));
      instanceElement = instanceDebugElement.nativeElement;
      instance = instanceDebugElement.injector.get<DtExpandableSection>(DtExpandableSection);
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
        'dt-expandable-section-opened');

      expect(instance.toggle()).toBe(true);
      fixture.detectChanges();

      expect(instanceElement.classList).toContain(
        'dt-expandable-section-opened');
    });

    it('should not open when disabled', () => {
      instance.disabled = true;
      instance.open();
      expect(instance.opened).toBe(false);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `<dt-expandable-section>
    <dt-expandable-section-header>Header</dt-expandable-section-header>
    text
    </dt-expandable-section>`,
})
class TestApp {
}
