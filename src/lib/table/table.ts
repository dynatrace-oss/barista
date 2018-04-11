import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CdkTable, CDK_TABLE_TEMPLATE } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./table.scss'],
  template: CDK_TABLE_TEMPLATE,
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class DtTable<T> extends CdkTable<T> { }
