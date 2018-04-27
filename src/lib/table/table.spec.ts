import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  DtTableModule,
  DtTable,
  DtHeaderCell,
  DtRow,
  DtCell,
  DtTableEmptyState,
  DtTableLoadingState,
  DtTableEmptyStateTitle,
  DtTableEmptyStateMessage,
  DtTableEmptyStateDirective,
  DtLoadingDistractorModule,
  DtLoadingDistractor,
} from '@dynatrace/angular-components';

describe('DtTable', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DtTableModule, DtLoadingDistractorModule],
      declarations: [TestApp, TestDynamicApp],
    });

    TestBed.compileComponents();
  }));

  // Regular button tests
  describe('Table Rendering', () => {
    it('Should render the TestComponent', () => {
      const fixture = TestBed.createComponent(TestApp);
      expect(fixture.componentInstance.tableComponent.dataSource).toBeFalsy('Expected component dataSource empty');

      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy('Expected test component defined');
      expect(fixture.componentInstance.tableComponent).toBeTruthy('Expected component defined');
      expect(fixture.componentInstance.tableComponent.dataSource).toBeTruthy('Expected component received dataSource');
    });

    it('Should render a TableComponent', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const dataSourceRows = (fixture.componentInstance.dataSource as object[]).length;
      const tableRows = fixture.debugElement.queryAll(By.directive(DtRow));
      const dataSourceCells = (fixture.componentInstance.dataSource as object[])
        .reduce((prev, cur) => Object.keys(cur).length + prev, 0);
      const tableCells = fixture.debugElement.queryAll(By.directive(DtCell));

      expect(tableRows.length).toBe(dataSourceRows, 'Expected the same amount of rows that the dataSource');
      expect(tableCells.length).toBe(dataSourceCells, 'Expected the same amount of cells that the dataSource');
    });

    it('Should have corresponding classes', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const tableComponent = fixture.debugElement.queryAll(By.css('dt-table'));
      const tableRows = fixture.debugElement.queryAll(By.css('dt-row'));
      const tableCells = fixture.debugElement.queryAll(By.css('dt-cell'));
      const tableHeaderRows = fixture.debugElement.queryAll(By.css('dt-header-row'));
      const tableHeaderCells = fixture.debugElement.queryAll(By.css('dt-header-cell'));

      expect(tableComponent.length)
        .toBeGreaterThanOrEqual(1, 'Expected at least one component with the CSS .dt-table class applied');
      expect(tableRows.length)
        .toBeGreaterThanOrEqual(1, 'Expected at least one component with the CSS .dt-row class applied');
      expect(tableCells.length)
        .toBeGreaterThanOrEqual(1, 'Expected at least one component with the CSS .dt-cell class applied');
      expect(tableHeaderRows.length)
        .toBeGreaterThanOrEqual(1, 'Expected at least one component with the CSS .dt-header-row class applied');
      expect(tableHeaderCells.length)
        .toBeGreaterThanOrEqual(1, 'Expected at least one component with the CSS .dt-header-cell class applied');
    });

    it('Should render a EmptyState content', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const noEmptyComponent = fixture.debugElement.query(By.directive(DtTableEmptyStateDirective));
      expect(noEmptyComponent).toBeFalsy('Expected the DtTableEmptyState not beign rendered for not empty tables');

      const emptyDataSources = [[], null, undefined];

      emptyDataSources.forEach((ds) => {
        fixture.componentInstance.dataSource = ds;
        fixture.detectChanges();

        const emptyComponent = fixture.debugElement.query(By.directive(DtTableEmptyStateDirective));
        expect(emptyComponent).toBeTruthy('Expected the DtTableEmptyState rendered for empty tables');

        const emptyTitleComponent = fixture.debugElement.query(By.directive(DtTableEmptyStateTitle));
        expect(emptyTitleComponent).toBeTruthy('Expected the DtTableEmptyStateTitle rendered for empty tables');

        const emptyMessageComponent = fixture.debugElement.query(By.directive(DtTableEmptyStateMessage));
        expect(emptyMessageComponent).toBeTruthy('Expected the DtTableEmptyStateMessage rendered for empty tables');
      });

    });

    it('Should render a LoadingComponent', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.componentInstance.loading = true;
      fixture.detectChanges();

      const loadingComponent = fixture.debugElement.query(By.directive(DtLoadingDistractor));
      expect(loadingComponent).toBeTruthy('Expected the DtLoadingSpinner beign rendered for loading tables');

      const loadingPlaceholder = fixture.debugElement.query(By.directive(DtTableLoadingState));
      expect(loadingPlaceholder).toBeTruthy('Expected the DtTableLoadingState placeholder beign rendered for loading tables');

      fixture.componentInstance.loading = false;
      fixture.detectChanges();

      const noLoadingComponent = fixture.debugElement.query(By.directive(DtLoadingDistractor));
      expect(noLoadingComponent).toBeFalsy('Expected the DtLoadingSpinner not beign rendered for not loading tables');
    });

    it('Should render dynamic columns', () => {
      const fixture = TestBed.createComponent(TestDynamicApp);
      fixture.detectChanges();

      const { dataSource, columns } = fixture.componentInstance;

      const testColumns = fixture.debugElement.queryAll(By.directive(DtHeaderCell));
      expect(testColumns.length).toBe(columns.length,
                                      'Expected the DtLoadingSpinner beign rendered for loading tables');

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
      const testCells = dataSource.reduce((prev, cur) => Object.keys(cur).length + prev, 0);
      const testRows = fixture.debugElement.queryAll(By.directive(DtRow));

      expect(cells.length).toBe(testCells, 'Expected the same number of DtCells as DataSource cells');
      expect(dataSource.length).toBe(testRows.length, 'Expected the same number of DtRows as DataSource rows');
    });

  });
});

