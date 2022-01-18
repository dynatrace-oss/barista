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

import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Type, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  DtTreeControl,
  DtTreeDataSource,
  DtTreeFlattener,
} from '@dynatrace/barista-components/core';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTreeTableModule } from './tree-table-module';

import { createComponent } from '@dynatrace/testing/browser';
import { DtTreeTable } from './tree-table';

describe('DtTreeTable', () => {
  let treeTableElement: HTMLElement;
  let underlyingDataSource: FakeDataSource;
  function configureDtTreeTableTestingModule(
    declarations: Array<Type<any>>,
  ): void {
    TestBed.configureTestingModule({
      imports: [
        DtTreeTableModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        DtIndicatorModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations,
    }).compileComponents();
  }

  describe('initialization', () => {
    let fixture: ComponentFixture<SimpleDtTreeTableApp>;
    let component: SimpleDtTreeTableApp;

    beforeEach(
      waitForAsync(() => {
        configureDtTreeTableTestingModule([SimpleDtTreeTableApp]);
        fixture = createComponent(SimpleDtTreeTableApp);

        component = fixture.componentInstance;
        underlyingDataSource = component.underlyingDataSource;
        treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');

        fixture.detectChanges();
      }),
    );

    it('with rendered rows', () => {
      const rows = getRows(treeTableElement);

      expect(rows).toBeDefined();
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

      expect(component.treeControl.expansionModel.selected.length).toBe(0);

      fixture.detectChanges();

      expectTreeTableToMatch(treeTableElement, [
        { cells: ['topping_1', 'cheese_1'], level: 0 },
        { cells: ['topping_2', 'cheese_2'], level: 0 },
        { cells: ['topping_3', 'cheese_3'], level: 0 },
      ]);
      fixture.detectChanges();

      (getToggles(treeTableElement)[2] as HTMLElement).click();
      fixture.detectChanges();

      expect(component.treeControl.expansionModel.selected.length).toBe(1);
      expectTreeTableToMatch(treeTableElement, [
        { cells: ['topping_1', 'cheese_1'], level: 0 },
        { cells: ['topping_2', 'cheese_2'], level: 0 },
        { cells: ['topping_3', 'cheese_3'], level: 0 },
        { cells: ['topping_4', 'cheese_4'], level: 1 },
      ]);

      (getToggles(treeTableElement)[3] as HTMLElement).click();
      fixture.detectChanges();

      expect(component.treeControl.expansionModel.selected.length).toBe(2);
      expectTreeTableToMatch(treeTableElement, [
        { cells: ['topping_1', 'cheese_1'], level: 0 },
        { cells: ['topping_2', 'cheese_2'], level: 0 },
        { cells: ['topping_3', 'cheese_3'], level: 0 },
        { cells: ['topping_4', 'cheese_4'], level: 1 },
        { cells: ['topping_5', 'cheese_5'], level: 2 },
      ]);

      (getToggles(treeTableElement)[2] as HTMLElement).click();
      fixture.detectChanges();

      expectTreeTableToMatch(treeTableElement, [
        { cells: ['topping_1', 'cheese_1'], level: 0 },
        { cells: ['topping_2', 'cheese_2'], level: 0 },
        { cells: ['topping_3', 'cheese_3'], level: 0 },
      ]);
    });

    it('should fire the expandChange event when toggled by user click', () => {
      expect(component.expandCounter).toBe(0);
      expect(component.collapseCounter).toBe(0);
      expect(component.toggleCounter).toBe(0);

      //click the third toggle to open the node
      (getToggles(treeTableElement)[2] as HTMLElement).click();
      fixture.detectChanges();
      expect(
        component.treeControl.isExpanded(component.dataSource.data[2]),
      ).toBeTruthy();

      expect(component.expandCounter).toBe(1);
      expect(component.collapseCounter).toBe(0);
      expect(component.toggleCounter).toBe(1);

      //click the third toggle to open the node
      (getToggles(treeTableElement)[2] as HTMLElement).click();
      fixture.detectChanges();
      expect(
        component.treeControl.isExpanded(component.dataSource.data[2]),
      ).toBeFalsy();

      expect(component.expandCounter).toBe(1);
      expect(component.collapseCounter).toBe(1);
      expect(component.toggleCounter).toBe(2);

      component.dataSource.data[2].expanded = true;
      fixture.detectChanges(false);
      expect(
        component.treeControl.isExpanded(component.dataSource.data[2]),
      ).toBeTruthy();
      expect(component.expandCounter).toBe(2);
      expect(component.collapseCounter).toBe(1);
      expect(component.toggleCounter).toBe(3);

      component.dataSource.data[2].expanded = false;
      fixture.detectChanges(false);
      expect(
        component.treeControl.isExpanded(component.dataSource.data[2]),
      ).toBeFalsy();
      expect(component.expandCounter).toBe(2);
      expect(component.collapseCounter).toBe(2);
      expect(component.toggleCounter).toBe(4);
    });

    it('should fire the expandChange event when toggled programaticaly', () => {
      expect(component.expandCounter).toBe(0);
      expect(component.collapseCounter).toBe(0);
      expect(component.toggleCounter).toBe(0);

      component.treeControl.expandAll();
      fixture.detectChanges(false);
      expect(
        component.treeControl.isExpanded(component.dataSource.data[2]),
      ).toBeTruthy();
      expect(component.expandCounter).toBe(1);
      expect(component.collapseCounter).toBe(1);
      expect(component.toggleCounter).toBe(2);

      component.treeControl.collapseAll();
      fixture.detectChanges(false);
      expect(
        component.treeControl.isExpanded(component.dataSource.data[2]),
      ).toBeFalsy();
      expect(component.expandCounter).toBe(1);
      expect(component.collapseCounter).toBe(2);
      expect(component.toggleCounter).toBe(3);
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
      fixture = createComponent(WhenRowDtTreeTableApp);

      component = fixture.componentInstance;
      underlyingDataSource = component.underlyingDataSource;
      treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');

      fixture.detectChanges();
    });

    it('with the right data', () => {
      expectTreeTableToMatch(treeTableElement, [
        { cells: ['topping_1', 'cheese_1'], level: 0 },
        { cells: ['topping_2', 'cheese_2'], level: 0 },
        { cells: ['topping_3', 'cheese_3'], level: 0 },
        { cells: ['topping_4', 'base_4'], level: 0 },
      ]);
    });
  });

  describe('with undefined or null children', () => {
    describe('should initialize', () => {
      let fixture: ComponentFixture<DtTreeTableWithNullOrUndefinedChild>;

      beforeEach(() => {
        configureDtTreeTableTestingModule([
          DtTreeTableWithNullOrUndefinedChild,
        ]);
        fixture = createComponent(DtTreeTableWithNullOrUndefinedChild);
        treeTableElement = fixture.nativeElement.querySelector('dt-tree-table');

        fixture.detectChanges();
      });

      it('with rendered rows', () => {
        const rows = getRows(treeTableElement);

        expect(rows).toBeDefined();
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
  expanded: boolean;
  children: TestData[];
  observableChildren: BehaviorSubject<TestData[]>;
  isSpecial: boolean;

  constructor(
    pizzaTopping: string,
    pizzaCheese: string,
    pizzaBase: string,
    children: TestData[] = [],
    isSpecial = false,
    expanded = false,
  ) {
    this.pizzaTopping = pizzaTopping;
    this.pizzaCheese = pizzaCheese;
    this.pizzaBase = pizzaBase;
    this.isSpecial = isSpecial;
    this.expanded = expanded;
    this.children = children;
    this.observableChildren = new BehaviorSubject<TestData[]>(this.children);
  }
}

class FakeDataSource implements DataSource<TestData> {
  dataIndex = 0;
  _dataChange = new BehaviorSubject<TestData[]>([]);
  get data(): TestData[] {
    return this._dataChange.getValue();
  }
  set data(data: TestData[]) {
    this._dataChange.next(data);
  }

  connect(): Observable<TestData[]> {
    return this._dataChange;
  }

  constructor() {
    for (let i = 0; i < 3; i++) {
      this.addData();
    }
    const child = this.addChild(this.data[2]);
    this.addChild(child);
  }

  addChild(parent: TestData): TestData {
    const nextIndex = ++this.dataIndex;
    const child = new TestData(
      `topping_${nextIndex}`,
      `cheese_${nextIndex}`,
      `base_${nextIndex}`,
    );
    const index = this.data.indexOf(parent);
    parent.children.push(child);
    parent.observableChildren.next(parent.children);

    const copiedData = this.data.slice();
    if (index > -1) {
      copiedData.splice(index, 1, parent);
    }
    this.data = copiedData;
    return child;
  }

  addData(isSpecial = false): void {
    const nextIndex = ++this.dataIndex;
    const copiedData = this.data.slice();
    copiedData.push(
      new TestData(
        `topping_${nextIndex}`,
        `cheese_${nextIndex}`,
        `base_${nextIndex}`,
        [],
        isSpecial,
      ),
    );

    this.data = copiedData;
  }

  disconnect(_: CollectionViewer): void {}
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
  return (
    (row.querySelector('.dt-tree-table-toggle-cell-wrap') as HTMLElement).style
      .paddingLeft || '0px'
  );
}

function expectTreeTableToMatch(
  treeTableElement: Element,
  expectedTreeTable: RowExpectation[],
): void {
  const missedExpectations: string[] = [];

  function checkRow(
    row: Element,
    rowIndex: number,
    expectedRow: string[],
  ): void {
    const cells = getCells(row);
    cells.forEach((cell, index) => {
      checkCell(rowIndex, cell, expectedRow[index]);
    });
  }

  function checkCell(
    rowIndex: number,
    cell: Element,
    expectedCellContent: string,
  ): void {
    const actualTextContent = cell.textContent!.trim();
    if (actualTextContent !== expectedCellContent) {
      missedExpectations.push(
        `Expected cell's content in row at index ${rowIndex} to be ${expectedCellContent} but was ${actualTextContent}`,
      );
    }
  }

  function checkIndentation(row: Element, expectedLevel: number): void {
    const actualIndentation = getIndentation(row);
    const expectedIndentation = `${expectedLevel * 16}px`;
    if (actualIndentation !== expectedIndentation) {
      missedExpectations.push(
        `Expected node level to be ${expectedIndentation} due to expected level ${expectedLevel} but was ${actualIndentation}`,
      );
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
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Topping
        </dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell
          *dtCellDef="let row"
          (expandChange)="expandStateChanged($event)"
          [(expanded)]="row.expanded"
          (expanded)="hasExpanded()"
          (collapsed)="hasCollapsed(row)"
        >
          {{ row.pizzaTopping }}
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="cheese">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Cheese
        </dt-tree-table-header-cell>
        <dt-cell
          *dtCellDef="let row"
          dtIndicator="true"
          dtIndicatorColor="error"
        >
          {{ row.pizzaCheese }}
        </dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['topping', 'cheese']"></dt-header-row>
      <dt-tree-table-row
        *dtRowDef="let row; columns: ['topping', 'cheese']"
        [data]="row"
        class="customRowClass"
      ></dt-tree-table-row>
    </dt-tree-table>
  `,
})
class SimpleDtTreeTableApp {
  toggleCounter = 0;
  expandCounter = 0;
  collapseCounter = 0;

  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;
  getChildren = (node: TestData) => node.observableChildren;
  transformer = (node: TestData, level: number) => {
    node.level = level;
    return node;
  };

  expandStateChanged(): void {
    this.toggleCounter++;
  }

  hasCollapsed(): void {
    this.collapseCounter++;
  }

  hasExpanded(): void {
    this.expandCounter++;
  }

  treeFlattener = new DtTreeFlattener<TestData, TestData>(
    this.transformer,
    this.getLevel,
    this.isExpandable,
    this.getChildren,
  );

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
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops', children: null },
    ],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  template: `
    <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
      <ng-container dtColumnDef="name">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Name
        </dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          {{ row.name }}
        </dt-tree-table-toggle-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['name']"></dt-header-row>
      <dt-tree-table-row
        *dtRowDef="let row; columns: ['name']"
        [data]="row"
        class="customRowClass"
      ></dt-tree-table-row>
    </dt-tree-table>
  `,
})
class DtTreeTableWithNullOrUndefinedChild {
  private transformer = (node: FoodNode, level: number) => ({
    expandable: !!node.children,
    name: node.name,
    level,
  });

  treeControl = new DtTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new DtTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new DtTreeDataSource(
    this.treeControl,
    this.treeFlattener,
    TREE_DATA,
  );

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

@Component({
  template: `
    <dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
      <ng-container dtColumnDef="topping">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Topping
        </dt-tree-table-header-cell>
        <dt-tree-table-toggle-cell *dtCellDef="let row">
          {{ row.pizzaTopping }}
        </dt-tree-table-toggle-cell>
      </ng-container>

      <ng-container dtColumnDef="cheese">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Cheese
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.pizzaCheese }}
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="base">
        <dt-tree-table-header-cell *dtHeaderCellDef>
          Base
        </dt-tree-table-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.pizzaBase }}
        </dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="['topping', 'cheese']"></dt-header-row>
      <dt-tree-table-row
        *dtRowDef="let row; columns: ['topping', 'cheese']"
        [data]="row"
        class="customRowClass"
      ></dt-tree-table-row>
      <dt-tree-table-row
        *dtRowDef="let row; when: isSpecial; columns: ['topping', 'base']"
        [data]="row"
        class="customRowClass"
      ></dt-tree-table-row>
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
  };

  treeFlattener = new DtTreeFlattener<TestData, TestData>(
    this.transformer,
    this.getLevel,
    this.isExpandable,
    this.getChildren,
  );

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
