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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TestBed, waitForAsync, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtIndicatorThemePalette } from '@dynatrace/barista-components/indicator';
import {
  DtFormattersModule,
  formatBytes,
  formatPercent,
  formatRate,
} from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import {
  createComponent,
  dispatchMouseEvent,
} from '@dynatrace/testing/browser';
import { DtTableModule } from '../table-module';
import { DtTableDataSource } from '../table-data-source';
import { DtSort } from '../sort/sort';

describe('DtTable SimpleColumns', () => {
  beforeEach(
    waitForAsync(() => {
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
        declarations: [TestSimpleColumnsApp, TestSimpleColumnsErrorApp],
      });

      TestBed.compileComponents();
    }),
  );

  describe('rendering', () => {
    let fixture;
    beforeEach(() => {
      fixture = createComponent(TestSimpleColumnsApp);
    });

    it('should infer the header label from the passed name', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers[1].nativeElement.textContent).toBe('host');
    });

    it('should use the label as header label when passed', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers[2].nativeElement.textContent).toBe('Cpu');
    });

    it('should register all headerCell correctly', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers.length).toBe(6);
    });

    it('should display the correct favorite values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-favorite .dt-icon'),
      );
      expect(
        cells[0].nativeElement.classList.contains(
          'dt-favorite-column-empty-star',
        ),
      ).toBeTruthy();
      expect(
        cells[1].nativeElement.classList.contains(
          'dt-favorite-column-empty-star',
        ),
      ).toBeTruthy();
      expect(
        cells[2].nativeElement.classList.contains(
          'dt-favorite-column-filled-star',
        ),
      ).toBeTruthy();
      expect(
        cells[3].nativeElement.classList.contains(
          'dt-favorite-column-empty-star',
        ),
      ).toBeTruthy();
    });

    it('should display the correct simple-text values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );
      expect(cells[0].nativeElement.textContent).toBe(
        fixture.componentInstance.data[0].host.toString(),
      );
      expect(cells[1].nativeElement.textContent).toBe('');
      expect(cells[2].nativeElement.textContent).toBe(
        fixture.componentInstance.data[2].host.toString(),
      );
      expect(cells[3].nativeElement.textContent).toBe(
        fixture.componentInstance.data[3].host.toString(),
      );
    });

    it('should display the correct simple-number values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu'),
      );
      expect(cells[0].nativeElement.textContent).toBe(
        fixture.componentInstance.data[0].cpu.toString(),
      );
      expect(cells[1].nativeElement.textContent).toBe(
        fixture.componentInstance.data[1].cpu.toString(),
      );
      expect(cells[2].nativeElement.textContent).toBe('');
      expect(cells[3].nativeElement.textContent).toBe(
        fixture.componentInstance.data[3].cpu.toString(),
      );
    });

    it('should display the correct simple-percentage values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memoryPerc'),
      );
      expect(cells[0].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[0].memoryPerc} %`,
      );
      expect(cells[1].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[1].memoryPerc} %`,
      );
      expect(cells[2].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[2].memoryPerc} %`,
      );
      expect(cells[3].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[3].memoryPerc} %`,
      );
    });

    it('should display the correct values when accessing through a dataAccessor', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memoryConsumption'),
      );
      const transformFunction =
        fixture.componentInstance.combineMemory.bind(this);
      expect(cells[0].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[0]),
      );
      expect(cells[1].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[1]),
      );
      expect(cells[2].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[2]),
      );
      expect(cells[3].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[3]),
      );
    });
  });

  /**
   * Adding and removing elements.
   */
  describe('dynamic data', () => {
    let fixture;
    beforeEach(() => {
      fixture = createComponent(TestSimpleColumnsApp);
    });

    it('should add a new row at the bottom', () => {
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data,
        {
          favorite: false,
          host: 'et-demo-2-win3',
          cpu: 24,
          memoryPerc: 23,
          memoryTotal: 5820000000,
          traffic: 98700000,
        },
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(5);

      const newlyAddedRow = rows[rows.length - 1];
      const newlyAddedCells = newlyAddedRow.queryAll(By.css('.dt-cell'));
      expect(
        newlyAddedCells[0].nativeElement.children[0].classList.contains(
          'dt-icon-button',
        ),
      ).toBeTruthy();
      expect(newlyAddedCells[1].nativeElement.textContent).toBe(
        'et-demo-2-win3',
      );
      expect(newlyAddedCells[2].nativeElement.textContent).toBe('24');
      expect(newlyAddedCells[3].nativeElement.textContent).toBe('23 %');
      expect(newlyAddedCells[4].nativeElement.textContent).toBe(
        '23 % of 5.42 GiB',
      );
    });

    it('should remove a row', () => {
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data.slice(0, 3),
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(3);
    });

    it('should add a new row in correct sorted order(favorite)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-favorite'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data,
        {
          favorite: true,
          host: 'et-demo-2-win3',
          cpu: 24,
          memoryPerc: 23,
          memoryTotal: 5820000000,
          traffic: 98700000,
        },
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(5);

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-favorite .dt-icon'),
      );

      expect(
        cells[0].nativeElement.classList.contains(
          'dt-favorite-column-filled-star',
        ),
      ).toBeTruthy();
      expect(
        cells[1].nativeElement.classList.contains(
          'dt-favorite-column-filled-star',
        ),
      ).toBeTruthy();
      expect(
        cells[2].nativeElement.classList.contains(
          'dt-favorite-column-empty-star',
        ),
      ).toBeTruthy();
      expect(
        cells[3].nativeElement.classList.contains(
          'dt-favorite-column-empty-star',
        ),
      ).toBeTruthy();
      expect(
        cells[4].nativeElement.classList.contains(
          'dt-favorite-column-empty-star',
        ),
      ).toBeTruthy();
    });

    it('should add a new row in correct sorted order(host)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data,
        {
          favorite: false,
          host: 'et-demo-2-win3',
          cpu: 24,
          memoryPerc: 23,
          memoryTotal: 5820000000,
          traffic: 98700000,
        },
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(5);

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );
      expect(cells[0].nativeElement.textContent).toBe('docker-host2');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win3');
      expect(cells[3].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[4].nativeElement.textContent).toBe('');
    });

    it('should add a new row in correct sorted order(cpu)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data,
        {
          favorite: false,
          host: 'et-demo-2-win3',
          cpu: 24,
          memoryPerc: 23,
          memoryTotal: 5820000000,
          traffic: 98700000,
        },
      ];
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(5);

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu'),
      );
      expect(cells[0].nativeElement.textContent).toBe('30');
      expect(cells[1].nativeElement.textContent).toBe('26');
      expect(cells[2].nativeElement.textContent).toBe('24');
      expect(cells[3].nativeElement.textContent).toBe('23');
      expect(cells[4].nativeElement.textContent).toBe('');
    });
  });

  /**
   * Sorting
   */
  describe('sorting', () => {
    let fixture;
    beforeEach(() => {
      fixture = createComponent(TestSimpleColumnsApp);
    });

    it('should set the headers sortable by default', () => {
      const sortHeaders = fixture.debugElement.queryAll(
        By.css('.dt-sort-header-container'),
      );
      expect(sortHeaders.length).toBe(6);
    });

    it('should apply sort styles to header', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[2];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending',
      );
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu'),
      );
      expect(cells[1].nativeElement.classList.contains('dt-cell-sorted')).toBe(
        true,
      );
    });

    it('should apply sort styles to cells', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu'),
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu'),
      );
      for (const cell of cells) {
        expect(cell.nativeElement.classList.contains('dt-cell-sorted')).toBe(
          true,
        );
      }
    });

    it('should sort the number column correctly descending (start)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[2];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending',
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu'),
      );
      expect(cells[0].nativeElement.textContent).toBe('30');
      expect(cells[1].nativeElement.textContent).toBe('26');
      expect(cells[2].nativeElement.textContent).toBe('23');
      expect(cells[3].nativeElement.textContent).toBe('');
    });

    it('should sort the number column correctly ascending (alternate)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[2];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending',
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu'),
      );
      expect(cells[0].nativeElement.textContent).toBe('');
      expect(cells[1].nativeElement.textContent).toBe('23');
      expect(cells[2].nativeElement.textContent).toBe('26');
      expect(cells[3].nativeElement.textContent).toBe('30');
    });

    it('should sort the text column correctly ascending (start)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[1];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending',
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );
      expect(cells[0].nativeElement.textContent).toBe('docker-host2');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[3].nativeElement.textContent).toBe('');
    });

    it('should sort the text column correctly descending (alternate)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[1];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending',
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );
      expect(cells[0].nativeElement.textContent).toBe('');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[3].nativeElement.textContent).toBe('docker-host2');
    });

    it('should sort the favorite column correctly descending (start)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-favorite'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[0];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending',
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );
      expect(cells[0].nativeElement.textContent).toBe('docker-host2');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[2].nativeElement.textContent).toBe('');
      expect(cells[3].nativeElement.textContent).toBe('et-demo-2-win1');
    });

    it('should sort the favorite column correctly ascending (alternate)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-favorite'),
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell'),
      )[0];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending',
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host'),
      );
      expect(cells[0].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[1].nativeElement.textContent).toBe('');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[3].nativeElement.textContent).toBe('docker-host2');
    });

    it('should throw an error when no dtSort can be injected', () => {
      try {
        const errFixture = createComponent(TestSimpleColumnsErrorApp);
        errFixture.detectChanges();
      } catch (err) {
        expect(err.message).toBe(
          'DtSortHeader must be placed within a parent element with the DtSort directive.',
        );
      }
    });
  });

  /**
   * Toggling favorite column
   */
  describe('toggling favorite', () => {
    let fixture;
    beforeEach(() => {
      fixture = createComponent(TestSimpleColumnsApp);
    });

    it('should toggle the favorite column visually', () => {
      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(4);

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-favorite .dt-icon'),
      );

      const firstRow = cells[0].nativeElement;

      expect(
        firstRow.classList.contains('dt-favorite-column-empty-star'),
      ).toBeTruthy();

      firstRow.click();
      fixture.detectChanges();

      expect(
        firstRow.classList.contains('dt-favorite-column-filled-star'),
      ).toBeTruthy();
    });

    it('should toggle the favorite column in the datasource', () => {
      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));
      expect(rows.length).toBe(4);

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-favorite'),
      );

      const firstRow = cells[0].nativeElement;

      expect(fixture.componentInstance.dataSource.data[0].favorite).toBeFalsy();

      firstRow.children[0].click();
      fixture.detectChanges();

      expect(
        fixture.componentInstance.dataSource.data[0].favorite,
      ).toBeTruthy();
    });
  });

  describe('indicator', () => {
    it('should have the correct indicator classes on the affected rows', fakeAsync(() => {
      const fixture = createComponent(TestSimpleColumnsApp);

      flush();
      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));

      expect(rows[0].nativeElement.classList).toContain(
        'dt-table-row-indicator',
      );
      expect(rows[0].nativeElement.classList).toContain('dt-color-error');
      expect(rows[1].nativeElement.classList).toContain(
        'dt-table-row-indicator',
      );
      expect(rows[1].nativeElement.classList).toContain('dt-color-warning');
      expect(rows[3].nativeElement.classList).toContain(
        'dt-table-row-indicator',
      );
      expect(rows[3].nativeElement.classList).toContain('dt-color-error');
    }));

    it('should have the correct indicator classes on the affected cells', () => {
      const fixture = createComponent(TestSimpleColumnsApp);

      const rows = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-traffic'),
      );

      expect(rows[0].nativeElement.classList).toContain('dt-indicator');
      expect(rows[0].nativeElement.classList).toContain('dt-color-error');
      expect(rows[1].nativeElement.classList).toContain('dt-indicator');
      expect(rows[1].nativeElement.classList).toContain('dt-color-warning');
      expect(rows[3].nativeElement.classList).toContain('dt-indicator');
      expect(rows[3].nativeElement.classList).toContain('dt-color-error');
    });

    it('should update the indicator if the hasProblem function is updated', () => {
      const fixture = createComponent(TestSimpleColumnsApp);

      fixture.componentInstance.trafficHasProblem = (data) => {
        if (data.traffic > 60000000) {
          return 'error';
        }
      };
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-traffic'),
      );

      expect(rows[0].nativeElement.classList).toContain('dt-indicator');
      expect(rows[0].nativeElement.classList).toContain('dt-color-error');
      expect(rows[1].nativeElement.classList).toContain('dt-indicator');
      expect(rows[1].nativeElement.classList).toContain('dt-color-error');
      expect(rows[3].nativeElement.classList).toContain('dt-indicator');
      expect(rows[3].nativeElement.classList).toContain('dt-color-error');
    });
  });
  describe('columnProportion', () => {
    it('should set ColumnProportion to initial value', () => {
      const fixture = createComponent(TestSimpleColumnsApp);

      fixture.detectChanges();

      const affectedHeaderCell = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-memoryPerc'),
      );
      const affectedCell = fixture.debugElement.query(
        By.css('.dt-cell.dt-table-column-memoryPerc'),
      );

      expect(affectedHeaderCell.nativeElement.getAttribute('style')).toContain(
        'flex-grow: 10;',
      );
      expect(affectedHeaderCell.nativeElement.getAttribute('style')).toContain(
        'flex-shrink: 10;',
      );
      expect(affectedCell.nativeElement.getAttribute('style')).toContain(
        'flex-grow: 10;',
      );
      expect(affectedCell.nativeElement.getAttribute('style')).toContain(
        'flex-shrink: 10;',
      );
    });
    it('should update ColumnProportion at runtime', () => {
      const fixture = createComponent(TestSimpleColumnsApp);

      fixture.detectChanges();

      const affectedHeaderCell = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-memoryPerc'),
      );
      const affectedCell = fixture.debugElement.query(
        By.css('.dt-cell.dt-table-column-memoryPerc'),
      );

      fixture.componentInstance.testColumnProportion = 3;
      fixture.detectChanges();

      expect(affectedHeaderCell.nativeElement.getAttribute('style')).toContain(
        'flex-grow: 3;',
      );
      expect(affectedHeaderCell.nativeElement.getAttribute('style')).toContain(
        'flex-shrink: 3;',
      );
      expect(affectedCell.nativeElement.getAttribute('style')).toContain(
        'flex-grow: 3;',
      );
      expect(affectedCell.nativeElement.getAttribute('style')).toContain(
        'flex-shrink: 3;',
      );
    });
  });
});

