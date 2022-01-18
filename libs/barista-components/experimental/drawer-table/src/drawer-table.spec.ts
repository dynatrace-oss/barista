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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DtDrawerContent, DtDrawerRowDef, DtDrawerTable } from './drawer-table';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTableModule } from '@dynatrace/barista-components/table';
import { HttpClientModule } from '@angular/common/http';

describe('DtDrawerTable', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TestComponent,
          DtDrawerTable,
          DtDrawerRowDef,
          DtDrawerContent,
        ],
        imports: [
          CommonModule,
          DtTableModule,
          DtDrawerModule,
          BrowserAnimationsModule,
          DtIconModule.forRoot({ svgIconLocation: '' }),
          HttpClientModule,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set 1st as default column when none is set', () => {
    expect(component.drawerTable.openColumns).toEqual([
      component.initialColumns[0],
    ]);
  });

  it('should open or close drawer', () => {
    // drawer should not be open initially
    expect(component.drawerTable.isOpen).toBe(false);

    // row click should open the drawer
    const row = fixture.debugElement.nativeElement.querySelector('dt-row');
    row.click();
    expect(component.drawerTable.isOpen).toBe(true);

    // clicking the same row should close the drawer
    row.click();
    expect(component.drawerTable.isOpen).toBe(false);
  });

  it('should show the selected row in drawer', () => {
    const lastRow = fixture.debugElement.nativeElement.querySelector(
      'dt-row:last-of-type',
    );
    lastRow.click();
    fixture.detectChanges();
    expect(component.drawerTable.isOpen).toBe(true);

    let drawerBody = fixture.debugElement.nativeElement
      .querySelector('.dt-drawer-body')
      .textContent.trim();
    expect(drawerBody).toEqual('col3 test 4');

    const firstRow = fixture.debugElement.nativeElement.querySelector('dt-row');
    firstRow.click();
    fixture.detectChanges();

    drawerBody = fixture.debugElement.nativeElement
      .querySelector('.dt-drawer-body')
      .textContent.trim();
    expect(drawerBody).toEqual('col3 test 1');
  });
});

/**
 * Test component that contains a DrawerTable.
 */
@Component({
  selector: 'dt-test-component',
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `
    <dt-drawer-table>
      <ng-template dtDrawerContent let-row>
        {{ row.col3 }}
      </ng-template>
      <dt-table [dataSource]="dataSource" dtSort #sortable>
        <dt-simple-number-column
          name="col1"
          label="Column1"
        ></dt-simple-number-column>
        <dt-simple-number-column
          name="col2"
          label="Column2"
        ></dt-simple-number-column>
        <dt-simple-number-column
          name="col3"
          label="Column3"
        ></dt-simple-number-column>
        <dt-header-row *dtHeaderRowDef="initialColumns"></dt-header-row>
        <dt-row
          [dtDrawerRowDef]="row"
          *dtRowDef="let row; columns: initialColumns"
        ></dt-row>
      </dt-table>
    </dt-drawer-table>
  `,
})
class TestComponent {
  @ViewChild(DtDrawerTable, { static: true }) drawerTable: DtDrawerTable<Row>;
  initialColumns = ['col1', 'col2', 'col3'];
  dataSource: Row[] = [
    { col1: 'col1 test 1', col2: 'col2 test 1', col3: 'col3 test 1' },
    { col1: 'col1 test 2', col2: 'col2 test 2', col3: 'col3 test 2' },
    { col1: 'col1 test 3', col2: 'col2 test 3', col3: 'col3 test 3' },
    { col1: 'col1 test 4', col2: 'col2 test 4', col3: 'col3 test 4' },
  ];
}

interface Row {
  col1: string;
  col2: string;
  col3: string;
}
