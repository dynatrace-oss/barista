/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, Predicate } from '@angular/core';
import { DtTableModule } from '../table-module';
import { CommonModule } from '@angular/common';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DtCheckbox } from '@dynatrace/barista-components/checkbox';
import { DtTableSelection, DT_TABLE_SELECTION_CONFIG } from './selection';
import { createComponent } from '@dynatrace/testing/browser';

describe('DtTableSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DtTableModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtLoadingDistractorModule,
        NoopAnimationsModule,
        DtFormattersModule,
        HttpClientTestingModule,
      ],
      // The providers are necessary here - because otherwise the TestBed does not allow
      // overriding the providers in a different setup below
      // The token needs to be already available initially
      providers: [
        {
          provide: DT_TABLE_SELECTION_CONFIG,
          useValue: {},
        },
      ],
      declarations: [
        DtTableSelectionComponentForTesting,
        DtTableSelectionComponentEmptyForTesting,
      ],
    });
  });

  describe('with empty table', () => {
    let fixture: ComponentFixture<DtTableSelectionComponentEmptyForTesting>;

    beforeEach(() => {
      TestBed.compileComponents();
      fixture = createComponent(DtTableSelectionComponentEmptyForTesting);
    });

    it('should disable the global checkbox when table is empty', () => {
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('dt-header-row dt-checkbox'),
      );
      expect(headerCheckbox.length).toBe(1);
      expect(headerCheckbox[0].componentInstance.disabled).toBe(true);
    });

    it('should not check the global checkbox when the table is empty', () => {
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('dt-header-row dt-checkbox'),
      );
      expect(headerCheckbox.length).toBe(1);
      expect(headerCheckbox[0].componentInstance.checked).toBe(false);
    });
  });

  describe('without limit', () => {
    let component: DtTableSelectionComponentForTesting;
    let fixture: ComponentFixture<DtTableSelectionComponentForTesting>;

    beforeEach(() => {
      TestBed.compileComponents();
      fixture = createComponent(DtTableSelectionComponentForTesting);
      component = fixture.componentInstance;
    });

    it('should render checkboxes for the header and every row', () => {
      const rowCheckboxes = fixture.debugElement.queryAll(
        By.css('dt-row dt-checkbox'),
      );
      const headerCheckbox = fixture.debugElement.queryAll(
        By.css('dt-header-row dt-checkbox'),
      );
      expect(rowCheckboxes.length).toBe(4);
      expect(headerCheckbox.length).toBe(1);
    });

    it('should render checkboxes in the correct state', () => {
      fixture.detectChanges();
      const rowCheckboxes = fixture.debugElement.queryAll(
        By.css('dt-row dt-checkbox'),
      );

      const defaultRow: DtCheckbox<any> = rowCheckboxes[0].componentInstance;
      expect(defaultRow.checked).toBe(false);
      expect(defaultRow.disabled).toBe(false);

      const disabledRow: DtCheckbox<any> = rowCheckboxes[2].componentInstance;
      expect(disabledRow.checked).toBe(false);
      expect(disabledRow.disabled).toBe(true);

      const checkedRow: DtCheckbox<any> = rowCheckboxes[3].componentInstance;
      expect(checkedRow.checked).toBe(true);
      expect(checkedRow.disabled).toBe(false);
    });

    it('should toggle the checkbox by interaction', () => {
      const checkbox = fixture.debugElement.query(By.css('dt-row dt-checkbox'));

      const defaultRow: DtCheckbox<any> = checkbox.componentInstance;
      expect(defaultRow.checked).toBe(false);
      expect(defaultRow.disabled).toBe(false);

      defaultRow._onInputClick(new Event('click'));
      fixture.detectChanges();

      const updatedCheckbox = fixture.debugElement.query(
        By.css('dt-row dt-checkbox'),
      );
      const updatedRow: DtCheckbox<any> = updatedCheckbox.componentInstance;
      expect(updatedRow.checked).toBe(true);
      expect(updatedRow.disabled).toBe(false);

      updatedRow._onInputClick(new Event('click'));
      fixture.detectChanges();

      const deselectedRow: DtCheckbox<any> = fixture.debugElement.query(
        By.css('dt-row dt-checkbox'),
      ).componentInstance;
      expect(deselectedRow.checked).toBe(false);
      expect(deselectedRow.disabled).toBe(false);
    });

    it('should toggle all rows when master toggle is clicked', () => {
      const headerCheckbox: DtCheckbox<any> = fixture.debugElement.query(
        By.css('dt-header-row dt-checkbox'),
      ).componentInstance;

      expect(headerCheckbox.checked).toBe(false);
      expect(headerCheckbox.indeterminate).toBe(true);
      expect(headerCheckbox.disabled).toBe(false);

      headerCheckbox._onInputClick(new Event('click'));
      fixture.detectChanges();

      expect(headerCheckbox.checked).toBe(true);
      expect(headerCheckbox.indeterminate).toBe(false);
      expect(headerCheckbox.disabled).toBe(false);
      let rows = fixture.debugElement.queryAll(By.css('dt-row dt-checkbox'));
      rows.forEach((row) => {
        const checkbox: DtCheckbox<any> = row.componentInstance;
        expect(checkbox.checked).toBe(
          !component.disabledPredicate(checkbox.value),
        );
      });

      headerCheckbox._onInputClick(new Event('click'));
      fixture.detectChanges();
      expect(headerCheckbox.checked).toBe(false);
      expect(headerCheckbox.indeterminate).toBe(false);
      expect(headerCheckbox.disabled).toBe(false);
      rows = fixture.debugElement.queryAll(By.css('dt-row dt-checkbox'));
      rows.forEach((row) => {
        const checkbox: DtCheckbox<any> = row.componentInstance;
        expect(checkbox.checked).toBe(false);
      });
    });

    it('should show the header checkbox in the correct state when selecting programmatically', () => {
      const headerCheckbox: DtCheckbox<any> = fixture.debugElement.query(
        By.css('dt-header-row dt-checkbox'),
      ).componentInstance;

      expect(headerCheckbox.checked).toBe(false);
      expect(headerCheckbox.indeterminate).toBe(true);
      expect(headerCheckbox.disabled).toBe(false);

      component.tableSelection.deselect(component.dataSource[3]);
      fixture.detectChanges();

      expect(headerCheckbox.checked).toBe(false);
      expect(headerCheckbox.indeterminate).toBe(false);
      expect(headerCheckbox.disabled).toBe(false);

      component.tableSelection.select(...component.dataSource);
      fixture.detectChanges();

      expect(headerCheckbox.checked).toBe(true);
      expect(headerCheckbox.indeterminate).toBe(false);
      expect(headerCheckbox.disabled).toBe(false);

      component.tableSelection.deselect(component.dataSource[1]);
      fixture.detectChanges();

      expect(headerCheckbox.checked).toBe(false);
      expect(headerCheckbox.indeterminate).toBe(true);
      expect(headerCheckbox.disabled).toBe(false);
    });

    it('should have the correct states for selected', () => {
      const host4 = component.dataSource[3];
      expect(component.tableSelection.selected).toEqual([host4]);

      expect(component.tableSelection.isSelected(host4)).toBeTruthy();
      const host1 = component.dataSource[0];
      component.tableSelection.select(host1);

      fixture.detectChanges();

      expect(component.tableSelection.selected).toEqual([host4, host1]);

      expect(component.tableSelection.isSelected(host1)).toBeTruthy();
    });
  });

  describe('with selectionLimit', () => {
    let component: DtTableSelectionComponentForTesting;
    let fixture: ComponentFixture<DtTableSelectionComponentForTesting>;

    beforeEach(() => {
      TestBed.overrideProvider(DT_TABLE_SELECTION_CONFIG, {
        useValue: { selectionLimit: 2 },
      });
      TestBed.compileComponents();
      fixture = createComponent(DtTableSelectionComponentForTesting);
      component = fixture.componentInstance;
    });

    it('should disable the remaining checkboxes once the limit is reached', () => {
      component.tableSelection.select(component.dataSource[0]);
      fixture.detectChanges();
      const rowCheckboxes = fixture.debugElement.queryAll(
        By.css('dt-row dt-checkbox'),
      );
      const first = rowCheckboxes[0].componentInstance;
      expect(first.checked).toBeTruthy();
      expect(first.disabled).toBeFalsy();

      const second = rowCheckboxes[1].componentInstance;
      expect(second.checked).toBeFalsy();
      expect(second.disabled).toBeTruthy();

      const third = rowCheckboxes[2].componentInstance;
      expect(third.checked).toBeFalsy();
      expect(third.disabled).toBeTruthy();

      const fourth = rowCheckboxes[3].componentInstance;
      expect(fourth.checked).toBeTruthy();
      expect(fourth.disabled).toBeFalsy();
    });

    it('should enable once the limit is no longer exhausted', () => {
      component.tableSelection.select(component.dataSource[0]);
      fixture.detectChanges();

      component.tableSelection.deselect(component.dataSource[0]);
      fixture.detectChanges();
      const rowCheckboxes = fixture.debugElement.queryAll(
        By.css('dt-row dt-checkbox'),
      );
      const first = rowCheckboxes[0].componentInstance;
      expect(first.checked).toBeFalsy();
      expect(first.disabled).toBeFalsy();

      const second = rowCheckboxes[1].componentInstance;
      expect(second.checked).toBeFalsy();
      expect(second.disabled).toBeFalsy();

      const third = rowCheckboxes[2].componentInstance;
      expect(third.checked).toBeFalsy();
      expect(third.disabled).toBeTruthy();

      const fourth = rowCheckboxes[3].componentInstance;
      expect(fourth.checked).toBeTruthy();
      expect(fourth.disabled).toBeFalsy();
    });

    it('should select all rows even if there is a limit set when programmatically selecting all', () => {
      component.tableSelection.select(...component.dataSource);
      fixture.detectChanges();
      const rowCheckboxes = fixture.debugElement.queryAll(
        By.css('dt-row dt-checkbox'),
      );
      expect(component.tableSelection.selectionLimitReached).toBeTruthy();
      expect(rowCheckboxes.length).toBe(4);
      rowCheckboxes.forEach((checkbox) => {
        expect(checkbox.componentInstance.checked).toBeTruthy();
      });
    });
  });
});