@Component({
  selector: 'dt-test-table-simple-columns',
  /* eslint-disable */
  template: `
    <dt-table [dataSource]="dataSource" dtSort #sortable>
      <dt-favorite-column
        name="favorite"
        [sortable]="isSortable"
        (favoriteToggled)="toggleFavorite($event)"
      ></dt-favorite-column>
      <dt-simple-text-column name="host"></dt-simple-text-column>
      <dt-simple-number-column name="cpu" label="Cpu"></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryPerc"
        label="Memory"
        [formatter]="percentageFormatter"
        [dtColumnProportion]="testColumnProportion"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryConsumption"
        label="Memory combined"
        [displayAccessor]="combineMemory"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="traffic"
        label="Traffic"
        [sortable]="isSortable"
        [formatter]="trafficFormatter"
        [hasProblem]="trafficHasProblem"
      ></dt-simple-number-column>

      <dt-header-row
        *dtHeaderRowDef="[
          'favorite',
          'host',
          'cpu',
          'memoryPerc',
          'memoryConsumption',
          'traffic'
        ]"
      ></dt-header-row>
      <dt-row
        *dtRowDef="
          let row;
          columns: [
            'favorite',
            'host',
            'cpu',
            'memoryPerc',
            'memoryConsumption',
            'traffic'
          ]
        "
      ></dt-row>
    </dt-table>
  `,
  /* eslint-enable */
})
class TestSimpleColumnsApp implements AfterViewInit {
  data: Array<{
    favorite: boolean;
    host?: string;
    cpu?: number;
    memoryPerc: number;
    memoryTotal: number;
    traffic: number;
  }> = [
    {
      favorite: false,
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      favorite: false,
      host: undefined,
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      favorite: true,
      host: 'docker-host2',
      cpu: undefined,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      favorite: false,
      host: 'et-demo-2-win1',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
  ];

  testColumnProportion = 10;

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;
  dataSource: DtTableDataSource<{
    favorite: boolean;
    host?: string;
    cpu?: number;
    memoryPerc: number;
    memoryTotal: number;
    traffic: number;
  }>;
  constructor() {
    this.dataSource = new DtTableDataSource<{
      favorite: boolean;
      host?: string;
      cpu?: number;
      memoryPerc: number;
      memoryTotal: number;
      traffic: number;
    }>(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GiB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }

  isSortable = true;

  percentageFormatter = formatPercent;
  trafficFormatter = (value) =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MiB',
      factor: 1024,
    });

