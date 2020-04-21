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

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Component,
  AfterViewInit,
  ViewChild,
  DebugElement,
} from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import {
  DtTableModule,
  DtTableOrderDataSource,
  DtOrder,
  DtOrderCell,
} from '@dynatrace/barista-components/table';
import {
  createComponent,
  typeInElement,
  dispatchKeyboardEvent,
  dispatchFakeEvent,
} from '@dynatrace/testing/browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { DtOrderChangeEvent } from '../order/order-directive';

const ORDER_INPUT_INVALID_CLASS = 'dt-simple-order-input-invalid';

describe('DtTable SimpleColumns', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DtTableModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtLoadingDistractorModule,
        NoopAnimationsModule,
        DtFormattersModule,
        HttpClientTestingModule,
        DragDropModule,
        ReactiveFormsModule,
      ],
      declarations: [TestSimpleOrderColumnApp],
    });

    TestBed.compileComponents();
  }));

  describe('rendering', () => {
    let fixture: ComponentFixture<TestSimpleOrderColumnApp>;
    beforeEach(() => {
      fixture = createComponent(TestSimpleOrderColumnApp);
    });

    it('should infer the header label from the passed name', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers[0].nativeElement.textContent).toBe('order');
    });

    it('should use the label as header label when passed', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers[1].nativeElement.textContent).toBe('Name');
    });

    it('should register all headerCells correctly', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers.length).toBe(2);
    });

    it('should display the correct simple-order values', () => {
      const orderInputs = fixture.debugElement.queryAll(
        By.css('.dt-simple-order-column-input'),
      );
      expect(orderInputs[0].nativeElement.value).toBe('0');
      expect(orderInputs[0].nativeElement.placeholder).toBe('0');
      expect(orderInputs[1].nativeElement.value).toBe('1');
      expect(orderInputs[1].nativeElement.placeholder).toBe('1');
      expect(orderInputs[2].nativeElement.value).toBe('2');
      expect(orderInputs[2].nativeElement.placeholder).toBe('2');
      expect(orderInputs[3].nativeElement.value).toBe('3');
      expect(orderInputs[3].nativeElement.placeholder).toBe('3');
      expect(orderInputs[4].nativeElement.value).toBe('4');
      expect(orderInputs[4].nativeElement.placeholder).toBe('4');
    });
  });

  /**
   * Adding and removing elements.
   */
  describe('dynamic data', () => {
    let fixture: ComponentFixture<TestSimpleOrderColumnApp>;
    beforeEach(() => {
      fixture = createComponent(TestSimpleOrderColumnApp);
    });

    it('should add a new row at the bottom', () => {
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.dataSource.data,
        { name: 'VI' },
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(6);

      const newlyAddedRow = rows[rows.length - 1];
      const newlyAddedOrderCell = newlyAddedRow.query(By.css('.dt-order-cell'));
      expect(
        newlyAddedOrderCell.nativeElement.children[0].classList.contains(
          'dt-simple-order-cell-data',
        ),
      ).toBeTruthy();

      const newlyAddedOrderInput = newlyAddedRow.query(
        By.css('.dt-simple-order-column-input'),
      );
      expect(newlyAddedOrderInput.nativeElement.value).toBe('5');
      expect(newlyAddedOrderInput.nativeElement.placeholder).toBe('5');
    });

    it('should remove rows', () => {
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.dataSource.data.slice(0, 4),
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(4);
    });
  });

  /**
   * Validate input
   */
  describe('input validation', () => {
    let fixture: ComponentFixture<TestSimpleOrderColumnApp>;
    let orderCells: DebugElement[];

    beforeEach(() => {
      fixture = createComponent(TestSimpleOrderColumnApp);
      orderCells = getOrderCells(fixture);
    });

    it('should be valid initially', () => {
      for (const cell of orderCells) {
        expect(cell.componentInstance._orderFormControl.valid).toBeTruthy();
      }
    });

    it('should append error class if input is empty', () => {
      let orderInputs = getOrderInputs(fixture);

      typeInElement('', orderInputs[0].nativeElement);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      expect(
        orderCells[0].componentInstance._orderFormControl.invalid,
      ).toBeTruthy();
      expect(
        orderInputs[0].nativeElement.classList.contains(
          ORDER_INPUT_INVALID_CLASS,
        ),
      ).toBeTruthy();
    });

    it('should append error class if input is not a number', () => {
      let orderInputs = getOrderInputs(fixture);

      typeInElement('x', orderInputs[0].nativeElement);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      expect(
        orderCells[0].componentInstance._orderFormControl.invalid,
      ).toBeTruthy();
      expect(
        orderInputs[0].nativeElement.classList.contains(
          ORDER_INPUT_INVALID_CLASS,
        ),
      ).toBeTruthy();
    });

    it('should append and remove input invalid class ', () => {
      let orderInputs = getOrderInputs(fixture);

      typeInElement('x', orderInputs[0].nativeElement);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      expect(
        orderCells[0].componentInstance._orderFormControl.invalid,
      ).toBeTruthy();
      expect(
        orderInputs[0].nativeElement.classList.contains(
          ORDER_INPUT_INVALID_CLASS,
        ),
      ).toBeTruthy();

      typeInElement('3', orderInputs[0].nativeElement);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      expect(
        orderCells[0].componentInstance._orderFormControl.invalid,
      ).toBeFalsy();
      expect(
        orderCells[0].componentInstance._orderFormControl.valid,
      ).toBeTruthy();
      expect(
        orderInputs[0].nativeElement.classList.contains(
          ORDER_INPUT_INVALID_CLASS,
        ),
      ).toBeFalsy();
    });
  });

  /**
   * Change table order
   */
  describe('order change', () => {
    let fixture: ComponentFixture<TestSimpleOrderColumnApp>;
    beforeEach(() => {
      fixture = createComponent(TestSimpleOrderColumnApp);
      fixture.detectChanges();
    });

    it('should change order on enter', () => {
      let orderInputs = getOrderInputs(fixture);
      let cells = getNameColumnCells(fixture);

      typeInElement('1', orderInputs[2].nativeElement);
      dispatchKeyboardEvent(orderInputs[2].nativeElement, 'keyup', ENTER);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      cells = getNameColumnCells(fixture);

      expect(orderInputs[1].nativeElement.value).toBe('1');
      expect(cells[1].nativeElement.textContent).toBe('III');
      expect(orderInputs[2].nativeElement.value).toBe('2');
      expect(cells[2].nativeElement.textContent).toBe('II');
    });

    it('should change order on blur', () => {
      let orderInputs = getOrderInputs(fixture);
      let cells = getNameColumnCells(fixture);

      typeInElement('1', orderInputs[2].nativeElement);
      dispatchFakeEvent(orderInputs[2].nativeElement, 'blur');
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      cells = getNameColumnCells(fixture);

      expect(orderInputs[1].nativeElement.value).toBe('1');
      expect(cells[1].nativeElement.textContent).toBe('III');
      expect(orderInputs[2].nativeElement.value).toBe('2');
      expect(cells[2].nativeElement.textContent).toBe('II');
    });

    it('should not change order if the input is invalid', () => {
      let orderInputs = getOrderInputs(fixture);
      let cells = getNameColumnCells(fixture);

      typeInElement('x', orderInputs[2].nativeElement);
      dispatchKeyboardEvent(orderInputs[2].nativeElement, 'keyup', ENTER);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      cells = getNameColumnCells(fixture);

      expect(orderInputs[1].nativeElement.value).toBe('1');
      expect(cells[1].nativeElement.textContent).toBe('II');
      expect(orderInputs[2].nativeElement.value).toBe('x');
      expect(cells[2].nativeElement.textContent).toBe('III');
    });

    it('should move row to last position', () => {
      let orderInputs = getOrderInputs(fixture);
      let cells = getNameColumnCells(fixture);

      typeInElement('999', orderInputs[0].nativeElement);
      dispatchKeyboardEvent(orderInputs[0].nativeElement, 'keyup', ENTER);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      cells = getNameColumnCells(fixture);

      expect(orderInputs[0].nativeElement.value).toBe('0');
      expect(cells[0].nativeElement.textContent).toBe('II');
      expect(fixture.componentInstance.changeEvent.previousIndex).toBe(0);
      expect(fixture.componentInstance.changeEvent.currentIndex).toBe(4);
      expect(orderInputs[orderInputs.length - 1].nativeElement.value).toBe('4');
      expect(cells[cells.length - 1].nativeElement.textContent).toBe('I');
    });

    it('should move row to first position', () => {
      let orderInputs = getOrderInputs(fixture);
      let cells = getNameColumnCells(fixture);

      typeInElement('0', orderInputs[4].nativeElement);
      dispatchKeyboardEvent(orderInputs[4].nativeElement, 'keyup', ENTER);
      fixture.detectChanges();

      orderInputs = getOrderInputs(fixture);
      cells = getNameColumnCells(fixture);

      expect(orderInputs[0].nativeElement.value).toBe('0');
      expect(cells[0].nativeElement.textContent).toBe('V');
      expect(orderInputs[1].nativeElement.value).toBe('1');
      expect(cells[1].nativeElement.textContent).toBe('I');
    });
  });
});