interface Row {
  host: string;
}

@Component({
  selector: 'dt-test-table-selectable-column-empty',
  template: `<dt-table
    [dataSource]="dataSource"
    dtTableSelection
    [dtTableSelectionInitial]="dataSource.slice(3)"
    dtSort
  >
    <ng-container dtColumnDef="select">
      <dt-table-header-selector *dtHeaderCellDef></dt-table-header-selector>
      <dt-table-row-selector
        *dtCellDef="let row"
        [row]="row"
      ></dt-table-row-selector>
    </ng-container>
    <dt-simple-text-column name="host"></dt-simple-text-column>
    <dt-header-row *dtHeaderRowDef="['select', 'host']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['select', 'host']"></dt-row>
  </dt-table>`,
})
class DtTableSelectionComponentEmptyForTesting {
  @ViewChild(DtTableSelection, { static: true })
  tableSelection: DtTableSelection<Row>;

  dataSource: Row[] = [];

  disabledPredicate: Predicate<Row> = (value) => {
    return value.host === 'host3';
  };
}

@Component({
  selector: 'dt-test-table-selectable-column',
  template: `<dt-table
    [dataSource]="dataSource"
    dtTableSelection
    [dtTableSelectionInitial]="dataSource.slice(3)"
    [dtTableIsRowDisabled]="disabledPredicate"
    dtSort
  >
    <ng-container dtColumnDef="select">
      <dt-table-header-selector *dtHeaderCellDef></dt-table-header-selector>
      <dt-table-row-selector
        *dtCellDef="let row"
        [row]="row"
      ></dt-table-row-selector>
    </ng-container>
    <dt-simple-text-column name="host"></dt-simple-text-column>
    <dt-header-row *dtHeaderRowDef="['select', 'host']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['select', 'host']"></dt-row>
  </dt-table>`,
})
class DtTableSelectionComponentForTesting {
  @ViewChild(DtTableSelection, { static: true })
  tableSelection: DtTableSelection<Row>;

  dataSource: Row[] = [
    {
      host: 'host1',
    },
    {
      host: 'host2',
    },
    {
      host: 'host3',
    },
    {
      host: 'host4',
    },
  ];

  disabledPredicate: Predicate<Row> = (value) => {
    return value.host === 'host3';
  };
}
