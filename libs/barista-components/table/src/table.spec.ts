/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Component,
  DebugElement,
  Input,
  NgModule,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  waitForAsync,
  fakeAsync,
  TestBed,
  tick,
  flushMicrotasks,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtCustomEmptyState,
  DtEmptyState,
  DtEmptyStateModule,
} from '@dynatrace/barista-components/empty-state';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import {
  DtLoadingDistractor,
  DtLoadingDistractorModule,
} from '@dynatrace/barista-components/loading-distractor';

import { createComponent } from '@dynatrace/testing/browser';
import { DtCell } from './cell';
import { DtExpandableCell, DtExpandableRow } from './expandable';
import { DtHeaderCell } from './header';
import { DtRow } from './row';
import { DtTableLoadingState } from './states';
import { DtTable } from './table';
import { DtTableDataSource } from './table-data-source';
import { DtTableModule } from './table-module';

describe('DtTable', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          DtTableModule,
          DtEmptyStateModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
          DtLoadingDistractorModule,
          HttpClientTestingModule,
          NoopAnimationsModule,
          TestExpandableComponentModule,
          DtIndicatorModule,
        ],
        declarations: [
          TestApp,
          TestDynamicApp,
          TestAppMultiExpandableTable,
          TestStickyHeader,
          TestIndicatorApp,
          CustomEmptyState,
          TestCustomEmptyStateApp,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  // Regular table tests
  describe('Table Rendering', () => {
    it('Should render the TestComponent', () => {
      const fixture = TestBed.createComponent(TestApp);
      expect(fixture.componentInstance.tableComponent.dataSource).toBeFalsy();

      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy();
      expect(fixture.componentInstance.tableComponent).toBeTruthy();
      expect(fixture.componentInstance.tableComponent.dataSource).toBeTruthy();
    });

    it('Should render a TableComponent', () => {
      const fixture = createComponent(TestApp);

      const dataSourceRows = (fixture.componentInstance.dataSource as object[])
        .length;
      const tableRows = fixture.debugElement.queryAll(By.directive(DtRow));
      const dataSourceCells = (
        fixture.componentInstance.dataSource as object[]
      ).reduce((prev, cur) => Object.keys(cur).length + prev, 0);
      const tableCells = fixture.debugElement.queryAll(By.directive(DtCell));

      expect(tableRows.length).toBe(dataSourceRows);
      expect(tableCells.length).toBe(dataSourceCells);
    });

    it('Should have corresponding classes', () => {
      const fixture = createComponent(TestApp);

      const tableComponent = fixture.debugElement.queryAll(By.css('dt-table'));
      const tableRows = fixture.debugElement.queryAll(By.css('dt-row'));
      const tableCells = fixture.debugElement.queryAll(By.css('dt-cell'));
      const tableHeaderRows = fixture.debugElement.queryAll(
        By.css('dt-header-row'),
      );
      const tableHeaderCells = fixture.debugElement.queryAll(
        By.css('dt-header-cell'),
      );
      const tableColumnProportionCells = fixture.debugElement.queryAll(
        By.css('.dt-table-column-col1'),
      );
      const tableColumnMinWidthCells = fixture.debugElement.queryAll(
        By.css('.dt-table-column-col2'),
      );
      const tableColumnMinWidthAndPropCells = fixture.debugElement.queryAll(
        By.css('.dt-table-column-col3'),
      );
      const tableHeaderCellsAlignCenter = fixture.debugElement.queryAll(
        By.css('.dt-header-cell.dt-table-column-align-center'),
      );
      const tableCellsAlignCenter = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-align-center'),
      );

      // Expected 1 component with directive <dt-table>
      expect(tableComponent.length).toBe(1);
      // Expected 4 components with directive <dt-row>
      expect(tableRows.length).toBe(4);
      // Expected 12 components with directive <dt-cell>
      expect(tableCells.length).toBe(12);
      // Expected 1 component with directive <dt-header-row>
      expect(tableHeaderRows.length).toBe(1);
      // Expected 3 components with directive <dt-header-cell>
      expect(tableHeaderCells.length).toBe(3);
      // Expected 5 components with the CSS .dt-table-column-col1 class applied
      expect(tableColumnProportionCells.length).toBe(5);
      // Expected 5 components with the CSS .dt-table-column-col2 class applied
      expect(tableColumnMinWidthCells.length).toBe(5);
      // Expected 5 components with the CSS .dt-table-column-col3 class applied
      expect(tableColumnMinWidthAndPropCells.length).toBe(5);
      // Expected 1 header cells with the CSS .dt-table-column-align-center class applied
      expect(tableHeaderCellsAlignCenter.length).toBe(1);
      // Expected 4 header cells with the CSS .dt-table-column-align-center class applied
      expect(tableCellsAlignCenter.length).toBe(4);

      tableColumnMinWidthCells.forEach((cell) => {
        expect(cell.nativeElement.style.minWidth).toBe('50px');
        expect(cell.nativeElement.style.flexGrow).toBeFalsy();
        expect(cell.nativeElement.style.flexShrink).toBeFalsy();
      });

      tableColumnProportionCells.forEach((cell) => {
        expect(cell.nativeElement.style.minWidth).toBeFalsy();
        expect(cell.nativeElement.style.flexGrow).toBe('2');
        expect(cell.nativeElement.style.flexShrink).toBe('2');
      });

      tableColumnMinWidthAndPropCells.forEach((cell) => {
        expect(cell.nativeElement.style.minWidth).toBe('50px');
        expect(cell.nativeElement.style.flexGrow).toBe('2');
        expect(cell.nativeElement.style.flexShrink).toBe('2');
      });
    });

    it('Should render a EmptyState content', () => {
      const fixture = createComponent(TestApp);

      const noEmptyComponent = fixture.debugElement.query(
        By.directive(DtEmptyState),
      );
      expect(noEmptyComponent).toBeFalsy();

      const emptyDataSources = [[], null, undefined];

      for (const ds of emptyDataSources) {
        fixture.componentInstance.dataSource = ds;
        fixture.detectChanges();

        const emptyComponent = fixture.debugElement.query(
          By.directive(DtEmptyState),
        );
        expect(emptyComponent).toBeTruthy();
      }
    });

    it('Should render a emptystate component when a datasource is set to empty twice', () => {
      const fixture = createComponent(TestApp);

      fixture.componentInstance.dataSource = new DtTableDataSource<any>([]);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('dt-empty-state'))).toBeTruthy();

      fixture.componentInstance.dataSource = new DtTableDataSource<any>([]);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('dt-empty-state'))).toBeTruthy();
    });

    it('Should render a provided custom empty-state marked with the DtEmptyStateDirective', () => {
      const fixture = createComponent(TestCustomEmptyStateApp);

      expect(
        fixture.debugElement.query(By.directive(DtCustomEmptyState)),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.directive(CustomEmptyState)),
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.directive(DtEmptyState)),
      ).toBeFalsy();

      fixture.componentInstance.dataSource = [];
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.directive(DtCustomEmptyState)),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.directive(CustomEmptyState)),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.directive(DtEmptyState)),
      ).toBeTruthy();
    });

    it('Should render a LoadingComponent', () => {
      const fixture = createComponent(TestApp);
      fixture.componentInstance.loading = true;
      fixture.detectChanges();

      const loadingComponent = fixture.debugElement.query(
        By.directive(DtLoadingDistractor),
      );
      // Expected the DtLoadingSpinner beign rendered for loading tables
      expect(loadingComponent).toBeTruthy();

      const loadingPlaceholder = fixture.debugElement.query(
        By.directive(DtTableLoadingState),
      );
      // Expected the DtTableLoadingState placeholder beign rendered for loading tables
      expect(loadingPlaceholder).toBeTruthy();

      fixture.componentInstance.loading = false;
      fixture.detectChanges();

      const noLoadingComponent = fixture.debugElement.query(
        By.directive(DtLoadingDistractor),
      );
      // Expected the DtLoadingSpinner not beign rendered for not loading tables
      expect(noLoadingComponent).toBeFalsy();
    });

    it('Should render dynamic columns', () => {
      const fixture = createComponent(TestDynamicApp);

      const { dataSource, columns } = fixture.componentInstance;

      const testColumns = fixture.debugElement.queryAll(
        By.directive(DtHeaderCell),
      );
      // Expected the DtLoadingSpinner being rendered for loading tables
      expect(testColumns.length).toBe(columns.length);

      const MAX_ITER = 10;
      for (let i = 0; i < MAX_ITER; i++) {
        const newRow = {};

        columns.forEach((elem) => {
          newRow[elem] = { [`${elem}`]: elem };
        });

        fixture.componentInstance.dataSource.push(newRow);
      }

      fixture.componentInstance.tableComponent.renderRows();
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(By.directive(DtCell));
      const testCells = dataSource.reduce(
        (prev, cur) => Object.keys(cur).length + prev,
        0,
      );
      const testRows = fixture.debugElement.queryAll(By.directive(DtRow));

      // Expected the same number of DtCells as DataSource cells
      expect(cells.length).toBe(testCells);
      // Expected the same number of DtRows as DataSource rows
      expect(dataSource.length).toBe(testRows.length);
    });

    it('should set a dt-indicator class on the cell', () => {
      const fixture = createComponent(TestIndicatorApp);
      const cell = fixture.debugElement.query(By.css('.dt-cell'));
      expect(
        cell.nativeElement.classList.contains('dt-indicator'),
      ).toBeTruthy();
    });

    it('should complete the `stateChanges` stream for the dtCells on destroy', () => {
      const fixture = createComponent(TestIndicatorApp);

      const instance: DtCell = fixture.debugElement.query(
        By.directive(DtCell),
      ).componentInstance;
      const completeSpy = jest.fn();
      const subscription = instance._stateChanges.subscribe(
        () => {},
        () => {},
        completeSpy,
      );

      fixture.destroy();
      expect(completeSpy).toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should have the correct values for hasError and hasWarning', () => {
      const fixture = createComponent(TestIndicatorApp);

      const instance: DtCell = fixture.debugElement.query(
        By.directive(DtCell),
      ).componentInstance;

      expect(instance.hasError).toBeTruthy();
      expect(instance.hasWarning).toBeFalsy();

      fixture.componentInstance.color = 'warning';
      fixture.detectChanges();

      expect(instance.hasError).toBeFalsy();
      expect(instance.hasWarning).toBeTruthy();
    });

    it('should have the correct classes on the row', fakeAsync(() => {
      const fixture = createComponent(TestIndicatorApp);
      tick();
      let rowNative = fixture.debugElement.query(
        By.directive(DtRow),
      ).nativeElement;

      expect(
        rowNative.classList.contains('dt-table-row-indicator'),
      ).toBeTruthy();
      expect(rowNative.classList.contains('dt-color-error')).toBeTruthy();
      expect(rowNative.classList.contains('dt-color-warning')).toBeFalsy();

      fixture.componentInstance.active = false;
      fixture.detectChanges();
      tick();

      rowNative = fixture.debugElement.query(By.directive(DtRow)).nativeElement;

      expect(
        rowNative.classList.contains('dt-table-row-indicator'),
      ).toBeFalsy();

      fixture.componentInstance.active = true;
      fixture.componentInstance.color = 'warning';
      fixture.detectChanges();
      tick();

      rowNative = fixture.debugElement.query(By.directive(DtRow)).nativeElement;

      expect(
        rowNative.classList.contains('dt-table-row-indicator'),
      ).toBeTruthy();
      expect(rowNative.classList.contains('dt-color-error')).toBeFalsy();
      expect(rowNative.classList.contains('dt-color-warning')).toBeTruthy();
    }));
  });

  describe('Expandable table', () => {
    it('should render an expandable table', () => {
      const fixture = createComponent(TestAppMultiExpandableTable);

      const tableExpandableRows = fixture.debugElement.queryAll(
        By.directive(DtExpandableRow),
      );
      const tableCells = fixture.debugElement.queryAll(By.directive(DtCell));
      const tableExpandableCells = fixture.debugElement.queryAll(
        By.directive(DtExpandableCell),
      );

      // Expected the table to have 4 instances of DtExpandableRow
      expect(tableExpandableRows.length).toBe(4);
      // Expected the table to have 8 instances of DtCell
      expect(tableCells.length).toBe(8);
      // Expected the table to have 4 instances of DtExpandableCell
      expect(tableExpandableCells.length).toBe(4);
    });

    it('should assign the right classes to an expandable table', () => {
      const fixture = createComponent(TestAppMultiExpandableTable);

      const tableComponent = fixture.debugElement.queryAll(By.css('dt-table'));
      const tableExpandableRows = fixture.debugElement.queryAll(
        By.css('dt-expandable-row'),
      );
      const tableCells = fixture.debugElement.queryAll(By.css('dt-cell'));
      const tableExpandableCells = fixture.debugElement.queryAll(
        By.css('dt-expandable-cell'),
      );
      const tableHeaderRows = fixture.debugElement.queryAll(
        By.css('dt-header-row'),
      );
      const tableHeaderCells = fixture.debugElement.queryAll(
        By.css('dt-header-cell'),
      );

      // Expected 1 component with directive <dt-table>
      expect(tableComponent.length).toBe(1);
      // Expected 4 components with directive <dt-expandable-row>
      expect(tableExpandableRows.length).toBe(4);
      // Expected 8 components with directive <dt-cell>
      expect(tableCells.length).toBe(8);
      // Expected 4 components with directive <dt-expandable-cell>
      expect(tableExpandableCells.length).toBe(4);
      // Expected 1 component with directive <dt-header-row>
      expect(tableHeaderRows.length).toBe(1);
      // Expected 3 components with directive <dt-header-cell>
      expect(tableHeaderCells.length).toBe(3);
    });

    it('should render static content of expandable rows', () => {
      const fixture = createComponent(TestAppMultiExpandableTable);

      const expandableRowElements = fixture.debugElement.queryAll(
        By.css('dt-expandable-row'),
      );
      const expandableSections = expandableRowElements.map(
        (debugElement: DebugElement) =>
          debugElement.nativeElement as HTMLElement,
      );

      expect(expandableSections.length).toBe(4);
      expect(expandableSections[0].children[1].children[0].textContent).toBe(
        'details1',
      );
      expect(expandableSections[1].children[1].children[0].textContent).toBe(
        'details2',
      );
      expect(expandableSections[2].children[1].children[0].textContent).toBe(
        'details3',
      );
      expect(expandableSections[3].children[1].children[0].textContent).toBe(
        'details4',
      );
    });

    it('should only expand one row at a time if multiExpand is set to false', () => {
      const fixture = createComponent(TestAppMultiExpandableTable);
      const componentInstance: TestAppMultiExpandableTable =
        fixture.debugElement.componentInstance;

      const expandableRowTriggerElements = fixture.debugElement
        .queryAll(By.css('.dt-expandable-cell .dt-button'))
        .map(
          (debugElement: DebugElement) =>
            debugElement.nativeElement as HTMLElement,
        );

      // initially two rows are expanded
      expect(componentInstance.expandableRows[0].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[1].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[2].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();

      // when clicking on the first one, all others should collapse
      expandableRowTriggerElements[0].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[1].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[2].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();

      // when clicking on the last one, all others should collapse
      expandableRowTriggerElements[3].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[1].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[2].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[3].expanded).toBeTruthy();

      // when clicking on the last one again, all should be collapsed
      expandableRowTriggerElements[3].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[1].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[2].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();
    });

    it('should expand multiple rows at a time if multiExpand is set to true', () => {
      const fixture = createComponent(TestAppMultiExpandableTable);
      const componentInstance: TestAppMultiExpandableTable =
        fixture.debugElement.componentInstance;
      componentInstance.multiExpand = true;
      fixture.detectChanges();

      const expandableRowTriggerElements = fixture.debugElement
        .queryAll(By.css('.dt-expandable-cell .dt-button'))
        .map(
          (debugElement: DebugElement) =>
            debugElement.nativeElement as HTMLElement,
        );

      // initially two rows are expanded
      expect(componentInstance.expandableRows[0].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[1].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[2].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();

      // expanding first row
      expandableRowTriggerElements[0].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[1].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[2].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();

      // collapsing second row
      expandableRowTriggerElements[1].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[1].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[2].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();

      // expanding fourth row
      expandableRowTriggerElements[3].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[1].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[2].expanded).toBeTruthy();
      expect(componentInstance.expandableRows[3].expanded).toBeTruthy();

      // collapsing all rows
      expandableRowTriggerElements[0].click();
      expandableRowTriggerElements[2].click();
      expandableRowTriggerElements[3].click();
      fixture.detectChanges();
      expect(componentInstance.expandableRows[0].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[1].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[2].expanded).toBeFalsy();
      expect(componentInstance.expandableRows[3].expanded).toBeFalsy();
    });

    it('should style dt-expandable-cell correctly on expand and on collapse', () => {
      const fixture = createComponent(TestAppMultiExpandableTable);

      const expandableRowTriggerElements = fixture.debugElement
        .queryAll(By.css('.dt-expandable-cell .dt-button'))
        .map(
          (debugElement: DebugElement) =>
            debugElement.nativeElement as HTMLElement,
        );

      const expandableCells = fixture.debugElement.queryAll(
        By.directive(DtExpandableCell),
      );
      const cell1 = expandableCells[0].nativeElement;
      const cell2 = expandableCells[1].nativeElement;
      const cell3 = expandableCells[2].nativeElement;
      const cell4 = expandableCells[3].nativeElement;

      // on init two rows are expanded
      expect(cell1.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(
        cell2.className.indexOf('dt-expandable-cell-expanded'),
      ).toBeGreaterThan(-1);
      expect(
        cell3.className.indexOf('dt-expandable-cell-expanded'),
      ).toBeGreaterThan(-1);
      expect(cell4.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);

      // after collapsing the second row
      expandableRowTriggerElements[1].click();
      fixture.detectChanges();
      expect(cell1.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell2.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(
        cell3.className.indexOf('dt-expandable-cell-expanded'),
      ).toBeGreaterThan(-1);
      expect(cell4.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);

      // after collapsing the third row
      expandableRowTriggerElements[2].click();
      fixture.detectChanges();
      expect(cell1.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell2.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell3.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell4.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
    });
  });

  describe('Cell - Row registraion', () => {
    it('should register a cell with the row after creation', () => {
      const fixture = createComponent(TestIndicatorApp);
      const row: DtRow = fixture.debugElement.query(
        By.directive(DtRow),
      ).componentInstance;

      expect(row._registeredCells.length).toBe(2);
    });

    it('should register a cell with the row when the cell is generated at runtime', () => {
      const fixture = createComponent(TestIndicatorApp);

      fixture.componentInstance.columns = ['col1', 'col2', 'col3'];
      fixture.detectChanges();
      const row: DtRow = fixture.debugElement.query(
        By.directive(DtRow),
      ).componentInstance;
      expect(row._registeredCells.length).toBe(3);
    });

    it('should unregister a cell when a column is removed', () => {
      const fixture = createComponent(TestIndicatorApp);

      fixture.componentInstance.columns = ['col1'];
      fixture.detectChanges();
      const row: DtRow = fixture.debugElement.query(
        By.directive(DtRow),
      ).componentInstance;
      expect(row._registeredCells.length).toBe(1);
    });

    it('should unregister each cell with the row after destroy', () => {
      const fixture = createComponent(TestIndicatorApp);
      const row = fixture.debugElement.query(
        By.directive(DtRow),
      ).componentInstance;
      jest.spyOn(row, '_unregisterCell').mockImplementation(() => {});
      fixture.destroy();
      expect(row._unregisterCell).toHaveBeenCalledTimes(2);
    });
  });

  describe('Sticky Header', () => {
    it('should add the sticky class to the header', fakeAsync(() => {
      const fixture = createComponent(TestStickyHeader);
      flushMicrotasks();

      const headerRow = fixture.debugElement.query(
        By.css('dt-header-row'),
      ).nativeElement;
      expect(headerRow.classList.contains('dt-table-sticky')).toBe(true);
    }));
  });
});

/**
 * Test component that contains a DtTable.
 */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-table [dataSource]="dataSource" [loading]="loading">
      <ng-container
        dtColumnDef="col1"
        [dtColumnProportion]="2"
        dtColumnAlign="center"
      >
        <dt-header-cell *dtHeaderCellDef>column 1</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.col1 }}</dt-cell>
      </ng-container>

      <ng-container
        dtColumnDef="col2"
        dtColumnMinWidth="50"
        dtColumnAlign="no-align-type"
      >
        <dt-header-cell *dtHeaderCellDef>column 2</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.col2 }}</dt-cell>
      </ng-container>

      <ng-container
        dtColumnDef="col3"
        dtColumnMinWidth="50"
        dtColumnProportion="2"
      >
        <dt-header-cell *dtHeaderCellDef>column 3</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.col3 }}</dt-cell>
      </ng-container>

      <dt-empty-state>
        <dt-empty-state-item>
          <dt-empty-state-item-title> No host </dt-empty-state-item-title>
          Test message
        </dt-empty-state-item>
      </dt-empty-state>

      <dt-loading-distractor dtTableLoadingState>
        Loading...
      </dt-loading-distractor>

      <dt-header-row *dtHeaderRowDef="['col1', 'col2', 'col3']"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: ['col1', 'col2', 'col3']"></dt-row>
    </dt-table>
  `,
})
class TestApp {
  @ViewChild(DtTable, { static: true }) tableComponent: DtTable<object[]>;
  loading = false;
  dataSource: object[] | null | undefined | DtTableDataSource<any> = [
    { col1: 'test 1', col2: 'test 2', col3: 'test 3' },
    { col1: 'test 1', col2: 'test 2', col3: 'test 3' },
    { col1: 'test 1', col2: 'test 2', col3: 'test 3' },
    { col1: 'test 1', col2: 'test 2', col3: 'test 3' },
  ];

  constructor() {}
}

/** Test component that contains a Dynamic DtTable. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container *ngFor="let column of columns" [dtColumnDef]="column">
        <dt-header-cell *dtHeaderCellDef>{{ column }}</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row[column] }}</dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="columns"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: columns"></dt-row>
    </dt-table>
  `,
})
class TestDynamicApp {
  @ViewChild(DtTable, { static: true }) tableComponent: DtTable<object[]>;
  columns = ['col1', 'col2', 'col3'];
  dataSource: object[] = [];
}

