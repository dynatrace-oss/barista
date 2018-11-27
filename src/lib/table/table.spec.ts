import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  DebugElement,
  Input,
  NgModule,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtCell,
  DtExpandableCell,
  DtHeaderCell,
  DtRow,
  DtExpandableRow,
  DtTable,
  DtTableEmptyStateDirective,
  DtTableEmptyStateMessage,
  DtTableEmptyStateTitle,
  DtTableLoadingState,
  DtTableModule,
  DtLoadingDistractor,
  DtLoadingDistractorModule,
  DtIconModule,
  DtIndicatorModule,
} from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// tslint:disable:no-magic-numbers
describe('DtTable', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DtTableModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtLoadingDistractorModule,
        HttpClientModule,
        NoopAnimationsModule,
        TestExpandableComponentModule,
        DtIndicatorModule,
      ],
      declarations: [
        TestApp,
        TestDynamicApp,
        TestAppExpandableTable,
        TestStickyHeader,
        TestIndicatorApp,
      ],
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
      const tableColumnProportionCells = fixture.debugElement.queryAll(By.css('.dt-table-column-col1'));
      const tableColumnMinWidthCells = fixture.debugElement.queryAll(By.css('.dt-table-column-col2'));
      const tableColumnMinWidthAndPropCells = fixture.debugElement.queryAll(By.css('.dt-table-column-col3'));
      const tableHeaderCellsAlignCenter = fixture.debugElement.queryAll(By.css('.dt-header-cell.dt-table-column-align-center'));
      const tableCellsAlignCenter = fixture.debugElement.queryAll(By.css('.dt-cell.dt-table-column-align-center'));

      expect(tableComponent.length)
        .toBe(1, 'Expected 1 component with directive <dt-table>');
      expect(tableRows.length)
        .toBe(4, 'Expected 4 components with directive <dt-row>');
      expect(tableCells.length)
        .toBe(12, 'Expected 12 components with directive <dt-cell>');
      expect(tableHeaderRows.length)
        .toBe(1, 'Expected 1 component with directive <dt-header-row>');
      expect(tableHeaderCells.length)
        .toBe(3, 'Expected 3 components with directive <dt-header-cell>');
      expect(tableColumnProportionCells.length)
        .toBe(5, 'Expected 5 components with the CSS .dt-table-column-col1 class applied');
      expect(tableColumnMinWidthCells.length)
        .toBe(5, 'Expected 5 components with the CSS .dt-table-column-col2 class applied');
      expect(tableColumnMinWidthAndPropCells.length)
        .toBe(5, 'Expected 5 components with the CSS .dt-table-column-col3 class applied');
      expect(tableHeaderCellsAlignCenter.length)
        .toBe(1, 'Expected 1 header cells with the CSS .dt-table-column-align-center class applied');
      expect(tableCellsAlignCenter.length)
        .toBe(4, 'Expected 4 header cells with the CSS .dt-table-column-align-center class applied');

      tableColumnMinWidthCells.forEach((cell, index) => {
        expect(cell.nativeElement.style.minWidth)
          .toBe('50px', `Expected cell ${index} min width prop set`);
        expect(cell.nativeElement.style.flexGrow)
          .toBeFalsy(`Expected cell ${index} flexGrow prop to be empty`);
        expect(cell.nativeElement.style.flexShrink)
          .toBeFalsy(`Expected cell ${index} flexShrink prop to be empty`);
      });

      tableColumnProportionCells.forEach((cell, index) => {
        expect(cell.nativeElement.style.minWidth)
          .toBeFalsy(`Expected cell ${index} minWidth prop to be empty`);
        expect(cell.nativeElement.style.flexGrow)
          .toBe('2', `Expected cell ${index} with just DtColumnProportion input set, have flexGrow prop set to 2`);
        expect(cell.nativeElement.style.flexShrink)
          .toBe('2', `Expected cell ${index} with just DtColumnProportion prop set, have flexShrink prop set to 2`);
      });

      tableColumnMinWidthAndPropCells.forEach((cell, index) => {
        expect(cell.nativeElement.style.minWidth)
          .toBe('50px', `Expected cell ${index} Expected min width prop set`);
        expect(cell.nativeElement.style.flexGrow)
          .toBe('2', `Expected cell ${index} with DtColumnProportion input set, have flexGrow prop set to 2`);
        expect(cell.nativeElement.style.flexShrink)
          .toBe('2', `Expected cell ${index} with DtColumnProportion input set, have flexShrink prop set to 2`);
      });
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

      const {dataSource, columns} = fixture.componentInstance;

      const testColumns = fixture.debugElement.queryAll(By.directive(DtHeaderCell));
      expect(testColumns.length).toBe(columns.length, 'Expected the DtLoadingSpinner being rendered for loading tables');

      const MAX_ITER = 10;
      for (let i = 0; i < MAX_ITER; i++) {
        const newRow = {};

        columns.forEach((elem) => {
          newRow[elem] = {[`${elem}`]: elem};
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

    it('should render an expandable table', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      fixture.detectChanges();

      const tableExpandableRows = fixture.debugElement.queryAll(By.directive(DtExpandableRow));
      const tableCells = fixture.debugElement.queryAll(By.directive(DtCell));
      const tableExpandableCells = fixture.debugElement.queryAll(By.directive(DtExpandableCell));

      expect(tableExpandableRows.length)
        .toBe(3, 'Expected the table to have 3 instances of DtExpandableRow');
      expect(tableCells.length)
        .toBe(6, 'Expected the table to have 6 instances of DtCell');
      expect(tableExpandableCells.length)
        .toBe(3, 'Expected the table to have 3 instances of DtExpandableCell');
    });

    it('should assign the right classes to an expandable table', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      fixture.detectChanges();

      const tableComponent = fixture.debugElement.queryAll(By.css('dt-table'));
      const tableExpandableRows = fixture.debugElement.queryAll(By.css('dt-expandable-row'));
      const tableCells = fixture.debugElement.queryAll(By.css('dt-cell'));
      const tableExpandableCells = fixture.debugElement.queryAll(By.css('dt-expandable-cell'));
      const tableHeaderRows = fixture.debugElement.queryAll(By.css('dt-header-row'));
      const tableHeaderCells = fixture.debugElement.queryAll(By.css('dt-header-cell'));

      expect(tableComponent.length)
        .toBe(1, 'Expected 1 component with directive <dt-table>');
      expect(tableExpandableRows.length)
        .toBe(3, 'Expected 3 components with directive <dt-expandable-row>');
      expect(tableCells.length)
        .toBe(6, 'Expected 6 components with directive <dt-cell>');
      expect(tableExpandableCells.length)
        .toBe(3, 'Expected 3 components with directive <dt-expandable-cell>');
      expect(tableHeaderRows.length)
        .toBe(1, 'Expected 1 component with directive <dt-header-row>');
      expect(tableHeaderCells.length)
        .toBe(3, 'Expected 3 components with directive <dt-header-cell>');
    });

    it('should render static content of expandable rows', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      fixture.detectChanges();

      const expandableRowElements = fixture.debugElement.queryAll(By.css('dt-expandable-row'));
      const expandableSections = expandableRowElements.map(
        (debugElement: DebugElement) => debugElement.nativeElement as HTMLElement);

      expect(expandableSections.length).toBe(3, 'Expected 3 expandable sections');
      expect(expandableSections[0].children[1].children[0].textContent).toBe('details1');
      expect(expandableSections[1].children[1].children[0].textContent).toBe('details2');
      expect(expandableSections[2].children[1].children[0].textContent).toBe('details3');
    });

    it('should expand only one row at a time if dtExpandMultiple is set to false (default)', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      fixture.detectChanges();

      const testApp = fixture.debugElement.componentInstance;
      const expandableRowElements = fixture.debugElement.queryAll(By.css('.dt-expandable-row-base')).map(
        (debugElement: DebugElement) => debugElement.nativeElement as HTMLElement);

      // initially all rows collapsed
      expect(testApp.expandableRows[0].expanded).toBeFalsy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();

      // if 1st row expanded
      expandableRowElements[0].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeTruthy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();

      // if 2nd row expanded
      expandableRowElements[1].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeFalsy();
      expect(testApp.expandableRows[1].expanded).toBeTruthy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();

      // if 3rd row expanded
      expandableRowElements[2].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeFalsy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeTruthy();

      // if 3rd row collapsed
      expandableRowElements[2].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeFalsy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();
    });

    it('should expand multiple rows at a time if dtExpandMultiple is set to true', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      const testApp: TestAppExpandableTable = fixture.debugElement.componentInstance;
      testApp.multiple = true;
      fixture.detectChanges();

      const expandableRowElements = fixture.debugElement.queryAll(By.css('.dt-expandable-row-base')).map(
        (debugElement: DebugElement) => debugElement.nativeElement as HTMLElement);

      // initially all rows collapsed
      expect(testApp.expandableRows[0].expanded).toBeFalsy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();

      // if 1st row expanded
      expandableRowElements[0].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeTruthy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();

      // if 2nd row expanded
      expandableRowElements[1].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeTruthy();
      expect(testApp.expandableRows[1].expanded).toBeTruthy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();

      // if 3rd row expanded
      expandableRowElements[2].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeTruthy();
      expect(testApp.expandableRows[1].expanded).toBeTruthy();
      expect(testApp.expandableRows[2].expanded).toBeTruthy();

      // if all rows collapsed
      expandableRowElements[0].click();
      expandableRowElements[1].click();
      expandableRowElements[2].click();
      fixture.detectChanges();
      expect(testApp.expandableRows[0].expanded).toBeFalsy();
      expect(testApp.expandableRows[1].expanded).toBeFalsy();
      expect(testApp.expandableRows[2].expanded).toBeFalsy();
    });

    it('should trigger openedChanged event on expand and on collapse', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      const testApp: TestAppExpandableTable = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      const expandableRowElements = fixture.debugElement.queryAll(By.css('.dt-expandable-row-base')).map(
        (debugElement: DebugElement) => debugElement.nativeElement as HTMLElement);

      // on init
      expect(testApp.expandedRow).toBe(undefined);

      // on expand
      expandableRowElements[1].click();
      fixture.detectChanges();
      expect(testApp.expandedRow).toBe(testApp.expandableRows[1]);

      // on collapse
      expandableRowElements[1].click();
      fixture.detectChanges();
      expect(testApp.expandedRow).toBe(undefined);
    });

    it('should style dt-expandable-cell correctly on expand and on collapse', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      fixture.detectChanges();

      const expandableRowElements = fixture.debugElement.queryAll(By.css('.dt-expandable-row-base')).map(
        (debugElement: DebugElement) => debugElement.nativeElement as HTMLElement);

      const expandableCells = fixture.debugElement.queryAll(By.directive(DtExpandableCell));
      const cell1 = expandableCells[0].nativeElement;
      const cell2 = expandableCells[1].nativeElement;
      const cell3 = expandableCells[2].nativeElement;

      // on init
      expect(cell1.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell2.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell3.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);

      // on expand
      expandableRowElements[0].click();
      fixture.detectChanges();
      expect(cell1.className.indexOf('dt-expandable-cell-expanded')).toBeGreaterThan(-1);
      expect(cell2.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell3.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);

      // on collapse
      expandableRowElements[0].click();
      fixture.detectChanges();
      expect(cell1.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell2.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
      expect(cell3.className.indexOf('dt-expandable-cell-expanded')).toBe(-1);
    });

    it('should be able to dynamically add a component to an expandable row', () => {
      const fixture = TestBed.createComponent(TestAppExpandableTable);
      const testApp = fixture.componentInstance;
      testApp.dynamicallyAddComponent = true;
      fixture.detectChanges();

      const expandableRowElements = fixture.debugElement.queryAll(By.css('.dt-expandable-row-base')).map(
        (debugElement: DebugElement) => debugElement.nativeElement as HTMLElement);

      // on init
      expect(testApp.expandableRows[0].contentViewContainer.element.nativeElement.nextElementSibling).toBeNull();
      expect(testApp.expandableRows[1].contentViewContainer.element.nativeElement.nextElementSibling).toBeNull();
      expect(testApp.expandableRows[2].contentViewContainer.element.nativeElement.nextElementSibling).toBeNull();

      // on expand
      expandableRowElements[2].click();
      fixture.detectChanges();
      const expandableContent =
        testApp.expandableRows[2].contentViewContainer.element.nativeElement.nextElementSibling as HTMLElement;
      expect(expandableContent.innerHTML).toEqual('<div>Test Component for expandable section</div>');
    });

    it('should set a dt-indicator class on the cell', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();
      const cell = fixture.debugElement.query(By.css('.dt-cell'));
      expect(cell.nativeElement.classList.contains('dt-indicator')).toBeTruthy();
    });

    it('should complete the `stateChanges` stream for the dtCells on destroy', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();

      const instance: DtCell =
        fixture.debugElement.query(By.directive(DtCell)).componentInstance;
      const completeSpy = jasmine.createSpy('complete spy');
      const subscription = instance._stateChanges.subscribe(undefined, undefined, completeSpy);

      fixture.destroy();
      expect(completeSpy).toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should have the correct values for hasError and hasWarning', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();

      const instance: DtCell =
        fixture.debugElement.query(By.directive(DtCell)).componentInstance;

      expect(instance.hasError).toBeTruthy('hasError to be true');
      expect(instance.hasWarning).toBeFalsy('hasWarning to be false');

      fixture.componentInstance.color = 'warning';
      fixture.detectChanges();

      expect(instance.hasError).toBeFalsy('hasError to be false');
      expect(instance.hasWarning).toBeTruthy('hasWarning to be true');

    });

    it('should have the correct classes on the row', fakeAsync(() => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();
      tick();
      let rowNative = fixture.debugElement.query(By.directive(DtRow)).nativeElement;

      expect(rowNative.classList.contains('dt-table-row-indicator')).toBeTruthy();
      expect(rowNative.classList.contains('dt-color-error')).toBeTruthy();
      expect(rowNative.classList.contains('dt-color-warning')).toBeFalsy();

      fixture.componentInstance.active = false;
      fixture.detectChanges();
      tick();

      rowNative = fixture.debugElement.query(By.directive(DtRow)).nativeElement;

      expect(rowNative.classList.contains('dt-table-row-indicator')).toBeFalsy();

      fixture.componentInstance.active = true;
      fixture.componentInstance.color = 'warning';
      fixture.detectChanges();
      tick();

      rowNative = fixture.debugElement.query(By.directive(DtRow)).nativeElement;

      expect(rowNative.classList.contains('dt-table-row-indicator')).toBeTruthy();
      expect(rowNative.classList.contains('dt-color-error')).toBeFalsy();
      expect(rowNative.classList.contains('dt-color-warning')).toBeTruthy();
    }));
  });

  describe('Cell - Row registraion', () => {

    it('should register a cell with the row after creation', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();
      const row: DtRow = fixture.debugElement.query(By.directive(DtRow)).componentInstance;

      expect(row._registeredCells.length).toBe(2);
    });

    it('should register a cell with the row when the cell is generated at runtime', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();

      fixture.componentInstance.columns = ['col1', 'col2', 'col3'];
      fixture.detectChanges();
      const row: DtRow = fixture.debugElement.query(By.directive(DtRow)).componentInstance;
      expect(row._registeredCells.length).toBe(3);
    });

    it('should unregister a cell when a column is removed', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();

      fixture.componentInstance.columns = ['col1'];
      fixture.detectChanges();
      const row: DtRow = fixture.debugElement.query(By.directive(DtRow)).componentInstance;
      expect(row._registeredCells.length).toBe(1);
    });

    it('should unregister each cell with the row after destroy', () => {
      const fixture = TestBed.createComponent(TestIndicatorApp);
      fixture.detectChanges();
      const row = fixture.debugElement.query(By.directive(DtRow)).componentInstance;
      spyOn(row, '_unregisterCell');
      fixture.destroy();
      expect(row._unregisterCell).toHaveBeenCalledTimes(2);
    });
  });

  describe('Sticky Header', () => {
    it('should add the sticky class to the header', () => {
      const fixture = TestBed.createComponent(TestStickyHeader);
      fixture.detectChanges();
      const headerRow = fixture.debugElement.query(By.css('dt-header-row')).nativeElement;
      expect(headerRow.classList.contains('dt-table-sticky')).toBe(true);
    });
  });
});

