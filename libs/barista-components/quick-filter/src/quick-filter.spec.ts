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

import { HttpClient } from '@angular/common/http';
import { Component, DebugElement, NgZone, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtCheckbox } from '@dynatrace/barista-components/checkbox';
import {
  DtTriggerableViewportResizer,
  DtViewportResizer,
} from '@dynatrace/barista-components/core';
import { DtDrawer } from '@dynatrace/barista-components/drawer';
import { DtFilterField } from '@dynatrace/barista-components/filter-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  createComponent,
  dispatchMouseEvent,
  MockNgZone,
} from '@dynatrace/testing/browser';
import {
  FILTER_FIELD_TEST_DATA,
  FILTER_FIELD_TEST_DATA_FOR_TRUNCATION,
} from '@dynatrace/testing/fixtures';
import { of } from 'rxjs';
import { DtQuickFilter, DtQuickFilterChangeEvent } from './quick-filter';
import { DtQuickFilterDefaultDataSource } from './quick-filter-default-data-source';
import { DtQuickFilterGroup } from './quick-filter-group';
import { DtQuickFilterModule } from './quick-filter.module';

describe('dt-quick-filter', () => {
  let instanceDebugElement: DebugElement;
  let quickFilterInstance: DtQuickFilter;
  let zone: MockNgZone;
  let viewportResizer: DtTriggerableViewportResizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DtQuickFilterModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: '{{name}}.svg' }),
      ],
      declarations: [
        QuickFilterSimpleComponent,
        QuickFilterDefaultComponent,
        QuickFilterSidebarOpen,
        QuickFilterSidebarClosed,
        QuickFilterForTruncation,
      ],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn().mockReturnValue(of('<svg></svg>')),
          },
        },
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        {
          provide: DtViewportResizer,
          useFactory: () =>
            (viewportResizer = new DtTriggerableViewportResizer(
              <DtViewportResizer>(<unknown>undefined),
            )),
        },
      ],
    });
    TestBed.compileComponents();
  });

  describe('Simple QuickFilter without dataSource', () => {
    let fixture: ComponentFixture<QuickFilterSimpleComponent>;
    beforeEach(() => {
      fixture = createComponent(QuickFilterSimpleComponent);
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtQuickFilter),
      );
      quickFilterInstance =
        instanceDebugElement.injector.get<DtQuickFilter>(DtQuickFilter);
    });

    it('should have an empty filters array if no dataSource is set', () => {
      expect(quickFilterInstance.filters).toHaveLength(0);
    });
  });

  describe('Normal QuickFilter with mixed dataSource', () => {
    let fixture: ComponentFixture<QuickFilterDefaultComponent>;
    let filterFieldDebugElement: DebugElement;
    let filterFieldInstance: DtFilterField;
    let drawerDebugElement: DebugElement;
    let drawerInstance: DtDrawer;

    beforeEach(() => {
      fixture = createComponent(QuickFilterDefaultComponent);
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtQuickFilter),
      );
      quickFilterInstance =
        instanceDebugElement.injector.get<DtQuickFilter>(DtQuickFilter);

      filterFieldDebugElement = fixture.debugElement.query(
        By.directive(DtFilterField),
      );
      filterFieldInstance =
        filterFieldDebugElement.injector.get<DtFilterField>(DtFilterField);
      drawerDebugElement = fixture.debugElement.query(By.directive(DtDrawer));
      drawerInstance = drawerDebugElement.injector.get<DtDrawer>(DtDrawer);
    });

    it('should set the filters on the filter field if they are set on the quick-filter', fakeAsync(() => {
      expect(quickFilterInstance.filters).toHaveLength(0);
      const filters = [
        [
          FILTER_FIELD_TEST_DATA.autocomplete[0],
          FILTER_FIELD_TEST_DATA.autocomplete[0].autocomplete![0],
        ],
      ];

      quickFilterInstance.filters = filters;
      zone.simulateZoneExit();

      expect(filterFieldInstance.filters).toMatchObject(filters);
    }));

    it('should filter the groups that should be displayed in the sidebar dynamically', () => {
      let groups = getGroupHeadlines(fixture.debugElement);
      expect(groups).toHaveLength(3);
      expect(groups).toMatchObject(['AUT', 'USA', 'Not in Quickfilter']);

      fixture.detectChanges();

      fixture.componentInstance._dataSource =
        new DtQuickFilterDefaultDataSource(FILTER_FIELD_TEST_DATA, {
          showInSidebar: (node) => node.name !== 'Not in Quickfilter',
        });
      fixture.detectChanges();
      groups = getGroupHeadlines(fixture.debugElement);

      expect(groups).toHaveLength(2);
      expect(groups).toMatchObject(['AUT', 'USA']);
    });

    it('should dispatch an event with the changes on selecting an option', fakeAsync(() => {
      const changeSpy = jest.spyOn(fixture.componentInstance, 'filterChanges');
      expect(changeSpy).toHaveBeenCalledTimes(0);
      const checkboxes = fixture.debugElement
        .queryAll(By.directive(DtCheckbox))
        .map((el) => el.query(By.css('label')));

      // Zone must be stable at least once before the quickfilter can be interacted with.
      zone.simulateZoneExit();

      dispatchMouseEvent(checkboxes[1].nativeElement, 'click');
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy.mock.calls[0][0].filters).toMatchObject([
        [
          FILTER_FIELD_TEST_DATA.autocomplete[1],
          FILTER_FIELD_TEST_DATA.autocomplete[1].autocomplete![1],
        ],
      ]);
      changeSpy.mockClear();
    }));

    it('should propagate currentFilterChanges event when emitted on the filter field', fakeAsync(() => {
      const spy = jest.fn();
      const subscription =
        quickFilterInstance.currentFilterChanges.subscribe(spy);
      zone.simulateZoneExit();

      filterFieldInstance.currentFilterChanges.emit();
      expect(spy).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();
    }));

    it('should propagate sidebarOpenChange event when emitted by the drawer', fakeAsync(() => {
      const spy = jest.fn();
      const subscription = quickFilterInstance.sidebarOpenChange.subscribe(spy);
      zone.simulateZoneExit();

      drawerInstance.openChange.emit(true);
      flush();

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should trigger resizer when openChange event occurs', fakeAsync(() => {
      const resizerSpy = jest.fn();
      const resizerSubscription = viewportResizer
        .change()
        .subscribe(resizerSpy);
      zone.simulateZoneExit();

      drawerInstance.openChange.emit(true);
      flush();

      expect(resizerSpy).toHaveBeenCalledTimes(1);
      resizerSubscription.unsubscribe();
    }));

    it('should propagate inputChange event when emitted on the filter field', fakeAsync(() => {
      const spy = jest.fn();
      const subscription = quickFilterInstance.inputChange.subscribe(spy);
      zone.simulateZoneExit();

      filterFieldInstance.inputChange.emit('x');
      expect(spy).toHaveBeenCalledWith('x');

      filterFieldInstance.inputChange.emit('xy');
      expect(spy).toHaveBeenCalledWith('xy');

      subscription.unsubscribe();
    }));
  });

  describe('Sidebar methods', () => {
    it('should open the sidebar when the openSidebar function is called', fakeAsync(() => {
      const fixture = createComponent<QuickFilterSidebarClosed>(
        QuickFilterSidebarClosed,
      );
      const instance = fixture.debugElement.componentInstance;
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeFalsy();
      expect(instance.quickFilter._drawer.opened).toBeFalsy();

      instance.quickFilter.openSidebar();
      fixture.detectChanges();
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeTruthy();
      expect(instance.quickFilter._drawer.opened).toBeTruthy();
    }));

    it('should close the sidebar when the closeSidebar function is called', fakeAsync(() => {
      const fixture = createComponent<QuickFilterSidebarClosed>(
        QuickFilterSidebarOpen,
      );
      const instance = fixture.debugElement.componentInstance;
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeTruthy();
      expect(instance.quickFilter._drawer.opened).toBeTruthy();

      instance.quickFilter.closeSidebar();
      fixture.detectChanges();
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeFalsy();
      expect(instance.quickFilter._drawer.opened).toBeFalsy();
    }));

    it('should open/close the sidebar when the toggleSidebar function is called', fakeAsync(() => {
      const fixture = createComponent<QuickFilterSidebarClosed>(
        QuickFilterSidebarOpen,
      );
      const instance = fixture.debugElement.componentInstance;
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeTruthy();
      expect(instance.quickFilter._drawer.opened).toBeTruthy();

      instance.quickFilter.toggleSidebar();
      fixture.detectChanges();
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeFalsy();
      expect(instance.quickFilter._drawer.opened).toBeFalsy();

      instance.quickFilter.toggleSidebar();
      fixture.detectChanges();
      flush();

      expect(instance.quickFilter.sidebarOpened).toBeTruthy();
      expect(instance.quickFilter._drawer.opened).toBeTruthy();
    }));
  });

  describe('Simple QuickFilterGroup with truncation and see more', () => {
    let fixture: ComponentFixture<QuickFilterForTruncation>;
    let groupDebugElement: DebugElement;
    beforeEach(() => {
      fixture = createComponent(QuickFilterForTruncation);
      groupDebugElement = fixture.debugElement.query(
        By.directive(DtQuickFilterGroup),
      );
    });

    it('should have the group truncated', () => {
      expect(
        groupDebugElement.queryAll(By.directive(DtCheckbox)).length,
      ).toEqual(4);
    });

    it('should have the appropriate texts', () => {
      expect(
        (
          groupDebugElement.query(By.css('.dt-quick-filter-show-more-text'))
            .nativeElement as HTMLParagraphElement
        ).textContent,
      ).toEqual(' There are 2 States available ');

      expect(
        (
          groupDebugElement.query(By.css('.dt-show-more'))
            .nativeElement as HTMLButtonElement
        ).textContent,
      ).toEqual('View more');
    });
  });
});

