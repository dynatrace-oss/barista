/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { HttpClient } from '@angular/common/http';
import { Component, DebugElement, NgZone } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtCheckbox } from '@dynatrace/barista-components/checkbox';
import { DtFilterField } from '@dynatrace/barista-components/filter-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  createComponent,
  dispatchMouseEvent,
  MockNgZone,
} from '@dynatrace/testing/browser';
import { FILTER_FIELD_TEST_DATA } from '@dynatrace/testing/fixtures';
import { of } from 'rxjs';
import { DtQuickFilter, DtQuickFilterChangeEvent } from './quick-filter';
import { DtQuickFilterDefaultDataSource } from './quick-filter-default-data-source';
import { DtQuickFilterModule } from './quick-filter.module';

describe('dt-quick-filter', () => {
  let instanceDebugElement: DebugElement;
  let quickFilterInstance: DtQuickFilter;
  let zone: MockNgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DtQuickFilterModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: '{{name}}.svg' }),
      ],
      declarations: [QuickFilterSimpleComponent, QuickFilterDefaultComponent],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn().mockReturnValue(of('<svg></svg>')),
          },
        },
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
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
      quickFilterInstance = instanceDebugElement.injector.get<DtQuickFilter>(
        DtQuickFilter,
      );
    });

    it('should have an empty filters array if no dataSource is set', () => {
      expect(quickFilterInstance.filters).toHaveLength(0);
    });
  });

  describe('Normal QuickFilter with mixed dataSource', () => {
    let fixture: ComponentFixture<QuickFilterDefaultComponent>;
    let filterFieldDebugElement: DebugElement;
    let filterFieldInstance: DtFilterField;

    beforeEach(() => {
      fixture = createComponent(QuickFilterDefaultComponent);
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtQuickFilter),
      );
      quickFilterInstance = instanceDebugElement.injector.get<DtQuickFilter>(
        DtQuickFilter,
      );

      filterFieldDebugElement = fixture.debugElement.query(
        By.directive(DtFilterField),
      );
      filterFieldInstance = filterFieldDebugElement.injector.get<DtFilterField>(
        DtFilterField,
      );
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

    it('should reset the filters if the data source gets switched', () => {
      quickFilterInstance.filters = [
        [
          FILTER_FIELD_TEST_DATA.autocomplete[0],
          FILTER_FIELD_TEST_DATA.autocomplete[0].autocomplete![0],
        ],
      ];
      zone.simulateZoneExit();
      fixture.detectChanges();

      fixture.componentInstance._dataSource = new DtQuickFilterDefaultDataSource(
        FILTER_FIELD_TEST_DATA,
        {
          showInSidebar: () => true,
        },
      );
      zone.simulateZoneExit();
      fixture.detectChanges();
      expect(filterFieldInstance.filters).toMatchObject([]);
      expect(quickFilterInstance.filters).toMatchObject([]);
    });

    it('should filter the groups that should be displayed in the sidebar dynamically', () => {
      let groups = getGroupHeadlines(fixture.debugElement);
      expect(groups).toHaveLength(3);
      expect(groups).toMatchObject(['AUT', 'USA', 'Not in Quickfilter']);

      fixture.detectChanges();

      fixture.componentInstance._dataSource = new DtQuickFilterDefaultDataSource(
        FILTER_FIELD_TEST_DATA,
        {
          showInSidebar: (node) => node.name !== 'Not in Quickfilter',
        },
      );
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
      const subscription = quickFilterInstance.currentFilterChanges.subscribe(
        spy,
      );
      zone.simulateZoneExit();

      filterFieldInstance.currentFilterChanges.emit();
      expect(spy).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();
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
