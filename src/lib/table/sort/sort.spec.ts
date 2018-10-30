import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getSortHeaderNotContainedWithinSortError,
  getSortInvalidDirectionError,
} from './sort-errors';
import { DtTableModule } from '../table-module';
import { DtSort, DtSortEvent, DtSortDirection, DtSortHeader, DtIconModule } from '@dynatrace/angular-components';
import { wrappedErrorMessage } from '../../../testing/wrapped-error-message';
import { dispatchMouseEvent } from '../../../testing/dispatch-events';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('DtSort', () => {
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

  it('should have the sort headers register and deregister themselves', () => {
    const sortables = component.dtSort.sortables;
    expect(sortables.size).toBe(3);
    expect(sortables.get('column_a')).toBe(component.sortHeaderA);
    expect(sortables.get('column_b')).toBe(component.sortHeaderB);
    expect(sortables.get('column_c')).toBe(component.sortHeaderC);

    fixture.destroy();
    expect(sortables.size).toBe(0);
  });

  it('should mark itself as initialized', fakeAsync(() => {
    let isMarkedInitialized = false;
    component.dtSort.initialized.subscribe(() => isMarkedInitialized = true);

    tick();
    expect(isMarkedInitialized).toBeTruthy();
  }));

  describe('checking correct icon for its various states', () => {
    let expectedStates: Map<string, { iconName: string }>;

    beforeEach(() => {
      // Starting state for the view and directions
      expectedStates = new Map<string, { iconName: string }>([
        ['column_a', { iconName: 'sorter-down' }],
        ['column_b', { iconName: '' }],
        ['column_c', { iconName: '' }],
      ]);
      component.expectIconStates(expectedStates);
    });

    it('should be correct when cycling through a default sort header', () => {
      // Sort the header to set it to the active start state
      component.sort('column_a');
      expectedStates.set('column_a', { iconName: 'sorter-down' });
      component.expectIconStates(expectedStates);

      // Sorting again will reverse its direction
      component.dispatchMouseEvent('column_a', 'click');
      expectedStates.set('column_a', { iconName: 'sorter-up' });
      component.expectIconStates(expectedStates);

      // // Sorting again will remove the sort and animate away the view
      component.dispatchMouseEvent('column_a', 'click');
      expectedStates.set('column_a', { iconName: 'sorter-down' });
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

  // it('should throw an error if an MatSortable is not contained within an MatSort directive', () => {
  //   expect(() => TestBed.createComponent(DtSortHeaderMissingSortApp).detectChanges())
  //       .toThrowError(wrappedErrorMessage(getSortHeaderNotContainedWithinSortError()));
  // });

  // it('should throw an error if the provided direction is invalid', () => {
  //   expect(() => TestBed.createComponent(DtSortableInvalidDirection).detectChanges())
  //       .toThrowError(wrappedErrorMessage(getSortInvalidDirectionError('invalid')));
  // });

  // it('should allow let DtSortable override the default sort parameters', () => {
  //   testSingleColumnSortDirectionSequence(
  //       fixture, ['asc', 'desc']);
  // });

  // it('should apply the aria-labels to the button', () => {
  //   const button = fixture.nativeElement.querySelector('#column_a button');
  //   expect(button.getAttribute('aria-label')).toBe('Change sorting for defaultA');
  // });

  // it('should apply the aria-sort label to the header when sorted', () => {
  //   const sortHeaderElement = fixture.nativeElement.querySelector('#defaultA');
  //   expect(sortHeaderElement.getAttribute('aria-sort')).toBe(null);

  //   component.sort('column_a');
  //   fixture.detectChanges();
  //   expect(sortHeaderElement.getAttribute('aria-sort')).toBe('ascending');

  //   component.sort('column_a');
  //   fixture.detectChanges();
  //   expect(sortHeaderElement.getAttribute('aria-sort')).toBe('descending');

  //   component.sort('column_a');
  //   fixture.detectChanges();
  //   expect(sortHeaderElement.getAttribute('aria-sort')).toBe(null);
  // });

  // it('should re-render when the i18n labels have changed', () => {
  //   const header = fixture.debugElement.query(By.directive(DtSortHeader)).nativeElement;
  //   const button = header.querySelector('.dt-sort-header-button');

  //   component.sortAriaLabel = 'Sort all of the things';
  //   fixture.detectChanges();

  //   expect(button.getAttribute('aria-label')).toBe('Sort all of the things');
  // });
});

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

    // Check that the sort event's active sort is consistent with the MatSort
    expect(component.dtSort.active).toBe(id);
    if (component.latestSortEvent !== null) {
      expect(component.latestSortEvent.active).toBe(id);
      expect(component.dtSort.direction).toBe(component.latestSortEvent.direction);
    }

    // Check that the sort event's direction is consistent with the MatSort
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

/** Column IDs of the SimpleMatSortApp for typing of function params in the component (e.g. sort) */
type DtSortAppColumnIds = 'column_a' | 'column_b' | 'column_c';

@Component({
  template: `
    <dt-table [dataSource]="dataSource" dtSort [dtSortDisabled]="disableAllSort">
      <ng-container dtColumnDef="column_a">
        <dt-header-cell id="column_a" *dtHeaderCellDef #sortHeaderA dt-sort-header [disabled]="disabledColumnSort" start="asc">Column A</dt-header-cell>
        <dt-cell *dtCellDef="let row"> {{row.a}} </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="column_b">
        <dt-header-cell id="column_b" *dtHeaderCellDef #sortHeaderB dt-sort-header [dt-sort-header-aria-label]="sortAriaLabel">
          Column B
        </dt-header-cell>
        <dt-cell *dtCellDef="let row"> {{row.b}} </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="column_c">
        <dt-header-cell id="column_c" *dtHeaderCellDef #sortHeaderC dt-sort-header>Column C</dt-header-cell>
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
  sortAriaLabel = 'Sort column b';

  @ViewChild(DtSort) dtSort: DtSort;
  @ViewChild('sortHeaderA') sortHeaderA: DtSortHeader;
  @ViewChild('sortHeaderB') sortHeaderB: DtSortHeader;
  @ViewChild('sortHeaderC') sortHeaderC: DtSortHeader;

  dataSource = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  constructor(public elementRef: ElementRef) { }

  sort(id: DtSortAppColumnIds): void {
    this.dispatchMouseEvent(id, 'click');
  }

  dispatchMouseEvent(id: DtSortAppColumnIds, event: string): void {
    const sortElement = this.elementRef.nativeElement.querySelector(`#${id}`);
    dispatchMouseEvent(sortElement, event);
  }

  expectIconStates(
    viewStates: Map<string, {iconName: string}>): void {
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
    <dt-header-cell *dtHeaderCellDefdt-sort-header>Column A</dt-header-cell>
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