@Component({
  selector: 'dt-test-table-sticky',
  template: `
    <dt-table [dataSource]="dataSource1">
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.host }}</dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['host']; sticky: true"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: ['host']"></dt-row>
    </dt-table>
  `,
})
export class TestStickyHeader {
  dataSource1: object[] = [{ host: 'et-demo-2-win4' }];
}

/**
 * Test component that contains an expandable table with multiExpand property
 * and two rows already expanded.
 */
@Component({
  selector: 'dt-test-app-multi-expandable-table',
  template: `
    <dt-table [dataSource]="dataSource" [multiExpand]="multiExpand">
      <ng-container dtColumnDef="col1">
        <dt-header-cell *dtHeaderCellDef>column 1</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.col1 }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="col2">
        <dt-header-cell *dtHeaderCellDef>column 2</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.col2 }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="details">
        <dt-header-cell *dtHeaderCellDef>details</dt-header-cell>
        <dt-expandable-cell *dtCellDef></dt-expandable-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['col1', 'col2', 'details']"
      ></dt-header-row>
      <dt-expandable-row
        *dtRowDef="let row; columns: ['col1', 'col2', 'details']"
        [expanded]="row.expanded"
      >
        <span>{{ row.details }}</span>
      </dt-expandable-row>
    </dt-table>
  `,
})
class TestAppMultiExpandableTable {
  @Input() multiExpand = false;
  @ViewChildren(DtExpandableRow)
  private _expandableRows: QueryList<DtExpandableRow>;
  dataSource: object[] | null | undefined | DtTableDataSource<any> = [
    { col1: 'test 1', col2: 'test 2', details: 'details1' },
    { col1: 'test 1', col2: 'test 2', details: 'details2', expanded: true },
    { col1: 'test 1', col2: 'test 2', details: 'details3', expanded: true },
    { col1: 'test 1', col2: 'test 2', details: 'details4' },
  ];