/** Test component that contains a DtTable. */
@Component({
  selector: 'dt-test-app',
  template: `
  <dt-table [dataSource]="dataSource" [isLoading]="loading">
    <ng-container dtColumnDef="col1" [dtColumnProportion]="2" dtColumnAlign="center">
      <dt-header-cell *dtHeaderCellDef>column 1</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.col1}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="col2" dtColumnMinWidth="50" dtColumnAlign="no-align-type">
      <dt-header-cell *dtHeaderCellDef>column 2</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.col2}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="col3" dtColumnMinWidth="50" dtColumnProportion="2">
      <dt-header-cell *dtHeaderCellDef>column 3</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.col3}}</dt-cell>
    </ng-container>

    <dt-table-empty-state dtTableEmptyState>
      <dt-table-empty-state-title>No host</dt-table-empty-state-title>
      <dt-table-empty-state-message>Test message</dt-table-empty-state-message>
    </dt-table-empty-state>

    <dt-loading-distractor dtTableLoadingState>Loading...</dt-loading-distractor>

    <dt-header-row *dtHeaderRowDef="['col1', 'col2', 'col3']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['col1', 'col2', 'col3']"></dt-row>
  </dt-table>
  `,
})
class TestApp {
  @ViewChild(DtTable) tableComponent: DtTable<object[]>;
  loading = false;
  dataSource: object[] | null | undefined = [
    {col1: 'test 1', col2: 'test 2', col3: 'test 3'},
    {col1: 'test 1', col2: 'test 2', col3: 'test 3'},
    {col1: 'test 1', col2: 'test 2', col3: 'test 3'},
    {col1: 'test 1', col2: 'test 2', col3: 'test 3'},
  ];