/** Get all quick filter group item headlines */
function getGroupHeadlines(debugElement: DebugElement): string[] {
  return debugElement
    .queryAll(By.css('.dt-quick-filter-group-headline'))
    .map((el) => el.nativeElement.textContent.trim());
}

@Component({
  selector: 'dt-quick-filter-simple',
  template: ` <dt-quick-filter></dt-quick-filter> `,
})
class QuickFilterSimpleComponent {}

@Component({
  selector: 'dt-quick-filter-simple',
  template: `
    <dt-quick-filter
      [dataSource]="_dataSource"
      [label]="label"
      [clearAllLabel]="clearAllLabel"
      (filterChanges)="filterChanges($event)"
    >
      <dt-quick-filter-title>Quick-filter</dt-quick-filter-title>
      <dt-quick-filter-sub-title>
        All options in the filter field above
      </dt-quick-filter-sub-title>

      my content
    </dt-quick-filter>
  `,
})
class QuickFilterDefaultComponent {
  filterFn = () => true;
  label = 'Filter by';
  clearAllLabel = 'Clear all';

  filterChanges(_event: DtQuickFilterChangeEvent<any>): void {}

  _dataSource = new DtQuickFilterDefaultDataSource(FILTER_FIELD_TEST_DATA, {
    showInSidebar: this.filterFn,
  });
}

