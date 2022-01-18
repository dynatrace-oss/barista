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

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DtSortDirection } from '@dynatrace/barista-components/core';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  createComponent,
  dispatchMouseEvent,
  wrappedErrorMessage,
} from '@dynatrace/testing/browser';
import { DtTableModule } from '../table-module';
import { getDtSortHeaderNotContainedWithinSortError } from './sort-errors';
import { DtCell } from '../cell';
import { DtSort, DtSortEvent } from './sort';
import { DtSortHeader } from './sort-header';

describe('DtSort', () => {
  let fixture: ComponentFixture<DtTableSortApp>;

  let component: DtTableSortApp;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtTableModule,
          NoopAnimationsModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [
          DtTableSortApp,
          DtSortHeaderMissingSortApp,
          DtSortableInvalidDirection,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = createComponent(DtTableSortApp);
    component = fixture.componentInstance;
  });

  describe('checking correct icon for its various states', () => {
    let expectedStates: Map<string, { iconName: string }>;

    beforeEach(() => {
      // Starting state for the view and directions
      expectedStates = new Map<string, { iconName: string }>([
        ['column_a', { iconName: 'sorter-double' }],
        ['column_b', { iconName: 'sorter-double' }],
        ['column_c', { iconName: 'sorter-double' }],
      ]);
      component.expectIconStates(expectedStates);
    });

    it('should be correct when cycling through a default sort header', () => {
      // Sort the header to set it to the active start state
      component.sort('column_a');
      expectedStates.set('column_a', { iconName: 'sorter2-up' });
      component.expectIconStates(expectedStates);

      // Sorting again will reverse its direction
      component.dispatchMouseEvent('column_a', 'click');
      expectedStates.set('column_a', { iconName: 'sorter2-down' });
      component.expectIconStates(expectedStates);

      // Sorting again continue the cycle
      component.dispatchMouseEvent('column_a', 'click');
      expectedStates.set('column_a', { iconName: 'sorter2-up' });
      component.expectIconStates(expectedStates);
    });

    it('should be correct when sort has been disabled', () => {
      // Mousing over the first sort should set the view state to hint
      component.disabledColumnSort = true;
      fixture.detectChanges();

      component.dispatchMouseEvent('column_a', 'click');
      component.expectIconStates(expectedStates);
    });
  });

  describe('checking if sorted items have bold class', () => {
    it('should set the isSorted property to true on each cell in a sorted column', () => {
      component.dataSource = DATA_SOURCE;
      fixture.detectChanges();

      // ensure that we have cells
      expect(component.cells.length).toBeGreaterThan(0);
      // all cells unsorted
      expect(checkCellsSorted(component.cells, false)).toBeTruthy();

      component.sort('column_a');
      fixture.detectChanges();

      // now the col column_a should have sorted cells
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();

      // now sort according to column_b so column a should not have isSorted property
      component.sort('column_b');
      fixture.detectChanges();

      expect(checkCellsSorted(component.cells, false, 'column_a')).toBeTruthy();
      expect(checkCellsSorted(component.cells, true, 'column_b')).toBeTruthy();
      expect(checkCellsSorted(component.cells, false, 'column_c')).toBeTruthy();
    });

    it('should initially sort using the given sort direction', () => {
      component.dataSource = DATA_SOURCE;
      component.start = 'asc';
      component.active = 'column_a';
      component.direction = 'desc';
      fixture.detectChanges();

      let sortHeaderElement = fixture.nativeElement.querySelector('#column_a');
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();
      expect(sortHeaderElement.getAttribute('aria-sort')).toBe('descending');

      component.active = 'column_b';
      component.direction = 'asc';
      fixture.detectChanges();

      sortHeaderElement = fixture.nativeElement.querySelector('#column_b');
      expect(checkCellsSorted(component.cells, true, 'column_b')).toBeTruthy();
      expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');
    });

    it('should apply the isSorted to appended rows as well', () => {
      component.dataSource = DATA_SOURCE;
      fixture.detectChanges();

      component.sort('column_a');
      fixture.detectChanges();

      // every cell in the col should be active;
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();

      component.dataSource.push({ a: 'new entry', b: 30, c: 40 });

      // new pushed cell in column should be active as well
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();
      expect(checkCellsSorted(component.cells, false, 'column_b')).toBeTruthy();
      expect(checkCellsSorted(component.cells, false, 'column_c')).toBeTruthy();
    });

    it('should have the isSorted set initial if sorting is active by default', () => {
      component.dataSource = DATA_SOURCE;
      component.start = 'asc';
      component.active = 'column_a';
      fixture.detectChanges();

      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();
    });

    it('should sort the correct column when active is being changed dynamically', () => {
      component.dataSource = DATA_SOURCE;
      component.start = 'asc';
      component.active = 'column_a';
      fixture.detectChanges();

      component.active = 'column_b';
      fixture.detectChanges();
      expect(checkCellsSorted(component.cells, true, 'column_b')).toBeTruthy();
    });

    it('should keep all cells sorted if there are new rows added dynamically', () => {
      component.dataSource = DATA_SOURCE;
      component.start = 'asc';
      component.active = 'column_a';
      fixture.detectChanges();

      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();

      component.dataSource = [...DATA_SOURCE, DATA_SOURCE[0]];
      fixture.detectChanges();
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();

      component.dataSource = [...DATA_SOURCE, DATA_SOURCE[1]];
      fixture.detectChanges();
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();
    });

    it('should keep the sorting when changing columns dynamically', () => {
      component.start = 'asc';
      component.active = 'column_a';
      fixture.detectChanges();
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();
      expect(checkCellsSorted(component.cells, false, 'column_b')).toBeTruthy();
      component.columnsToRender = ['column_a', 'column_b'];
      fixture.detectChanges();
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();
      expect(checkCellsSorted(component.cells, false, 'column_b')).toBeTruthy();
    });
  });

  describe('checking the initial active setting', () => {
    it('should default sort direction to the ascending start value when no direction is given', () => {
      component.active = 'column_b';
      fixture.detectChanges();

      // Check if the header is now set as sorted ascending.
      const headerCellContainer = fixture.debugElement.query(
        By.css(
          '.dt-header-cell.dt-table-column-column_b .dt-sort-header-container',
        ),
      );
      expect(headerCellContainer.nativeElement.classList.toString()).toContain(
        'dt-sort-header-sorted',
      );

      const headerCell = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-column_b'),
      );
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending',
      );
    });

    it('should use given sort direction and not default', () => {
      component.active = 'column_b';
      component.direction = 'asc';
      fixture.detectChanges();

      // Check if the header is now set as sorted ascending.
      const headerCellContainer = fixture.debugElement.query(
        By.css(
          '.dt-header-cell.dt-table-column-column_b .dt-sort-header-container',
        ),
      );
      expect(headerCellContainer.nativeElement.classList.toString()).toContain(
        'dt-sort-header-sorted',
      );

      const headerCell = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-column_b'),
      );
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending',
      );
    });

    it('should use given sort direction and not default', () => {
      component.active = 'column_b';
      component.direction = 'desc';
      fixture.detectChanges();

      // Check if the header is now set as sorted ascending.
      const headerCellContainer = fixture.debugElement.query(
        By.css(
          '.dt-header-cell.dt-table-column-column_b .dt-sort-header-container',
        ),
      );
      expect(headerCellContainer.nativeElement.classList.toString()).toContain(
        'dt-sort-header-sorted',
      );

      const headerCell = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-column_b'),
      );
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending',
      );
    });
  });

  it('should be able to cycle from asc -> desc from either start point', () => {
    component.sortHeaderA.start = 'asc';
    testSingleColumnSortDirectionSequence(fixture, ['asc', 'desc']);

    // Reverse directions
    component.sortHeaderA.start = 'desc';
    testSingleColumnSortDirectionSequence(fixture, ['desc', 'asc']);
  });

  it('should allow for the cycling the sort direction to be disabled per column', () => {
    const button = fixture.nativeElement.querySelector('#column_a button');

    component.sort('column_a');
    expect(component.dtSort.direction).toBe('asc');
    expect(button.getAttribute('disabled')).toBeFalsy();

    component.disabledColumnSort = true;
    fixture.detectChanges();

    component.sort('column_a');
    expect(component.dtSort.direction).toBe('asc');
    expect(button.getAttribute('disabled')).toBe('true');
  });

  it('should allow for the cycling the sort direction to be disabled for all columns', () => {
    const button = fixture.nativeElement.querySelector('#column_a button');

    component.sort('column_a');
    expect(component.dtSort.active).toBe('column_a');
    expect(component.dtSort.direction).toBe('asc');
    expect(button.getAttribute('disabled')).toBeFalsy();

    component.disableAllSort = true;
    fixture.detectChanges();

    component.sort('column_a');
    expect(component.dtSort.active).toBe('column_a');
    expect(component.dtSort.direction).toBe('asc');
    expect(button.getAttribute('disabled')).toBe('true');

    component.sort('column_b');
    expect(component.dtSort.active).toBe('column_a');
    expect(component.dtSort.direction).toBe('asc');
    expect(button.getAttribute('disabled')).toBe('true');
  });

  it('should reset sort direction when a different column is sorted', () => {
    component.sort('column_a');
    expect(component.dtSort.active).toBe('column_a');
    expect(component.dtSort.direction).toBe('asc');

    component.sort('column_a');
    expect(component.dtSort.active).toBe('column_a');
    expect(component.dtSort.direction).toBe('desc');

    component.sort('column_b');
    expect(component.dtSort.active).toBe('column_b');
    expect(component.dtSort.direction).toBe('asc');
  });

  it('should throw an error if an DtSortable is not contained within an DtSort directive', () => {
    expect(() => {
      TestBed.createComponent(DtSortHeaderMissingSortApp).detectChanges();
    }).toThrowError(
      wrappedErrorMessage(getDtSortHeaderNotContainedWithinSortError()),
    );
  });

  it('should allow let DtSortable override the default sort parameters', () => {
    testSingleColumnSortDirectionSequence(fixture, ['desc', 'asc'], 'column_c');
  });

  it('should apply the aria-labels to the button', () => {
    const button = fixture.nativeElement.querySelector('#column_b button');
    expect(button.getAttribute('aria-label')).toBe('Sort column b');
  });

  it('should apply the aria-sort label to the header when sorted', () => {
    const sortHeaderElement = fixture.nativeElement.querySelector('#column_a');
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe(null);

    component.sort('column_a');
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');

    component.sort('column_a');
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('descending');

    component.sort('column_a');
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');
  });

  it('should not emit an invalid sort event when destroyed', () => {
    const spy = jest.fn();

    component.sort('column_a');
    fixture.detectChanges();
    const subscription = component.dtSort.sortChange.subscribe(spy);

    fixture.destroy();
    expect(spy).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should sort correctly when calling the sort function on DtSort with a `DtSortHeader` parameter', () => {
    const sortHeaderElement = fixture.nativeElement.querySelector('#column_a');
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe(null);

    component.dtSort.sort(component.sortHeaderA);
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');

    component.dtSort.sort(component.sortHeaderA);
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('descending');

    component.dtSort.sort(component.sortHeaderA);
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');
  });

  it('should sort correctly when calling the sort function on DtSort with a name and direction parameters', () => {
    const sortHeaderElement = fixture.nativeElement.querySelector('#column_a');
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe(null);

    component.dtSort.sort('column_a', 'asc');
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');

    component.dtSort.sort('column_a', 'desc');
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe('descending');

    component.dtSort.sort('column_b', 'asc');
    fixture.detectChanges();
    expect(sortHeaderElement.getAttribute('aria-sort')).toBe(null);
  });
});

