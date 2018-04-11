import { ChangeDetectionStrategy, Component, Directive, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import {
  CDK_ROW_TEMPLATE,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';

/**
 * Header row definition for the dt-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[dtHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: DtHeaderRowDef}],
  inputs: ['columns: dtHeaderRowDef'],
})
export class DtHeaderRowDef extends CdkHeaderRowDef { }

/**
 * Data row definition for the dt-table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[dtRowDef]',
  providers: [{provide: CdkRowDef, useExisting: DtRowDef}],
  inputs: ['columns: dtRowDefColumns', 'when: dtRowDefWhen'],
})
export class DtRowDef<T> extends CdkRowDef<T> {
}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'dt-header-row, tr[dt-header-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'dt-header-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  exportAs: 'dtHeaderRow',
})
export class DtHeaderRow extends CdkHeaderRow { }

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'dt-row, tr[dt-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'dt-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  exportAs: 'dtRow',
})
export class DtRow extends CdkRow { }