  trafficHasProblem(row: any): DtIndicatorThemePalette {
    if (row.traffic > 90000000) {
      return 'error';
    } else if (row.traffic > 60000000) {
      return 'warning';
    }
  }

  toggleFavorite(toggledRow: any): void {
    // Modify a data clone and assign the changed state at the end
    // to notify change detection about the dataChange in an array.
    const modifiedData = [...this.data];
    for (const row of modifiedData) {
      if (row === toggledRow) {
        row.favorite = !row.favorite;
      }
    }
    this.data = modifiedData;
  }
}

@Component({
  selector: 'dt-test-table-simple-columns',
  /* eslint-disable */
  template: `
    <dt-table [dataSource]="dataSource">
      <dt-favorite-column
        name="favorite"
        [sortable]="isSortable"
      ></dt-favorite-column>
      <dt-simple-text-column name="host"></dt-simple-text-column>
      <dt-simple-number-column name="cpu" label="Cpu"></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryPerc"
        label="Memory"
        [formatter]="percentageFormatter"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="memoryConsumption"
        label="Memory combined"
        [displayAccessor]="combineMemory"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="traffic"
        label="Traffic"
        [sortable]="isSortable"
      ></dt-simple-number-column>

      <dt-header-row
        *dtHeaderRowDef="[
          'favorite',
          'host',
          'cpu',
          'memoryPerc',
          'memoryConsumption',
          'traffic'
        ]"
      ></dt-header-row>
      <dt-row
        *dtRowDef="
          let row;
          columns: [
            'favorite',
            'host',
            'cpu',
            'memoryPerc',
            'memoryConsumption',
            'traffic'
          ]
        "
      ></dt-row>
    </dt-table>
  `,
  /* eslint-enable */
})
class TestSimpleColumnsErrorApp implements AfterViewInit {
  data: Array<{
    favorite: boolean;
    host?: string;
    cpu?: number;
    memoryPerc: number;
    memoryTotal: number;
    traffic: number;
  }> = [
    {
      favorite: false,
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      favorite: true,
      host: undefined,
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      favorite: false,
      host: 'docker-host2',
      cpu: undefined,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      favorite: false,
      host: 'et-demo-2-win1',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;
  dataSource: DtTableDataSource<{
    favorite: boolean;
    host?: string;
    cpu?: number;
    memoryPerc: number;
    memoryTotal: number;
    traffic: number;
  }>;
  constructor() {
    this.dataSource = new DtTableDataSource<{
      favorite: boolean;
      host?: string;
      cpu?: number;
      memoryPerc: number;
      memoryTotal: number;
      traffic: number;
    }>(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GiB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }

  isSortable = true;

  percentageFormatter = formatPercent;
  trafficFormatter = (value) =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MiB',
      factor: 1024,
    });
}