function getOrderInputs(
  fixture: ComponentFixture<TestSimpleOrderColumnApp>,
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('.dt-simple-order-column-input'));
}

function getOrderCells(
  fixture: ComponentFixture<TestSimpleOrderColumnApp>,
): DebugElement[] {
  return fixture.debugElement.queryAll(By.directive(DtOrderCell));
}

function getNameColumnCells(
  fixture: ComponentFixture<TestSimpleOrderColumnApp>,
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('.dt-cell.dt-table-column-name'));
}

@Component({
  selector: 'dt-test-table-simple-order-column',
  // tslint:disable
  template: `
    <dt-table
      [dataSource]="dataSource"
      dtOrder
      (dtOrderChange)="orderChange($event)"
      cdkDropList
      [cdkDropListData]="dataSource"
    >
      <dt-simple-order-column
        name="order"
        dtColumnProportion="0.1"
      ></dt-simple-order-column>
      <dt-simple-text-column
        name="name"
        label="Name"
        sortable="false"
      ></dt-simple-text-column>
      <dt-header-row *dtHeaderRowDef="['order', 'name']"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: ['order', 'name']"></dt-row>
    </dt-table>
  `,
  // tslint:enable
})
class TestSimpleOrderColumnApp implements AfterViewInit {
  dataSource: DtTableOrderDataSource<any> = new DtTableOrderDataSource([
    { name: 'I' },
    { name: 'II' },
    { name: 'III' },
    { name: 'IV' },
    { name: 'V' },
  ]);

  changeEvent: DtOrderChangeEvent;

  @ViewChild(DtOrder) _dtOrder: DtOrder<any>;

  ngAfterViewInit(): void {
    this.dataSource.order = this._dtOrder;
  }

  orderChange($event: DtOrderChangeEvent): void {
    this.changeEvent = $event;
  }
}
