import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CdkTable, CDK_TABLE_TEMPLATE } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./table.scss'],
  template: CDK_TABLE_TEMPLATE,
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class DtTable<T> extends CdkTable<T> { }
