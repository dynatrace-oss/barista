import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtIconModule,
  DtSort,
  DtSortDirection,
  DtSortEvent,
  DtSortHeader,
  DtCell,
  DtTableModule,
  getDtSortHeaderNotContainedWithinSortError,
} from '@dynatrace/angular-components';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dispatchMouseEvent } from '../../../testing/dispatch-events';
import { wrappedErrorMessage } from '../../../testing/wrapped-error-message';

describe('DtSort', () => {
  let fixture: ComponentFixture<DtTableSortApp>;

  let component: DtTableSortApp;

  beforeEach(async(() => {
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtTableSortApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('checking correct icon for its various states', () => {
    let expectedStates: Map<string, { iconName: string }>;

    beforeEach(() => {
      // Starting state for the view and directions
      expectedStates = new Map<string, { iconName: string }>([
        ['column_a', { iconName: '' }],
        ['column_b', { iconName: '' }],
        ['column_c', { iconName: '' }],
      ]);
      component.expectIconStates(expectedStates);
    });

    it('should be correct when cycling through a default sort header', () => {
      // Sort the header to set it to the active start state
      component.sort('column_a');
      expectedStates.set('column_a', { iconName: 'sorter-up' });
      component.expectIconStates(expectedStates);

      // Sorting again will reverse its direction
      component.dispatchMouseEvent('column_a', 'click');
      expectedStates.set('column_a', { iconName: 'sorter-down' });
      component.expectIconStates(expectedStates);

      // Sorting again continue the cycle
      component.dispatchMouseEvent('column_a', 'click');
      expectedStates.set('column_a', { iconName: 'sorter-up' });
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

    it('should apply the isSorted to appended rows as well', () => {
      component.dataSource = DATA_SOURCE;
      fixture.detectChanges();

      component.sort('column_a');
      fixture.detectChanges();

      // every cell in the col should be active;
      expect(checkCellsSorted(component.cells, true, 'column_a')).toBeTruthy();

      component.dataSource.push({a: 'new entry', b: 30, c: 40});

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
    expect(() => TestBed.createComponent(DtSortHeaderMissingSortApp).detectChanges())
        .toThrowError(wrappedErrorMessage(getDtSortHeaderNotContainedWithinSortError()));
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
    const spy = jasmine.createSpy('Sort event');

    component.sort('column_a');
    fixture.detectChanges();
    const subscription = component.dtSort.sortChange.subscribe(spy);

    fixture.destroy();
    expect(spy).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });
});

function checkCellsSorted(cells: QueryList<DtCell>, sorted: boolean = false, colName?: string): boolean {

  const filteredCells = colName ?
    cells.filter((cell) => cell._columnDef.name === colName) :
    cells.toArray();

  return filteredCells.every((cell) => cell._isSorted === sorted);
}
/**
 * Performs a sequence of sorting on a single column to see if the sort directions are
 * consistent with expectations. Detects any changes in the fixture to reflect any changes in
 * the inputs and resets the DtSort to remove any side effects from previous tests.
 */
function testSingleColumnSortDirectionSequence(fixture: ComponentFixture<DtTableSortApp>,
                                               expectedSequence: DtSortDirection[],
                                               id: DtSortAppColumnIds = 'column_a'): void {
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
      expect(component.dtSort.direction).toBe(component.latestSortEvent.direction);
    }

    // Check that the sort event's direction is consistent with the DtSort
    return component.dtSort.direction;
  });
  expect(actualSequence).toEqual(expectedSequence);

  // Expect that performing one more sort will loop it back to the beginning.
  component.sort(id);
  expect(component.dtSort.direction).toBe(expectedSequence[0]);
}

// tslint:disable-next-line:no-any
class FakeDataSource extends DataSource<any> {

  // tslint:disable-next-line:no-any
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
    <dt-table [dataSource]="dataSource"
      dtSort
      [dtSortDisabled]="disableAllSort"
      [dtSortActive]="active"
      [dtSortStart]="start"
      [dtSortDirection]="direction">
      <ng-container dtColumnDef="column_a">
        <dt-header-cell id="column_a"
          *dtHeaderCellDef
          #sortHeaderA
          dt-sort-header
          [disabled]="disabledColumnSort">
          Column A
        </dt-header-cell>
        <dt-cell *dtCellDef="let row"> {{row.a}} </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="column_b">
        <dt-header-cell id="column_b" *dtHeaderCellDef #sortHeaderB dt-sort-header [sort-aria-label]="sortAriaLabel">
          Column B
        </dt-header-cell>
        <dt-cell *dtCellDef="let row"> {{row.b}} </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="column_c">
        <dt-header-cell id="column_c" *dtHeaderCellDef #sortHeaderC dt-sort-header start="desc">Column C</dt-header-cell>
        <dt-cell *dtCellDef="let row"> {{row.c}} </dt-cell>
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
  @ViewChild('sortHeaderA', { static: true }) sortHeaderA: DtSortHeader;
  @ViewChild('sortHeaderB', { static: true }) sortHeaderB: DtSortHeader;
  @ViewChild('sortHeaderC', { static: true }) sortHeaderC: DtSortHeader;

  @ViewChildren(DtCell) cells: QueryList<DtCell>;

  // tslint:disable-next-line:no-any
  dataSource: FakeDataSource | any[] = new FakeDataSource();

  columnsToRender = ['column_a', 'column_b', 'column_c'];

  constructor(public elementRef: ElementRef) { }

  sort(id: DtSortAppColumnIds): void {
    this.dispatchMouseEvent(id, 'click');
  }

  dispatchMouseEvent(id: DtSortAppColumnIds, event: string): void {
    const sortElement = this.elementRef.nativeElement.querySelector(`#${id}`);
    dispatchMouseEvent(sortElement, event);
  }

  expectIconStates(viewStates: Map<string, {iconName: string}>): void {
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
  template: `<dt-table [dataSource]="dataSource">
  <ng-container dtColumnDef="column_a">
    <dt-header-cell *dtHeaderCellDef dt-sort-header>Column A</dt-header-cell>
    <dt-cell *dtCellDef="let row"> {{row.a}} </dt-cell>
  </ng-container>
  <dt-header-row *dtHeaderRowDef="columnsToRender"></dt-header-row>
  <dt-row *dtRowDef="let row; columns: columnsToRender"></dt-row>
</dt-table>`,
})
class DtSortHeaderMissingSortApp {
  dataSource = new FakeDataSource();
  columnsToRender = ['column_a'];
}

@Component({
  template: `
  <dt-table [dataSource]="dataSource" dtSort dtSortDirection="'invalid'">
  <ng-container dtColumnDef="column_a">
    <dt-header-cell *dtHeaderCellDef dt-sort-header>Column A</dt-header-cell>
    <dt-cell *dtCellDef="let row"> {{row.a}} </dt-cell>
  </ng-container>
  <dt-header-row *dtHeaderRowDef="columnsToRender"></dt-header-row>
  <dt-row *dtRowDef="let row; columns: columnsToRender"></dt-row>
</dt-table>`,
})
class DtSortableInvalidDirection { }
