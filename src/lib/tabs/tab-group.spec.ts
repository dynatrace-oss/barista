// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { DtTabsModule, DtTab, DtLogConsumer, DtLogEntry, DT_TABGROUP_SINGLE_TAB_ERROR, DtTabChange } from '@dynatrace/angular-components';
import { By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DT_TABGROUP_NO_ENABLED_TABS_ERROR } from '@dynatrace/angular-components/tabs/tab-group';
import { createComponent } from '../../testing/create-component';

describe('DtTabs', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTabsModule],
      declarations: [
        SimpleTabsTestApp,
        DynamicTabsTestApp,
        LazyTabsTestApp,
        ErrorTabsTestApp,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTabsTestApp>;
    let element: HTMLElement;
    let component: SimpleTabsTestApp;

    beforeEach(() => {
      fixture = createComponent(SimpleTabsTestApp);
      element = fixture.nativeElement;
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should default to the first tab', () => {
      checkSelected(0, fixture);
    });

    it('will properly load content on first change detection pass', () => {
      const bodyContent = element.querySelector('.dt-tab-body');
      expect(bodyContent).not.toBeNull();
      expect(bodyContent!.textContent).not.toBeNull();
      expect(bodyContent!.textContent!.trim()).toBe('Tab one content');
    });

    it('should change selected tab on click', () => {
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

      const tabs = fixture.componentInstance.tabs.toArray();

      expect(tabs[0].selected).toBe(true);
      expect(tabs[1].selected).toBe(false);

      tabs[1].selected = true;
      fixture.detectChanges();

      expect(tabs[0].selected).toBe(false);
      expect(tabs[1].selected).toBe(true);
    });

    it('should emit a change event on programmatic tab change', () => {
      spyOn(component, 'handleTabChange').and.callThrough();

      const tabs = fixture.componentInstance.tabs.toArray();
      tabs[1].selected = true;
      fixture.detectChanges();

      // tslint:disable-next-line no-unbound-method
      expect(component.handleTabChange).toHaveBeenCalledTimes(1);
      expect(component.selectEvent.source.id).toBe(tabs[1].id);
    });

    it('should emit a change event on tab click', () => {
      fixture.detectChanges();
      spyOn(component, 'handleTabChange').and.callThrough();

      const tabLabel = fixture.debugElement.queryAll(By.css('.dt-tab-label'))[1];
      tabLabel.nativeElement.click();

      const tabs = fixture.componentInstance.tabs.toArray();

      // tslint:disable-next-line no-unbound-method
      expect(component.handleTabChange).toHaveBeenCalledTimes(1);
      expect(component.selectEvent.source).toBe(tabs[1]);
    });

    it('should update the id at runtime and leave selection unchanged', () => {
      fixture.detectChanges();
      const tabs = fixture.componentInstance.tabs.toArray();

      expect(tabs[1].id).toBe('secondId');
      tabs[1].selected = true;
      component.dynamicId = 'someotherid';
      fixture.detectChanges();
      expect(tabs[1].id).toBe('someotherid');
      expect(tabs[1].selected).toBeTruthy();
    });

    it('should use correct colors initially', () => {
      const tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs[0].color).toBe('main');
      expect(tabs[1].color).toBe('error');
    });

    it('should update the color on the buttons', () => {
      const tabs = fixture.componentInstance.tabs.toArray();
      tabs[1].color = 'recovered';
      fixture.detectChanges();
      expect(tabs[1].color).toBe('recovered');
      checkLabelClass(1, fixture, 'dt-color-recovered');
    });

    it('should disable tab correctly', () => {
      const tabs = fixture.componentInstance.tabs.toArray();
      tabs[1].disabled = true;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('.dt-tab-label'))[1].nativeElement.disabled).toBeTruthy();
    });

  });

  describe('dynamic behaviour', () => {
    let fixture: ComponentFixture<DynamicTabsTestApp>;
    let component: DynamicTabsTestApp;

    beforeEach(() => {
      fixture = createComponent(DynamicTabsTestApp);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should select the 2nd tab initially', () => {
      const tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs[1].selected).toBeTruthy();
    });

    it('should add and remove a third tab', () => {
      let tabs = fixture.componentInstance.tabs.toArray();
      component.dynamicTab = true;
      fixture.detectChanges();
      tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs.length).toBe(3);

      component.dynamicTab = false;
      fixture.detectChanges();
      tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs.length).toBe(2);
    });

    it('should reset selection to first tab when selected tab is removed', () => {
      component.dynamicTab = true;
      fixture.detectChanges();
      let tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs.length).toBe(3);
      tabs[2].selected = true;

      component.dynamicTab = false;
      fixture.detectChanges();
      tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs.length).toBe(2);
      expect(tabs[0].selected).toBeTruthy();
    });

    it('should emit a change event when the tab is removed and selection is changed automatically', () => {
      spyOn(component, 'handleTabChange').and.callThrough();

      component.dynamicTab = true;
      fixture.detectChanges();
      const tabs = fixture.componentInstance.tabs.toArray();
      expect(tabs.length).toBe(3);
      tabs[2].selected = true;

      component.dynamicTab = false;
      fixture.detectChanges();
      // tslint:disable-next-line no-unbound-method
      expect(component.handleTabChange).toHaveBeenCalledTimes(2);
      expect(component.selectEvent.source).toBe(tabs[0]);
    });

    it('should change selection to first enabled tab when selected tab is disabled', () => {
      const tabs = fixture.componentInstance.tabs.toArray();
      tabs[1].disabled = true;
      fixture.detectChanges();
      expect(tabs[0].selected).toBeTruthy();
      expect(tabs[1].selected).toBeFalsy();
    });
  });

  describe('lazy loading', () => {
    it('should lazy load the second tab', () => {
      const fixture = createComponent(LazyTabsTestApp);
      fixture.detectChanges();

      const lazyFirst = fixture.debugElement.query(By.css('.lazy-first'));
      expect(lazyFirst.nativeElement).toBeDefined();
      let lazySecond = fixture.debugElement.query(By.css('.lazy-second'));
      expect(lazySecond).toBeNull();

      const secondLabel = fixture.debugElement.queryAll(By.css('.dt-tab-label'))[1];
      secondLabel.nativeElement.click();
      fixture.detectChanges();

      lazySecond = fixture.debugElement.query(By.css('.lazy-second'));
      expect(lazySecond.nativeElement).toBeDefined();
    });
  });

  describe('logging errors', () => {
    it('should log an error if only one tab is rendered', () => {
      const fixture = createComponent(ErrorTabsTestApp);
      fixture.detectChanges();

      const logEntry = fixture.componentInstance.lastLogEntry;
      expect(logEntry.message).toEqual(DT_TABGROUP_SINGLE_TAB_ERROR);
      expect(logEntry.level).toEqual('ERROR');
    });

    it('should log an error if only one tab is rendered at runtime', () => {
      // We need to create the component directly via the TestBed
      // because we specifically want to create the error after the second change detection.
      const fixture = TestBed.createComponent(ErrorTabsTestApp);
      fixture.componentInstance.secondTab = true;
      fixture.detectChanges();
      let logEntry = fixture.componentInstance.lastLogEntry;
      expect(logEntry).toBeUndefined();

      fixture.componentInstance.secondTab = false;
      fixture.detectChanges();

      logEntry = fixture.componentInstance.lastLogEntry;
      expect(logEntry.message).toEqual(DT_TABGROUP_SINGLE_TAB_ERROR);
      expect(logEntry.level).toEqual('ERROR');
    });

    it('should log an error if all tabs get disabled', () => {
      const fixture = createComponent(ErrorTabsTestApp);
      fixture.componentInstance.secondTab = true;
      fixture.componentInstance.disableAll = true;
      fixture.detectChanges();

      const logEntry = fixture.componentInstance.lastLogEntry;
      expect(logEntry.message).toEqual(DT_TABGROUP_NO_ENABLED_TABS_ERROR);
      expect(logEntry.level).toEqual('ERROR');
    });
  });
});