/** Test component that contains a DtTable. */
@Component({
  selector: 'dt-test-app',
  template: `
  <dt-table [dataSource]="dataSource" [isLoading]="loading">
    <ng-container dtColumnDef="col1">
      <dt-header-cell *dtHeaderCellDef>column 1</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.col1}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="col2">
      <dt-header-cell *dtHeaderCellDef>column 2</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.col2}}</dt-cell>
    </ng-container>

    <dt-table-empty-state dtTableEmptyState>
      <dt-table-empty-state-title>No host</dt-table-empty-state-title>
      <dt-table-empty-state-message>Test message</dt-table-empty-state-message>
    </dt-table-empty-state>

    <dt-loading-distractor dtTableLoadingState>Loading...</dt-loading-distractor>

    <dt-header-row *dtHeaderRowDef="['col1', 'col2']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['col1', 'col2']"></dt-row>
</dt-table>
  `,
})
class TestApp {
  @ViewChild(DtTable) tableComponent: DtTable<object[]>;
  loading = false;
  dataSource: object[] | null | undefined = [
    {col1: 'test 1', col2: 'test 2'},
    {col1: 'test 1', col2: 'test 2'},
    {col1: 'test 1', col2: 'test 2'},
    {col1: 'test 1', col2: 'test 2'},
  ];
}

/** Test component that contains a Dynamic DtTable. */
@Component({
  selector: 'dt-test-app',
  template: `
  <dt-table [dataSource]="dataSource">
    <ng-container *ngFor="let column of columns;" [dtColumnDef]="column">
      <dt-header-cell *dtHeaderCellDef>{{ column }}</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{ row[column] }}</dt-cell>
    </ng-container>

    <dt-header-row *dtHeaderRowDef="columns"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: columns"></dt-row>
</dt-table>
  `,
})
class TestDynamicApp {
  @ViewChild(DtTable) tableComponent: DtTable<object[]>;
  columns = ['col1', 'col2', 'col3'];
  dataSource: object[] = [];
}
