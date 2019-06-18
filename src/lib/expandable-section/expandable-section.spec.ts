// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture, flushMicrotasks, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtExpandableSection, DtExpandableSectionModule, DtIconModule } from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';

// TODO @thomas.pink @fabian.friedl: ***REMOVED***
// Rework tests!!!

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
    let instance: DtExpandableSection;

    beforeEach(async(() => {
      fixture = createComponent(TestApp);
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
      expect(instanceElement.classList).not.toContain('dt-expandable-section-opened');

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

    it('should emit an openedChange event when it opens', fakeAsync(() => {
      const spy = jasmine.createSpy('option selection spy');
      const subscription = instance.openedChange.subscribe(spy);

      instance.open();
      fixture.detectChanges();
      flushMicrotasks();

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    }));
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
class TestApp { }
