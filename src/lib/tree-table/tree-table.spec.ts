// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, ViewChild, Type } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, async } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DtTreeTable,
  DtTreeTableModule,
} from '@dynatrace/angular-components/tree-table';
import { DtTreeDataSource, DtTreeControl, DtTreeFlattener, DtIndicatorModule } from '@dynatrace/angular-components/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DtIconModule } from '@dynatrace/angular-components/icon';

describe('DtTreeTable', () => {
  let treeTableElement: HTMLElement;
  let underlyingDataSource: FakeDataSource;

  // tslint:disable-next-line:no-any
  function configureDtTreeTableTestingModule(declarations: Array<Type<any>>): void {
    TestBed.configureTestingModule({
      imports: [
        DtTreeTableModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        DtIndicatorModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations,
    }).compileComponents();
  }

  describe('initialization', () => {
    let fixture: ComponentFixture<SimpleDtTreeTableApp>;
    let component: SimpleDtTreeTableApp;

    beforeEach(async(() => {
      configureDtTreeTableTestingModule([SimpleDtTreeTableApp]);
      fixture = TestBed.createComponent(SimpleDtTreeTableApp);

      component = fixture.componentInstance;
      underlyingDataSource = component.underlyingDataSource;
      treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');

      fixture.detectChanges();
    }));

    it('with rendered rows', () => {
      const rows = getRows(treeTableElement);

      expect(rows).toBeDefined('Expect rows to be defined');
      expect(rows[0].classList).toContain('customRowClass');
    });

    it('with the right accessibility roles', () => {
      expect(treeTableElement.getAttribute('role')).toBe('treegrid');

      getRows(treeTableElement).forEach((row) => {
        expect(row.getAttribute('role')).toBe('row');
      });
    });

    it('should expand/collapse the node', () => {
      expect(underlyingDataSource.data.length).toBe(3);

      expect(component.treeControl.expansionModel.selected.length)
      .toBe(0, `Expect no expanded node`);

      fixture.detectChanges();

      expectTreeTableToMatch(
        treeTableElement,
        [
          { cells: ['topping_1', 'cheese_1'], level: 0 },
          { cells: ['topping_2', 'cheese_2'], level: 0 },
          { cells: ['topping_3', 'cheese_3'], level: 0 },
        ]);
      fixture.detectChanges();

      (getToggles(treeTableElement)[2] as HTMLElement).click();
      fixture.detectChanges();

      expect(component.treeControl.expansionModel.selected.length)
        .toBe(1, `Expect node expanded one level`);
      expectTreeTableToMatch(
        treeTableElement,
        [
          { cells: ['topping_1', 'cheese_1'], level: 0 },
          { cells: ['topping_2', 'cheese_2'], level: 0 },
          { cells: ['topping_3', 'cheese_3'], level: 0 },
          { cells: ['topping_4', 'cheese_4'], level: 1 },
        ]);

      (getToggles(treeTableElement)[3] as HTMLElement).click();
      fixture.detectChanges();

      expect(component.treeControl.expansionModel.selected.length)
        .toBe(2, `Expect node expanded`);
      expectTreeTableToMatch(
        treeTableElement,
        [
          { cells: ['topping_1', 'cheese_1'], level: 0 },
          { cells: ['topping_2', 'cheese_2'], level: 0 },
          { cells: ['topping_3', 'cheese_3'], level: 0 },
          { cells: ['topping_4', 'cheese_4'], level: 1 },
          { cells: ['topping_5', 'cheese_5'], level: 2 },
        ]);

      (getToggles(treeTableElement)[2] as HTMLElement).click();
      fixture.detectChanges();

      expectTreeTableToMatch(
        treeTableElement,
        [
          { cells: ['topping_1', 'cheese_1'], level: 0 },
          { cells: ['topping_2', 'cheese_2'], level: 0 },
          { cells: ['topping_3', 'cheese_3'], level: 0 },
        ]);
    });

    it('with dtIndicator', fakeAsync(() => {
      fixture.detectChanges();
      treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');
      const rows = getRows(treeTableElement);
      expect(rows[1].classList).toContain('dt-table-row-indicator');
    }));
  });

  describe('with when row template', () => {
    let fixture: ComponentFixture<WhenRowDtTreeTableApp>;
    let component: WhenRowDtTreeTableApp;

    beforeEach(() => {
      configureDtTreeTableTestingModule([WhenRowDtTreeTableApp]);
      fixture = TestBed.createComponent(WhenRowDtTreeTableApp);

      component = fixture.componentInstance;
      underlyingDataSource = component.underlyingDataSource;
      treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');

      fixture.detectChanges();
    });

    it('with the right data', () => {
      expectTreeTableToMatch(
        treeTableElement,
        [
          { cells: ['topping_1', 'cheese_1'], level: 0 },
          { cells: ['topping_2', 'cheese_2'], level: 0 },
          { cells: ['topping_3', 'cheese_3'], level: 0 },
          { cells: ['topping_4', 'base_4'], level: 0 },
        ]);
    });
  });

  describe('with undefined or null children', () => {
    describe('should initialize', () => {
      let fixture: ComponentFixture<DtTreeTableWithNullOrUndefinedChild >;

      beforeEach(() => {
        configureDtTreeTableTestingModule([DtTreeTableWithNullOrUndefinedChild ]);
        fixture = TestBed.createComponent(DtTreeTableWithNullOrUndefinedChild);
        treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');

        fixture.detectChanges();
      });

      it('with rendered rows', () => {
        const rows = getRows(treeTableElement);

        expect(rows).toBeDefined('Expect rows to be defined');
        expect(rows[0].classList).toContain('customRowClass');
      });
    });
  });
});

interface RowExpectation {
  cells: string[];
  level: number;
}

export class TestData {
  pizzaTopping: string;
  pizzaCheese: string;
  pizzaBase: string;
  level: number;
  children: TestData[];
  observableChildren: BehaviorSubject<TestData[]>;
  isSpecial: boolean;

  constructor(pizzaTopping: string, pizzaCheese: string, pizzaBase: string,
              children: TestData[] = [], isSpecial: boolean = false) {
    this.pizzaTopping = pizzaTopping;
    this.pizzaCheese = pizzaCheese;
    this.pizzaBase = pizzaBase;
    this.isSpecial = isSpecial;
    this.children = children;
    this.observableChildren = new BehaviorSubject<TestData[]>(this.children);
  }
}

class FakeDataSource {
  dataIndex = 0;
  _dataChange = new BehaviorSubject<TestData[]>([]);
  get data(): TestData[] { return this._dataChange.getValue(); }
  set data(data: TestData[]) { this._dataChange.next(data); }

  connect(): Observable<TestData[]> {
    return this._dataChange;
  }

  disconnect(): void {}

  constructor() {
    for (let i = 0; i < 3; i++) {
      this.addData();
    }
    const child = this.addChild(this.data[2]);
    this.addChild(child);
  }

  addChild(parent: TestData, isSpecial: boolean = false): TestData {
    const nextIndex = ++this.dataIndex;
    const child = new TestData(`topping_${nextIndex}`, `cheese_${nextIndex}`, `base_${nextIndex}`);
    let newParent;
    const index = this.data.indexOf(parent);
    if (index > -1) {
      newParent = new TestData(
          parent.pizzaTopping, parent.pizzaCheese, parent.pizzaBase, parent.children, isSpecial);
    }
    parent.children.push(child);
    parent.observableChildren.next(parent.children);

    const copiedData = this.data.slice();
    if (index > -1) {
      copiedData.splice(index, 1, parent);
    }
    this.data = copiedData;
    return child;
  }

  addData(isSpecial: boolean = false): void {
    const nextIndex = ++this.dataIndex;
    const copiedData = this.data.slice();
    copiedData.push(new TestData(
      `topping_${nextIndex}`, `cheese_${nextIndex}`, `base_${nextIndex}`, [], isSpecial));

    this.data = copiedData;
  }
}

function getRows(treeElement: Element): Element[] {
  return [].slice.call(treeElement.querySelectorAll('.dt-tree-table-row'));
}

function getToggles(treeElement: Element): Element[] {
  return [].slice.call(treeElement.querySelectorAll('.dt-tree-table-toggle'));
}

function getCells(row: Element): Element[] {
  return [].slice.call(row.querySelectorAll('.dt-cell'));
}

function getIndentation(row: Element): string | null {
  return (row.querySelector('.dt-tree-table-toggle-cell-wrap') as HTMLElement).style.paddingLeft || '0px';
}

function expectTreeTableToMatch(treeTableElement: Element, expectedTreeTable: RowExpectation[]): void {
  const missedExpectations: string[] = [];

  function checkRow(row: Element, rowIndex: number, expectedRow: string[]): void {
    const cells = getCells(row);
    cells.forEach((cell, index) => {
      checkCell(rowIndex, cell, expectedRow[index]);
    });
  }

  function checkCell(rowIndex: number, cell: Element, expectedCellContent: string): void {
    const actualTextContent = cell.textContent!.trim();
    if (actualTextContent !== expectedCellContent) {
      missedExpectations.push(
        `Expected cell's content in row at index ${rowIndex} to be ${expectedCellContent} but was ${actualTextContent}`);
    }
  }

  function checkIndentation(row: Element, expectedLevel: number): void {

    const actualIndentation = getIndentation(row);
    const expectedIndentation = `${expectedLevel * 16}px`;
    if (actualIndentation !== expectedIndentation) {
      missedExpectations.push(
        `Expected node level to be ${expectedIndentation} due to expected level ${expectedLevel} but was ${actualIndentation}`);
    }
  }

  getRows(treeTableElement).forEach((row, index) => {
    const expected = expectedTreeTable[index];

    checkIndentation(row, expected.level);
    checkRow(row, index, expected.cells);
  });

  if (missedExpectations.length) {
    fail(missedExpectations.join('\n'));
  }
}

@Component({
  template: `
    <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
      <ng-container dtColumnDef="topping">
        <dt-tree-table-header-cell *dtHeaderCellDef>Topping</dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          {{row.pizzaTopping}}
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="cheese">
        <dt-tree-table-header-cell *dtHeaderCellDef>Cheese</dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row" dtIndicator="true" dtIndicatorColor="error" >
        {{row.pizzaCheese}}
        </dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['topping', 'cheese']"></dt-header-row>
      <dt-tree-table-row *dtRowDef="let row; columns: ['topping', 'cheese'];" [data]="row" class="customRowClass">
      </dt-tree-table-row>
    </dt-tree-table>
  `,
})
class SimpleDtTreeTableApp {
  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;
  getChildren = (node: TestData) => node.observableChildren;
  transformer = (node: TestData, level: number) => {
    node.level = level;
    return node;
  }

  treeFlattener = new DtTreeFlattener<TestData, TestData>(
    this.transformer, this.getLevel, this.isExpandable, this.getChildren);

  treeControl = new DtTreeControl(this.getLevel, this.isExpandable);

  dataSource = new DtTreeDataSource(this.treeControl, this.treeFlattener);

  underlyingDataSource = new FakeDataSource();

  @ViewChild(DtTreeTable, { static: true }) tree: DtTreeTable<TestData>;

  constructor() {
    this.underlyingDataSource.connect().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
}

interface FoodNode {
  name: string;
  children?: FoodNode[] | null;
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops', children: null},
    ],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussel sprouts'},
        ],
      },
      {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ],
      },
    ],
  },
];

