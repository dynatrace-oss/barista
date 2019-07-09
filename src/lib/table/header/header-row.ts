import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
} from '@angular/core';
import {
  CdkHeaderRow,
  CDK_ROW_TEMPLATE,
  CdkHeaderRowDef,
} from '@angular/cdk/table';

/**
 * Header row definition for the dt-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[dtHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: DtHeaderRowDef }],
  inputs: ['columns: dtHeaderRowDef', 'sticky: dtHeaderRowDefSticky'],
})
export class DtHeaderRowDef extends CdkHeaderRowDef {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'dt-header-row',
  template: CDK_ROW_TEMPLATE,
  styleUrls: ['./header-row.scss'],
  host: {
    class: 'dt-header-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtHeaderRow',
})
export class DtHeaderRow extends CdkHeaderRow {}