function checkCellsSorted(
  cells: QueryList<DtCell>,
  sorted = false,
  colName?: string,
): boolean {
  const filteredCells = colName
    ? cells.filter((cell) => cell._columnDef.name === colName)
    : cells.toArray();

  return filteredCells.every((cell) => cell._isSorted === sorted);
}

/**
 * Performs a sequence of sorting on a single column to see if the sort directions are
 * consistent with expectations. Detects any changes in the fixture to reflect any changes in
 * the inputs and resets the DtSort to remove any side effects from previous tests.
 */
function testSingleColumnSortDirectionSequence(
  fixture: ComponentFixture<DtTableSortApp>,
  expectedSequence: DtSortDirection[],
  id: DtSortAppColumnIds = 'column_a',
): void {
  // Detect any changes that were made in preparation for this sort sequence
  fixture.detectChanges();

  // Reset the sort to make sure there are no side affects from previous tests
  const component = fixture.componentInstance;
  component.dtSort.active = '';
  component.dtSort.direction = '';
  component.latestSortEvent = null;

  // Run through the sequence to confirm the order
  const actualSequence = expectedSequence.map(() => {
    component.sort(id);

    // Check that the sort event's active sort is consistent with the DtSort
    expect(component.dtSort.active).toBe(id);
    if (component.latestSortEvent !== null) {
      expect(component.latestSortEvent.active).toBe(id);
      expect(component.dtSort.direction).toBe(
        component.latestSortEvent.direction,
      );
    }

    // Check that the sort event's direction is consistent with the DtSort
    return component.dtSort.direction;
  });
  expect(actualSequence).toEqual(expectedSequence);

  // Expect that performing one more sort will loop it back to the beginning.
  component.sort(id);
  expect(component.dtSort.direction).toBe(expectedSequence[0]);
}

