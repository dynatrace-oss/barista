import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { CdkTable } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./table.scss'],
  templateUrl: './table.html',
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class DtTable<T> extends CdkTable<T> { }
