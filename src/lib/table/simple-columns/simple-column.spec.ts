// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtSort,
  DtTableDataSource,
  formatPercent,
  formatBytes,
  DtTableModule,
  DtIconModule,
  DtLoadingDistractorModule,
  DtFormattersModule,
  DtIndicatorThemePalette,
  formatRate,
} from '@dynatrace/angular-components';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchMouseEvent } from '../../../testing/dispatch-events';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponent } from '../../../testing/create-component';

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
      ],
      declarations: [TestSimpleColumnsApp, TestSimpleColumnsErrorApp],
    });

    TestBed.compileComponents();
  }));

  describe('rendering', () => {
    let fixture;
    beforeEach(() => {
      fixture = createComponent(TestSimpleColumnsApp);
    });

    it('should infer the header label from the passed name', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers[0].nativeElement.textContent).toBe('host');
    });

    it('should use the label as header label when passed', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers[1].nativeElement.textContent).toBe('Cpu');
    });

    it('should register all headerCell correctly', () => {
      const headers = fixture.debugElement.queryAll(By.css('.dt-header-cell'));
      expect(headers.length).toBe(5);
    });

    it('should display the correct simple-text values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host')
      );
      expect(cells[0].nativeElement.textContent).toBe(
        fixture.componentInstance.data[0].host.toString()
      );
      expect(cells[1].nativeElement.textContent).toBe('');
      expect(cells[2].nativeElement.textContent).toBe(
        fixture.componentInstance.data[2].host.toString()
      );
      expect(cells[3].nativeElement.textContent).toBe(
        fixture.componentInstance.data[3].host.toString()
      );
    });

    it('should display the correct simple-number values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu')
      );
      expect(cells[0].nativeElement.textContent).toBe(
        fixture.componentInstance.data[0].cpu.toString()
      );
      expect(cells[1].nativeElement.textContent).toBe(
        fixture.componentInstance.data[1].cpu.toString()
      );
      expect(cells[2].nativeElement.textContent).toBe('');
      expect(cells[3].nativeElement.textContent).toBe(
        fixture.componentInstance.data[3].cpu.toString()
      );
    });

    it('should display the correct simple-percentage values', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memoryPerc')
      );
      expect(cells[0].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[0].memoryPerc} %`
      );
      expect(cells[1].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[1].memoryPerc} %`
      );
      expect(cells[2].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[2].memoryPerc} %`
      );
      expect(cells[3].nativeElement.textContent).toBe(
        `${fixture.componentInstance.data[3].memoryPerc} %`
      );
    });

    it('should display the correct values when accessing through a dataAccessor', () => {
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-memoryConsumption')
      );
      const transformFunction = fixture.componentInstance.combineMemory.bind(
        this
      );
      expect(cells[0].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[0])
      );
      expect(cells[1].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[1])
      );
      expect(cells[2].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[2])
      );
      expect(cells[3].nativeElement.textContent).toBe(
        transformFunction(fixture.componentInstance.data[3])
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
      expect(newlyAddedCells[0].nativeElement.textContent).toBe(
        'et-demo-2-win3'
      );
      expect(newlyAddedCells[1].nativeElement.textContent).toBe('24');
      expect(newlyAddedCells[2].nativeElement.textContent).toBe('23 %');
      expect(newlyAddedCells[3].nativeElement.textContent).toBe(
        '23 % of 5.42 GB'
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

    it('should add a new row in correct sorted order', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host')
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data,
        {
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
        By.css('.dt-cell.dt-table-column-host')
      );
      expect(cells[0].nativeElement.textContent).toBe('docker-host2');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win3');
      expect(cells[3].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[4].nativeElement.textContent).toBe('');
    });

    it('should add a new row in correct sorted order', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu')
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.componentInstance.dataSource.data = [
        ...fixture.componentInstance.data,
        {
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
        By.css('.dt-cell.dt-table-column-cpu')
      );
      expect(cells[0].nativeElement.textContent).toBe('');
      expect(cells[1].nativeElement.textContent).toBe('30');
      expect(cells[2].nativeElement.textContent).toBe('26');
      expect(cells[3].nativeElement.textContent).toBe('24');
      expect(cells[4].nativeElement.textContent).toBe('23');
      expect(cells[4].nativeElement.textContent).toBe('23');
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
        By.css('.dt-sort-header-container')
      );
      expect(sortHeaders.length).toBe(5);
    });

    it('should apply sort styles to header', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu')
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell')
      )[1];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending'
      );
      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu')
      );
      expect(cells[1].nativeElement.classList.contains('dt-cell-sorted')).toBe(
        true
      );
    });

    it('should apply sort styles to cells', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu')
      );
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu')
      );
      for (const cell of cells) {
        expect(cell.nativeElement.classList.contains('dt-cell-sorted')).toBe(
          true
        );
      }
    });

    it('should sort the number column correctly descending (start)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu')
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell')
      )[1];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending'
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu')
      );
      expect(cells[0].nativeElement.textContent).toBe('');
      expect(cells[1].nativeElement.textContent).toBe('30');
      expect(cells[2].nativeElement.textContent).toBe('26');
      expect(cells[3].nativeElement.textContent).toBe('23');
    });

    it('should sort the number column correctly ascending (alternate)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-cpu')
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell')
      )[1];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending'
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-cpu')
      );
      expect(cells[0].nativeElement.textContent).toBe('23');
      expect(cells[1].nativeElement.textContent).toBe('26');
      expect(cells[2].nativeElement.textContent).toBe('30');
      expect(cells[3].nativeElement.textContent).toBe('');
    });

    it('should sort the text column correctly ascending (start)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host')
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell')
      )[0];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'ascending'
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host')
      );
      expect(cells[0].nativeElement.textContent).toBe('docker-host2');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[3].nativeElement.textContent).toBe('');
    });

    it('should sort the text column correctly descending (alternate)', () => {
      const sortHeader = fixture.debugElement.query(
        By.css('.dt-header-cell.dt-table-column-host')
      );

      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();
      dispatchMouseEvent(sortHeader.nativeElement, 'click');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.queryAll(
        By.css('.dt-header-cell')
      )[0];
      expect(headerCell.nativeElement.getAttribute('aria-sort')).toBe(
        'descending'
      );

      const cells = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-host')
      );
      expect(cells[0].nativeElement.textContent).toBe('');
      expect(cells[1].nativeElement.textContent).toBe('et-demo-2-win4');
      expect(cells[2].nativeElement.textContent).toBe('et-demo-2-win1');
      expect(cells[3].nativeElement.textContent).toBe('docker-host2');
    });

    it('should throw an error when no dtSort can be injected', () => {
      try {
        const errFixture = createComponent(TestSimpleColumnsErrorApp);
        errFixture.detectChanges();
      } catch (err) {
        expect(err.message).toBe(
          'DtSortHeader must be placed within a parent element with the DtSort directive.'
        );
      }
    });
  });

  describe('indicator', () => {
    it('should have the correct indicator classes on the affected rows', fakeAsync(() => {
      const fixture = createComponent(TestSimpleColumnsApp);

      flush();
      const rows = fixture.debugElement.queryAll(By.css('.dt-row'));

      expect(rows[0].nativeElement.classList).toContain(
        'dt-table-row-indicator'
      );
      expect(rows[0].nativeElement.classList).toContain('dt-color-error');
      expect(rows[1].nativeElement.classList).toContain(
        'dt-table-row-indicator'
      );
      expect(rows[1].nativeElement.classList).toContain('dt-color-warning');
      expect(rows[3].nativeElement.classList).toContain(
        'dt-table-row-indicator'
      );
      expect(rows[3].nativeElement.classList).toContain('dt-color-error');
    }));

    it('should have the correct indicator classes on the affected cells', () => {
      const fixture = createComponent(TestSimpleColumnsApp);

      const rows = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-traffic')
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

      fixture.componentInstance.trafficHasProblem = data => {
        if (data.traffic > 60000000) {
          return 'error';
        }
      };
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(
        By.css('.dt-cell.dt-table-column-traffic')
      );

      expect(rows[0].nativeElement.classList).toContain('dt-indicator');
      expect(rows[0].nativeElement.classList).toContain('dt-color-error');
      expect(rows[1].nativeElement.classList).toContain('dt-indicator');
      expect(rows[1].nativeElement.classList).toContain('dt-color-error');
      expect(rows[3].nativeElement.classList).toContain('dt-indicator');
      expect(rows[3].nativeElement.classList).toContain('dt-color-error');
    });
  });
});

@Component({
  selector: 'dt-test-table-simple-columns',
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource" dtSort #sortable>
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
        [formatter]="trafficFormatter"
        [hasProblem]="trafficHasProblem"
      ></dt-simple-number-column>

      <dt-header-row
        *dtHeaderRowDef="[
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
          columns: ['host', 'cpu', 'memoryPerc', 'memoryConsumption', 'traffic']
        "
      ></dt-row>
    </dt-table>
  `,
  // tslint:enable
})
class TestSimpleColumnsApp implements AfterViewInit {
  data: Array<{
    host: string | undefined;
    cpu: number | undefined;
    memoryPerc: number;
    memoryTotal: number;
    traffic: number;
  }> = [
    {
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      host: undefined,
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'docker-host2',
      cpu: undefined,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      host: 'et-demo-2-win1',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;
  dataSource: DtTableDataSource<object>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  // tslint:disable-next-line: no-any
  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }

  isSortable = true;

  percentageFormatter = formatPercent;
  trafficFormatter = value =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MB',
      factor: 1024,
    });

  // tslint:disable-next-line: no-any
  trafficHasProblem(row: any): DtIndicatorThemePalette {
    // tslint:disable-next-line: no-magic-numbers
    if (row.traffic > 90000000) {
      return 'error';
      // tslint:disable-next-line: no-magic-numbers
    } else if (row.traffic > 60000000) {
      return 'warning';
    }
  }
}

@Component({
  selector: 'dt-test-table-simple-columns',
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource">
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
          columns: ['host', 'cpu', 'memoryPerc', 'memoryConsumption', 'traffic']
        "
      ></dt-row>
    </dt-table>
  `,
  // tslint:enable
})
class TestSimpleColumnsErrorApp implements AfterViewInit {
  data: Array<{
    host: string | undefined;
    cpu: number | undefined;
    memoryPerc: number;
    memoryTotal: number;
    traffic: number;
  }> = [
    {
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      host: undefined,
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'docker-host2',
      cpu: undefined,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      host: 'et-demo-2-win1',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;
  dataSource: DtTableDataSource<object>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  // tslint:disable-next-line: no-any
  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }

  isSortable = true;

  percentageFormatter = formatPercent;
  trafficFormatter = value =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MB',
      factor: 1024,
    });
}