class FakeDataSource extends DataSource<any> {
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return collectionViewer.viewChange.pipe(map(() => []));
  }
  disconnect(): void {}
}

const DATA_SOURCE = [
  { a: 'et-demo-2-win3', b: 26, c: 46 },
  { a: 'et-demo-2-win4', b: 30, c: 38 },
  { a: 'docker-host2', b: 25.4, c: 35 },
  { a: 'et-demo-2-win1', b: 23, c: 7.86 },
];

/** Column IDs of the SimpleSortApp for typing of function params in the component (e.g. sort) */
type DtSortAppColumnIds = 'column_a' | 'column_b' | 'column_c';

@Component({
  template: `
    <dt-table
      [dataSource]="dataSource"
      dtSort
      [dtSortDisabled]="disableAllSort"
      [dtSortActive]="active"
      [dtSortStart]="start"
      [dtSortDirection]="direction"
    >
      <ng-container dtColumnDef="column_a">
        <dt-header-cell
          id="column_a"
          *dtHeaderCellDef
          #sortHeaderA
          dt-sort-header
          [disabled]="disabledColumnSort"
        >
          Column A
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.a }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="column_b">
        <dt-header-cell
          id="column_b"
          *dtHeaderCellDef
          #sortHeaderB
          dt-sort-header
          [sort-aria-label]="sortAriaLabel"
        >
          Column B
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.b }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="column_c">
        <dt-header-cell
          id="column_c"
          *dtHeaderCellDef
          #sortHeaderC
          dt-sort-header
          start="desc"
        >
          Column C
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.c }}</dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="columnsToRender"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: columnsToRender"></dt-row>
    </dt-table>
  `,
})
class DtTableSortApp {
  latestSortEvent: DtSortEvent | null;
  disabledColumnSort = false;
  disableAllSort = false;
  active: string;
  start: DtSortDirection = 'asc';
  direction: DtSortDirection = '';
  sortAriaLabel = 'Sort column b';

