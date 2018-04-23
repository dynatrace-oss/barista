import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtTableModule, DtTable, DtRow, DtCell } from '@dynatrace/angular-components/table';
import { DtTableEmptyState } from '@dynatrace/angular-components/table/table-empty-state';
import { DtLoadingSpinner } from '@dynatrace/angular-components/loading-distractor';

describe('DtTable', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTableModule],
      declarations: [TestApp],
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

      const dataSourceRows = fixture.componentInstance.dataSource.length;
      const tableRows = fixture.debugElement.queryAll(By.directive(DtRow));
      const dataSourceCells = fixture.componentInstance.dataSource.reduce((prev, cur) => Object.keys(cur).length + prev, 0);
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

    it('Should render a TableEmptyStateComponent', () => {
      const fixture = TestBed.createComponent(TestApp);

      const noEmptyStateComponent = fixture.debugElement.query(By.directive(DtTableEmptyState));
      expect(noEmptyStateComponent).toBeFalsy('Expected the DtEmptyStateComponent not beign rendered for not empty tables');

      fixture.componentInstance.dataSource = [];
      fixture.detectChanges();

      const emptyStateComponent = fixture.debugElement.query(By.directive(DtTableEmptyState));
      expect(emptyStateComponent).toBeTruthy('Expected the DtEmptyStateComponent rendered for empty tables');
    });

    it('Should render a LoadingComponent', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.componentInstance.loading = true;
      fixture.detectChanges();

      const loadingComponent = fixture.debugElement.query(By.directive(DtLoadingSpinner));
      expect(loadingComponent).toBeTruthy('Expected the DtLoadingSpinner rendered for loading tables');

      fixture.componentInstance.loading = false;
      fixture.detectChanges();

      const noLoadingComponent = fixture.debugElement.query(By.directive(DtLoadingSpinner));
      expect(noLoadingComponent).toBeFalsy('Expected the DtLoadingSpinner not beign rendered for not loading tables');
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

    <dt-header-row *dtHeaderRowDef="['col1', 'col2']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['col1', 'col2']"></dt-row>
</dt-table>
  `,
})
class TestApp {
  @ViewChild(DtTable) tableComponent: DtTable<object[]>;
  loading = false;
  dataSource = [
    {col1: 'test 1', col2: 'test 2'},
    {col1: 'test 1', col2: 'test 2'},
    {col1: 'test 1', col2: 'test 2'},
    {col1: 'test 1', col2: 'test 2'},
  ];
}
