import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
  host: {
    class: 'dt-table',
  },
})
export class DtTable<T> extends CdkTable<T> { }