  @ViewChild(DtSort, { static: true }) dtSort: DtSort;
  @ViewChild('sortHeaderA') sortHeaderA: DtSortHeader;
  @ViewChild('sortHeaderB') sortHeaderB: DtSortHeader;
  @ViewChild('sortHeaderC') sortHeaderC: DtSortHeader;

  @ViewChildren(DtCell) cells: QueryList<DtCell>;

  dataSource: FakeDataSource | any[] = new FakeDataSource();

  columnsToRender = ['column_a', 'column_b', 'column_c'];

  constructor(public elementRef: ElementRef) {}

  sort(id: DtSortAppColumnIds): void {
    this.dispatchMouseEvent(id, 'click');
  }

  dispatchMouseEvent(id: DtSortAppColumnIds, event: string): void {
    const sortElement = this.elementRef.nativeElement.querySelector(`#${id}`);
    dispatchMouseEvent(sortElement, event);
  }

  expectIconStates(viewStates: Map<string, { iconName: string }>): void {
    const sortHeaders = new Map([
      ['column_a', this.sortHeaderA],
      ['column_b', this.sortHeaderB],
      ['column_c', this.sortHeaderC],
    ]);

    viewStates.forEach((viewState, id) => {
      expect(sortHeaders.get(id)!._sortIconName).toEqual(viewState.iconName);
    });
  }
}

@Component({
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container dtColumnDef="column_a">
        <dt-header-cell *dtHeaderCellDef dt-sort-header>
          Column A
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.a }}</dt-cell>
      </ng-container>
      <ng-container dtColumnDef="column_b">
        <dt-header-cell *dtHeaderCellDef dt-sort-header>
          Column B
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.b }}</dt-cell>
      </ng-container>
      <dt-header-row *dtHeaderRowDef="columnsToRender"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: columnsToRender"></dt-row>
    </dt-table>
  `,
})
class DtSortHeaderMissingSortApp {
  dataSource = new FakeDataSource();
  columnsToRender = ['column_a'];
}

@Component({
  template: `
    <dt-table [dataSource]="dataSource" dtSort dtSortDirection="'invalid'">
      <ng-container dtColumnDef="column_a">
        <dt-header-cell *dtHeaderCellDef dt-sort-header>
          Column A
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.a }}</dt-cell>
      </ng-container>
      <dt-header-row *dtHeaderRowDef="columnsToRender"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: columnsToRender"></dt-row>
    </dt-table>
  `,
})
class DtSortableInvalidDirection {}