  constructor(public _renderer: Renderer2) {

  }
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

@Component({
  selector: 'dt-test-table-sticky',
  template: `
    <dt-table [dataSource]="dataSource1">
    <ng-container dtColumnDef="host" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.host}}</dt-cell>
    </ng-container>

    <dt-header-row *dtHeaderRowDef="['host']; sticky: true"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['host']"></dt-row>
  </dt-table>`,
})
export class TestStickyHeader {
  dataSource1: object[] = [
    { host: 'et-demo-2-win4' },
  ];
}

/** Test component that contains expandable table */
@Component({
  selector: 'dt-test-app-expandable-table',
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container dtColumnDef="col1">
        <dt-header-cell *dtHeaderCellDef>column 1</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{row.col1}}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="col2">
        <dt-header-cell *dtHeaderCellDef>column 2</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{row.col2}}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="details">
        <dt-header-cell *dtHeaderCellDef>details</dt-header-cell>
        <dt-expandable-cell *dtCellDef></dt-expandable-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['col1', 'col2', 'details']"></dt-header-row>
      <dt-expandable-row *dtRowDef="let row; columns: ['col1', 'col2', 'details']"
                         (openedChange)="onOpenedChange($event)"
                         [multiple]="multiple">
        <span *ngIf="!dynamicallyAddComponent">{{row.details}}</span>
      </dt-expandable-row>
    </dt-table>
  `,
})
class TestAppExpandableTable {
  @Input() multiple = false;
  @Input() dynamicallyAddComponent = false;
  @ViewChildren(DtExpandableRow) private _expandableRows: QueryList<DtExpandableRow>;
  private _expandedRow: DtExpandableRow | undefined;
  dataSource: object[] | null | undefined = [
    {col1: 'test 1', col2: 'test 2', details: 'details1'},
    {col1: 'test 1', col2: 'test 2', details: 'details2'},
    {col1: 'test 1', col2: 'test 2', details: 'details3'},
  ];

  get expandableRows(): DtExpandableRow[] {
    return this._expandableRows.toArray();
  }

  get expandedRow(): DtExpandableRow | undefined {
    return this._expandedRow;
  }

  constructor(private resolver: ComponentFactoryResolver) {}

  onOpenedChange(row: DtExpandableRow): void {
    this._expandedRow = (row.expanded) ? row : undefined;

    if (this.dynamicallyAddComponent) {
      const factory: ComponentFactory<TestExpandableComponent> = this.resolver.resolveComponentFactory(TestExpandableComponent);
      row.contentViewContainer.clear();
      row.contentViewContainer.createComponent(factory);
    }
  }
}

@Component({
  template: '<div>Test Component for expandable section</div>',
})
class TestExpandableComponent {}

@NgModule({
  imports: [CommonModule],
  declarations: [TestExpandableComponent],
  entryComponents: [TestExpandableComponent],
})
export class TestExpandableComponentModule {}

/** Test component that contains a dtIndicator DtTable. */
@Component({
  selector: 'dt-test-app',
  template: `
  <dt-table [dataSource]="dataSource">
    <ng-container *ngFor="let column of columns;" [dtColumnDef]="column">
      <dt-header-cell *dtHeaderCellDef>{{ column }}</dt-header-cell>
      <dt-cell *dtCellDef="let row" [dtIndicator]="active" [dtIndicatorColor]="color">{{ row[column] }}</dt-cell>
    </ng-container>

    <dt-header-row *dtHeaderRowDef="columns"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: columns"></dt-row>
  </dt-table>
  `,
})
class TestIndicatorApp {
  @ViewChild(DtTable) tableComponent: DtTable<object[]>;
  columns = ['col1', 'col2'];
  dataSource: object[] = [
    {col1: 'test 1', col2: 'test 2', col3: 'test 3'},
  ];
  color: 'error' | 'warning' = 'error';
  active = true;
}