@Component({
  selector: 'dt-quick-filter-simple',
  template: `<dt-quick-filter></dt-quick-filter>`,
})
class QuickFilterSidebarOpen {
  @ViewChild(DtQuickFilter) quickFilter: DtQuickFilter;
}

@Component({
  selector: 'dt-quick-filter-simple',
  template: `<dt-quick-filter sidebarOpened="false"></dt-quick-filter>`,
})
class QuickFilterSidebarClosed {
  @ViewChild(DtQuickFilter) quickFilter: DtQuickFilter;
}
@Component({
  selector: 'dt-quick-filter-simple',
  template: `
    <dt-quick-filter
      [dataSource]="_dataSource"
      [maxGroupItems]="4"
      [showMoreTemplate]="showMore"
    >
    </dt-quick-filter>

    <ng-template #showMore let-count let-group="group">
      <p class="dt-quick-filter-show-more-text">
        There are {{ count }}
        <ng-container [ngSwitch]="group">
          <ng-container *ngSwitchCase="'Country'">States</ng-container>
        </ng-container>
        available
      </p>
    </ng-template>
  `,
})
class QuickFilterForTruncation {
  @ViewChild(DtQuickFilter) quickFilter: DtQuickFilter;
  _dataSource = new DtQuickFilterDefaultDataSource(
    FILTER_FIELD_TEST_DATA_FOR_TRUNCATION,
  );
}