@Component({
  template: `
    <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
      <ng-container dtColumnDef="name">
        <dt-tree-table-header-cell *dtHeaderCellDef>Name</dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          {{row.name}}
        </dt-tree-table-toggle-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['name']"></dt-header-row>
      <dt-tree-table-row *dtRowDef="let row; columns: ['name'];" [data]="row" class="customRowClass"></dt-tree-table-row>
    </dt-tree-table>
  `,
})
class DtTreeTableWithNullOrUndefinedChild {
  private transformer = (node: FoodNode, level: number) => ({
    expandable: !!node.children,
    name: node.name,
    level,
  })

  treeControl = new DtTreeControl<ExampleFlatNode>(
    (node) => node.level, (node) => node.expandable);

  treeFlattener = new DtTreeFlattener(
     this.transformer, (node) => node.level, (node) => node.expandable, (node) => node.children);

  dataSource = new DtTreeDataSource(this.treeControl, this.treeFlattener, TREE_DATA);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

@Component({
  template: `
  <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
    <ng-container dtColumnDef="topping">
      <dt-tree-table-header-cell *dtHeaderCellDef>Topping</dt-tree-table-header-cell>
      <dt-tree-table-toggle-cell *dtCellDef="let row">
        {{row.pizzaTopping}}
      </dt-tree-table-toggle-cell>
    </ng-container>

    <ng-container dtColumnDef="cheese">
      <dt-tree-table-header-cell *dtHeaderCellDef>Cheese</dt-tree-table-header-cell>
      <dt-cell *dtCellDef="let row">
      {{row.pizzaCheese}}
      </dt-cell>
    </ng-container>

    <ng-container dtColumnDef="base">
      <dt-tree-table-header-cell *dtHeaderCellDef>Base</dt-tree-table-header-cell>
      <dt-cell *dtCellDef="let row">
      {{row.pizzaBase}}
      </dt-cell>
    </ng-container>

    <dt-header-row *dtHeaderRowDef="['topping', 'cheese']"></dt-header-row>
    <dt-tree-table-row *dtRowDef="let row; columns: ['topping', 'cheese'];" [data]="row" class="customRowClass"></dt-tree-table-row>
    <dt-tree-table-row *dtRowDef="let row; when: isSpecial; columns: ['topping', 'base'];" [data]="row" class="customRowClass">
    </dt-tree-table-row>
  </dt-tree-table>
  `,
})
class WhenRowDtTreeTableApp {
  isSpecial = (_: number, node: TestData) => node.isSpecial;

  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;
  getChildren = (node: TestData) => node.observableChildren;
  transformer = (node: TestData, level: number) => {
    node.level = level;
    return node;
  }

  treeFlattener = new DtTreeFlattener<TestData, TestData>(
    this.transformer, this.getLevel, this.isExpandable, this.getChildren);

  treeControl = new DtTreeControl(this.getLevel, this.isExpandable);

  dataSource = new DtTreeDataSource(this.treeControl, this.treeFlattener);

  underlyingDataSource = new FakeDataSource();

  @ViewChild(DtTreeTable, { static: true }) tree: DtTreeTable<TestData>;

  constructor() {
    this.underlyingDataSource.connect().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
}
