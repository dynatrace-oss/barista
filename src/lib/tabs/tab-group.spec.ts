
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { DtTabsModule, DtTab } from '@dynatrace/angular-components';
import { By } from '@angular/platform-browser';
import { DtTabChange } from '@dynatrace/angular-components/tabs/tab';

describe('DtTabs', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTabsModule],
      declarations: [SimpleTabsTestApp],
    });

    TestBed.compileComponents();
  }));

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTabsTestApp>;
    let element: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabsTestApp);
      element = fixture.nativeElement;
    });

    it('should default to the first tab', () => {
      checkSelected(0, fixture);
    });

    it('will properly load content on first change detection pass', () => {
      fixture.detectChanges();
      const bodyContent = element.querySelector('.dt-tab-body');
      expect(bodyContent).not.toBeNull();
      expect(bodyContent!.textContent).not.toBeNull();
      expect(bodyContent!.textContent!.trim()).toBe('Tab one content');
    });

    it('should change selected tab on click', () => {
      fixture.detectChanges();
      // select the second tab
      let tabLabel = fixture.debugElement.queryAll(By.css('.dt-tab-label'))[1];
      tabLabel.nativeElement.click();
      fixture.detectChanges();
      checkSelected(1, fixture);

      // select the first tab
      tabLabel = fixture.debugElement.queryAll(By.css('.dt-tab-label'))[0];
      tabLabel.nativeElement.click();
      checkSelected(0, fixture);
    });

    it('should set the selected flag on each of the tabs', () => {
      fixture.detectChanges();

      const tabs = fixture.componentInstance.tabs.toArray();

      expect(tabs[0].selected).toBe(true);
      expect(tabs[1].selected).toBe(false);

      tabs[1].selected = true;
      fixture.detectChanges();

      expect(tabs[0].selected).toBe(false);
      expect(tabs[1].selected).toBe(true);
    });

    it('should emit a change event on tab change', () => {
      fixture.detectChanges();
      const component = fixture.componentInstance;
      spyOn(component, 'handleTabChange');

      const tabs = fixture.componentInstance.tabs.toArray();
      tabs[1].selected = true;

      // tslint:disable-next-line no-unbound-method
      expect(component.handleTabChange).toHaveBeenCalledTimes(1);
      expect(component.selectEvent.source).toBe(tabs[1]);
    });

    it('should emit a change event on tab click', () => {
      fixture.detectChanges();
      const component = fixture.componentInstance;
      spyOn(component, 'handleTabChange').and.callThrough();

      const tabLabel = fixture.debugElement.queryAll(By.css('.dt-tab-label'))[1];
      tabLabel.nativeElement.click();

      const tabs = fixture.componentInstance.tabs.toArray();

      // tslint:disable-next-line no-unbound-method
      expect(component.handleTabChange).toHaveBeenCalledTimes(1);
      expect(component.selectEvent.source).toBe(tabs[1]);
    });

  });
});

/**
 * Checks that the label and body have their
 * respective `active` classes
 */
// tslint:disable-next-line:no-any
function checkSelected(expectedIndex: number, fixture: ComponentFixture<any>): void {
  fixture.detectChanges();

  const tabLabelElement = fixture.debugElement
      .queryAll(By.css('.dt-tab-label'))[expectedIndex].nativeElement;
  expect(tabLabelElement.classList.contains('dt-tab-label-active')).toBe(true, 'Expected "dt-tab-label-active" class to be there');

  const tabContentElement = fixture.debugElement
      .queryAll(By.css('.dt-tab-body'))[expectedIndex].nativeElement;
  expect(tabContentElement.classList.contains('dt-tab-body-active')).toBe(true, 'Expected "dt-tab-body-active" class to be there');
}

/** Test component that contains an DtTabs. */
@Component({
  selector: 'dt-test-app',
  template: `
  <dt-tab-group (change)="handleTabChange($event)">
    <dt-tab>
      <ng-template dtTabLabel>Tab one label</ng-template>
      <ng-template dtTabContent>
        Tab one content
      </ng-template>
    </dt-tab>
    <dt-tab>
      <ng-template dtTabLabel>Tab two label</ng-template>
      <ng-template dtTabContent>
        Tab two content
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
class SimpleTabsTestApp {
  @ViewChildren(DtTab) tabs: QueryList<DtTab>;
  selectEvent: DtTabChange;

  handleTabChange(event: DtTabChange): void {
    this.selectEvent = event;
  }
}

/**
 * color on the button to be correct also check class
 */

/**
 * throw error if no tab is active (e.g. all are disabled) initially
 */

/**
 * throw error if no tab is active (e.g. all are disabled) at runtime
 */

/**
 * throw error if only one tab is inside the tabgroup initially
 */

/**
 * throw error if only one tab is inside the tabgroup at runtime
 */

/**
 * first one is selected if none is selected
 */

/**
 * selected works if set
 */

/**
 * if selected tab is removed at runtime first one is selected
 */

/**
 * check lazy loading
 */