/**
 * Checks that the label and body have their
 * respective `active` classes
 */
// tslint:disable-next-line:no-any
export function checkSelected(expectedIndex: number, fixture: ComponentFixture<any>, isSelected?: boolean): void {
  fixture.detectChanges();
  checkLabelClass(expectedIndex, fixture, 'dt-tab-label-active', isSelected);
  const tabContentElement = fixture.debugElement
      .queryAll(By.css('.dt-tab-body'))[expectedIndex].nativeElement;
  expect(tabContentElement.classList.contains('dt-tab-body-active'))
  .toBe(isSelected !== undefined ? isSelected : true, 'Expected "dt-tab-body-active" class to be there');
}
/** checks if the label at given index has the given class */
// tslint:disable-next-line:no-any
function checkLabelClass(expectedIndex: number, fixture: ComponentFixture<any>, cssClass: string, toExist?: boolean): void {
  const tabLabelElement = fixture.debugElement
      .queryAll(By.css('.dt-tab-label'))[expectedIndex].nativeElement;
  expect(tabLabelElement.classList.contains(cssClass))
  .toBe(toExist !== undefined ? toExist : true, `Expected "${cssClass}" class to be there`);
}
/** Test component that contains an DtTabs. */
@Component({
  selector: 'dt-test-app',
  template: `
  <dt-tab-group (selectionChanged)="handleTabChange($event)">
    <dt-tab id="firstid">
      <ng-template dtTabLabel>Tab one label</ng-template>
      <ng-template dtTabContent>
        Tab one content
      </ng-template>
    </dt-tab>
    <dt-tab [id]="dynamicId" color="error">
      <ng-template dtTabLabel>Tab two label</ng-template>
      <ng-template dtTabContent>
        Tab two content
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
class SimpleTabsTestApp {
  dynamicId = 'secondId';

  @ViewChildren(DtTab) tabs: QueryList<DtTab>;
  selectEvent: DtTabChange;

  handleTabChange(event: DtTabChange): void {
    this.selectEvent = event;
  }
}

/** Test component that contains an DtTabs. */
@Component({
  selector: 'dt-dynamic-test-app',
  template: `
  <dt-tab-group (selectionChanged)="handleTabChange($event)">
    <dt-tab>
      <ng-template dtTabLabel>Tab one label</ng-template>
      <ng-template dtTabContent>
        Tab one content
      </ng-template>
    </dt-tab>
    <dt-tab selected>
      <ng-template dtTabLabel>Tab two label</ng-template>
      <ng-template dtTabContent>
        Tab two content
      </ng-template>
    </dt-tab>
    <dt-tab *ngIf="dynamicTab">
      <ng-template dtTabLabel>Tab three label</ng-template>
      <ng-template dtTabContent>
        Tab two content
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
class DynamicTabsTestApp {
  dynamicTab = false;

  @ViewChildren(DtTab) tabs: QueryList<DtTab>;
  selectEvent: DtTabChange;

  handleTabChange(event: DtTabChange): void {
    this.selectEvent = event;
  }
}

/** Test component that contains an DtTabs. */
@Component({
  selector: 'dt-lazy-test-app',
  template: `
  <dt-tab-group>
    <dt-tab selected>
      <ng-template dtTabLabel>Tab one label</ng-template>
      <ng-template dtTabContent>
        <div class="lazy-first"></div>
      </ng-template>
    </dt-tab>
    <dt-tab>
      <ng-template dtTabLabel>Tab two label</ng-template>
      <ng-template dtTabContent>
        <div class="lazy-second"></div>
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
class LazyTabsTestApp {
  @ViewChildren(DtTab) tabs: QueryList<DtTab>;
}

/** Test component that contains an DtTabs. */
@Component({
  selector: 'dt-error-test-app',
  template: `
  <dt-tab-group>
    <dt-tab [disabled]="disableAll">
      <ng-template dtTabLabel>Tab one label</ng-template>
      <ng-template dtTabContent>
      </ng-template>
    </dt-tab>
    <dt-tab *ngIf="secondTab" [disabled]="disableAll">
      <ng-template dtTabLabel>Tab two label</ng-template>
      <ng-template dtTabContent>
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
class ErrorTabsTestApp implements OnDestroy {
  @ViewChildren(DtTab) tabs: QueryList<DtTab>;
  secondTab = false;
  disableAll = false;

  lastLogEntry: DtLogEntry;

  private _logSub: Subscription;

  constructor(public logConsumer: DtLogConsumer) {
    this._logSub = logConsumer.consume().subscribe((val) => {
      this.lastLogEntry = val;
    });
  }

  ngOnDestroy(): void {
    this._logSub.unsubscribe();
  }
}