  get expandableRows(): DtExpandableRow[] {
    return this._expandableRows.toArray();
  }
}

@Component({
  template: '<div>Test Component for expandable section</div>',
})
export class TestExpandableComponent {}

@NgModule({
  imports: [CommonModule],
  declarations: [TestExpandableComponent],
})
export class TestExpandableComponentModule {}

/** Test component that contains a dtIndicator DtTable. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container *ngFor="let column of columns" [dtColumnDef]="column">
        <dt-header-cell *dtHeaderCellDef>{{ column }}</dt-header-cell>
        <dt-cell
          *dtCellDef="let row"
          [dtIndicator]="active"
          [dtIndicatorColor]="color"
        >
          {{ row[column] }}
        </dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="columns"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: columns"></dt-row>
    </dt-table>
  `,
})
class TestIndicatorApp {
  @ViewChild(DtTable, { static: true }) tableComponent: DtTable<object[]>;
  columns = ['col1', 'col2'];
  dataSource: object[] = [{ col1: 'test 1', col2: 'test 2', col3: 'test 3' }];
  color: 'error' | 'warning' = 'error';
  active = true;
}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.host }}</dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['host']"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: ['host']"></dt-row>
      <custom-empty-state dtCustomEmptyState></custom-empty-state>
    </dt-table>
  `,
})
export class TestCustomEmptyStateApp {
  dataSource: object[] = [{ host: 'host-1' }];
}

@Component({
  selector: 'custom-empty-state',
  providers: [
    {
      provide: DtEmptyState,
      useExisting: CustomEmptyState,
    },
  ],
  template: `
    <dt-empty-state>
      <dt-empty-state-item>
        <dt-empty-state-item-title>No host</dt-empty-state-item-title>
        Test message
      </dt-empty-state-item>
    </dt-empty-state>
  `,
})
export class CustomEmptyState {}
